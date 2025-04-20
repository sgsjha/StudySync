"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { auth, db } from "@/firebase-config";
import { collection, getDocs } from "firebase/firestore";

interface SessionData {
  timestamp: number; // ms
  duration: number; // ms
}

export function StudyHoursChart() {
  const [studyData, setStudyData] = useState<
    { day: string; minutes: number }[]
  >([]);

  useEffect(() => {
    async function fetchStudyData() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const sessionsRef = collection(db, "users", user.uid, "studySessions");
        const snapshot = await getDocs(sessionsRef);
        const sessions: SessionData[] = snapshot.docs.map(
          (doc) => doc.data() as SessionData
        );

        const now = new Date();
        const dailyMinutes: Record<string, number> = {};

        // Initialize last 7 days with 0 minutes
        for (let i = 6; i >= 0; i--) {
          const day = new Date(now);
          day.setDate(now.getDate() - i);
          const label = `${String(day.getDate()).padStart(2, "0")}/${String(
            day.getMonth() + 1
          ).padStart(2, "0")}`; // format as dd/mm
          dailyMinutes[label] = 0;
        }

        sessions.forEach((session) => {
          const date = new Date(session.timestamp);
          const label = `${String(date.getDate()).padStart(2, "0")}/${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
          if (dailyMinutes[label] !== undefined) {
            dailyMinutes[label] += Math.floor(session.duration / 60000);
          }
        });

        const data = Object.entries(dailyMinutes).map(([day, minutes]) => ({
          day,
          minutes,
        }));

        setStudyData(data);
      } catch (err) {
        console.error("Failed to load study sessions:", err);
      }
    }

    fetchStudyData();
  }, []);

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={studyData}>
          <XAxis dataKey="day" stroke="#888888" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
