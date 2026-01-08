import React, { useEffect, useState } from 'react';
import { Eye, MapPin, Clock, Calendar, X, Star, CalendarCheck } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
const DUMMY_IMAGE_URL = "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";

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

const getGradientByName = (name) => {
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

const isDummyImage = (imageUrl)=> {
  return imageUrl === DUMMY_IMAGE_URL;
};




const formatTime = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const suffix = h >= 12 ? "PM" : "AM";
  const formattedHour = h % 12 || 12;
  return `${formattedHour}:${minute} ${suffix}`;
};

const getInitials = (name) => {
  if (!name) return "NA";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`?.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const formatRole = (role) => {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1)?.toLowerCase();
};

const RatingInput= ({ label, value, setValue }) => {
  const increase = () => value < 10 && setValue(value + 1);
  const decrease = () => value > 1 && setValue(value - 1);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold">{value}/10</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrease}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          -
        </button>
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          className="w-full h-2 sm:h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        <button
          type="button"
          onClick={increase}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          +
        </button>
      </div>
    </div>
  );
};

const RatingForm = ({
  player,
  onClose,
  onSubmit
}) => {

 
  const [ratingType, setRatingType] = useState('');
  const [attitude, setAttitude] = useState(0);
  const [batsman, setBatting] = useState(0);
  const [bowler, setBowling] = useState(0);
  const [fielding, setFielding] = useState(0);
  const [wicketKeeper, setWicketKeeper] = useState(0);

  // Check if player has existing rating
  const hasExistingRating = player.rating?.ratings && player.rating.ratings.length > 0;
  const isRatingTypeEditable = !hasExistingRating;

  const handleSubmit = async () => {
    // Use the correct player ID from the data structure
    const playerId = (player )._id || player.id;

    // Construct rating data based on player type
    const ratingData= {
      playerId: playerId,
      playerType: ratingType,
      ratings: [{
        selectorId: localStorage.getItem('playerId'), // Changed from 'playerId' to 'selectorId'
        attitude,
        submittedAt: new Date().toISOString()
      }]
    };

    // Add specific rating fields based on player type
    if (ratingType === 'wicketkeeper') {
      // For wicketkeeper, store wicket keeping value in fielding key
      ratingData.ratings[0].fielding = wicketKeeper;
      ratingData.ratings[0].wicketKeeper = wicketKeeper;
       ratingData.ratings[0].batsman = batsman; // Also store in wicketKeeper for consistency
    } else {
      // For non-wicketkeeper types, add fielding as normal
      ratingData.ratings[0].fielding = fielding;

      // Add batting/bowling based on type
      if (ratingType === 'batsman' || ratingType === 'allrounder') {
        ratingData.ratings[0].batsman = batsman;
      }
      if (ratingType === 'bowler' || ratingType === 'allrounder') {
        ratingData.ratings[0].bowler = bowler;
      }
    }

    try {
      // Check if we have session and slot information
      if (player.sessions && player.sessions.length > 0) {
        const session = player.sessions[0];
        const res = await axios.post(
          `/webSiteApi/auctionSelector/ratePlayer/${session.slotId}/${session.sessionId}`,
          ratingData
        );
        toast.success('Scores Submitted Successfully');
        onSubmit(ratingData);
      } else {
        // Fallback to using the old properties if sessions array doesn't exist
        if (player.slotId && player.sessionId) {
          const res = await axios.post(
            `/webSiteApi/auctionSelector/ratePlayer/${player.slotId}/${player.sessionId}`,
            ratingData
          );
          toast.success('Scores Submitted Successfully');
          onSubmit(ratingData);
        } else {
          toast.error('Missing session or slot information');
        }
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
      const errorMessage = error.response?.data?.message || 'Failed to submit scores';
      toast.error(errorMessage);
    }

    onClose();
  };

  // Initialize values with existing rating if available
  useEffect(() => {
    if (hasExistingRating) {
      const latestRating = player.rating.ratings[0];

      // Set common fields
      setAttitude(latestRating.attitude || 0);

      // Set rating type from existing data - this will be disabled
      if (latestRating.playerType) {
        setRatingType(latestRating.playerType);
      } else {
        // Fallback to determining from player role
        const role = (player.playerType)?.toLowerCase();
        if (role?.includes('bat')) setRatingType('batsman');
        else if (role?.includes('bowl')) setRatingType('bowler');
        else if (role?.includes('all')) setRatingType('allrounder');
        else if (role?.includes('wicket')) setRatingType('wicketkeeper');
      }

      // Set specific rating fields based on player type
      const playerType = latestRating.playerType || ratingType;

      if (playerType === 'wicketkeeper') {
        // For wicketkeeper, get value from fielding OR wicketKeeper field
        const wkValue = latestRating.wicketKeeper || latestRating.fielding || 0;
        setWicketKeeper(wkValue);
      } else {
        // For non-wicketkeeper types
        setFielding(latestRating.fielding || 0);

        if (playerType === 'batsman' || playerType === 'allrounder') {
          setBatting(latestRating.batsman || 0);
        }

        if (playerType === 'bowler' || playerType === 'allrounder') {
          setBowling(latestRating.bowler || 0);
        }
      }
    } else {
      // If no existing rating, set rating type based on player role
      const role = (player.playerRole || player.type)?.toLowerCase();
      if (role?.includes('bat')) setRatingType('batsman');
      else if (role?.includes('bowl')) setRatingType('bowler');
      else if (role?.includes('all')) setRatingType('allrounder');
      else if (role?.includes('wicket')) setRatingType('wicketkeeper');
    }
  }, [player]);

  const ratingTypes = [
    { value: 'batsman', label: 'Batsman' },
    { value: 'bowler', label: 'Bowler' },
    { value: 'allrounder', label: 'All Rounder' },
    { value: 'wicketkeeper', label: 'Wicket Keeper' },
  ];

  // Function to get display name for player type
  const getPlayerTypeDisplayName = (type) => {
    const typeMap = {
      'batsman': 'Batsman',
      'bowler': 'Bowler',
      'allrounder': 'All Rounder',
      'wicketkeeper': 'Wicket Keeper'
    };
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg mx-2 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Trials Scoring</h2>
          <p className="text-gray-600 mb-6">Please provide scores for {player.batchId}</p>

          {/* Rating Type Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Type
            </label>

            {hasExistingRating ? (
              // Display player type as read-only when rating exists
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="font-medium text-gray-800">
                    {getPlayerTypeDisplayName(ratingType)}
                  </span>
                </div>
                {/* <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                  Already Rated
                </div> */}
              </div>
            ) : (
              // Show dropdown when no rating exists
              <select
                value={ratingType}
                onChange={(e) => {
                  setRatingType(e.target.value);
                  // Reset specific ratings when type changes
                  if (e.target.value === 'wicketkeeper') {
                    setWicketKeeper(0);
                  } else {
                    setFielding(0);
                    if (e.target.value !== 'batsman') setBowling(0);
                    if (e.target.value !== 'bowler') setBatting(0);
                  }
                }}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="" disabled hidden>
                  Select Type
                </option>
                {ratingTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}

            {hasExistingRating && (
              <p className="mt-1 text-sm text-gray-500">
                Player type cannot be changed once rated. To change player type, contact administrator.
              </p>
            )}
          </div>

          {/* Rating Bars - Only show if rating type is selected or exists */}
          {(ratingType || hasExistingRating) && (
            <div className="space-y-6">
              {/* Common for all types */}
              <RatingInput label="Attitude" value={attitude} setValue={setAttitude} />

              {/* Batsman rating → batsman, allrounder, wicketkeeper */}
              {(ratingType === "batsman" ||
                ratingType === "allrounder" ||
                ratingType === "wicketkeeper") && (
                  <RatingInput label="Batsman" value={batsman} setValue={setBatting} />
                )}

              {/* Bowler rating → bowler, allrounder */}
              {(ratingType === "bowler" || ratingType === "allrounder") && (
                <RatingInput label="Bowler" value={bowler} setValue={setBowling} />
              )}

              {/* Fielding → ALL types except wicketkeeper special case */}
              {(ratingType !== "wicketkeeper" && ratingType !== "") && (
                <RatingInput label="Fielding" value={fielding} setValue={setFielding} />
              )}

              {/* Wicket Keeper → only wicketkeeper type */}
              {ratingType === "wicketkeeper" && (
                <RatingInput
                  label="Wicket Keeping"
                  value={wicketKeeper}
                  setValue={setWicketKeeper}
                />
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!ratingType}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${ratingType
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {hasExistingRating ? "Update Scores" : "Submit Scores"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const PlayerDetailsModal = ({
  player,
  isOpen,
  onClose,
  onRate,
  selector,
  fetchSelectorPlayers
}) => {

  const [showRatingForm, setShowRatingForm] = useState(false);
  const slotId = player?.sessions?.[0]?.slotId
  const sessionId = player?.sessions?.[0]?.sessionId


  if (!isOpen || !player) return null;

  if (showRatingForm) {
    return (
      <RatingForm
        player={player}
        onClose={() => {
          setShowRatingForm(false);
          onClose();
        }}
        onSubmit={(rating) => {

          if (onRate) onRate(player);
        }}
      />
    );
  }

  // Helper function to get rating details
  // Update the getRatingDetails function:

  const getRatingDetails = () => {
    if (!player.rating?.ratings || player.rating.ratings.length === 0) {
      return null;
    }
    const latestRating = player.rating.ratings[0];

    // Determine the player type
    const playerType = latestRating.playerType ||
      (player.playerRole || player.type)?.toLowerCase();

    // For wicketkeeper, wicket keeping value could be in wicketKeeper OR fielding
    const isWicketkeeper = playerType?.includes('wicket') ||
      latestRating.playerType === 'wicketkeeper';

    const wicketKeeperValue = isWicketkeeper ?
      (latestRating.wicketKeeper || latestRating.fielding || 0) :
      (latestRating.wicketKeeper || 0);

    const fieldingValue = !isWicketkeeper ?
      (latestRating.fielding || 0) :
      0;

    return {
      attitude: latestRating.attitude || 0,
      batsman: latestRating.batsman || 0,
      bowler: latestRating.bowler || 0,
      fielding: fieldingValue,
      wicketKeeper: wicketKeeperValue,
      playerType: latestRating.playerType || playerType || '',
      avgRating: player.rating.avgRating || 0
    };
  };

  const ratingDetails = getRatingDetails();
  const session = player.sessions?.[0]; // Get first session if exists



  const handleRemoveRating = async () => {
    // Check if we have the required IDs
    if (!slotId || !sessionId || !player?._id) {
      toast.error("Missing required information to remove rating");
      return;
    }

    try {
      const selectorId = localStorage.getItem("playerId");
      if (!selectorId) {
        toast.error("Selector ID not found");
        return;
      }

      const res = await axios.post(`/webSiteApi/auctionSelector/removePlayerRating/${slotId}/${sessionId}`, {
        playerId: player._id,  // Fixed the syntax here
        selectorId: selectorId
      });
      fetchSelectorPlayers()

      toast.success("Rating removed successfully");
      // Optionally refresh the player data or close modal
      onClose();
    } catch (error) {
      console.error("Unable to delete rating", error);
      const errorMessage = error.response?.data?.message || 'Failed to remove rating';
      toast.error(errorMessage);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        <div className="p-6">
          {/* Header with Player Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {player.image && !isDummyImage(player.image) ? (
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target ).style.display = 'none';
                    const parent = (e.target ).parentElement;
                    if (parent) {
                      const initialsDiv = document.createElement('div');
                      initialsDiv.className = `w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(player.name)} text-white font-bold`;
                      initialsDiv.textContent = getInitials(player.name);
                      parent.appendChild(initialsDiv);
                    }
                  }}
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(player.name)} text-white font-bold`}>
                  {getInitials(player.name)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900"> {player.batchId}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {formatRole(player.playerRole || player.type)}
                </span>
                {player.batchId && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">

                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rating Section */}
          {ratingDetails && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Player Ratings</h3>
              {/* <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="text-2xl font-bold text-blue-600">
                    {ratingDetails.avgRating.toFixed(1)}/10
                  </div>
                </div>
                <div className="flex items-center">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(ratingDetails.avgRating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </div> */}

              <div className="grid grid-cols-2 gap-3">
                {ratingDetails.attitude > 0 && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <span className="text-sm text-gray-600 block">Attitude</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-gray-900">{ratingDetails.attitude}/10</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${ratingDetails.attitude * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {ratingDetails.batsman > 0 && ratingDetails.playerType === 'batsman' && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <span className="text-sm text-gray-600 block">Batting</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-gray-900">{ratingDetails.batsman}/10</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${ratingDetails.batsman * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {ratingDetails.bowler > 0 && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <span className="text-sm text-gray-600 block">Bowling</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-gray-900">{ratingDetails.bowler}/10</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${ratingDetails.bowler * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {ratingDetails.fielding > 0 && ratingDetails.playerType !== 'wicketkeeper' && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <span className="text-sm text-gray-600 block">Fielding</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-gray-900">{ratingDetails.fielding}/10</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${ratingDetails.fielding * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {ratingDetails.wicketKeeper > 0 && ratingDetails.playerType === 'wicketkeeper' && (
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <span className="text-sm text-gray-600 block">Wicket Keeping</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-gray-900">{ratingDetails.wicketKeeper}/10</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500"
                          style={{ width: `${ratingDetails.wicketKeeper * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Display player type if available */}
              {ratingDetails.playerType && (
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Player Type: </span>
                  <span className="capitalize">{ratingDetails.playerType.replace('-', ' ')}</span>
                </div>
              )}
            </div>
          )}

          {/* Selector Details */}
          {player.selector && (
            <div className="mb-6 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Assigned Selector</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {player.selector.logo ? (
                    <img
                      src={player.selector.logo}
                      alt={player.selector.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(player.selector.name)} text-white`}>
                      {getInitials(player.selector.name)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{player.selector.name}</h4>
                  <p className="text-sm text-gray-600">{player.selector.mobile}</p>
                </div>
              </div>
            </div>
          )}

          {/* Session Details */}
          {session && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Trial Session Details</h3>

              <div className="space-y-3">
                {/* Session Info */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{session.sessionName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <span>Slot:</span>
                    <span className="font-medium">{session.slotName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{session.slotType}</span>
                  </div>
                </div>

                {/* Timing */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="font-medium">Timing</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">
                        {new Date(session.slotDate).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">
                        {formatTime(session.slotStartTime)} - {formatTime(session.slotEndTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Venue Details */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="font-medium">Venue</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{session.location.venue}</div>
                  { session.location.address && <div>{session.location.address}</div>}
                   {(session.location.city || session.location.state) && <div>{session.location.city}, {session.location.state}</div>}
                    {(session.location.country || session.location.pincode) && <div>{session.location.country} - {session.location.pincode}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t">

            {/* Locked message */}
            {session?.lockStatus === "locked" && (
              <div className="flex items-start gap-3 p-3 rounded-lg border border-red-300 bg-red-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4a2 2 0 00-3.464 0L4.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>

                <p className="text-sm text-red-700 leading-relaxed">
                  This session is <strong>locked</strong>. You cannot update the score.
                  Please contact the admin to unlock this session.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {(ratingDetails && session?.lockStatus === "unlocked") ? (
                <button
                  type="button"
                  onClick={handleRemoveRating}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-all shadow-sm"
                >
                  Remove Rating
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all shadow-sm"
                >
                  Close
                </button>
              )}

              {session?.lockStatus === "unlocked" && (
                <button
                  type="button"
                  onClick={() => setShowRatingForm(true)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  {ratingDetails ? "Update Score" : "Score Player"}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const SelectorPlayerCard= ({
  player,
  onViewDetails,
  onRate,
  selector = true,
  fetchSelectorPlayers

}) => {

  const [imageError, setImageError] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const initials = getInitials(player.name);
  const role = formatRole(player.type);
  const session = player.sessions?.[0];
  const rating = player.rating ? player.rating.avgRating : null;


  const handleViewDetails = (e) => {
    e?.stopPropagation();
    setDetailsModalOpen(true);

    if (onViewDetails) {
      try {
        onViewDetails(player);
      } catch (err) {
        console.error('onViewDetails callback failed:', err);
      }
    }
  };

  const getRoleColor = () => {
    const roleLower = (player.playerRole || player.type)?.toLowerCase();
    if (roleLower === "batsman") {
      return "bg-blue-600 text-white";
    } else if (roleLower === "bowler") {
      return "bg-red-600 text-white";
    } else if (roleLower?.includes("wicket")) {
      return "bg-amber-600 text-white";
    } else {
      return "bg-orange-500 text-white";
    }
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
        border border-gray-200 overflow-hidden flex w-full max-w-sm p-3 gap-3"
      >
        {/* LEFT: IMAGE */}
        <div
          onClick={handleViewDetails}
          className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600"
        >
          {!imageError && player.image && !isDummyImage(player.image) ? (
            <img
              src={player.image}
              alt={player.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(player.name)} text-white text-xl font-bold`}>
              {initials}
            </div>
          )}

          {/* Role Badge */}
          <span
            className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[9px] font-semibold shadow ${getRoleColor()}`}
          >
            {role}
          </span>

          {/* Rating Badge */}
          {/* {rating && 
          (
            <span className="absolute top-1 right-1 px-2 py-0.5 bg-yellow-500 text-white rounded-full text-[9px] font-semibold shadow flex items-center gap-1">
              <Star className="w-2 h-2" />
              {rating.toFixed(1)}
            </span>
          )
          } */}
        </div>

        {/* RIGHT: DETAILS */}
        <div
          onClick={handleViewDetails}
          className="flex flex-col justify-center flex-grow cursor-pointer"
        >
          {/* NAME & BATCH */}
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 text-sm">
              {player.batchId}
            </h3>
          </div>

          {/* VENUE */}
          {session?.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-pink-500" />
              <span className="text-xs text-gray-700 truncate">
                {session.slotName}
              </span>
            </div>
          )}
          {session?.sessionName && <div className="flex items-center gap-1 mt-1">
            <CalendarCheck className="w-3 h-3 text-pink-500" />
            <span className="text-xs text-gray-700 truncate">
              Session -{session.sessionName}
            </span>
          </div>}

          {/* TIMING */}
          {session && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-green-600" />
              <span className="text-xs text-gray-600">
                {formatTime(session.slotStartTime)} - {formatTime(session.slotEndTime)}
              </span>
            </div>
          )}
        </div>

        {/* Hover View Button */}
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
        onRate={() => {
          if (onRate) onRate(player);
        }}
        selector={selector}
        fetchSelectorPlayers={fetchSelectorPlayers}
      />
    </>
  );
};

export default SelectorPlayerCard;