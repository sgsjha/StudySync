"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUser,
  IconVocabulary,
  IconListCheck,
  IconUsers,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Import the different sections
import { DashboardSection } from "@/components/sections/DashboardSection";
import { StudySection } from "@/components/sections/StudySection";
import { ModulesSection } from "@/components/sections/ModulesSection";
import { LeaderboardSection } from "@/components/sections/LeaderboardSection";
import { StopwatchProvider } from "./contexts/StopwatchContext";

export function SidebarDemo() {
  // State to track the selected section
  const [activeSection, setActiveSection] = useState("Dashboard");

  // Added local state to handle sidebar open/close behavior
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      section: "Dashboard",
      icon: <IconBrandTabler className="h-5 w-5" />,
    },
    {
      label: "Study",
      section: "Study",
      icon: <IconVocabulary className="h-5 w-5" />,
    },
    {
      label: "Modules",
      section: "Modules",
      icon: <IconListCheck className="h-5 w-5" />,
    },
    {
      label: "Leaderboard",
      section: "Leaderboard",
      icon: <IconUsers className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden md:overflow-auto">
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSection(link.section)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  {link.icon}
                  <span className="text-neutral-700 dark:text-neutral-200">
                    {link.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Sarthak Jha",
                href: "#",
                icon: (
                  <IconUser className="h-7 w-7 text-neutral-700 dark:text-neutral-200" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Render the active section */}
      <div className="flex flex-1 p-4 overflow-y-auto h-full">
        <StopwatchProvider>
          {" "}
          {/* NOTE : This is here because it gives the app the better behavior of  */}
          {activeSection === "Dashboard" && <DashboardSection />}
          {activeSection === "Study" && <StudySection />}
          {activeSection === "Modules" && <ModulesSection />}
          {activeSection === "Leaderboard" && <LeaderboardSection />}
        </StopwatchProvider>
      </div>
    </div>
  );
}

const Logo = () => (
  <Link
    href="#"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1"
  >
    <div className="h-5 w-6 bg-black dark:bg-white rounded-lg shrink-0" />
    <motion.span className="font-medium text-black dark:text-white whitespace-pre">
      Study Sync
    </motion.span>
  </Link>
);
