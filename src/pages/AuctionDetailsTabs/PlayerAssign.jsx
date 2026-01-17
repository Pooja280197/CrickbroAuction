// import React, { useState, useEffect } from 'react';
// import { X, MapPin, Clock, Users } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// interface AuctionSlot {
//   _id: string;
//   name: string;
//   location: string;
//   totalSlots: number;
//   availableSlots: number;
// }

// interface Session {
//   _id: string;
//   sessionTime: string;
//   availableSlots: number;
//   maxPlayers: number;
// }

// interface AssignmentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   selectedPlayers: string[];
//   playerCount: number;
//   onAssignSuccess: () => void;
// }

// const PlayerAssign: React.FC<AssignmentModalProps> = ({
//   isOpen,
//   onClose,
//   selectedPlayers,
//   playerCount,
//   onAssignSuccess
// }) => {
//   const [auctionSlots, setAuctionSlots] = useState<AuctionSlot[]>([]);
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<string>('');
//   const [selectedSession, setSelectedSession] = useState<string>('');
//   const [loading, setLoading] = useState(false);
//   const [slotLoading, setSlotLoading] = useState(false);
//   const [sessionLoading, setSessionLoading] = useState(false);

//   // Fetch auction slots on modal open
//   useEffect(() => {
//     if (isOpen) {
//       fetchAuctionSlots();
//     }
//   }, [isOpen]);

//   // Fetch auction slots
//   const fetchAuctionSlots = async () => {
//     setSlotLoading(true);
//     try {
//       const res = await axios.get('/webSiteApi/auctionSlot/getListAuctionSlots');
//       setAuctionSlots(res?.data?.data?.data || []);
//     } catch (error) {
//       console.log("Error fetching auction slots:", error);
//       toast.error("Failed to fetch locations");
//     } finally {
//       setSlotLoading(false);
//     }
//   };

//   // Fetch sessions when slot is selected
//   const fetchSessions = async (slotId: string) => {
//     setSessionLoading(true);
//     setSelectedSession('');
//     try {
//       const res = await axios.get(`/webSiteApi/auctionSlot/getAuctionSlot/${slotId}`);
//       console.log(res.data.data?.sessions)
//       setSessions(res.data.data?.sessions || []);
//     } catch (error) {
//       console.log("Error fetching sessions:", error);
//       toast.error("Failed to fetch shift times");
//       setSessions([]);
//     } finally {
//       setSessionLoading(false);
//     }
//   };

//   const handleSlotChange = (slotId: string) => {
//     setSelectedSlot(slotId);
//     setSelectedSession('');
//     if (slotId) {
//       fetchSessions(slotId);
//     } else {
//       setSessions([]);
//     }
//   };

//   const handleAssign = async () => {
//     if (!selectedSlot || !selectedSession) {
//       toast.error("Please select both location and shift time");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Assign each player to the session
//       const response = await axios.post(
//         `/webSiteApi/auctionSlot/addPlayerToSession/${selectedSlot}/${selectedSession}`,
//         {
//           playerIds: selectedPlayers // Send as array directly
//         }
//       );
//       toast.success(`Successfully assigned ${playerCount} player${playerCount > 1 ? 's' : ''} to trial`);
//       onAssignSuccess();
//       onClose();
//       resetForm();
//     } catch (error) {
//       console.log("Error assigning players:", error);
//       toast.error("Failed to assign players to trial");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setSelectedSlot('');
//     setSelectedSession('');
//     setSessions([]);
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   if (!isOpen) return null;

//   const formatDate = (isoDate) => {
//     const d = new Date(isoDate);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };
//   const formatTime = (time) => {
//     const [hour, minute] = time.split(":");
//     const h = Number(hour);
//     const ampm = h >= 12 ? "PM" : "AM";
//     const h12 = h % 12 === 0 ? 12 : h % 12;
//     return `${h12}:${minute} ${ampm}`;
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
//       <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-xl font-bold text-gray-900">Assign Players to Trial</h2>
//           <button
//             onClick={handleClose}
//             className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6">
//           {/* Player Count */}
//           <div className="bg-blue-50 rounded-lg p-4">
//             <p className="text-sm font-semibold text-blue-900">
//               Assigning {playerCount} player{playerCount > 1 ? 's' : ''} to trial
//             </p>
//           </div>

