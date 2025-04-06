"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "@/firebase-config";
import PracticeExamModal from "./PracticeExamModal"; // Adjust path as needed

// Define the RevisionQuiz interface (for local use)
interface RevisionQuiz {
  id: string;
  numberOfQuestions: number;
  examType: string; // "MCQ" or "Written"
  timeAllowed: number; // in minutes
  totalMarks: number;
  createdAt: number;
}

export default function RevisionSection() {
  const [revisionQuizzes, setRevisionQuizzes] = useState<RevisionQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchRevisionQuizzes() {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        const revisionRef = collection(
          db,
          "users",
          user.uid,
          "revisionQuizzes"
        );
        const q = query(revisionRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const quizzes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as RevisionQuiz[];
        setRevisionQuizzes(quizzes);
      } catch (err: any) {
        console.error("Error fetching revision quizzes:", err);
        setError(err.message || "Error fetching revision quizzes");
      } finally {
        setLoading(false);
      }
    }
    fetchRevisionQuizzes();
  }, []);

  // Callback when a new practice exam is added
  const handleNewExam = async (
    newExam: Omit<RevisionQuiz, "id" | "createdAt">
  ) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const revisionRef = collection(db, "users", user.uid, "revisionQuizzes");
      const examData = { ...newExam, createdAt: Date.now() };
      const docRef = await addDoc(revisionRef, examData);
      setRevisionQuizzes((prev) => [{ id: docRef.id, ...examData }, ...prev]);
    } catch (err: any) {
      console.error("Error adding practice exam:", err);
      setError(err.message || "Error adding practice exam");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Revision Quizzes</h1>
      {loading ? (
        <p>Loading revision quizzes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : revisionQuizzes.length === 0 ? (
        <p>No revision quizzes added yet.</p>
      ) : (
        <ul className="space-y-4">
          {revisionQuizzes.map((quiz) => (
            <li key={quiz.id} className="border p-4 rounded">
              <p className="font-semibold">
                {quiz.examType} Exam - {quiz.numberOfQuestions} Questions
              </p>
              <p className="text-sm">
                Time Allowed: {quiz.timeAllowed} minutes
              </p>
              <p className="text-sm">Total Marks: {quiz.totalMarks}</p>
              <p className="text-xs text-gray-500">
                Created: {new Date(quiz.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Create Practice Exam
        </button>
      </div>
      {showModal && (
        <PracticeExamModal
          onClose={() => setShowModal(false)}
          onSubmit={(examType, numQuestions, timeAllowed, totalMarks) => {
            handleNewExam({
              examType,
              numberOfQuestions: numQuestions,
              timeAllowed,
              totalMarks,
            });
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
