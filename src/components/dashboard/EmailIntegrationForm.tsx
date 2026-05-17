"use client";

import { useState } from "react";
import { Mail, Lock, Server, Save, Loader2 } from "lucide-react";
import { saveEmailIntegration } from "@/actions/email";
import { useRouter } from "next/navigation";
import { EmailIntegration } from "@prisma/client";

export function EmailIntegrationForm({ integration }: { integration: EmailIntegration | null }) {
  const [emailAddress, setEmailAddress] = useState(integration?.emailAddress || "");
  const [provider, setProvider] = useState(integration?.provider || "GMAIL");
  const [appPassword, setAppPassword] = useState(""); // Never show the existing password
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveEmailIntegration({ emailAddress, provider, appPassword });
      router.refresh();
      setAppPassword(""); // Clear the password field after save
    } catch (error) {
      console.error("Failed to update email integration:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-glass mt-6">
      <h3 className="heading-4 text-dark mb-2 flex items-center gap-2">
        <Mail size={20} className="text-sage" />
        Email Monitoring
      </h3>
      <p className="text-body text-gray mb-6">
        Connect your email to let Cherry Blossom monitor important messages and help you stay on top of your tasks.
      </p>
      
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray mb-1.5">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
          >
            <option value="GMAIL">Gmail</option>
            <option value="OUTLOOK">Outlook</option>
            <option value="IMAP">Custom IMAP</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray mb-1.5">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Mail size={16} />
            </div>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray mb-1.5">App Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Lock size={16} />
            </div>
            <input
              type="password"
              value={appPassword}
              onChange={(e) => setAppPassword(e.target.value)}
              placeholder={integration ? "••••••••••••" : "Your app-specific password"}
              required={!integration}
              className="w-full pl-10 px-4 py-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-sage/20 focus:border-sage transition-all"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-sage text-white rounded-xl font-bold hover:bg-sage-dark transition-all shadow-md shadow-sage/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Connecting..." : integration ? "Update Connection" : "Connect Email"}
          </button>
        </div>
      </form>
    </div>
  );
}
