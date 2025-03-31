"use client";
import React, { useState } from "react";

interface TopicDetailsProps {
  topic: string;
  onBack: () => void;
}

export default function TopicDetails({ topic, onBack }: TopicDetailsProps) {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-4 w-full h-full space-y-6 dark:text-neutral-100 text-neutral-800">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Back to Module
      </button>
      <h1 className="text-3xl font-bold">{topic}</h1>

      {/* Notes Section for the Topic */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Topic Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter your notes for this topic..."
          className="w-full border rounded px-2 py-1 text-sm min-h-[150px]"
        />
      </div>

      {/* Quiz Section Placeholder */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Quiz Section</h2>
        <div className="w-full border rounded px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Quiz functionality coming soon...
        </div>
      </div>
    </div>
  );
}
