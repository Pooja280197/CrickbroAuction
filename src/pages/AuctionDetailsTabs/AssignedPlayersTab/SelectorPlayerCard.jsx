import React, { useEffect, useState } from "react";
import {
  Eye,
  MapPin,
  Clock,
  Calendar,
  X,
  Star,
  CalendarCheck,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
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

const getGradientByName = (name) => {
  const hash = name
    ?.split("")
    ?.reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

const isDummyImage = (imageUrl) => {
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

const RatingInput = ({ label, value, setValue }) => {
  const increase = () => value < 10 && setValue(value + 1);
  const decrease = () => value > 1 && setValue(value - 1);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <span className="text-sm font-semibold">{value}/10</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrease}
          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-black  rounded-full"
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
          className="w-8 h-8 flex items-center justify-center bg-black rounded-full"
        >
          +
        </button>
      </div>
    </div>
  );
};

const RatingForm = ({ player, onClose, onSubmit, ratingFields }) => {
  const [ratingType, setRatingType] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [fieldValues, setFieldValues] = useState({});

  // Check if player already has a rating
  const hasExistingRating =
    player.rating && player.rating.ratings && player.rating.ratings.length > 0;

  // Get existing rating data
  const existingRating = hasExistingRating ? player.rating.ratings[0] : null;

  console.log("Existing rating data:", existingRating);
  console.log("Rating fields:", ratingFields);

  // Initialize values with existing rating if available
  useEffect(() => {
    if (hasExistingRating && existingRating) {
      // Set rating type - check multiple possible locations
      const existingRatingType =
        player.rating.playerType ||
        player.player?.playerType ||
        existingRating.playerType;

      if (existingRatingType) {
        setRatingType(existingRatingType.toLowerCase());
      }

      // Set rating value - prioritize avgRating, then rating from ratings array
      if (player.rating.avgRating !== undefined) {
        setRating(player.rating.avgRating);
      } else if (existingRating.rating !== undefined) {
        setRating(existingRating.rating);
      }

      // Set comments if available
      if (existingRating.comments) {
        setComments(existingRating.comments);
      }

      // Initialize field values from existing rating
      const initialFieldValues = {};

      // First, try to get fields from existingRating.field
      if (existingRating.field && Array.isArray(existingRating.field)) {
        existingRating.field.forEach((field) => {
          // Find matching field from ratingFields by label
          if (ratingFields && Array.isArray(ratingFields)) {
            const matchingField = ratingFields.find(
              (f) => f.label === field.label
            );
            if (matchingField) {
              // Check if it's a number field or string field
              if (field.type === "number" && field.numberValue !== undefined) {
                initialFieldValues[matchingField._id] =
                  field.numberValue.toString();
              } else if (
                field.type === "string" &&
                field.stringValue !== undefined
              ) {
                initialFieldValues[matchingField._id] = field.stringValue;
              } else if (field.value !== undefined) {
                // Fallback for generic value field
                initialFieldValues[matchingField._id] = field.value;
              }
            }
          }
        });
      }

      // Fill in any missing fields with empty values
      if (ratingFields && Array.isArray(ratingFields)) {
        ratingFields.forEach((field) => {
          if (!(field._id in initialFieldValues)) {
            initialFieldValues[field._id] = "";
          }
        });
      }

      console.log("Initialized field values:", initialFieldValues);
      setFieldValues(initialFieldValues);
    } else {
      // No existing rating, set rating type from player data
      const role = player.player?.playerType?.toLowerCase();
      if (role) {
        setRatingType(role);
      }

      // Initialize empty field values
      const initialFieldValues = {};
      if (ratingFields && Array.isArray(ratingFields)) {
        ratingFields.forEach((field) => {
          initialFieldValues[field._id] = "";
        });
      }
      setFieldValues(initialFieldValues);
    }
  }, [player, ratingFields, hasExistingRating, existingRating]);

  const handleSubmit = async () => {
    // Use the correct player ID from the data structure
    const playerId = player.player?._id ;

    // Prepare field array based on ratingFields
    const fieldData =
      ratingFields?.map((field) => {
        const value = fieldValues[field._id] || "";

        return {
          label: field.label,
          type: field.type,
          // Use correct property name based on your data structure
          ...(field.type === "string"
            ? { stringValue: value }
            : { numberValue: parseFloat(value) || 0 }),
        };
      }) || [];

    // Construct rating data
    const ratingData = {
      playerId: playerId,
      playerType: ratingType,
      selectorId: localStorage.getItem("playerId"), // This should be the selector's ID
      rating: rating,
      comments: comments,
      field: fieldData,
    };

    try {
      // Check if we have session and slot information
      if (player.session && player.session._id) {
        const sessionId = player.session._id;

        // Use slotId if available in session, otherwise use sessionId
        const slotId = player.session.slot?._id || sessionId;

        // Make API call - note the endpoint might need adjustment
        const res = await axios.post(
          `/webSiteApi/auctionSelector/ratePlayer/${slotId}/${sessionId}`,
          ratingData
        );

        toast.success(
          hasExistingRating
            ? "Rating Updated Successfully"
            : "Rating Submitted Successfully"
        );
        onSubmit(ratingData); // Call parent callback
        onClose(); // Close the modal
      } else {
        toast.error("Missing session information");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit rating";
      toast.error(errorMessage);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Player type options based on available data
  const playerTypeOptions = [
    { value: "batsman", label: "Batsman" },
    { value: "bowler", label: "Bowler" },
    { value: "allrounder", label: "All Rounder" },
    { value: "wicketkeeper", label: "Wicket Keeper" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative bg-black rounded-xl shadow-xl w-full max-w-sm sm:max-w-md mx-2 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
        >
          <X className="w-4 h-4 text-gray-700" />
        </button>

        <div className="p-4 sm:p-5">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">
            {hasExistingRating ? "Update Player Rating" : "Player Rating"}
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            {hasExistingRating ? "Update rating for" : "Rate player"}:{" "}
            {player.player?.name || "Unknown Player"}
          </p>

          {/* Player Type Dropdown */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-400 mb-1">

              Player Type
            </label>
            <select
              value={ratingType}
              onChange={(e) => setRatingType(e.target.value)}
              className="w-full px-3 py-1.5 text-sm bg-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
              disabled={hasExistingRating}
            >
              <option value="" disabled hidden>
                Select Player Type
              </option>
              {playerTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasExistingRating && (
              <p className="mt-1 text-sm text-yellow-500">
                Player type cannot be changed once rated.
              </p>
            )}
          </div>

          {/* Overall Rating (0-10) */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Overall Rating (0-10)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white text-sm font-medium w-10 text-center">

                {rating}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>5</span>
              <span>10</span>
            </div>
            {hasExistingRating && (
              <p className="mt-1 text-sm text-gray-500">
                Current rating:{" "}
                {player.rating?.avgRating ||
                  existingRating?.rating ||
                  "Not rated"}
              </p>
            )}
          </div>

          {/* Dynamic Rating Fields */}
          {ratingFields && ratingFields.length > 0 && (
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 mb-1">

                Additional Fields {hasExistingRating && "(Current Values)"}
              </label>
              <div className="space-y-3">
                {ratingFields.map((field) => {
                  // Find existing value for this field
                  const existingField = existingRating?.field?.find(
                    (f) => f.label === field.label
                  );
                  const existingValue = existingField
                    ? field.type === "number"
                      ? existingField.numberValue
                      : existingField.stringValue
                    : null;

                  return (
                    <div
                      key={field._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div className="flex flex-col">
                        <label className="text-gray-300 text-sm">
                          {field.label}
                        </label>
                        {hasExistingRating && existingValue !== null && (
                          <span className="text-xs text-gray-500">
                            Current: {existingValue}
                          </span>
                        )}
                      </div>
                      {field.type === "number" ? (
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={fieldValues[field._id] || ""}
                          onChange={(e) =>
                            handleFieldChange(field._id, e.target.value)
                          }
                          className="w-full sm:w-20 px-2 py-1 text-sm bg-black border border-gray-300 rounded text-white text-right"

                          placeholder="0-10"
                        />
                      ) : (
                        <input
                          type="text"
                          value={fieldValues[field._id] || ""}
                          onChange={(e) =>
                            handleFieldChange(field._id, e.target.value)
                          }
                          className="w-full sm:w-28 px-2 py-1 text-sm bg-black border border-gray-300 rounded text-white"

                          placeholder="Enter value"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-400 mb-1">

              Comments
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full h-20 px-3 py-2 text-sm bg-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-white resize-none"
              placeholder="Add your comments here..."
              rows="3"
            />
            {hasExistingRating && existingRating?.comments && (
              <p className="mt-1 text-sm text-gray-500">
                Previous comment: {existingRating.comments}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-400 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!ratingType}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors font-medium ${
                ratingType
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {hasExistingRating ? "Update Rating" : "Submit Rating"}
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
  fetchSelectorPlayers,
  ratingFields = { ratingFields },
}) => {
  const [showRatingForm, setShowRatingForm] = useState(false);
  const slotId = player?.session?.slot?._id;
  const sessionId = player?.session?._id;
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
        ratingFields={ratingFields}
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
    const playerType =
      latestRating.playerType ||
      player?.rating?.playerType ||
      player.player?.playerType?.toLowerCase();

    // For wicketkeeper, wicket keeping value could be in wicketKeeper OR fielding
    const isWicketkeeper =
      playerType?.includes("wicket") ||
      latestRating.playerType === "wicketkeeper";

    const wicketKeeperValue = isWicketkeeper
      ? latestRating.wicketKeeper || latestRating.fielding || 0
      : latestRating.wicketKeeper || 0;

    const fieldingValue = !isWicketkeeper ? latestRating.fielding || 0 : 0;

    return {
      attitude: latestRating.attitude || 0,
      batsman: latestRating.batsman || 0,
      bowler: latestRating.bowler || 0,
      fielding: fieldingValue,
      wicketKeeper: wicketKeeperValue,
      playerType: latestRating.playerType || playerType || "",
      avgRating: player.rating.avgRating || 0,
    };
  };

  const ratingDetails = getRatingDetails();
  const session = player.session; // Get first session if exists

  const handleRemoveRating = async () => {
    // Check if we have the required IDs
    console.log(player,"player")
    if (!slotId || !sessionId || !player.player?._id) {
      toast.error("Missing required information to remove rating");
      return;
    }

    try {
      const selectorId = localStorage.getItem("playerId");
      if (!selectorId) {
        toast.error("Selector ID not found");
        return;
      }

      const res = await axios.post(
        `/webSiteApi/auctionSelector/removePlayerRating/${slotId}/${sessionId}`,
        {
          playerId: player.player?._id, // Fixed the syntax here
          selectorId: selectorId,
        }
      );
      fetchSelectorPlayers();
      toast.success("Rating removed successfully");
      // Optionally refresh the player data or close modal
      onClose();
    } catch (error) {
      console.error("Unable to delete rating", error);
      const errorMessage =
        error.response?.data?.message || "Failed to remove rating";
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
              {player?.player?.logo && !isDummyImage(player?.player?.logo) ? (
                <img
                  src={player?.player?.logo}
                  alt={player?.player?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const parent = e.target.parentElement;
                    if (parent) {
                      const initialsDiv = document.createElement("div");
                      initialsDiv.className = `w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(
                        player.player.name
                      )} text-white font-bold`;
                      initialsDiv.textContent = getInitials(player.player.name);
                      parent.appendChild(initialsDiv);
                    }
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(
                    player.player.name
                  )} text-white font-bold`}
                >
                  {getInitials(player?.player?.name)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {" "}
                {player?.player?.batchId}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {formatRole(
                    player?.rating?.playerType || player.player?.playerType
                  )}
                </span>
                {player?.player?.batchId && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {player.player.batchId}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rating Section */}
          {ratingDetails && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                Player Ratings
              </h3>
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
                    <span className="text-sm text-gray-600 block">
                      Attitude
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-gray-900">
                        {ratingDetails.attitude}/10
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${ratingDetails.attitude * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {ratingDetails.batsman > 0 &&
                  ratingDetails.playerType === "batsman" && (
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <span className="text-sm text-gray-600 block">
                        Batting
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-gray-900">
                          {ratingDetails.batsman}/10
                        </span>
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
                      <span className="font-bold text-gray-900">
                        {ratingDetails.bowler}/10
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${ratingDetails.bowler * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {ratingDetails.fielding > 0 &&
                  ratingDetails.playerType !== "wicketkeeper" && (
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <span className="text-sm text-gray-600 block">
                        Fielding
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-gray-900">
                          {ratingDetails.fielding}/10
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${ratingDetails.fielding * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                {ratingDetails.wicketKeeper > 0 &&
                  ratingDetails.playerType === "wicketkeeper" && (
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <span className="text-sm text-gray-600 block">
                        Wicket Keeping
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-gray-900">
                          {ratingDetails.wicketKeeper}/10
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{
                              width: `${ratingDetails.wicketKeeper * 10}%`,
                            }}
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
                  <span className="capitalize">
                    {ratingDetails.playerType.replace("-", " ")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Selector Details */}
          {player.selector && (
            <div className="mb-6 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                Assigned Selector
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {player.selector.logo ? (
                    <img
                      src={player.selector.logo}
                      alt={player.selector.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(
                        player.selector.name
                      )} text-white`}
                    >
                      {getInitials(player.selector.name)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {player.selector.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {player.selector.mobile}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Session Details */}
          {session && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                Trial Session Details
              </h3>

              <div className="space-y-3">
                {/* Session Info */}
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{session.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <span>Slot:</span>
                    <span className="font-medium">
                      {session.slot?.slotName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Type:</span>
                    <span className="font-medium capitalize">
                      {session?.slot?.slotType}
                    </span>
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
                        {new Date(session.slotDate).toLocaleDateString(
                          "en-IN",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">
                        {formatTime(session.slotStartTime)} -{" "}
                        {formatTime(session.slotEndTime)}
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
                    <div>{session?.slot?.location?.venue}</div>
                    {session?.slot?.location?.address && (
                      <div>{session.slot.location.address}</div>
                    )}
                    {(session?.slot?.location?.city ||
                      session?.slot?.location?.state) && (
                      <div>
                        {session.slot.location.city},{" "}
                        {session.slot.location.state}
                      </div>
                    )}
                    {(session?.slot?.location?.country ||
                      session?.slot?.location?.pincode) && (
                      <div>
                        {session.slot.location.country} -{" "}
                        {session.slot.location.pincode}
                      </div>
                    )}
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
                  This session is <strong>locked</strong>. You cannot update the
                  score. Please contact the admin to unlock this session.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {ratingDetails && session?.lockStatus === "unlocked" ? (
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

const SelectorPlayerCard = ({
  player,
  onViewDetails,
  onRate,
  selector = true,
  fetchSelectorPlayers,
  ratingFields,
}) => {
  const [imageError, setImageError] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const initials = getInitials(player.player.name);
  const role = formatRole(player?.rating?.playerType);
  const session = player.session;
  const rating = player.rating ? player.rating.avgRating : null;

  const handleViewDetails = (e) => {
    e?.stopPropagation();
    setDetailsModalOpen(true);

    if (onViewDetails) {
      try {
        onViewDetails(player);
      } catch (err) {
        console.error("onViewDetails callback failed:", err);
      }
    }
  };

  const getRoleColor = () => {
    const roleLower = player?.rating?.playerType?.toLowerCase();
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
        className="relative bg-[var(--color-primary)] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
        border border-gray-200 overflow-hidden flex w-full max-w-sm p-3 gap-3"
      >
        {/* LEFT: IMAGE */}
        <div
          onClick={handleViewDetails}
          className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600"
        >
          {!imageError &&
          player.player.logo &&
          !isDummyImage(player.player.logo) ? (
            <img
              src={player?.player?.logo}
              alt={player?.player?.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(
                player?.player?.name
              )} text-white text-xl font-bold`}
            >
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
            <h3 className="font-semibold text-gray-200 text-sm">
              {player?.player?.batchId}
            </h3>
          </div>

          {/* VENUE */}
          {session?.slot?.location && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-blue-300" />
              <span className="text-xs text-gray-300 truncate">
                {session?.slot?.slotName}
              </span>
            </div>
          )}
          {session?.name && (
            <div className="flex items-center gap-1 mt-1">
              <CalendarCheck className="w-3 h-3 text-pink-300" />
              <span className="text-xs text-gray-300 truncate">
                Session -{session?.name}
              </span>
            </div>
          )}

          {/* TIMING */}
          {session && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-green-200" />
              <span className="text-xs text-gray-300">
                {formatTime(session.slotStartTime)} -{" "}
                {formatTime(session.slotEndTime)}
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
        ratingFields={ratingFields}
      />
    </>
  );
};

export default SelectorPlayerCard;