//           {/* Location Selection */}
//           <div className="space-y-3">
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
//               <MapPin className="w-4 h-4" />
//               Trial Location
//             </label>
//             <select
//               value={selectedSlot}
//               onChange={(e) => handleSlotChange(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               disabled={slotLoading}
//             >
//               <option value="" disabled hidden>Select location...</option>
//               {slotLoading && (
//                 <option disabled>Loading locations...</option>
//               )}

//               {!slotLoading && auctionSlots.length === 0 && (
//                 <option disabled>No location found</option>
//               )}

//               {auctionSlots.length > 0 &&
//                 auctionSlots.map((slot) => (
//                   <option key={slot._id} value={slot._id}>
//                     {slot.slotName}
//                   </option>
//                 ))}
//             </select>
//             {slotLoading && (
//               <p className="text-sm text-gray-500">Loading locations...</p>
//             )}
//           </div>

//           {/* Shift Time Selection */}
//           <div className="space-y-3">
//             <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
//               <Clock className="w-4 h-4" />
//               Shift Time
//             </label>
//             <select
//               value={selectedSession}
//               onChange={(e) => setSelectedSession(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               disabled={!selectedSlot || sessionLoading}
//             >
//               <option value="" disabled hidden>
//                 {selectedSlot ? "Select shift time..." : "Please select a location first"}
//               </option>

//               {sessionLoading && selectedSlot && (
//                 <option disabled>Loading shift times...</option>
//               )}

//               {!sessionLoading && selectedSlot && sessions.length === 0 && (
//                 <option disabled>No session available</option>
//               )}

//               {sessions.length > 0 &&
//                 sessions.map((session) => (
//                   <option key={session._id} value={session._id} className='text-sm'>
//                     {session.name}
//                     {" "}
//                     {` - ${formatDate(session.slotDate)} (${formatTime(session.slotStartTime)} - ${formatTime(session.slotEndTime)})`}
//                   </option>
//                 ))
//               }

//             </select>
//             {!selectedSlot && (
//               <p className="text-sm text-gray-500">Select a location to view available shift times</p>
//             )}
//             {sessionLoading && selectedSlot && (
//               <p className="text-sm text-gray-500">Loading shift times...</p>
//             )}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex gap-3 p-6 border-t">
//           <button
//             onClick={handleClose}
//             className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAssign}
//             disabled={!selectedSlot || !selectedSession || loading}
//             className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition-colors ${!selectedSlot || !selectedSession || loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//               }`}
//           >
//             {loading ? "Assigning..." : "Assign to Trial"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayerAssign;

