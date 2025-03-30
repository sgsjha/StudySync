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
        content: "Talk in Hinglish", // this is where we would add - make questions or whatever
      },
      {
        role: "user",
        content: "Hi what is python?", // need to add lecture slides here
      },
    ],
  });

  return communication.choices[0].message?.content || "No message received.";
}
