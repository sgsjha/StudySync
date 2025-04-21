import { auth, db } from "@/firebase-config";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

export async function calculateStreaks(): Promise<{
  currentStreak: number;
  highestStreak: number;
}> {
  const user = auth.currentUser;
  if (!user) {
    console.log("No authenticated user.");
    return { currentStreak: 0, highestStreak: 0 };
  }

  const sessionsRef = collection(db, "users", user.uid, "studySessions");
  const streakRef = doc(db, "users", user.uid, "meta", "streaks");

  // Fetch study sessions
  const snapshot = await getDocs(sessionsRef);
  const datesSet = new Set<string>();

  snapshot.forEach((doc) => {
    const { timestamp } = doc.data();
    const date = new Date(timestamp);
    const key = date.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
    datesSet.add(key);
  });

  console.log("📅 Unique study session dates:", Array.from(datesSet));

  const dates = Array.from(datesSet)
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let currentStreak = 0;
  let highestStreak = 0;
  let prevDate: Date | null = null;

  for (let date of dates) {
    if (!prevDate) {
      currentStreak = 1;
    } else {
      const diff = Math.floor(
        (date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 1) {
        currentStreak++;
      } else if (diff > 1) {
        currentStreak = 1;
      }
    }
    highestStreak = Math.max(highestStreak, currentStreak);
    prevDate = date;
  }

  console.log("🔥 Current Streak (pre-check):", currentStreak);
  console.log("🏆 Highest Streak (pre-check):", highestStreak);

  // Reset current streak only if yesterday is missing
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const todayKey = today.toISOString().split("T")[0];
  const yKey = yesterday.toISOString().split("T")[0];

  if (!datesSet.has(yKey)) {
    console.log("⚠️ No study session found for yesterday:", yKey);
    currentStreak = 0;
  }

  // Fetch previously saved highest streak from Firestore
  let savedStreak = 0;
  const streakSnap = await getDoc(streakRef);
  if (streakSnap.exists()) {
    savedStreak = streakSnap.data().longestStreak || 0;
    console.log("📦 Saved longest streak from Firestore:", savedStreak);
  } else {
    console.log("📦 No saved longest streak found in Firestore.");
  }

  // Update Firestore if new highest streak
  const newHighest = Math.max(savedStreak, highestStreak);
  if (newHighest > savedStreak) {
    console.log("✅ Updating Firestore with new longest streak:", newHighest);
    await setDoc(streakRef, { longestStreak: newHighest });
  }

  console.log("📊 Final Streaks — Current:", currentStreak, "| Highest:", newHighest);
  return { currentStreak, highestStreak: newHighest };
}
