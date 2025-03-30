"use client";
import React, { useEffect, useState } from "react";
import { fetchAIResponse } from "@/lib/openaiClient"; // import our helper function

export function LeaderboardSection() {
  const [aiOutput, setAiOutput] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getResponse() {
      const response = await fetchAIResponse();
      setAiOutput(response);
      setLoading(false);
    }
    getResponse();
  }, []);

  return (
    <div className="w-full p-4">
      <h1 className="text-xl font-bold">Leaderboard</h1>
      <p>Show rankings of friends based on progress.</p>
      {loading ? (
        <p className="mt-4">Loading AI response...</p>
      ) : (
        <p className="mt-4 border p-2 rounded bg-gray-50 dark:bg-neutral-800">
          {aiOutput}
        </p>
      )}
    </div>
  );
}
