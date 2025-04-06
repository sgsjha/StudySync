import { OpenAI } from "openai";

export async function fetchAIResponseAgain(notesContent: string): Promise<string> {
  // Instantiate the OpenAI client using your environment variables.
  // We add dangerouslyAllowBrowser: true to bypass browser restrictions.
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    organization: process.env.NEXT_PUBLIC_ORG_ID,
    project: process.env.NEXT_PUBLIC_PROJECT_ID,
    dangerouslyAllowBrowser: true,
  });

  const communication = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Make a practice exam of 30 MCQs Exam on this topic, make it hard. output should be in JSON, with questions and answers. DO NOT ADD ANYTHING OTHER THAN THE JSON ITSELF. BEFORE OR AFTER",
      },
      {
        role: "user",
        content: notesContent,
      },
    ],
  });

  return communication.choices[0].message?.content || "No message received.";
}
