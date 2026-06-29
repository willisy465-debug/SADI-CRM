import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { RevenueChart } from "./revenue-chart"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch live metrics
  const activeDeals = await prisma.deal.count({
    where: {
      stage: { notIn: ["WON", "LOST"] }
    }
  })

  // Leads created in the last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const newLeads = await prisma.lead.count({
    where: {
      createdAt: { gte: sevenDaysAgo }
    }
  })

  // Calculate pipeline value (deals not won or lost)
  const pipelineDeals = await prisma.deal.findMany({
    where: {
      stage: { notIn: ["WON", "LOST"] }
    },
    select: { stage: true, amount: true }
  })
  
  const pipelineValue = pipelineDeals.reduce((acc, deal) => acc + (deal.amount || 0), 0)

  const stageCounts = pipelineDeals.reduce((acc: any, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1
    return acc
  }, {})

  const chartData = [
    { name: "Prospecting", count: stageCounts["PROSPECTING"] || 0 },
    { name: "Qualification", count: stageCounts["QUALIFICATION"] || 0 },
    { name: "Proposal", count: stageCounts["PROPOSAL"] || 0 },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-600 mt-2">
            Welcome back, <span className="text-brand-cyan font-medium">{session.user.name}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-600 text-sm font-medium">Active Deals</h3>
            <p className="text-3xl font-semibold text-slate-900 mt-2">{activeDeals}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-600 text-sm font-medium">New Leads (This Week)</h3>
            <p className="text-3xl font-semibold text-slate-900 mt-2">{newLeads}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-600 text-sm font-medium">Pipeline Value</h3>
            <p className="text-3xl font-semibold text-brand-cyan mt-2">
              ZAR {pipelineValue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-600 text-sm font-medium mb-6">Pipeline by Stage</h3>
            <RevenueChart data={chartData} />
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-slate-600 text-sm font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <p className="text-slate-500 text-sm italic">Activity feed will populate as tasks and deals are updated.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
