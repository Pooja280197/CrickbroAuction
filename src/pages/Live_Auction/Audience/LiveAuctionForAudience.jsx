// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Trophy, Users, History } from "lucide-react";
// import { useLocation, useParams } from 'react-router-dom';
// import { connectAuctionSocket, disconnectSocket } from '../SocketClient';


// export default function LiveAuctionForAudience() {
//   const [mode, setMode] = useState("video"); // video | full
//   const location = useLocation();
//   // If a `status` query param is present, drive initial layout from it
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const status = (params.get('status') || '').toLowerCase();
//     if (status === 'full' || status === 'fullscreen' || status === 'fullscrien') {
//       setMode('full');
//     } else if (status === 'player' || status === 'playercard') {
//       setMode('video');
//     }
//   }, [location.search]);

//   const { auctionId } = useParams<{ auctionId: string }>();
//   const params = new URLSearchParams(location.search);
//   const statusParam = (params.get('status') || '').toLowerCase();
//   const hideModeSwitch = !!statusParam; // hide manual switch when status supplied

//   // socket-driven player and history
//   const [currentPlayer, setCurrentPlayer] = useState<any | null>(null);
//   const [bidHistoryState, setBidHistoryState] = useState<any[]>([]);
//   const [socketInstance, setSocketInstance] = useState<any | null>(null);

//   // Handler for socket payloads — normalize and update local state
//   const handleSocketData = (data: any) => {
//     const payload = data && data.data ? data.data : data;
//     if (!payload) return;

//     const player = payload.currentPlayer || null;
//     if (!player) {
//       // if no currentPlayer, clear state
//       setCurrentPlayer(null);
//       setBidHistoryState([]);
//       return;
//     }

//     setCurrentPlayer(player);

//     const bh = Array.isArray(player.bidHistory) ? player.bidHistory : [];

//     const formatBidTime = (val?: string) => {
//       if (!val) return "";
//       const d = new Date(val);
//       if (isNaN(d.getTime())) return val;
//       const day = String(d.getDate()).padStart(2, "0");
//       const month = d.toLocaleString("en-IN", { month: "short" });
//       const year = d.getFullYear();
//       const hours = String(d.getHours()).padStart(2, "0");
//       const mins = String(d.getMinutes()).padStart(2, "0");
//       const secs = String(d.getSeconds()).padStart(2, "0");
//       return `${day} ${month} ${year}, ${hours}:${mins}:${secs}`;
//     };

//     const normalized = bh
//       .map((b: any) => ({
//         teamName: b.teamName || b.team || '-',
//         teamId: b.teamId ?? b.team ?? null,
//         amount: Number(b.bidAmount ?? b.amount ?? 0),
//         time: formatBidTime(b.bidTime || b.createdAt || b.time),
//       }))
//       .sort((a: any, c: any) => (c.amount ?? 0) - (a.amount ?? 0))
//       .slice(0, 10);

//     setBidHistoryState(normalized);
//   };

//   // Connect to socket
//   useEffect(() => {
//     if (!auctionId) return;

//     const socket = connectAuctionSocket<SocketAuctionPayload>({
//       auctionId,
//       onSnapshot: (data) => {
//         console.log("✅ FIRST SNAPSHOT", data);
//         handleSocketData(data);
//       },
//       onUpdate: (data) => {
//         console.log("📩 UPDATE", data);
//         handleSocketData(data);
//       },
//       onDisconnect: (reason) => console.log("Socket disconnected:", reason),
//       onError: (err) => console.error("Socket error:", err),
//     });

//     setSocketInstance(socket);

//     return () => {
//       disconnectSocket();
//       setSocketInstance(null);
//     };
//   }, [auctionId]);

//   return (
//     <div className="w-full h-screen bg-[#071320] text-white relative overflow-hidden">
//       {/* MODE SWITCH BUTTONS (hidden when ?status=... is provided) */}
//       {!hideModeSwitch && (
//         <div className="absolute top-4 right-4 flex gap-2 z-50">
//           <button
//             onClick={() => setMode("video")}
//             className={`px-3 py-1 rounded-lg text-sm ${mode === "video" ? "bg-blue-600" : "bg-gray-700"}`}
//           >
//             Video
//           </button>
//           <button
//             onClick={() => setMode("full")}
//             className={`px-3 py-1 rounded-lg text-sm ${mode === "full" ? "bg-blue-600" : "bg-gray-700"}`}
//           >
//             Full
//           </button>
//         </div>
//       )}