import React, { useState, useEffect } from "react";
import { X, MapPin, Clock, AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { AssignPlayersToTrails, fetchSlotList, fetchSlotSessions } from "../../redux/actions";

const PlayerAssign = ({
  isOpen,
  onClose,
  selectedPlayers,
  playerCount,
  onAssignSuccess,
  auctionId,
}) => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const slotLoading = useSelector((state) => state?.loading?.slotList);
  const sessionLoading = useSelector((state) => state?.loading?.sessions);
  const slotsdata = useSelector((state) => state?.data?.slotList);
  const sessionsdata = useSelector((state) => state?.data?.sessions);

  const auctionSlots = slotsdata?.data;
  const sessions = sessionsdata?.sessions;

  // Fetch auction slots on modal open
  useEffect(() => {
    if (isOpen && auctionId) {
      fetchAuctionSlots();
    }
  }, [isOpen, auctionId]);

  // Fetch auction slots
  const fetchAuctionSlots = async () => {
    try {
      await dispatch(fetchSlotList(auctionId));
    } catch (error) {
      console.log("Error fetching auction slots:", error);
      toast.error("Failed to fetch auction slots");
    }
  };

  // Fetch sessions when slot is selected
  const fetchSessions = async (slotId) => {
    setSelectedSession("");
    try {
      await dispatch(fetchSlotSessions(slotId));
    } catch (error) {
      console.log("Error fetching sessions:", error);
      toast.error("Failed to fetch shift times");
      // setSessions([]);
    }
  };

  const handleSlotChange = (slotId) => {
    setSelectedSlot(slotId);
    setSelectedSession("");
    if (slotId) {
      fetchSessions(slotId);
    }
  };

  const handleAssign = async () => {
    if (!selectedSlot || !selectedSession) {
      toast.error("Please select both location and shift time");
      return;
    }

    setLoading(true);
    try {
      const payload={
      "auctionId":auctionId,
      "playerIds":selectedPlayers
      }
      await dispatch(AssignPlayersToTrails(selectedSlot, selectedSession,payload))
      toast.success(
        `Successfully assigned ${playerCount} player${
          playerCount > 1 ? "s" : ""
        } to trial`
      );
      onAssignSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.log("Error assigning players:", error);
      toast.error("Failed to assign players to trial");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSlot("");
    setSelectedSession("");
    // setSessions([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const h = Number(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${minute} ${ampm}`;
  };

  console.log(sessionsdata, "ssessions");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative rounded-2xl shadow-2xl max-w-md w-full bg-gray-900/90 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-white">
            Assign Players to Trial
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900">
              Assigning {playerCount} player{playerCount > 1 ? "s" : ""} to
              trial
            </p>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="w-4 h-4" />
              Trial Location
            </label>

            <select
              value={selectedSlot}
              onChange={(e) => handleSlotChange(e.target.value)}
              disabled={slotLoading}
              className="w-full p-3 border rounded-lg bg-gray-800/50"
            >
              <option value="" disabled hidden>
                {slotLoading ? "Loading locations..." : "Select location..."}
              </option>

              {!slotLoading && auctionSlots && auctionSlots.length === 0 && (
                <option value="" disabled>
                  No trial locations available
                </option>
              )}

              {!slotLoading && auctionSlots && auctionSlots.length > 0 && (
                <>
                  {auctionSlots.map((slot) => (
                    <option key={slot._id} value={slot._id}>
                      {slot.slotName}
                    </option>
                  ))}
                </>
              )}
            </select>

            {/* Display messages based on state */}
            {slotLoading && (
              <p className="text-sm text-gray-400 animate-pulse">
                Loading locations...
              </p>
            )}

            {!slotLoading && auctionSlots && auctionSlots.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-800/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <p className="text-sm text-red-300">
                  No trial locations available for this auction
                </p>
              </div>
            )}
          </div>

          {/* Sessions */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="w-4 h-4" />
              Shift Time
            </label>

            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              disabled={!selectedSlot || sessionLoading}
              className="w-full p-3 border rounded-lg bg-gray-800/50"
            >
              <option value="" disabled hidden>
                {!selectedSlot
                  ? "Select location first"
                  : sessionLoading
                  ? "Loading shift times..."
                  : sessions && sessions.length > 0
                  ? "Select shift time..."
                  : "No sessions available"}
              </option>

              {/* {selectedSlot &&
                !sessionLoading &&
                sessions &&
                sessions.length === 0 && (
                  <option value="" disabled>
                    No sessions available for this location
                  </option>
                )} */}

              {selectedSlot &&
                !sessionLoading &&
                sessions &&
                sessions.length > 0 && (
                  <>
                    {sessions.map((session) => (
                      <option key={session._id} value={session._id}>
                        {session.name} - {formatDate(session.slotDate)} (
                        {formatTime(session.slotStartTime)} -{" "}
                        {formatTime(session.slotEndTime)})
                      </option>
                    ))}
                  </>
                )}
            </select>
            {/* Display messages based on state */}
            {!selectedSlot && (
              <p className="text-sm text-gray-400">
                Please select a location first
              </p>
            )}

            {sessionLoading && selectedSlot && (
              <p className="text-sm text-gray-400 animate-pulse">
                Loading shift times...
              </p>
            )}

            {selectedSlot &&
              !sessionLoading &&
              sessions &&
              sessions.length === 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-800/30 rounded-lg ">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm text-yellow-300">
                    No shift times available for this location
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={
              !selectedSlot ||
              !selectedSession ||
              loading ||
              (auctionSlots && auctionSlots.length === 0) ||
              (selectedSlot && sessions && sessions.length === 0)
            }
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              !selectedSlot ||
              !selectedSession ||
              loading ||
              (auctionSlots && auctionSlots.length === 0) ||
              (selectedSlot && sessions && sessions.length === 0)
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Assigning..." : "Assign to Trial"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerAssign;
