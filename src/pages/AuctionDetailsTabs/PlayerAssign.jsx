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



import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlayerAssign = ({
  isOpen,
  onClose,
  selectedPlayers,
  playerCount,
  onAssignSuccess
}) => {
  const [auctionSlots, setAuctionSlots] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);

  // Fetch auction slots on modal open
  useEffect(() => {
    if (isOpen) {
      fetchAuctionSlots();
    }
  }, [isOpen]);

  // Fetch auction slots
  const fetchAuctionSlots = async () => {
    setSlotLoading(true);
    try {
      const res = await axios.get('/webSiteApi/auctionSlot/getListAuctionSlots');
      setAuctionSlots(res?.data?.data?.data || []);
    } catch (error) {
      console.log("Error fetching auction slots:", error);
      toast.error("Failed to fetch locations");
    } finally {
      setSlotLoading(false);
    }
  };

  // Fetch sessions when slot is selected
  const fetchSessions = async (slotId) => {
    setSessionLoading(true);
    setSelectedSession('');
    try {
      const res = await axios.get(
        `/webSiteApi/auctionSlot/getAuctionSlot/${slotId}`
      );
      setSessions(res?.data?.data?.sessions || []);
    } catch (error) {
      console.log("Error fetching sessions:", error);
      toast.error("Failed to fetch shift times");
      setSessions([]);
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSlotChange = (slotId) => {
    setSelectedSlot(slotId);
    setSelectedSession('');
    if (slotId) {
      fetchSessions(slotId);
    } else {
      setSessions([]);
    }
  };

  const handleAssign = async () => {
    if (!selectedSlot || !selectedSession) {
      toast.error("Please select both location and shift time");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `/webSiteApi/auctionSlot/addPlayerToSession/${selectedSlot}/${selectedSession}`,
        {
          playerIds: selectedPlayers
        }
      );

      toast.success(
        `Successfully assigned ${playerCount} player${playerCount > 1 ? 's' : ''} to trial`
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
    setSelectedSlot('');
    setSelectedSession('');
    setSessions([]);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Assign Players to Trial
          </h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900">
              Assigning {playerCount} player{playerCount > 1 ? 's' : ''} to trial
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
              className="w-full p-3 border rounded-lg"
            >
              <option value="" disabled hidden>
                Select location...
              </option>

              {auctionSlots.map((slot) => (
                <option key={slot._id} value={slot._id}>
                  {slot.slotName}
                </option>
              ))}
            </select>
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
              className="w-full p-3 border rounded-lg"
            >
              <option value="" disabled hidden>
                {selectedSlot ? "Select shift time..." : "Select location first"}
              </option>

              {sessions.map((session) => (
                <option key={session._id} value={session._id}>
                  {session.name} - {formatDate(session.slotDate)} (
                  {formatTime(session.slotStartTime)} -{" "}
                  {formatTime(session.slotEndTime)})
                </option>
              ))}
            </select>
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
            disabled={!selectedSlot || !selectedSession || loading}
            className={`flex-1 px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
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
