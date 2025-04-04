"use client";
import * as Progress from "@radix-ui/react-progress";

interface Module {
  label: string;
  topics: { quizScore?: number; quizTotal?: number }[];
}

interface ModulePerformanceProps {
  type: "strong" | "weak";
  modules: Module[];
}

const ProgressBar = ({ value, label }: { value: number; label: string }) => (
  <div>
    <p className="text-sm text-gray-700 dark:text-gray-200 mb-1">{label}</p>
    <Progress.Root className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <Progress.Indicator
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </Progress.Root>
  </div>
);

export function ModulePerformance({ type, modules }: ModulePerformanceProps) {
  if (!modules || modules.length === 0) {
    return <p className="text-sm">No modules added yet.</p>;
  }

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

  // Sort modules: descending for "strong", ascending for "weak"
  const sortedModules = modulesWithProgress.sort((a, b) =>
    type === "strong" ? b.value - a.value : a.value - b.value
  );

  // Select up to three modules
  const selectedModules = sortedModules.slice(
    0,
    Math.min(3, sortedModules.length)
  );

  return (
    <div className="space-y-3">
      {selectedModules.map((mod, i) => (
        <ProgressBar key={i} label={mod.label} value={mod.value} />
      ))}
    </div>
  );
}
