import { Trash2, Eye } from "lucide-react";

const DUMMY_IMAGE_URL =
  "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";

// Color gradients for initials
const gradients = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-rose-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-fuchsia-500 to-pink-500",
  "from-cyan-500 to-blue-500",
];

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

const getGradientByName = (name) => {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

const isDummyImage = (logoUrl) => {
  return logoUrl === DUMMY_IMAGE_URL;
};

export default function PlayerCard({
  player,
  selected,
  selectable,
  showDelete,
  onSelect,
  onDelete,
  onViewDetails,
  isTrialType
}) {
  
  const playerName = player?.player?.name || "Unknown";
  const playerLogo = player?.player?.logo || DUMMY_IMAGE_URL;
  const isPlaceholder = isDummyImage(playerLogo);
  const initials = getInitials(playerName);
  const gradientClass = getGradientByName(playerName);

  // console.log(player,"player")
  return (
    /* Updated Player card — paste in place of your current card JSX */
    <div
      className="relative group bg-gray-800 rounded-2xl shadow-sm p-4 flex items-start gap-4 max-w-full"
      style={{ minWidth: 0 }} // prevents flex children from forcing parent width
    >
      {/* LEFT: square avatar (clickable) */}
      <div
        onClick={onSelect}
        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center
      ${selected ? "ring-4 ring-green-400 scale-105" : "ring-2 ring-gray-200"}
      ${selectable ? "cursor-pointer hover:ring-purple-500" : ""}`}
      >
        {isPlaceholder ? (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}
          >
            <span className="text-white font-bold text-xl leading-none">
              {initials}
            </span>
          </div>
        ) : (
          <img
            src={playerLogo}
            className="block w-full h-full object-cover"
            alt={playerName}
          />
        )}

       {isTrialType && <span className="absolute top-1 left-1 bg-blue-400 px-2 py-0.5 rounded text-yellow-300 font-semibold text-[10px] shadow-sm">
          ⭐ {(player?.playersRatings?.avgRating || 0).toFixed(2)}
        </span>}

        {player?.playersRatings?.playerType && (
          <span className="absolute bottom-1 right-1 bg-purple-50 px-1.5 py-0.5 rounded text-purple-700 text-[9px] font-semibold shadow-sm">
            {player?.playersRatings?.playerType.slice(0, 10).toUpperCase()}
          </span>
        )}
      </div>

      {/* RIGHT: details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          {showDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete();
              }}
              className="ml-2 hidden group-hover:flex items-center justify-center bg-red-500 text-white p-1 rounded-full z-10 hover:bg-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <div className=" flex items-center gap-2">
          <p className="text-sm font-bold text-white leading-tight line-clamp-2 break-words min-w-0">
            {playerName}
          </p>
        </div>
        {player?.player?.batchId && (
          <div className="mt-1 text-[11px] text-gray-400 truncate">
            {player.player.batchId}
          </div>
        )}

        {/* Slot / Session lines */}
        { isTrialType && 
        <>
        <div className=" text-[12px] text-gray-600">
          <div className="truncate text-[11px] text-gray-400">
            {player?.session?.name || "Session"}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[15px]">
          <div className="truncate">{player?.slot?.slotName || "Slot -1"}</div>
        </div>
        </>
        }

        {/* Batch id */}
        {/* {player?.playerDoc?.batchId && (
      <div className="mt-2 text-[11px] text-gray-400 truncate">
        {player.playerDoc.batchId}
      </div>
    )} */}
      </div>

      {/* Hover overlay View button (optional) */}
      {onViewDetails && (
        <div
          className="absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          aria-hidden={!onViewDetails}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            className="pointer-events-auto bg-white/90 text-gray-800 px-3 py-1 rounded-full shadow-md flex items-center gap-2"
          >
            <Eye size={14} />
            <span className="text-sm">View</span>
          </button>
        </div>
      )}
    </div>
  );
}