//       {/* If mode was forced via ?status=..., show small badge */}
//       {hideModeSwitch && (
//         <div className="absolute top-4 right-4 z-50 px-3 py-1 bg-indigo-700/90 rounded-xl text-sm font-semibold">
//           Mode forced: {mode === 'full' ? 'FULLSCREEN' : mode.toUpperCase()}
//         </div>
//       )}

//       {/* BACKGROUND VIDEO (only in video mode) */}
//       {mode === "video" && (
//         <div className="absolute inset-0">
//           <video autoPlay loop muted className="w-full h-full object-cover">
//             <source src="/sample-video.mp4" type="video/mp4" />
//           </video>
//         </div>
//       )}

//     {mode === "full" && (
//   <div className="grid grid-cols-1 lg:grid-cols-2 h-screen gap-4 p-4 lg:p-6 
//                   relative z-10 overflow-y-auto overflow-x-hidden">

//     {/* ================= LEFT - PLAYER CARD ================= */}
//     <div className="flex items-start justify-center">
//       {!currentPlayer ? (
//         <div className="text-center mt-10">
//           <div className="text-6xl mb-4 opacity-50">⏳</div>
//           <p className="text-2xl font-bold text-slate-300">
//             Waiting for player...
//           </p>
//         </div>
//       ) : (
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           className="bg-gradient-to-br from-slate-800 to-slate-900 
//                      border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl
//                      w-full flex flex-col h-full"
//         >
//           {/* PLAYER IMAGE */}
//           <div className="flex justify-center mb-3">
//             <div className="relative">
//               <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 
//                               rounded-full overflow-hidden border-4 border-purple-400 
//                               shadow-2xl bg-[#0f1724]">
//                 {currentPlayer?.profilePicture ? (
//                   <img
//                     src={currentPlayer.profilePicture}
//                     alt={currentPlayer.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center text-slate-300">
//                     <Users className="w-12 h-12 opacity-70" />
//                   </div>
//                 )}
//               </div>

//               {/* SOLD / UNSOLD TAGS */}
//               {currentPlayer.status === "sold" && (
//                 <div className="absolute inset-0 bg-green-600/70 rounded-full 
//                                 flex items-center justify-center">
//                   <span className="text-white font-bold text-lg -rotate-12">
//                     SOLD
//                   </span>
//                 </div>
//               )}

//               {currentPlayer.status === "unsold" && (
//                 <div className="absolute inset-0 bg-red-600/50 rounded-full 
//                                 flex items-center justify-center">
//                   <span className="text-white font-bold text-lg -rotate-12">
//                     UNSOLD
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* PLAYER INFO */}
//           <div className="text-center mb-3">
//             <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 
//                            flex items-center justify-center gap-2">
//               {currentPlayer?.name}
//               <Trophy className="text-yellow-400 w-6 h-6" />
//             </h1>
//             <p className="text-slate-400 mt-1 text-sm">
//               {currentPlayer?.role || "Player"}
//             </p>
//           </div>

//           {/* SCROLLABLE CONTENT */}
//           <div className="flex-1 space-y-4 overflow-y-auto pr-1">

//             {/* BADGES */}
//             <div className="flex flex-wrap gap-2 justify-center">
//               {currentPlayer?.role && (
//                 <span className="px-3 py-1 bg-blue-500/30 border border-blue-400 
//                                  rounded-full text-xs text-blue-200 font-semibold">
//                   {currentPlayer.role}
//                 </span>
//               )}

//               {currentPlayer?.country && (
//                 <span className="px-3 py-1 bg-green-500/30 border border-green-400 
//                                  rounded-full text-xs text-green-200 font-semibold">
//                   {currentPlayer.country}
//                 </span>
//               )}
//             </div>

