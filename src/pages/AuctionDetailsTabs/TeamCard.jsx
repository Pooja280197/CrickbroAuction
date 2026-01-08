import React, { useState } from "react";

export default function EnhancedTeamCard({ player }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[140px]">
      <div className="relative w-full flex justify-center">
        <div
          className="w-20 h-20 rounded-full overflow-hidden shadow-lg cursor-pointer transition-all ring-2 ring-gray-200 hover:ring-blue-400"
        >
          {!imageError && player?.image ? (
            <img
              src={player.image}
              alt={player.name}
              className="w-20 h-20 object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-500 text-white text-xl font-bold">
              {/* initials can go here */}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs font-semibold text-white text-center truncate w-full px-1">
        {player?.name}
      </p>
    </div>
  );
}
