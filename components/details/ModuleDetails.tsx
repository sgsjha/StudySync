"use client";
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase-config";
import TopicDetails from "../details/TopicDetails";

interface ModuleType {
  id: string;
  label: string;
  lecturer: string;
  year?: string;
  semester?: string;
  topics: { id: string; title: string; notes: string }[];
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
  const [moduleInfo, setModuleInfo] = useState<ModuleType>(module);
  const [newTopic, setNewTopic] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<{
    id: string;
    title: string;
    notes: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Helper to get the Firestore document reference for this module.
  const getModuleDocRef = () => {
    const user = auth.currentUser;
    if (!user) return null;
    return doc(db, "users", user.uid, "modules", moduleInfo.id);
  };

  // Save basic module info (name, lecturer, year, semester)
  const handleSaveChanges = async () => {
    setSaving(true);
    const moduleRef = getModuleDocRef();
    if (moduleRef) {
      try {
        await updateDoc(moduleRef, {
          label: moduleInfo.label,
          lecturer: moduleInfo.lecturer,
          year: moduleInfo.year,
          semester: moduleInfo.semester,
        });
        console.log("Module info updated.");
      } catch (err: any) {
        console.error("Error updating module info:", err);
        setError(err.message || "Error updating module info.");
      }
    }
    setSaving(false);
  };

  // Add a new topic and update Firestore
  const handleAddTopic = async () => {
    if (newTopic.trim()) {
      const newTopicObj = {
        id: Date.now().toString(),
        title: newTopic.trim(),
        notes: "",
      };
      const updatedTopics = [...moduleInfo.topics, newTopicObj];
      setModuleInfo((prev) => ({ ...prev, topics: updatedTopics }));
      setNewTopic("");
      const moduleRef = getModuleDocRef();
      if (moduleRef) {
        try {
          await updateDoc(moduleRef, { topics: updatedTopics });
          console.log("Topics updated.");
        } catch (err: any) {
          console.error("Error updating topics:", err);
          setError(err.message || "Error updating topics.");
        }
      }
    }
  };

  // Save module-level notes and update Firestore
  const handleSaveNotes = async () => {
    const moduleRef = getModuleDocRef();
    if (moduleRef) {
      try {
        await updateDoc(moduleRef, { notes: moduleInfo.notes });
        console.log("Module notes updated.");
      } catch (err: any) {
        console.error("Error updating notes:", err);
        setError(err.message || "Error updating notes.");
      }
    }
  };

  // If a topic is selected, show the TopicDetails view
  if (selectedTopic) {
    return (
      <TopicDetails
        moduleId={moduleInfo.id}
        topic={selectedTopic}
        onBack={() => setSelectedTopic(null)}
      />
    );
  }

  return (
    <div className="p-4 w-full h-full space-y-6 dark:text-neutral-100 text-neutral-800">
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
              onChange={(e) =>
                setModuleInfo((prev) => ({ ...prev, label: e.target.value }))
              }
              className="mt-1 block w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Lecturer</label>
            <input
              type="text"
              name="lecturer"
              value={moduleInfo.lecturer}
              onChange={(e) =>
                setModuleInfo((prev) => ({ ...prev, lecturer: e.target.value }))
              }
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
                onChange={(e) =>
                  setModuleInfo((prev) => ({ ...prev, year: e.target.value }))
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium">Semester</label>
              <input
                type="text"
                name="semester"
                value={moduleInfo.semester || ""}
                onChange={(e) =>
                  setModuleInfo((prev) => ({
                    ...prev,
                    semester: e.target.value,
                  }))
                }
                className="mt-1 block w-full border rounded px-2 py-1"
              />
            </div>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>

      {/* Topics Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Topics</h2>
        <div className="space-y-2">
          {moduleInfo.topics.length > 0 ? (
            <ul className="list-disc ml-6">
              {moduleInfo.topics.map((topic) => (
                <li
                  key={topic.id}
                  className="text-sm cursor-pointer hover:underline"
                  onClick={() => setSelectedTopic(topic)}
                >
                  {topic.title}
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

      {/* Module Notes Section */}
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
        <button
          onClick={handleSaveNotes}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Save Notes
        </button>
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
