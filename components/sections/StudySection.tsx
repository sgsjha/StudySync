"use client";
import React, { useState, useEffect } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";

export function StudySection() {
  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // in milliseconds
  const [lastTick, setLastTick] = useState<number | null>(null);

  // Update elapsed time every second while running
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setElapsed((prev) => prev + (Date.now() - (lastTick ?? Date.now())));
        setLastTick(Date.now());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, lastTick]);

  // Start / Pause
  const handleStartPause = () => {
    if (!isRunning) {
      setIsRunning(true);
      setLastTick(Date.now());
    } else {
      setIsRunning(false);
    }
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
    setLastTick(null);
  };

  // Format ms -> HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 space-y-6">
      {/* Title */}
      <h1 className="text-xl font-semibold">Study</h1>

      <div className="flex flex-col items-center space-y-4">
        {/* Analog Clock as Stopwatch */}
        <Clock
          // Pass a Date object derived from the stopwatch's elapsed time
          value={new Date(elapsed)}
          size={200}
          renderNumbers
        />

        {/* Digital Timer */}
        <div className="text-6xl font-bold">{formatTime(elapsed)}</div>

        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={handleStartPause}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No distractions, just a clean stopwatch. Give it your best!
      </p>
    </div>
  );
}
