"use server";

import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";
import { fetchRecentEmails } from "./email";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateAIAdvice(userPrompt: string, history: { role: 'user' | 'model', text: string }[] = []) {
  const session = await getAuthSession();
  if (!session?.user) throw new Error("Unauthorized");
  
  if (!process.env.GEMINI_API_KEY) {
    return "The AI Guide requires a valid GEMINI_API_KEY to be set in your environment variables.";
  }

  const userId = session.user.id;

  // Gather context
  const [sleepLogs, nutritionLogs, tasks, balanceAudit, recentEmails] = await Promise.all([
    prisma.sleepLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 3,
    }),
    prisma.nutritionLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    }),
    prisma.task.findMany({
      where: { userId, status: { not: "DONE" } },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.balanceAudit.findUnique({
      where: { userId },
    }),
    fetchRecentEmails()
  ]);

  const contextData = `
User Context:
Recent Sleep Logs: ${JSON.stringify(sleepLogs)}
Recent Nutrition Logs: ${JSON.stringify(nutritionLogs)}
Pending Tasks: ${JSON.stringify(tasks)}
Recent Balance Audit: ${balanceAudit ? JSON.stringify(balanceAudit.scores) : "None"}
Recent Emails (Inbox Monitoring): ${JSON.stringify(recentEmails)}
`;

const systemPrompt = `You are Cherry Blossom, an elite AI coach for the Success Hub platform. 
Your goal is to provide highly customized, actionable, and encouraging daily advice based on the user's data.
You have access to their recent sleep, nutrition, tasks, wellness audits, and their recent emails.
Keep your responses concise, structured, and use a friendly, motivational tone.
Do not hallucinate data; if data is missing, politely encourage them to track more of their habits.

CRITICAL: You have access to tools that allow you to act on the user's behalf.
1. If the user asks you to create a task, remind them of a task, or add something to their to-do list, call the \`createTask\` tool.
2. If the user tells you what they ate or asks you to log a meal, call the \`logMeal\` tool (estimate calories and macros if they don't provide exact numbers).
Always confirm with the user after you successfully execute an action using these tools!

PROACTIVE EMAIL MONITORING:
- You have access to the user's recent emails. Review them to identify any pending action items, flights, or important meetings.
- If they ask for a daily summary, explicitly mention actionable insights from their emails and offer to create tasks for them.

Use markdown for formatting.

${contextData}`;

  const tools = [{
    functionDeclarations: [
      {
        name: "createTask",
        description: "Create a new pending task for the user",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            description: { type: "STRING" },
            status: { type: "STRING", description: "Use 'TODO'" },
            priority: { type: "STRING", description: "Use 'LOW', 'MEDIUM', 'HIGH'" }
          },
          required: ["title", "status", "priority"]
        }
      },
      {
        name: "logMeal",
        description: "Log a meal to nutrition tracking",
        parameters: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            calories: { type: "NUMBER" },
            protein: { type: "NUMBER" },
            carbs: { type: "NUMBER" },
            fat: { type: "NUMBER" },
            mealType: { type: "STRING", description: "BREAKFAST, LUNCH, DINNER, SNACK" }
          },
          required: ["name", "calories", "mealType"]
        }
      }
    ]
  }];

  try {
    const contents: any[] = [
      ...history.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: userPrompt }] }
    ];

    let response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          tools: tools as any
        }
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      const args = call.args as any;
      let result = { success: true, message: "" };

      try {
        if (call.name === "createTask") {
          const { createTask } = await import("./tasks");
          await createTask({ title: args.title, description: args.description, status: args.status, priority: args.priority });
          result.message = `Task "${args.title}" created successfully.`;
        } else if (call.name === "logMeal") {
          const { logMeal } = await import("./nutrition");
          await logMeal({ name: args.name, calories: args.calories, protein: args.protein, carbs: args.carbs, fat: args.fat, mealType: args.mealType, workspaceId: session.workspaceId });
          result.message = `Meal "${args.name}" logged successfully.`;
        } else {
          result = { success: false, message: "Unknown function" };
        }
      } catch (err) {
        result = { success: false, message: "Action failed to execute locally." };
      }

      // Add model's function call to history
      contents.push({
        role: 'model',
        parts: [{ functionCall: { name: call.name, args: call.args } }]
      });

      // Add function response to history
      contents.push({
        role: 'user',
        parts: [{ functionResponse: { name: call.name, response: result } }]
      });

      // Generate final response based on function output
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: systemPrompt,
          tools: tools as any
        }
      });
    }

    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "I'm having trouble connecting to my neural net right now. Please try again later!";
  }
}
