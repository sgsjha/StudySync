"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase-config";
import PracticeExamModal from "../details/PracticeExamModal";
import PracticeExam from "../details/PracticeExam";
import { practiceExamClient } from "@/lib/practiceExamClient";

export interface ModuleType {
  id: string;
  label: string;
  topics: { id: string; title: string; notes: string }[];
}

interface RevisionQuiz {
  id: string;
  moduleId: string;
  examType: "MCQ" | "Written";
  numberOfQuestions: number;
  timeAllowed: number; // in minutes
  totalMarks: number;
  createdAt: number;
  examData: any;
}

interface RevisionSectionProps {
  modules?: ModuleType[];
}

export default function RevisionSection({
  modules: passedModules,
}: RevisionSectionProps) {
  const [modules, setModules] = useState<ModuleType[]>(passedModules || []);
  const [revisionQuizzes, setRevisionQuizzes] = useState<RevisionQuiz[]>([]);
  const [loadingModules, setLoadingModules] = useState(!passedModules);
  const [loadingRevision, setLoadingRevision] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [attemptExam, setAttemptExam] = useState<RevisionQuiz | null>(null);

  // If modules prop is not provided, fetch modules from Firestore.
  useEffect(() => {
    if (passedModules) return;
    async function fetchModules() {
      setLoadingModules(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        const modulesRef = collection(db, "users", user.uid, "modules");
        const q = query(modulesRef);
        const snapshot = await getDocs(q);
        const fetchedModules = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ModuleType)
        );
        setModules(fetchedModules);
      } catch (err: any) {
        console.error("Error fetching modules:", err);
        setError(err.message || "Error fetching modules");
      } finally {
        setLoadingModules(false);
      }
    }
    fetchModules();
  }, [passedModules]);

  // Fetch revision quizzes from Firestore
  useEffect(() => {
    async function fetchRevisionQuizzes() {
      setLoadingRevision(true);
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
        setLoadingRevision(false);
      }
    }
    fetchRevisionQuizzes();
  }, []);

  // Helper: Clean JSON output (removes code fences)
  const cleanJSON = (response: string): string => {
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "");
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.replace(/\s*```$/, "");
    }
    return cleaned;
  };

  // Helper: Save the generated exam to Firestore.
  const savePracticeExam = async (
    exam: RevisionQuiz["examData"],
    settings: { timeAllowed: number },
    moduleId: string,
    examDetails: Omit<RevisionQuiz, "id" | "createdAt" | "examData">
  ) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const revisionRef = collection(db, "users", user.uid, "revisionQuizzes");
      const examRecord = {
        ...examDetails,
        examData: exam,
        createdAt: Date.now(),
      };
      const docRef = await addDoc(revisionRef, examRecord);
      setRevisionQuizzes((prev) => [{ id: docRef.id, ...examRecord }, ...prev]);
    } catch (err: any) {
      console.error("Error adding practice exam:", err);
      setError(err.message || "Error adding practice exam");
    }
  };

  const handleCreateExam = async (
    selectedModuleId: string,
    examType: "MCQ" | "Written",
    numQuestions: number,
    timeAllowed: number,
    totalMarks: number
  ) => {
    // Find the selected module and concatenate its topics' notes.
    const selectedModule = modules.find((m) => m.id === selectedModuleId);
    if (!selectedModule) {
      setError("Selected module not found");
      return;
    }
    const notesContent = selectedModule.topics.map((t) => t.notes).join("\n");
    try {
      const response = await practiceExamClient(
        notesContent,
        numQuestions,
        examType,
        timeAllowed
      );
      const cleanResponse = cleanJSON(response);
      const examData = JSON.parse(cleanResponse);
      const examDetails = {
        moduleId: selectedModuleId,
        examType,
        numberOfQuestions: numQuestions,
        timeAllowed,
        totalMarks,
      };
      await savePracticeExam(
        examData,
        { timeAllowed },
        selectedModuleId,
        examDetails
      );
      setShowModal(false);
    } catch (err: any) {
      console.error("Error generating practice exam:", err);
      setError(err.message || "Error generating practice exam");
    }
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Revision Quizzes</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loadingRevision ? (
        <p>Loading revision quizzes...</p>
      ) : revisionQuizzes.length === 0 ? (
        <p>No revision quizzes added yet.</p>
      ) : (
        <ul className="space-y-4">
          {revisionQuizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => setAttemptExam(quiz)}
            >
              <p className="font-semibold">
                {modules.find((m) => m.id === quiz.moduleId)?.label ||
                  "Unknown Module"}
                : {quiz.examType} Exam - {quiz.numberOfQuestions} Questions
              </p>
              <p className="text-sm">
                Time Allowed: {quiz.timeAllowed} minutes | Total Marks:{" "}
                {quiz.totalMarks}
              </p>
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
          Generate Practice Exam
        </button>
      </div>
      {showModal && (
        <PracticeExamModal
          modules={modules.map((m) => ({ id: m.id, label: m.label }))}
          onClose={() => setShowModal(false)}
          onSubmit={(
            selectedModuleId,
            examType,
            numQuestions,
            timeAllowed,
            totalMarks
          ) => {
            handleCreateExam(
              selectedModuleId,
              examType as "MCQ" | "Written",
              numQuestions,
              timeAllowed,
              totalMarks
            );
          }}
        />
      )}
      {attemptExam && (
        <div className="mt-6">
          <PracticeExam
            examData={attemptExam.examData}
            timeAllowed={attemptExam.timeAllowed}
            onExit={() => setAttemptExam(null)}
          />
        </div>
      )}
    </div>
  );
}
