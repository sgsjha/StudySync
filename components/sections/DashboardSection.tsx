"use client";
import React, { useEffect, useState } from "react";
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
  assignments: string[];
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
            <p>1. COMP 109 Test on 28/03</p>
            <p>2. COMP 111: Assignment 2 due on 30/03</p>
            <p>3. COMP 116: Assignment 1 due on 31/03</p>
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
