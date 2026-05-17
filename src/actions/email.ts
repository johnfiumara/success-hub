"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function getEmailIntegration() {
  const session = await getAuthSession();
  if (!session?.user?.id) return null;

  return await prisma.emailIntegration.findUnique({
    where: { userId: session.user.id },
  });
}

export async function saveEmailIntegration(data: { emailAddress: string; provider: string; appPassword?: string }) {
  const session = await getAuthSession();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await getEmailIntegration();

  if (existing) {
    return await prisma.emailIntegration.update({
      where: { id: existing.id },
      data: {
        emailAddress: data.emailAddress,
        provider: data.provider,
        ...(data.appPassword ? { appPassword: data.appPassword } : {}),
      },
    });
  } else {
    return await prisma.emailIntegration.create({
      data: {
        userId: session.user.id,
        emailAddress: data.emailAddress,
        provider: data.provider,
        appPassword: data.appPassword || "",
      },
    });
  }
}

export async function fetchRecentEmails() {
  const session = await getAuthSession();
  if (!session?.user?.id) return [];

  const integration = await getEmailIntegration();
  if (!integration || !integration.appPassword) return [];

  const { ImapFlow } = await import("imapflow");
  const { simpleParser } = await import("mailparser");

  let host = "imap.gmail.com";
  if (integration.provider === "OUTLOOK") host = "outlook.office365.com";
  else if (integration.provider === "YAHOO") host = "imap.mail.yahoo.com";

  const client = new ImapFlow({
    host,
    port: 993,
    secure: true,
    auth: {
      user: integration.emailAddress,
      pass: integration.appPassword,
    },
    logger: false,
  });

  try {
    // Try to connect with a short timeout to prevent hanging the AI response
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("IMAP Connection timeout")), 5000))
    ]);

    const lock = await client.getMailboxLock("INBOX");
    const emails: any[] = [];

    try {
      const mailbox = client.mailbox;
      if (mailbox && typeof mailbox !== "boolean") {
        const total = mailbox.exists;
        if (total > 0) {
          // Fetch up to the 5 most recent emails
          const start = Math.max(1, total - 4);
          const fetchStream = client.fetch(`${start}:*`, { source: true, uid: true });
          
          for await (const message of fetchStream) {
            if (!message.source) continue;
            const parsed: any = await (simpleParser as any)(message.source);
            emails.push({
              id: message.uid?.toString() || Math.random().toString(),
              subject: parsed.subject || "No Subject",
              from: parsed.from?.text || "Unknown Sender",
              body: parsed.text ? parsed.text.substring(0, 500) : "No text content",
              date: parsed.date?.toISOString() || new Date().toISOString(),
            });
          }
        }
      }
    } finally {
      lock.release();
    }

    await client.logout();
    
    // Sort emails to ensure the most recent are first
    return emails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Failed to fetch emails via IMAP:", error);
    // If connection fails, return empty array to gracefully degrade
    return [];
  }
}
