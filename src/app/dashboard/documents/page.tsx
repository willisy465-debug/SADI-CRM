import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UploadDialog } from "./upload-dialog"
import { formatDistanceToNow } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

function CategoryBadge({ category }: { category: string }) {
  switch (category) {
    case "TEMPLATE":
      return <Badge className="bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20">Template</Badge>
    case "CONTRACT":
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Contract</Badge>
    case "TRAINING_MATERIAL":
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Material</Badge>
    default:
      return <Badge variant="outline" className="text-slate-600">General</Badge>
  }
}

export default async function DocumentsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const documents = await prisma.document.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      uploader: { select: { name: true } }
    }
  })

  return (
    <div className="p-8 font-sans h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Document Vault</h1>
          <p className="text-slate-600 mt-1 text-sm">Secure storage for SADI templates, materials, and client files.</p>
        </div>
        <UploadDialog />
      </div>

      <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-white border-b border-slate-200">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-slate-600">Name</TableHead>
              <TableHead className="text-slate-600">Category</TableHead>
              <TableHead className="text-slate-600">Uploaded By</TableHead>
              <TableHead className="text-slate-600 text-right">Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                  No documents found. Upload a file to get started.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc.id} className="border-b border-slate-200/50 hover:bg-slate-100/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center font-medium text-slate-900">
                      <FileText className="w-4 h-4 mr-2 text-slate-500" />
                      {doc.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={doc.category} />
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {doc.uploader?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="text-right text-slate-600 text-sm">
                    {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-slate-600 hover:text-brand-cyan hover:bg-brand-cyan/10">
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
