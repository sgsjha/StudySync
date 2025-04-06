import { OpenAI } from "openai";

export async function practiceExamClient(
  notesContent: string,
  numQuestions: number,
  examType: "MCQ" | "Written",
  timeAllowed: number
): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    organization: process.env.NEXT_PUBLIC_ORG_ID,
    project: process.env.NEXT_PUBLIC_PROJECT_ID,
    dangerouslyAllowBrowser: true,
  });

  const prompt = `Create a practice exam with ${numQuestions} ${examType} questions on the following topic. The exam should be challenging, and the time allowed is ${timeAllowed} minutes. Output only valid JSON with a key "questions" that is an array of objects. Each object must have a "question" string, an "options" array (for MCQ; for Written, leave it as an empty array), and an "answer" string. Do not add any extra text before or after the JSON.

Topic: ${notesContent}`;

  const communication = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: notesContent },
    ],
  });

  return communication.choices[0].message?.content || "No message received.";
}
