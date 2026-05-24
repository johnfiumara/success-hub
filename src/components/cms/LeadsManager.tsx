"use client"

import { useState, useTransition } from "react"
import { deleteLead, convertLead } from "@/actions/cms"
import { Button } from "@/components/ui/button"
import { Trash2, UserPlus, Mail, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function LeadsManager({ leads: initialLeads }: { leads: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLeads = initialLeads.filter(lead =>
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteLead = (id: string) => {
    if (!confirm("Delete this lead?")) return
    startTransition(async () => {
      await deleteLead(id)
    })
  }

  const handleConvertLead = (id: string) => {
    startTransition(async () => {
      await convertLead(id)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Leads</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Source</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Intent</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    <Mail size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No leads yet</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-dark">{lead.email}</td>
                    <td className="py-3 px-4 text-gray-600">{lead.name || "—"}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.source}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{lead.intent || "—"}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.consumedAt
                          ? "bg-green/20 text-green-dark"
                          : "bg-amber/20 text-amber-dark"
                      }`}>
                        {lead.consumedAt ? "Converted" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right flex gap-2 justify-end">
                      {!lead.consumedAt && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleConvertLead(lead.id)}
                          disabled={isPending}
                          className="gap-2"
                        >
                          <UserPlus size={16} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteLead(lead.id)}
                        disabled={isPending}
                        className="gap-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