//             {/* BASE PRICE */}
//             <div className="bg-slate-700/50 rounded-xl p-2 border border-slate-600">
//               <p className="text-slate-400 text-xs mb-1">Base Price</p>
//               <p className="text-2xl font-bold text-emerald-400">
//                 ₹{currentPlayer?.basePrice?.toLocaleString() || "-"}
//               </p>
//             </div>

//             {/* BID STATUS */}
//             {currentPlayer.status === "sold" ? (
//               <div className="space-y-3">
//                 <div className="bg-gradient-to-r from-emerald-600/30 to-green-600/30 
//                                 rounded-xl p-4 border-2 border-emerald-400">
//                   <p className="text-slate-300 text-xs mb-1">Final Selling Price</p>
//                   <p className="text-3xl font-bold text-emerald-300">
//                     ₹{(currentPlayer?.currentBid ?? currentPlayer?.basePrice).toLocaleString()}
//                   </p>
//                 </div>

//                 {currentPlayer?.highestBidderName && (
//                   <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 
//                                   rounded-xl p-4 border-2 border-blue-400">
//                     <p className="text-slate-300 text-xs mb-2">Sold To</p>
//                     <p className="text-xl font-bold text-blue-200">
//                       {currentPlayer.highestBidderName}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             ) : currentPlayer.status === "unsold" ? (
//               <div className="bg-gradient-to-r from-red-600/30 to-pink-600/30 
//                               rounded-xl p-4 border-2 border-red-400 text-center">
//                 <p className="text-lg font-bold text-red-200">Player Not Sold</p>
//                 <p className="text-slate-300 mt-1 text-xs">Unsold in this round</p>
//               </div>
//             ) : (
//               <div className="bg-gradient-to-r from-sky-600/30 to-cyan-600/30 
//                               rounded-xl p-4 border-2 border-sky-400 
//                               flex flex-col md:flex-row justify-between 
//                               items-start md:items-center gap-4 min-h-[90px]">

//                 <div>
//                   <p className="text-slate-300 text-xs mb-1">Current Bid</p>
//                   <p className="text-xl md:text-2xl font-bold text-sky-300">
//                     ₹{(currentPlayer?.currentBid ?? currentPlayer?.basePrice).toLocaleString()}
//                   </p>
//                 </div>

//                 {currentPlayer?.highestBidderName && (
//                   <div className="text-right ml-auto">
//                     <p className="text-slate-300 text-xs">Highest</p>
//                     <p className="text-xl md:text-2xl font-bold text-sky-300">
//                       {currentPlayer.highestBidderName}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         </motion.div>
//       )}
//     </div>

//     {/* ================= RIGHT - TOP 4 BIDS ================= */}
//     <div className="bg-gradient-to-br from-slate-800 to-slate-900 
//                     border-2 border-amber-500/50 rounded-3xl p-4 lg:p-6 
//                     shadow-2xl flex flex-col min-h-[480px]">

//       <h2 className="text-xl lg:text-2xl font-bold mb-4 flex items-center gap-2 text-amber-300">
//         <History className="w-6 h-6" />
//         Top 4 Bids
//       </h2>

//       <div className="flex-1 space-y-3 overflow-y-auto pr-1">

//         {bidHistoryState.length === 0 ? (
//           <div className="text-center py-8 text-gray-400">
//             <div className="text-4xl mb-2 opacity-40">📭</div>
//             <p className="text-sm">No bids yet</p>
//           </div>
//         ) : (
//           bidHistoryState.slice(0, 4).map((bid, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: i * 0.06 }}
//               className={`flex flex-col gap-2 justify-between rounded-xl border-2 
//                           p-[clamp(16px,1.7vh,18px)]
//                           min-h-[clamp(80px,11vh,140px)]
//                           ${
//                             i === 0
//                               ? "bg-gradient-to-br from-yellow-500/40 to-yellow-600/30 border-yellow-400 shadow-lg"
//                               : "bg-slate-700/50 border-slate-600"
//                           }`}
//             >
//               <div className="flex items-center justify-between">
//                 <p className="font-bold text-slate-100 text-[clamp(12px,1.6vh,18px)] truncate">
//                   {bid.teamName || bid.team}
//                 </p>
//                 {i === 0 && (
//                   <span className="text-yellow-400 text-[clamp(14px,1.8vh,20px)] font-bold">
//                     ★
//                   </span>
//                 )}
//               </div>

