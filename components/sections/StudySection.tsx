"use client";
import React from "react";
import {
  StopwatchProvider,
  useStopwatch,
} from "../../app/contexts/StopwatchContext";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

export function StudySection() {
  const { isRunning, elapsed, start, pause, reset } = useStopwatch();

  // Format ms -> HH:MM:SS
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

  return (
    <StopwatchProvider>
      <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 space-y-6">
        <h1 className="text-xl font-semibold">Study</h1>

        <div className="flex flex-col items-center space-y-4">
          {/* Analog stopwatch: pass new Date(elapsed) */}
          <Clock value={new Date(elapsed)} size={200} renderNumbers />

          {/* Digital stopwatch */}
          <div className="text-6xl font-bold">{formatTime(elapsed)}</div>

          {/* Controls */}
          <div className="flex space-x-4">
            <button
              onClick={isRunning ? pause : start}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
            >
              Reset
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
