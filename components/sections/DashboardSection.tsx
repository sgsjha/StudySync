"use client";
import React, { useState, useEffect } from "react";
import { BentoGridItem } from "../ui/bento-grid";
import { StudyHoursChart } from "../charts/StudyHoursChart";
import { ModulePerformance } from "../widgets/ModulePerformance";
import { Leaderboard } from "../widgets/Leaderboard";
import { auth, db } from "@/firebase-config";
import { collection, query, getDocs } from "firebase/firestore";

interface ModuleType {
  id: string;
  label: string;
  value: number; // stored progress (we will compute it)
  lecturer: string;
  topics: {
    id: string;
    title: string;
    notes: string;
    quizScore?: number;
    quizTotal?: number;
  }[];
  notes: string;
  grades: string;
  assignments: {
    id: string;
    title: string;
    weightage: number;
    dueDate: string;
  }[];
  year?: string;
  semester?: string;
}

export function DashboardSection() {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user modules from Firestore
  useEffect(() => {
    async function fetchModules() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        const modulesRef = collection(db, "users", user.uid, "modules");
        const q = query(modulesRef);
        const snapshot = await getDocs(q);
        const fetchedModules = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ModuleType)
        );
        setModules(fetchedModules);
      } catch (err: any) {
        console.error("Error fetching modules:", err);
        setError("Error fetching modules");
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Compute progress for each module from its topics' quiz scores.
  const modulesWithProgress = modules.map((mod) => {
    const totalScore = mod.topics.reduce(
      (acc, topic) => acc + (topic.quizScore || 0),
      0
    );
    const totalQuestions = mod.topics.reduce(
      (acc, topic) => acc + (topic.quizTotal || 0),
      0
    );
    const progress =
      totalQuestions > 0 ? Math.floor((totalScore / totalQuestions) * 100) : 0;
    return { label: mod.label, value: progress };
  });

  // Sort modules for strongest and weakest performance
  const sortedStrongModules = modulesWithProgress
    .slice()
    .sort((a, b) => b.value - a.value)
    .slice(0, Math.min(3, modulesWithProgress.length));
  const sortedWeakModules = modulesWithProgress
    .slice()
    .sort((a, b) => a.value - b.value)
    .slice(0, Math.min(3, modulesWithProgress.length));

  // Gather assignments along with their module title
  const allAssignments = modules.flatMap((mod) =>
    (mod.assignments || []).map((assignment) => ({
      ...assignment,
      moduleLabel: mod.label,
    }))
  );
  // Take the first 3 assignments (you can sort these by dueDate if desired)
  const nextAssignments = allAssignments.slice(0, 3);

  return (
    <div className="grid md:grid-cols-2 gap-4 w-full px-4 pb-10">
      <BentoGridItem
        title="Current Streak"
        description="2 days"
        className="md:row-span-3"
      />
      <BentoGridItem
        title="Longest Streak"
        description="6 days"
        className="md:row-span-3"
      />
      <BentoGridItem title="Total Study Time" description="39h 20m" />
      <BentoGridItem title="Avg. Session Length" description="2h 34m" />
      <BentoGridItem
        title="Hours of Study"
        description="Study patterns over time"
        header={<StudyHoursChart />}
      />
      <BentoGridItem
        title="Next Assignments"
        description="Next 3 due assignments"
        header={
          <div className="text-sm text-neutral-700 dark:text-neutral-200">
            {nextAssignments.length > 0 ? (
              nextAssignments.map((assignment, index) => (
                <p key={index}>
                  <strong>{assignment.moduleLabel}:</strong> {assignment.title}{" "}
                  - Due: {new Date(assignment.dueDate).toLocaleString()}
                </p>
              ))
            ) : (
              <p>No assignments available.</p>
            )}
          </div>
        }
      />
      <BentoGridItem
        title="Weakest Modules"
        description="Improve these topics"
        header={<ModulePerformance type="weak" modules={modules} />}
      />
      <BentoGridItem
        title="Strongest Modules"
        description="You excel in these!"
        header={<ModulePerformance type="strong" modules={modules} />}
      />
      <BentoGridItem
        title="Average Study Time Leaderboard"
        description="See top students"
        header={<Leaderboard />}
        className="md:col-span-2"
      />
    </div>
  );
}
