"use client"

import { useState, useTransition } from "react"
import { removeUserFromWorkspace } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, User, Shield, Plus, Search } from "lucide-react"

export function UserManagementManager({ users }: { users: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")

  const filteredUsers = users.filter(u =>
    u.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRemoveUser = (userId: string) => {
    if (!confirm("Remove this user from the workspace?")) return
    startTransition(async () => {
      await removeUserFromWorkspace(userId)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">User Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{users.length} member{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass rounded-2xl p-6 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
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
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Joined</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((member) => (
                <tr key={member.userId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center text-sage-dark font-medium text-sm">
                        {member.user?.name?.substring(0, 2).toUpperCase() || "U"}
                      </div>
                      <span className="font-medium text-dark">{member.user?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{member.user?.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      member.role === "OWNER" 
                        ? "bg-coral/20 text-coral-dark" 
                        : member.role === "EDITOR"
                        ? "bg-sage/20 text-sage-dark"
                        : "bg-gray/20 text-gray-dark"
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {member.role !== "OWNER" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveUser(member.userId)}
                        disabled={isPending}
                        className="gap-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
