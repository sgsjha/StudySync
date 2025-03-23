"use client";
import React from "react";
import * as Progress from "@radix-ui/react-progress";

export function ModulesSection() {
  // Dummy module data without icons
  const modules = [
    {
      label: "COMP108 : Data Structures and Algorithms",
      value: 48,
    },
    {
      label: "COMP101 : Introduction to Programming",
      value: 95,
    },
    {
      label: "COMP109 : Foundations of CS",
      value: 92,
    },
    {
      label: "COMP116 : Analytical Techniques used in CS",
      value: 89,
    },
    {
      label: "COMP122 : Object - Oriented Programming",
      value: 52,
    },
    {
      label: "COMP107 : DSDS",
      value: 36,
    },
  ];

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
        Modules
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {modules.map((mod, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm"
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
