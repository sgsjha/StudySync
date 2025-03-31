"use client";
import React, { useState } from "react";
import TopicDetails from "./TopicDetails"; // adjust path if needed

// Define the module type (or import from a shared types file)
interface ModuleType {
  id: string;
  label: string;
  lecturer: string;
  year?: string;
  semester?: string;
  topics: string[];
  notes: string;
  grades: string;
  assignments: string[];
  value: number;
}

interface ModuleDetailsProps {
  module: ModuleType;
  onBack: () => void;
}

export default function ModuleDetails({ module, onBack }: ModuleDetailsProps) {
  // Editable state for module info
  const [moduleInfo, setModuleInfo] = useState<ModuleType>(module);
  const [newTopic, setNewTopic] = useState("");

  // Local state for selected topic details view
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // If a topic is selected, show TopicDetails
  if (selectedTopic) {
    return (
      <TopicDetails
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  // Handlers for updating module info
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModuleInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new topic to the list
  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setModuleInfo((prev) => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()],
      }));
      setNewTopic("");
    }
  };

  // Save changes (currently just logs; integrate Firestore update as needed)
  const handleSaveChanges = () => {
    console.log("Saving module info...", moduleInfo);
    // TODO: update Firestore with new module info.
  };

  return (
    <div className="p-4 w-full h-full space-y-6 dark:text-neutral-100 text-neutral-800">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Back
      </button>

      {/* Module Info Section */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Module Information</h1>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium">Module Name</label>
            <input
              type="text"
              name="label"
              value={moduleInfo.label}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Lecturer</label>
            <input
              type="text"
              name="lecturer"
              value={moduleInfo.lecturer}
              onChange={handleInputChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Year</label>
              <input
                type="text"
                name="year"
                value={moduleInfo.year || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Semester</label>
              <input
                type="text"
                name="semester"
                value={moduleInfo.semester || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>
          </div>
          <button
            onClick={handleSaveChanges}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* Topics Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Topics</h2>
        <div className="space-y-2">
          {moduleInfo.topics.length > 0 ? (
            <ul className="list-disc ml-6">
              {moduleInfo.topics.map((topic, idx) => (
                <li
                  key={idx}
                  className="text-sm cursor-pointer hover:underline"
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm italic text-gray-500">No topics added yet.</p>
          )}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add a new topic"
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={handleAddTopic}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Module Notes</h2>
        <textarea
          value={moduleInfo.notes}
          onChange={(e) =>
            setModuleInfo((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Write your notes for the module here..."
          className="w-full border rounded px-2 py-1 text-sm min-h-[100px]"
        />
      </section>

      {/* Quiz Section Placeholder */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quiz Section</h2>
        <div className="w-full border rounded px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Quiz functionality coming soon...
        </div>
      </section>
    </div>
  );
}
