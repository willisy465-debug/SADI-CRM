import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { renderToStream } from "@react-pdf/renderer"
import { CertificateDocument } from "@/lib/pdf/CertificateDocument"
import { format } from "date-fns"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ delegateId: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { delegateId } = await params

  const delegate = await prisma.delegate.findUnique({
    where: { id: delegateId },
    include: { programme: true }
  })

  if (!delegate) {
    return new Response("Delegate not found", { status: 404 })
  }

  if (!delegate.attendance) {
    return new Response("Delegate did not attend the programme", { status: 400 })
  }

  const dateStr = format(new Date(delegate.programme.endDate), "MMMM d, yyyy")

  try {
    const stream = await renderToStream(
      <CertificateDocument 
        delegateName={`${delegate.firstName} ${delegate.lastName}`}
        programmeTitle={delegate.programme.title}
        date={dateStr}
      />
    )

    // Convert NodeJS ReadableStream to Web ReadableStream
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
        'Content-Disposition': `attachment; filename="Certificate-${delegate.firstName}-${delegate.lastName}.pdf"`,
      },
    })
  } catch (error) {
    console.error("PDF generation failed:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
