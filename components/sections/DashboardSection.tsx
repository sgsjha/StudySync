// components/sections/DashboardSection.tsx

// THIS NEEDS TO BE THE BENTO GRID
// MAIN DASHBOARD COMPONENT

import { BentoGridItem } from "../ui/bento-grid";
import { StudyHoursChart } from "../charts/StudyHoursChart";
import { ModulePerformance } from "../widgets/ModulePerformance";
import { Leaderboard } from "../widgets/Leaderboard";

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />
);

export function DashboardSection() {
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
            <p>2. COMP 111 : Assignment 2 due on 30/03</p>
            <p>3. COMP 116 : Assignment 1 due on 31/03</p>
          </div>
        }
      />

      <BentoGridItem
        title="Weakest Modules"
        description="Improve these topics"
        header={<ModulePerformance type="weak" />}
      />
      <BentoGridItem
        title="Strongest Modules"
        description="You excel in these!"
        header={<ModulePerformance type="strong" />}
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