//               <p
//                 className={`font-bold leading-tight text-[clamp(18px,2.5vh,32px)]
//                             ${i === 0 ? "text-yellow-300" : "text-emerald-400"}`}
//               >
//                 ₹{bid.bidAmount ?? bid.amount}
//               </p>

//               <p className="text-slate-400 text-[clamp(9px,1vh,14px)]">
//                 {bid.time || bid.createdAt}
//               </p>
//             </motion.div>
//           ))
//         )}

//       </div>
//     </div>
//   </div>
// )}


//       {/* VIDEO MODE - PLAYER CARD ONLY IN FOOTER */}
//       {mode === "video" && (
//         <motion.div
//           initial={{ y: 200 }}
//           animate={{ y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="absolute bottom-0 left-0 right-0 p-6 z-20 flex justify-center"
//         >
//           {!currentPlayer ? (
//             <div className="text-center">
//               <div className="text-4xl mb-2 opacity-50">⏳</div>
//               <p className="text-lg font-bold text-slate-300">Waiting for player...</p>
//             </div>
//           ) : (
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.4 }}
//               className="w-full max-w-6xl bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl shadow-2xl relative"
//             >
//               {/* {currentPlayer.status === 'sold' && (
//                 <div className="absolute -top-[215px] left-[520px] z-50 inset-0 bg-green-600/70 flex items-center w-28 h-32 justify-center text-white font-bold text-lg rounded-2xl rotate-[-15deg]">
//                           SOLD
//                         </div>
//               )}
//               {currentPlayer.status === 'unsold' && (
//                 <>
//                 <div className="absolute -top-[215px] left-[520px] z-50 inset-0 bg-red-600/70 flex items-center w-28 h-32 justify-center text-white font-bold text-lg rounded-2xl rotate-[-15deg]">
//                           UNSOLD
//                         </div>
                        
//                 </>
                
//               )} */}

//               {/* 3-COLUMN LAYOUT */}
//               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl">
//                 <div className="grid grid-cols-3 gap-6 h-44 items-end">

//                   {/* ================= LEFT - BASE PRICE ================= */}
//                   <div className="relative bg-gradient-to-br from-[#140b2e] to-[#060b18]
//                     border border-purple-500/40 rounded-lg
//                     skew-x-[-6deg] px-1 py-1 shadow-xl">

//                     <div className="skew-x-[6deg] text-center">
//                       <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">
//                         Base Price
//                       </p>

//                       <p className="text-2xl md:text-2xl font-bold text-white">
//                         ₹{currentPlayer?.basePrice?.toLocaleString() || "-"}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-center -mt-24">

//                     {/* Floating Avatar Circle */}
//                     <div className={`
//     relative w-32 h-32 rounded-full
//     border-4 
//     ${currentPlayer?.status === "sold"
//                         ? "border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.8)]"
//                         : currentPlayer?.status === "unsold"
//                           ? "border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.8)]"
//                           : "border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.7)]"
//                       }
//     bg-[#0b1220]
//     overflow-hidden
//     flex items-center justify-center
//   `}>

//                       {currentPlayer?.profilePicture ? (
//                         <img
//                           src={currentPlayer.profilePicture}
//                           className="w-full h-full object-cover"
//                           alt={currentPlayer.name}
//                         />
//                       ) : (
//                         <Users className="w-12 h-12 text-purple-300 opacity-70" />
//                       )}

//                       {/* ✅ UNSOLD OVERLAY ON PROFILE IMAGE */}
//                       {currentPlayer?.status === "unsold" && (
//                         <div className="
//           absolute inset-0
//           bg-red-600/60
//           rounded-full
//           flex items-center justify-center
//           backdrop-blur-sm
//         "
//                         >
//                           <span className="text-white font-bold text-lg -rotate-12 tracking-wider">
//                             UNSOLD
//                           </span>
//                         </div>
//                       )}
//                       {currentPlayer?.status === "sold" && (
//                         <div className="
//           absolute inset-0
//           bg-green-600/70
//           rounded-full
//           flex items-center justify-center
//           backdrop-blur-sm
//         "
//                         >
//                           <span className="text-white font-bold text-lg -rotate-12 tracking-wider">
//                             SOLD
//                           </span>
//                         </div>
//                       )}

