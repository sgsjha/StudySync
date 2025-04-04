"use client";
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/firebase-config";
import { TopicQuiz } from "@/components/details/TopicQuiz"; // adjust path as needed

interface TopicDetailsProps {
  moduleId: string; // Parent module's document ID
  topic: {
    id: string;
    title: string;
    notes: string;
    quizData?: any; // The stored quiz questions from last time
    quizAnswers?: Record<number, string>; // The user’s final answers
    quizScore?: number; // The user’s final score
    quizTotal?: number; // The total number of questions
  };
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

  useEffect(() => {
    // If there's already a quiz in Firestore, show it immediately
    if (topic.quizData) {
      setShowQuiz(true);
    }
  }, [topic.quizData]);

  // Save topic notes by updating the parent module’s topics array in Firestore
  const handleSaveNotes = async () => {
    setSaving(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const moduleRef = doc(db, "users", user.uid, "modules", moduleId);
      const moduleSnap = await getDoc(moduleRef);
      if (!moduleSnap.exists()) {
        throw new Error("Module not found");
      }
      const moduleData = moduleSnap.data();
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

  // Callback when the quiz is generated or re-loaded
  // We'll store the quizData in Firestore so user sees the same quiz next time
  const handleQuizGenerated = async (quizData: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const moduleRef = doc(db, "users", user.uid, "modules", moduleId);
      const moduleSnap = await getDoc(moduleRef);
      if (!moduleSnap.exists()) throw new Error("Module not found");
      const moduleData = moduleSnap.data();
      const currentTopics = moduleData.topics || [];
      const updatedTopics = currentTopics.map((t: any) =>
        t.id === topic.id ? { ...t, quizData } : t
      );
      await updateDoc(moduleRef, { topics: updatedTopics });
      console.log("Quiz data saved to Firestore.");
    } catch (err: any) {
      console.error("Error saving quiz data:", err);
    }
  };

  // Callback when user submits final quiz answers
  const handleQuizSubmit = async (
    quizAnswers: Record<number, string>,
    score: number,
    total: number
  ) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const moduleRef = doc(db, "users", user.uid, "modules", moduleId);
      const moduleSnap = await getDoc(moduleRef);
      if (!moduleSnap.exists()) throw new Error("Module not found");
      const moduleData = moduleSnap.data();
      const currentTopics = moduleData.topics || [];
      const updatedTopics = currentTopics.map((t: any) =>
        t.id === topic.id
          ? {
              ...t,
              quizAnswers, // store user’s final answers
              quizScore: score,
              quizTotal: total,
            }
          : t
      );
      await updateDoc(moduleRef, { topics: updatedTopics });
      console.log("Quiz results saved to Firestore.");
    } catch (err: any) {
      console.error("Error saving quiz results:", err);
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

      {/* Topic Notes Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Topic Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter your notes for this topic..."
          className="w-full border rounded px-2 py-1 text-sm min-h-[150px]"
        />
      </div>
      <div className="flex gap-4">
        <button
          onClick={handleSaveNotes}
          disabled={saving}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
        {!showQuiz && (
          <button
            onClick={() => {
              handleSaveNotes();
              setShowQuiz(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Take Quiz
          </button>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}

      {/* Quiz Section */}
      {showQuiz && (
        <div className="mt-6 border rounded-lg p-4 bg-white dark:bg-neutral-900">
          <TopicQuiz
            notesContent={notes}
            storedQuizData={topic.quizData}
            storedAnswers={topic.quizAnswers}
            storedScore={topic.quizScore}
            storedTotal={topic.quizTotal}
            onQuizGenerated={handleQuizGenerated}
            onQuizSubmit={handleQuizSubmit}
          />
        </div>
      )}
    </div>
  );
}
