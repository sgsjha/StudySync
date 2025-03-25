// components/sections/ModulesSection.tsx
"use client";
import React, { useState } from "react";
import * as Progress from "@radix-ui/react-progress";
import ModuleDetails from "../details/ModuleDetails"; // adjust the path if needed
import { modulesData } from "@/app/modulesData"; // adjust the alias/path based on your tsconfig

export function ModulesSection() {
  const [selectedModule, setSelectedModule] = useState<any>(null);

  // If a module is selected, show its details on the full page.
  if (selectedModule) {
    return (
      <ModuleDetails
        module={selectedModule}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  // Otherwise, display the modules grid.
  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
        Modules
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {modulesData.map((mod) => (
          <div
            key={mod.id}
            onClick={() => setSelectedModule(mod)}
            className="cursor-pointer bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
          >
            {/* Module Title */}
            <div className="flex items-center">
              <span className="font-medium text-sm text-neutral-800 dark:text-neutral-100">
                {mod.label}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="mt-4 w-full">
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
