"use client";
import { useState, useEffect } from "react";
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

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-emerald-600 text-lg">Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

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
        className="md:row-span-3 bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
      <BentoGridItem
        title="Longest Streak"
        description="6 days"
        className="md:row-span-3 bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
      <BentoGridItem
        title="Total Study Time"
        description="39h 20m"
        className="bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
      <BentoGridItem
        title="Avg. Session Length"
        description="2h 34m"
        className="bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
      <BentoGridItem
        title="Hours of Study"
        description="Study patterns over time"
        header={<StudyHoursChart />}
        className="bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
      <BentoGridItem
        title="Next Assignments"
        description="Next 3 due assignments"
        header={
          <div className="text-sm text-gray-700 dark:text-gray-200">
            {nextAssignments.length > 0 ? (
              nextAssignments.map((assignment, index) => (
                <p
                  key={index}
                  className="mb-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-md"
                >
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    {assignment.moduleLabel}:
                  </strong>{" "}
                  {assignment.title}{" "}
                  <span className="block text-xs mt-1 text-gray-500 dark:text-gray-400">
                    Due: {new Date(assignment.dueDate).toLocaleString()}
                  </span>
                </p>
              ))
            ) : (
              <p className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md text-center">
                No assignments available.
              </p>
            )}
          </div>
        }
        className="bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
      <BentoGridItem
        title="Weakest Modules"
        description="Improve these topics"
        header={<ModulePerformance type="weak" modules={modules} />}
        className="bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
      <BentoGridItem
        title="Strongest Modules"
        description="You excel in these!"
        header={<ModulePerformance type="strong" modules={modules} />}
        className="bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
      <BentoGridItem
        title="Average Study Time Leaderboard"
        description="See top students"
        header={<Leaderboard />}
        className="md:col-span-2 bg-white dark:bg-gray-800 border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/50"
      />
    </div>
  );
}
