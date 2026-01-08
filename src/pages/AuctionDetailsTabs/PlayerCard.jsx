import React, { useState } from "react";
import { Eye, MapPin, Clock, Calendar, X, Check, Star } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const DUMMY_IMAGE_URL =
  "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";

/* ================= GRADIENTS ================= */
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

const getGradientByName = (name = "") => {
  if (!name) return gradients[0];
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

const isDummyImage = (url) => url === DUMMY_IMAGE_URL;

const getInitials = (name = "") => {
  if (!name) return "NA";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

const formatRole = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB") : "";

const formatTime = (t) => {
  if (!t) return "";
  let [h, m] = t.split(":");
  let hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

/* ================= PLAYER DETAILS MODAL ================= */
const PlayerDetailsModal = ({
  player,
  isOpen,
  onClose,
  // selector,
  onRemove,
  adminLogin,
  type,
}) => {
  if (!isOpen || !player) return null;

  const playerData = player?.player || player;
  const playerName = playerData?.name || "";
  const playerImage = playerData?.logo || "";
  const playerEmail = playerData?.email || "";
  const playerMobile = playerData?.mobile || "";
  const playerLocation = playerData?.location || "";
  const playerBatchId = playerData?.batchId || "";
  
  const initials = getInitials(playerName);
  const role = formatRole(type || playerData?.playerRole);
  
  const rating = player?.playersRatings || {};
  const basePrice = player?.basePrice || 0;
  const currentBid = player?.currentBid || 0;
  const status = player?.status || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Player Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {playerImage && !isDummyImage(playerImage) ? (
                <img
                  src={playerImage}
                  alt={playerName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      const initialsDiv = document.createElement('div');
                      initialsDiv.className = `w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(playerName)} text-white font-bold`;
                      initialsDiv.textContent = initials;
                      parent.appendChild(initialsDiv);
                    }
                  }}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(playerName)} text-white font-bold`}>
                  {initials}
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900">{playerName}</h2>
              {role && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-1">
                  {role.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Personal Details</h3>
            {playerEmail && (
              <div className="text-sm">
                <span className="text-gray-600">Email: </span>
                <span className="font-medium text-gray-900">{playerEmail}</span>
              </div>
            )}
            {playerMobile && (
              <div className="text-sm">
                <span className="text-gray-600">Mobile: </span>
                <span className="font-medium text-gray-900">{playerMobile}</span>
              </div>
            )}
            {playerBatchId && (
              <div className="text-sm">
                <span className="text-gray-600">Batch ID: </span>
                <span className="font-medium text-gray-900">{playerBatchId}</span>
              </div>
            )}
            {playerLocation && (
              <div className="text-sm">
                <span className="text-gray-600">Location: </span>
                <span className="font-medium text-gray-900">{playerLocation}</span>
              </div>
            )}
          </div>

          {/* Auction Details */}
          {(basePrice > 0 || currentBid > 0) && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Auction Details</h3>
              <div className="grid grid-cols-2 gap-3">
                {basePrice > 0 && (
                  <div className="text-sm">
                    <div className="text-gray-600">Base Price</div>
                    <div className="font-semibold text-gray-900">₹{basePrice.toLocaleString()}</div>
                  </div>
                )}
                {currentBid > 0 && (
                  <div className="text-sm">
                    <div className="text-gray-600">Current Bid</div>
                    <div className="font-semibold text-gray-900">₹{currentBid.toLocaleString()}</div>
                  </div>
                )}
                {status && (
                  <div className="text-sm">
                    <div className="text-gray-600">Status</div>
                    <div className="font-semibold text-gray-900">{status}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rating Details */}
          {rating?.avgRating > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Rating Details</h3>
              <div className="mb-4">
                <div className="text-sm text-gray-600">Average Rating</div>
                <div className="text-2xl font-bold text-yellow-700">
                  {rating.avgRating}
                </div>
              </div>
              {rating.playerType && (
                <div className="text-sm">
                  <span className="text-gray-600">Player Type: </span>
                  <span className="font-medium text-gray-900">{rating.playerType}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {adminLogin && onRemove && (
          <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t z-50">
            <button
              type="button"
              onClick={() => onRemove(player)}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              Remove Player
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= PLAYER CARD ================= */
const PlayerCard = ({
  player,
  mode = "view",
  isSelected = false,
  onSelect,
  onViewDetails,
  onAssign,
  showActions = true,
  selector,
  onRemove,
  adminLogin,
  type,
}) => {
  const [imageError, setImageError] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract player data from the structure
  const playerData = player?.player || player;
  const playerId = player?.player?._id || player?.playerId || player?.id;
  const playerName = playerData?.name || "";
  const playerImage = playerData?.logo || "";
  const playerBatchId = playerData?.batchId || "";
  
  const initials = getInitials(playerName);
  const role = formatRole(type || playerData?.playerRole);

  const handleViewDetails = (e) => {
    e?.stopPropagation();
    setDetailsModalOpen(true);
    onViewDetails && onViewDetails(player);
  };

  const handleSelect = (e) => {
    e?.stopPropagation();
    if (onSelect) {
      onSelect(playerId);
    }
  };

  // For mode === "select"
  if (mode === "select") {
    return (
      <>
        <div className="flex flex-col items-center gap-2 w-full max-w-[140px]">
          <div className="relative w-full flex justify-center">
            {showActions && (
              <div
                onClick={handleSelect}
                className={`absolute -top-1 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-green-500 border-white text-white shadow-md"
                    : "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
                }`}
              >
                <Check className="w-4 h-4" />
              </div>
            )}

            <div
              onClick={handleViewDetails}
              className={`w-20 h-20 rounded-full overflow-hidden shadow-lg transition-all cursor-pointer ${
                isSelected
                  ? "ring-4 ring-green-400 shadow-green-200"
                  : "ring-2 ring-gray-200 hover:ring-blue-400"
              }`}
            >
              {!imageError && playerImage && !isDummyImage(playerImage) ? (
                <img
                  src={playerImage}
                  alt={playerName}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${getGradientByName(
                    playerName
                  )}`}
                >
                  {initials}
                </div>
              )}
            </div>

            {role && (
              <span className="absolute -bottom-2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-semibold rounded-full shadow-lg">
                {role}
              </span>
            )}
          </div>

          <div className="text-center w-full px-1">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {playerName}
            </p>
            {playerBatchId && (
              <p className="text-xs text-gray-500 truncate mt-1">
                {playerBatchId}
              </p>
            )}
          </div>
        </div>

        <PlayerDetailsModal
          player={player}
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          selector={selector}
          adminLogin={adminLogin}
          type={type}
        />
      </>
    );
  }

  // For mode === "assigned"
  if (mode === "assigned") {
    const assign = player?.assign || {};
    const location = assign?.location || {};
    const rating = player?.playersRatings || {};

    return (
      <>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden flex w-full max-w-sm p-3 gap-3"
        >
          <div
            onClick={handleViewDetails}
            className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
          >
            {!imageError && playerImage && !isDummyImage(playerImage) ? (
              <img
                src={playerImage}
                alt={playerName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${getGradientByName(
                  playerName
                )}`}
              >
                {initials}
              </div>
            )}

            {role && (
              <span
                className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[9px] font-semibold shadow ${
                  role?.toLowerCase() === "batsman"
                    ? "bg-blue-600 text-white"
                    : role?.toLowerCase() === "bowler"
                    ? "bg-red-600 text-white"
                    : role?.toLowerCase() === "allrounder"
                    ? "bg-orange-500 text-white"
                    : "bg-purple-500 text-white"
                }`}
              >
                {role}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center flex-grow">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {playerName}
            </h3>

            {location?.venue && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-pink-500" />
                <span className="text-xs text-gray-700 truncate">
                  {location.venue}
                </span>
              </div>
            )}

            {assign?.slotStartTime && (
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-green-600" />
                <span className="text-xs text-gray-600">
                  {formatTime(assign.slotStartTime)}-{formatTime(assign.slotEndTime)}
                </span>
              </div>
            )}

            {rating?.avgRating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-semibold text-gray-900">
                  Rating: {rating.avgRating}
                </span>
              </div>
            )}
          </div>

          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-200">
              <button
                type="button"
                onClick={handleViewDetails}
                className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-100"
              >
                <Eye className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">View</span>
              </button>
            </div>
          )}
        </div>

        <PlayerDetailsModal
          player={player}
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          selector={selector}
          onRemove={onRemove}
          adminLogin={adminLogin}
          type={type}
        />
      </>
    );
  }

  // Default view mode
  return (
    <>
      <div className="flex flex-col items-center gap-2 w-full max-w-[140px]">
        <div className="relative w-full flex justify-center">
          <div
            onClick={handleViewDetails}
            className="w-20 h-20 rounded-full overflow-hidden shadow-lg transition-all ring-2 ring-gray-200 hover:ring-blue-400 cursor-pointer"
          >
            {!imageError && playerImage && !isDummyImage(playerImage) ? (
              <img
                src={playerImage}
                alt={playerName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center text-white text-xl font-bold bg-gradient-to-br ${getGradientByName(
                  playerName
                )}`}
              >
                {initials}
              </div>
            )}
          </div>

          {role && (
            <span className="absolute -bottom-2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-semibold rounded-full shadow-lg">
              {role}
            </span>
          )}
        </div>

        <p className="text-xs font-semibold text-gray-900 text-center truncate w-full px-1">
          {playerName}
        </p>
        {playerBatchId && (
          <p className="text-xs text-gray-500 truncate mt-1">
            {playerBatchId}
          </p>
        )}

        {showActions && (
          <div className="flex gap-1 mt-1">
            <button
              type="button"
              onClick={handleViewDetails}
              className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
            >
              View
            </button>
            {onAssign && (
              <button
                type="button"
                onClick={() => onAssign && onAssign(player)}
                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
              >
                Assign
              </button>
            )}
          </div>
        )}
      </div>

      <PlayerDetailsModal
        player={player}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        selector={selector}
        adminLogin={adminLogin}
        type={type}
      />
    </>
  );
};

export default PlayerCard;