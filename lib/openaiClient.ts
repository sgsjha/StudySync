import { OpenAI } from "openai";

export async function fetchAIResponse(): Promise<string> {
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
          "Make very hard 10 mcq questions about this topic, output should be in JSON, with questions and answers. DO NOT ADD ANYTHING OTHER THAN THE JSON ITSELF. BEFORE OR AFTER",
      },
      {
        role: "user",
        content: "python",
      },
    ],
  });

  return communication.choices[0].message?.content || "No message received.";
}
