"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

interface StopwatchContextValue {
  isRunning: boolean;
  elapsed: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const StopwatchContext = createContext<StopwatchContextValue | undefined>(
  undefined
);

export function StopwatchProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [lastTick, setLastTick] = useState<number | null>(null);

  // Update every second while running
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

  // Start, pause, reset
  const start = () => {
    setIsRunning(true);
    setLastTick(Date.now());
  };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
    setLastTick(null);
  };

  return (
    <StopwatchContext.Provider
      value={{ isRunning, elapsed, start, pause, reset }}
    >
      {children}
    </StopwatchContext.Provider>
  );
}

export function useStopwatch() {
  const context = useContext(StopwatchContext);
  if (!context) {
    throw new Error("useStopwatch must be used within a StopwatchProvider");
  }
  return context;
}
