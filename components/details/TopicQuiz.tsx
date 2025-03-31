"use client";
import React, { useEffect, useState } from "react";
import { fetchAIResponse } from "@/lib/openaiClient"; // ensure this file exports fetchAIResponse properly

interface TopicQuizProps {
  notesContent: string;
}

export default function TopicQuiz({ notesContent }: TopicQuizProps) {
  const [aiOutput, setAiOutput] = useState<string>("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to clean code fences from the response
  function cleanJSON(response: string): string {
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "");
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.replace(/\s*```$/, "");
    }
    return cleaned;
  }

  useEffect(() => {
    async function getResponse() {
      // Pass the notesContent to fetchAIResponse so that the quiz is generated based on these notes.
      const response = await fetchAIResponse(notesContent);
      console.log("Raw AI Output:", response); // Log the raw output
      const cleanResponse = cleanJSON(response);
      setAiOutput(cleanResponse);
      try {
        const parsed = JSON.parse(cleanResponse);
        setQuestions(parsed.questions || []);
      } catch (error) {
        console.error("Error parsing AI response:", error);
      } finally {
        setLoading(false);
      }
    }
    getResponse();
  }, [notesContent]);

  return (
    <div className="w-full p-4">
      <p>Solve this quiz based on your topic notes:</p>
      {loading ? (
        <p className="mt-4">Loading AI response...</p>
      ) : (
        <div className="mt-4 border p-2 rounded bg-gray-50 dark:bg-neutral-800">
          {questions.length > 0 ? (
            <ol className="space-y-4">
              {questions.map((q, i) => (
                <li key={i} className="text-sm">
                  <p className="font-semibold">{q.question}</p>
                  <ul className="list-disc ml-4">
                    {q.options.map((option: string, j: number) => (
                      <li key={j}>{option}</li>
                    ))}
                  </ul>
                  <p className="italic text-green-700">Answer: {q.answer}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm">No questions available.</p>
          )}
        </div>
      )}
    </div>
  );
}
