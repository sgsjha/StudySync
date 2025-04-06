"use client";
import React, { useState } from "react";

export interface ModuleOption {
  id: string;
  label: string;
}

interface UpdatedPracticeExamModalProps {
  modules: ModuleOption[];
  onClose: () => void;
  onSubmit: (
    selectedModuleId: string,
    examType: "MCQ" | "Written",
    numQuestions: number,
    timeAllowed: number,
    totalMarks: number
  ) => void;
}

export default function UpdatedPracticeExamModal({
  modules,
  onClose,
  onSubmit,
}: UpdatedPracticeExamModalProps) {
  const [selectedModuleId, setSelectedModuleId] = useState(
    modules[0]?.id || ""
  );
  const [examType, setExamType] = useState<"MCQ" | "Written">("MCQ");
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeAllowed, setTimeAllowed] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedModuleId, examType, numQuestions, timeAllowed, totalMarks);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl w-11/12 md:w-1/2 lg:w-1/3">
        <h3 className="text-xl font-bold mb-4">Create Practice Exam</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Select Module</label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="mt-1 block w-full border rounded px-2 py-1"
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Exam Type</label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value as "MCQ" | "Written")}
              className="mt-1 block w-full border rounded px-2 py-1"
            >
              <option value="MCQ">MCQ</option>
              <option value="Written">Written</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">
              Number of Questions
            </label>
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="mt-1 block w-full border rounded px-2 py-1"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Time Allowed (minutes)
            </label>
            <input
              type="number"
              value={timeAllowed}
              onChange={(e) => setTimeAllowed(Number(e.target.value))}
              className="mt-1 block w-full border rounded px-2 py-1"
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Total Marks</label>
            <input
              type="number"
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
              className="mt-1 block w-full border rounded px-2 py-1"
              min={1}
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Create Exam
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
