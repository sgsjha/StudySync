"use client";
import * as Progress from "@radix-ui/react-progress";

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

export function ModulePerformance({ type }: { type: "strong" | "weak" }) {
  const data =
    type === "strong"
      ? [
          { label: "COMP101: Intro to Programming", value: 95 },
          { label: "COMP109: Foundations of CS", value: 92 },
          { label: "COMP105: Analytical Techniques", value: 89 },
        ]
      : [
          { label: "COMP108: Data Structures", value: 48 },
          { label: "COMP212: OOP", value: 52 },
          { label: "COMP107: DSD", value: 36 },
        ];

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <ProgressBar key={i} label={d.label} value={d.value} />
      ))}
    </div>
  );
}