//                     </div>

//                     {/* Player Name Plate */}
//                     <div className="mt-3 w-full bg-gradient-to-br from-[#140b2e] to-[#060b18]
//                   border border-purple-500/40 rounded-lg
//                   skew-x-[-6deg] px-8 py-4 shadow-xl">

//                       <h2 className="skew-x-[6deg] text-center text-xl md:text-2xl font-bold text-white">
//                         {currentPlayer?.name || "-"}
//                       </h2>
//                     </div>

//                   </div>


//                   {/* ================= RIGHT - BID ================= */}
//                   <div className="relative bg-gradient-to-br from-[#140b2e] to-[#060b18]
//                     border border-purple-500/40 rounded-lg
//                     skew-x-[6deg] px-1 py-1 shadow-xl">

//                     <div className="skew-x-[-6deg] text-center">
//                       <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">
//                         {currentPlayer?.status === "sold" ? " Final Bid" : "Current Bid"}
//                       </p>

//                       <p
//                         className={`text-3xl md:text-2xl font-bold ${currentPlayer?.status === "sold"
//                           ? "text-emerald-400"
//                           : currentPlayer?.status === "unsold"
//                             ? "text-red-400"
//                             : "text-sky-400"
//                           }`}
//                       >
//                         ₹{(currentPlayer?.currentBid ?? currentPlayer?.basePrice)?.toLocaleString() || "-"}
//                       </p>
//                     </div>

//                   </div>

//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </motion.div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, History } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { connectAuctionSocket, disconnectSocket } from "../SocketClient";

