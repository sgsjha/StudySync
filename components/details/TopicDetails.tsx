"use client";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase-config";
import { TopicQuiz } from "@/components/details/TopicQuiz"; // adjust path as needed

interface TopicDetailsProps {
  moduleId: string; // Parent module's document ID
  topic: { id: string; title: string; notes: string };
  onBack: () => void;
}

export default function TopicDetails({
  moduleId,
  topic,
  onBack,
}: TopicDetailsProps) {
  const [notes, setNotes] = useState(topic.notes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const moduleRef = doc(
        db,
        "users",
        auth.currentUser!.uid,
        "modules",
        moduleId
      );
      const moduleSnap = await getDoc(moduleRef);
      if (!moduleSnap.exists()) {
        throw new Error("Module not found");
      }
      const moduleData = moduleSnap.data();
      // Assume topics is stored as an array of objects
      const currentTopics = moduleData.topics || [];
      const updatedTopics = currentTopics.map((t: any) =>
        t.id === topic.id ? { ...t, notes } : t
      );
      await updateDoc(moduleRef, { topics: updatedTopics });
      console.log("Topic notes updated successfully.");
    } catch (err: any) {
      console.error("Error updating topic notes:", err);
      setError(err.message || "Error updating topic notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 w-full h-full space-y-6 dark:text-neutral-100 text-neutral-800">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Back to Module
      </button>
      <h1 className="text-3xl font-bold">{topic.title}</h1>
      <div>
        <h2 className="text-2xl font-semibold mb-2">Topic Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter your notes for this topic..."
          className="w-full border rounded px-2 py-1 text-sm min-h-[150px] select-text dark:bg-neutral-800 dark:border-neutral-700"
          style={{ userSelect: "text" }}
        />
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>

        {!showQuiz && (
          <button
            onClick={() => {
              handleSave();
              setShowQuiz(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Take Quiz
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {showQuiz && (
        <div className="mt-6 border rounded-lg p-4 bg-white dark:bg-neutral-900">
          <TopicQuiz notesContent={notes} />
        </div>
      )}
    </div>
  );
}
