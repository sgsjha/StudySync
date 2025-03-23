"use client";

export function Leaderboard() {
  const data = [
    { name: "Jesse Thomas", time: "7h", rank: 1, img: "/avatars/jesse.png" },
    {
      name: "Thisai Mathiyahagan",
      time: "6h 50m",
      rank: 2,
      img: "/avatars/thisai.png",
    },
  ];

  return (
    <div className="space-y-3">
      {data.map((user, i) => (
        <div key={i} className="flex items-center space-x-4">
          <img
            src={user.img}
            className="w-8 h-8 rounded-full"
            alt={user.name}
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.time}</p>
          </div>
          <span className="text-lg font-bold">#{user.rank}</span>
        </div>
      ))}
    </div>
  );
}
