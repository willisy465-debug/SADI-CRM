import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpensesTab } from "./expenses-tab"
import { InvoicesTab } from "./invoices-tab"

export default async function FinancePage() {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  const expenses = await prisma.expense.findMany({
    orderBy: { startDate: "desc" },
    include: {
      submitter: { select: { name: true, email: true } }
    }
  })

  const invoices = await prisma.invoice.findMany({
    orderBy: { issueDate: "desc" },
    include: {
      deal: {
        include: { account: { select: { name: true } } }
      },
      programme: { select: { title: true } }
    }
  })

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Finance Operations</h1>
        <p className="text-slate-600 mt-1 text-sm">Manage organisational expenses and client invoices.</p>
      </div>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1 mb-6 rounded-lg inline-flex h-10 items-center justify-center">
          <TabsTrigger value="expenses" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-8 py-1.5 text-sm font-medium transition-all text-slate-600">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 rounded-md px-8 py-1.5 text-sm font-medium transition-all text-slate-600">
            Invoices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="outline-none">
          <ExpensesTab expenses={expenses} isAdmin={isAdmin} />
        </TabsContent>
        
        <TabsContent value="invoices" className="outline-none">
          <InvoicesTab invoices={invoices} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
