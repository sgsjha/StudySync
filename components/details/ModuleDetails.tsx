// components/sections/ModuleDetails.tsx
"use client";
import React from "react";
//import * as Progress from "@radix-ui/react-progress";
// commented out for vercel build test

export default function ModuleDetails({
  module,
  onBack,
}: {
  module: {
    id: string;
    label: string;
    lecturer: string;
    topics: string[];
    notes: string;
    grades: string;
    assignments: string[];
  };
  onBack: () => void;
}) {
  return (
    <div className="p-4 w-full h-full">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-2">{module.label}</h2>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        <strong>Lecturer:</strong> {module.lecturer}
      </p>
      <div className="mb-4">
        <h3 className="font-semibold">Topics</h3>
        <ul className="list-disc ml-6 mt-1 text-sm">
          {module.topics.map((topic, idx) => (
            <li key={idx}>{topic}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Notes</h3>
        <p className="text-sm mt-1">{module.notes}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Grades</h3>
        <p className="text-sm mt-1">{module.grades}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Assignments</h3>
        <ul className="list-disc ml-6 mt-1 text-sm">
          {module.assignments.map((assn, idx) => (
            <li key={idx}>{assn}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
