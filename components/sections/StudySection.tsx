"use client";
import React from "react";
import {
  StopwatchProvider,
  useStopwatch,
} from "../../app/contexts/StopwatchContext";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import { auth, db } from "@/firebase-config";
import { collection, addDoc } from "firebase/firestore";

export function StudySection() {
  const { isRunning, elapsed, start, pause, reset } = useStopwatch();

  // Format ms → HH:MM:SS
  function formatTime(ms: number) {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  // Save session to Firestore and reset timer
  const handleSaveAndReset = async () => {
    if (elapsed === 0) return; // Don’t save if no time has passed

    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    try {
      const sessionRef = collection(db, "users", user.uid, "studySessions");
      await addDoc(sessionRef, {
        duration: elapsed,
        timestamp: Date.now(),
      });
      console.log("Study session saved.");
      reset();
    } catch (err) {
      console.error("Error saving study session:", err);
    }
  };

  return (
    <StopwatchProvider>
      <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 lg:space-y-15 space-y-6">
        <h1 className="text-xl font-semibold lg:text-2xl">Study Time</h1>

        <div className="flex flex-col items-center space-y-4 lg:scale-125">
          <Clock value={new Date(elapsed)} size={200} renderNumbers />

          <div className="text-6xl font-bold">{formatTime(elapsed)}</div>

          <div className="flex space-x-4">
            <button
              onClick={isRunning ? pause : start}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={handleSaveAndReset}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save and Reset
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          No distractions, just a clean stopwatch. Give it your best!
        </p>
      </div>
    </StopwatchProvider>
  );
}