export default function LiveAuctionForAudience() {
  const [mode, setMode] = useState("video"); // video | full
  const location = useLocation();

  // If a `status` query param is present, drive initial layout from it
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = (params.get("status") || "").toLowerCase();
    if (
      status === "full" ||
      status === "fullscreen" ||
      status === "fullscrien"
    ) {
      setMode("full");
    } else if (status === "player" || status === "playercard") {
      setMode("video");
    }
  }, [location.search]);

  const { auctionId } = useParams();
  const params = new URLSearchParams(location.search);
  const statusParam = (params.get("status") || "").toLowerCase();
  const hideModeSwitch = !!statusParam;

  // socket-driven player and history
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [bidHistoryState, setBidHistoryState] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);

  // Handler for socket payloads — normalize and update local state
  const handleSocketData = (data) => {
    const payload = data && data.data ? data.data : data;
    if (!payload) return;

    const player = payload.currentPlayer || null;
    if (!player) {
      setCurrentPlayer(null);
      setBidHistoryState([]);
      return;
    }

    setCurrentPlayer(player);

    const bh = Array.isArray(player.bidHistory)
      ? player.bidHistory
      : [];

    const formatBidTime = (val) => {
      if (!val) return "";
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      const day = String(d.getDate()).padStart(2, "0");
      const month = d.toLocaleString("en-IN", { month: "short" });
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      const secs = String(d.getSeconds()).padStart(2, "0");
      return `${day} ${month} ${year}, ${hours}:${mins}:${secs}`;
    };

    const normalized = bh
      .map((b) => ({
        teamName: b.teamName || b.team || "-",
        teamId: b.teamId ?? b.team ?? null,
        amount: Number(b.bidAmount ?? b.amount ?? 0),
        time: formatBidTime(b.bidTime || b.createdAt || b.time),
      }))
      .sort((a, c) => (c.amount ?? 0) - (a.amount ?? 0))
      .slice(0, 10);

    setBidHistoryState(normalized);
  };

  // Connect to socket
  useEffect(() => {
    if (!auctionId) return;

    const socket = connectAuctionSocket({
      auctionId,
      onSnapshot: (data) => {
        console.log("✅ FIRST SNAPSHOT", data);
        handleSocketData(data);
      },
      onUpdate: (data) => {
        console.log("📩 UPDATE", data);
        handleSocketData(data);
      },
      onDisconnect: (reason) =>
        console.log("Socket disconnected:", reason),
      onError: (err) => console.error("Socket error:", err),
    });

    setSocketInstance(socket);

    return () => {
      disconnectSocket();
      setSocketInstance(null);
    };
  }, [auctionId]);

  return (
    <div className="w-full h-screen bg-[#071320] text-white relative overflow-hidden">
      {/* MODE SWITCH BUTTONS */}
      {!hideModeSwitch && (
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <button
            onClick={() => setMode("video")}
            className={`px-3 py-1 rounded-lg text-sm ${
              mode === "video" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Video
          </button>
          <button
            onClick={() => setMode("full")}
            className={`px-3 py-1 rounded-lg text-sm ${
              mode === "full" ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            Full
          </button>
        </div>
      )}

      {hideModeSwitch && (
        <div className="absolute top-4 right-4 z-50 px-3 py-1 bg-indigo-700/90 rounded-xl text-sm font-semibold">
          Mode forced: {mode === "full" ? "FULLSCREEN" : mode.toUpperCase()}
        </div>
      )}

      {/* BACKGROUND VIDEO */}
      {mode === "video" && (
        <div className="absolute inset-0">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src="/sample-video.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* ================= FULL MODE ================= */}
      {mode === "full" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-screen gap-4 p-4 lg:p-6 relative z-10 overflow-y-auto overflow-x-hidden">
          {/* LEFT - PLAYER CARD */}
          <div className="flex items-start justify-center">
            {!currentPlayer ? (
              <div className="text-center mt-10">
                <div className="text-6xl mb-4 opacity-50">⏳</div>
                <p className="text-2xl font-bold text-slate-300">
                  Waiting for player...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl w-full flex flex-col h-full"
              >
                {/* PLAYER IMAGE */}
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-400 bg-[#0f1724]">
                      {currentPlayer.profilePicture ? (
                        <img
                          src={currentPlayer.profilePicture}
                          alt={currentPlayer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-12 h-12 opacity-70" />
                        </div>
                      )}
                    </div>

                    {currentPlayer.status === "sold" && (
                      <div className="absolute inset-0 bg-green-600/70 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold -rotate-12">
                          SOLD
                        </span>
                      </div>
                    )}

                    {currentPlayer.status === "unsold" && (
                      <div className="absolute inset-0 bg-red-600/60 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold -rotate-12">
                          UNSOLD
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PLAYER INFO */}
                <div className="text-center mb-3">
                  <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                    {currentPlayer.name}
                    <Trophy className="text-yellow-400 w-6 h-6" />
                  </h1>
                  <p className="text-slate-400 text-sm">
                    {currentPlayer.role || "Player"}
                  </p>
                </div>

                {/* BASE PRICE */}
                <div className="bg-slate-700/50 rounded-xl p-2 border border-slate-600 text-center">
                  <p className="text-xs text-slate-400 mb-1">Base Price</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ₹{currentPlayer.basePrice?.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT - TOP BIDS */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-amber-300">
              <History />
              Top 4 Bids
            </h2>

            <div className="space-y-3">
              {bidHistoryState.slice(0, 4).map((bid, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border ${
                    i === 0
                      ? "bg-yellow-500/30 border-yellow-400"
                      : "bg-slate-700/50 border-slate-600"
                  }`}
                >
                  <p className="font-bold">{bid.teamName}</p>
                  <p className="text-xl text-emerald-400">
                    ₹{bid.amount}
                  </p>
                  <p className="text-xs text-slate-400">{bid.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODE FOOTER */}
      {mode === "video" && (
        <motion.div
          initial={{ y: 200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 p-6 z-20 flex justify-center"
        >
          {!currentPlayer ? (
            <div className="text-center">
              <div className="text-4xl mb-2 opacity-50">⏳</div>
              <p className="text-lg font-bold text-slate-300">
                Waiting for player...
              </p>
            </div>
          ) : (
            <div className="bg-slate-900/95 p-6 rounded-2xl w-full max-w-4xl text-center">
              <h2 className="text-2xl font-bold">
                {currentPlayer.name}
              </h2>
              <p className="text-xl text-sky-400 mt-2">
                ₹{currentPlayer.currentBid?.toLocaleString()}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
