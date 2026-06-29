import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { renderToStream } from "@react-pdf/renderer"
import { InvoiceDocument } from "@/lib/pdf/InvoiceDocument"
import { format } from "date-fns"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { invoiceId } = await params

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      deal: { include: { account: true } },
      programme: true
    }
  })

  if (!invoice) {
    return new Response("Invoice not found", { status: 404 })
  }

  const issueDateStr = format(new Date(invoice.issueDate), "MMMM d, yyyy")
  const dueDateStr = format(new Date(invoice.dueDate), "MMMM d, yyyy")
  const clientName = invoice.deal?.account?.name || "Unknown Client"
  const description = invoice.programme?.title 
    ? `Training Programme: ${invoice.programme.title}` 
    : invoice.deal?.name 
      ? `Deal: ${invoice.deal.name}` 
      : "SADI Services"

  try {
    const stream = await renderToStream(
      <InvoiceDocument 
        invoiceNo={invoice.invoiceNo}
        issueDate={issueDateStr}
        dueDate={dueDateStr}
        clientName={clientName}
        description={description}
        amount={invoice.amount}
      />
    )

    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk))
        stream.on('end', () => controller.close())
        stream.on('error', (err) => controller.error(err))
      }
    })

    return new Response(readableStream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNo}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation failed:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
