import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { BadgeInfo, Building2, Calendar, Mail, Phone } from "lucide-react";
import { NewDelegateDialog } from "./new-delegate-dialog";

export default async function DelegatesPage() {
  const delegates = await prisma.delegate.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      programme: {
        select: {
          title: true
        }
      }
    }
  });

  const programmes = await prisma.programme.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <BadgeInfo className="w-8 h-8 text-brand-cyan" />
            Delegates Management
          </h1>
          <p className="text-slate-600 mt-1">Manage programme delegates and their personal details</p>
        </div>
        <NewDelegateDialog programmes={programmes} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {delegates.map((delegate) => (
          <div key={delegate.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-lg relative group hover:border-brand-cyan/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {delegate.firstName} {delegate.lastName}
                </h3>
                {delegate.jobTitle && (
                  <p className="text-sm text-slate-600">{delegate.jobTitle}</p>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-brand-cyan font-bold border border-slate-300">
                {delegate.firstName[0]}{delegate.lastName[0]}
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="truncate">{delegate.email}</span>
              </div>
              {delegate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>{delegate.phone}</span>
                </div>
              )}
              {delegate.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span className="truncate">{delegate.company}</span>
                </div>
              )}
              {delegate.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>DOB: {format(new Date(delegate.dateOfBirth), "PP")}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200/50">
              <div className="text-xs text-slate-500 mb-1">Programme</div>
              <div className="text-sm font-medium text-brand-cyan truncate">
                {delegate.programme.title}
              </div>
            </div>
            
            {delegate.emergencyContact && (
              <div className="mt-3 p-2 bg-red-950/20 border border-red-900/30 rounded text-xs text-red-200">
                <span className="font-semibold text-red-400">Emergency:</span> {delegate.emergencyContact}
              </div>
            )}
          </div>
        ))}

        {delegates.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white/50 border border-slate-200 border-dashed rounded-xl">
            No delegates found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
