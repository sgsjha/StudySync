"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/firebase-config";
import * as Progress from "@radix-ui/react-progress";

interface ModuleType {
  id: string;
  label: string;
  value: number;
  lecturer?: string;
  topics?: string[];
  notes?: string;
  grades?: string;
  assignments?: string[];
}

export function LeaderboardSection() {
  const [modules, setModules] = useState<ModuleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchModules() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        // Reference the user's modules subcollection
        const modulesRef = collection(db, "users", user.uid, "modules");
        const snapshot = await getDocs(modulesRef);
        const fetchedModules: ModuleType[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as ModuleType)
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

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p>{error}</p>;
  if (modules.length === 0)
    return <p>No modules found. Please add some modules.</p>;

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-bold mb-4">My Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm"
          >
            <div className="font-medium text-sm text-neutral-800 dark:text-neutral-100">
              {mod.label}
            </div>
            <div className="mt-2">
              <Progress.Root className="relative w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <Progress.Indicator
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${mod.value}%` }}
                />
              </Progress.Root>
              <div className="text-xs text-right mt-1 text-neutral-500 dark:text-neutral-400">
                {mod.value}% Correct
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
