// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Socket } from 'socket.io-client';
// import { useParams } from 'react-router-dom';
// import { connectAuctionSocket, disconnectSocket } from '../SocketClient';
// import { toast } from "react-toastify";

// interface Team {
//   teamId: string;
//   teamName: string;
//   teamCode: string;
//   teamCity: string;
//   teamLogo: string;
//   teamAuctionDetails: {
//     teamId: string;
//     initialBudget: number;
//     remainingBudget: number;
//     currentSquadSize: number;
//     maxPlayers: number;
//     purseSpent: number;
//   };
// }

// interface CurrentPlayer {
//   playerId: string;
//   name: string;
//   basePrice: number;
//   currentBid: number | null;
//   status: "bidding" | "sold" | "unsold";
//   categoryName: string;
//   profilePicture?: string | null;
//   batchId?: string;
//   highestBidderName?: string;
//   biddingIncrement?: number;
// }

// interface SocketBidEntry {
//   teamName: string;
//   amount: number;
//   time?: string;
//   createdAt?: string;
// }

// interface SocketAuctionPayload {
//   auctionId: string;
//   currentPlayer: CurrentPlayer | null;
//   teams: any[];
// }

// const BiddingPanel = () => {
//   const { auctionId } = useParams<{ auctionId: string }>();
//   const [teams, setTeams] = useState<Team[]>([]);
//   const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer | null>(null);
//   const [bidAmount, setBidAmount] = useState<number | null>(null);
//   const [bidHistory, setBidHistory] = useState<any[]>([]);
//   const [teamBiddingData, setTeamBiddingData] = useState<any>(null);
//   const [bidding, setBidding] = useState(false);
//   const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
//   const [playerId, setPlayerId] = useState<string | null>(null);
//   const dummyImage =
//     "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";
//   const BID_STEP = 250000;

//   // Get playerId from localStorage or props
//   useEffect(() => {
//     const storedPlayerId = localStorage.getItem('playerId') || sessionStorage.getItem('playerId');
//     setPlayerId(storedPlayerId);
//   }, []);

//   console.log('Selected Team:', playerId, auctionId);

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

//   const handleSocketData = (data: SocketAuctionPayload | any) => {
//     const payload = data && (data as any).data ? (data as any).data : data;

//     if (payload?.currentPlayer) {
//       const player = payload.currentPlayer;
//       setCurrentPlayer(player);

//       const bh: SocketBidEntry[] = player.bidHistory || [];

//       const formatBidTime = (val?: string) => {
//         if (!val) return "";
//         const d = new Date(val);
//         if (isNaN(d.getTime())) return val;
//         const day = String(d.getDate()).padStart(2, "0");
//         const month = d.toLocaleString("en-IN", { month: "short" });
//         const year = d.getFullYear();
//         const hours = String(d.getHours()).padStart(2, "0");
//         const mins = String(d.getMinutes()).padStart(2, "0");
//         const secs = String(d.getSeconds()).padStart(2, "0");
//         return `${day} ${month} ${year}, ${hours}:${mins}:${secs}`;
//       };

//       const normalized = bh
//         .map((b) => ({
//           teamName: b.teamName,
//           teamId: (b as any).teamId,
//           amount: Number((b as any).bidAmount ?? (b as any).amount ?? 0),
//           time: formatBidTime((b as any).bidTime || (b as any).createdAt || (b as any).time),
//         }))
//         .sort((a, c) => c.amount - a.amount)
//         .slice(0, 10);

//       setBidHistory(normalized);

//       // Extract team-specific bidding data if selected team exists
//       if (selectedTeam?.teamId) {
//         const teamBidData = normalized.find(b => String(b.teamId) === String(selectedTeam.teamId));
//         if (teamBidData) {
//           setTeamBiddingData({
//             lastBidAmount: teamBidData.amount,
//             lastBidTime: teamBidData.time,
//             isCurrentBidder: String(player.highestBidder) === String(selectedTeam.teamId),
//             isHighestBidder: normalized[0]?.teamId === selectedTeam.teamId
//           });
//         } else {
//           setTeamBiddingData(null);
//         }
//       }

//       const increment = player.biddingIncrement || BID_STEP;
//       if (player.currentBid) {
//         setBidAmount(player.currentBid + increment);
//       } else {
//         setBidAmount(player.basePrice + increment);
//       }
//     }
//   };

//   // Fetch team details
//   useEffect(() => {
//     if (!auctionId || !playerId) return;

//     const fetchTeams = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `/webSiteApi/auctionTeam/getTeamsByOwnerInAuction/${auctionId}?playerId=${playerId}`
//         );
//         console.log('Fetched teams:', response.data);
//         const teamData = response.data?.data?.data || [];
//         setTeams(teamData);
//         if (teamData.length > 0) {
//           setSelectedTeam(teamData[0]);
//         }
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching teams:', err);
//         setError('Failed to load teams');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeams();
//   }, [auctionId, playerId]);

//   // Update team bidding data when selected team or bid history changes
//   useEffect(() => {
//     if (selectedTeam?.teamId && bidHistory.length > 0) {
//       const teamBidData = bidHistory.find(b => String(b.teamId) === String(selectedTeam.teamId));
//       if (teamBidData) {
//         setTeamBiddingData({
//           lastBidAmount: teamBidData.amount,
//           lastBidTime: teamBidData.time,
//           isCurrentBidder: currentPlayer && String(currentPlayer.highestBidder) === String(selectedTeam.teamId),
//           isHighestBidder: bidHistory[0]?.teamId === selectedTeam.teamId
//         });
//       } else {
//         setTeamBiddingData(null);
//       }
//     }
//   }, [selectedTeam, bidHistory, currentPlayer]);

//   const formatMoney = (amount: number | null | undefined) => {
//     if (!amount || isNaN(amount)) return "0";

//     if (amount >= 10000000) {
//       const crore = amount / 10000000;
//       return `${parseFloat(crore.toFixed(2))}Cr`;
//     }

//     if (amount >= 100000) {
//       const lakh = amount / 100000;
//       return `${parseFloat(lakh.toFixed(2))}L`;
//     }

//     if (amount >= 1000) {
//       const thousand = amount / 1000;
//       return `${parseFloat(thousand.toFixed(1))}k`;
//     }

//     return amount.toString();
//   };

//   const handlePlaceBid = async () => {
//     if (!selectedTeam || !currentPlayer || !bidAmount) {
//       toast.error('Please fill all required fields')
//       return;
//     }

//     const increment = currentPlayer.biddingIncrement || BID_STEP;
//     const minBid = (currentPlayer.currentBid || currentPlayer.basePrice) + increment;
//     if (bidAmount < minBid) {
//       toast.error(`Minimum bid is ₹${formatMoney(minBid)}`);
//       return;
//     }

//     try {
//       setBidding(true);
//       const response = await axios.post(`/webSiteApi/auction/placeBid/${auctionId}`, {
//         playerId: currentPlayer.playerId,
//         teamId: selectedTeam.teamId,
//         bidAmount,
//       });

//       console.log('✅ Bid placed successfully:', response.data);
//       toast.success('Bid placed successfully!');
//     } catch (err: any) {
//       console.error('❌ Bid failed:', err);
//       toast.error(err.response?.data?.message || 'Failed to place bid');
//     } finally {
//       setBidding(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-slate-950">
//         <div className="text-slate-400">Loading teams...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-slate-950">
//         <div className="text-red-400">{error}</div>
//       </div>
//     );
//   }

//   const remainingBudget = selectedTeam?.teamAuctionDetails?.remainingBudget || 0;
//   const canBid = bidAmount && bidAmount <= remainingBudget && bidAmount > 0;
//   // Projected remaining budget: subtract the current player's current bid (use 0 if no currentBid)
//   const projectedRemaining: number | null = selectedTeam && currentPlayer
//     ? (selectedTeam.teamAuctionDetails?.remainingBudget || 0) - (currentPlayer.currentBid ?? 0)
//     : null;

//   console.log(selectedTeam, "st")
//   console.log(bidHistory, "bidding")
//   // console.log(currentPlayer?.bidHistory?.[(bidHistory.length-1)].teamId, "current")

//   const getInitials = (name) => {
//     if (!name) return "";
//     const words = name.trim().split(" ");
//     if (words.length === 1) return words[0][0].toUpperCase();
//     return (words[0][0] + words[1][0]).toUpperCase();
//   };

//   //   const remainingIfWin = (() => {
//   //   if (!currentPlayer) return null;
//   //   if (team.teamId !== selectedTeamId) return null;
//   //   const payAmount = Number(currentBid ?? currentPlayer.basePrice ?? 0);
//   //   return Math.max(team.remainingBudget - payAmount, 0);
//   // })();

//   return (
//     <div className="h-screen overflow-y-auto bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 p-4">
//       <div className="max-w-7xl mx-auto overflow-y-auto">
//         {/* Premium Header */}
//         <div className="mb-8 relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
//           {/* <div className="relative bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-indigo-500/30 rounded-2xl p-6">
//             <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 mb-2">
//               ⚡ LIVE AUCTION BIDDING
//             </h1>
//             <p className="text-indigo-200/70">Real-time player auction with dynamic bidding</p>
//           </div> */}
//         </div>

//         <div className="space-y-2">
//           {/* Selected Team Header with Logo */}
//           {selectedTeam && (
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
//               <div className="relative bg-gradient-to-r from-indigo-900/50 to-emerald-900/30 border border-indigo-400/30 rounded-2xl p-2 flex items-center gap-6">
//                 <img src={selectedTeam.teamLogo} alt={selectedTeam.teamName} className="w-20 h-20 rounded-full border-3 border-indigo-400/50" />
//                 <div className="flex-1">
//                   <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">
//                     {selectedTeam.teamName.toUpperCase()}
//                   </h2>
//                   <p className="text-indigo-200/70 text-lg">{selectedTeam.teamCode}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Teams Selector Row */}
//           {teams.length > 1 && (
//             <div className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 border border-indigo-500/30 rounded-2xl p-4">
//               <p className="text-sm text-indigo-300/70 mb-3 font-semibold">SWITCH TEAM</p>
//               <div className="flex gap-2 overflow-x-auto pb-2">
//                 {teams.map((team) => (
//                   <button
//                     key={team.teamId}
//                     onClick={() => setSelectedTeam(team)}
//                     className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${selectedTeam?.teamId === team.teamId
//                       ? 'bg-indigo-500/30 border border-indigo-400 text-indigo-100'
//                       : 'bg-slate-800/40 border border-slate-700/50 text-slate-300 hover:border-indigo-500/50'
//                       }`}
//                   >
//                     {team.teamName}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Main Content Grid - New Layout */}
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Left Column: Player + Live Status */}
//             <div className="space-y-6 lg:col-span-2">
//               {/* Card 1: Current Player - Compact */}
//               <div>
//                 {currentPlayer ? (
//                   <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-900/80 to-indigo-900/40 border border-indigo-500/30 rounded-2xl p-4 overflow-hidden">
//                     <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>

//                     <div className="flex items-center gap-2 mb-2">
//                       <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-emerald-400 rounded"></div>
//                       <h3 className="text-sm font-bold text-slate-50">👤 PLAYER</h3>
//                     </div>

//                     <div className="flex gap-3">
//                       {currentPlayer.profilePicture && (
//                         <div className="relative flex-shrink-0 w-16 h-16">
//                           {currentPlayer.profilePicture &&
//                             currentPlayer.profilePicture !== dummyImage ? (
//                             <img
//                               src={currentPlayer.profilePicture}
//                               alt={currentPlayer.name}
//                               className="w-16 h-16 rounded-lg object-cover border-2 border-indigo-400/50"
//                             />
//                           ) : (
//                             <div className="w-16 h-16 rounded-lg bg-indigo-500 flex items-center justify-center
//                     text-white text-xl font-bold border-2 border-indigo-400/50">
//                               {getInitials(currentPlayer.name)}
//                             </div>
//                           )}
//                           <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-400/20 to-transparent pointer-events-none"></div>
//                           {currentPlayer.status === "sold" && (
//                             <div
//                               className="
//         absolute inset-0
//         z-20
//         flex items-center justify-center
//         pointer-events-none
//       "
//                             >
//                               <div className="
//         w-[72px] h-[75px]
//         bg-green-600/80
//         text-white font-bold text-[11px]
//         rounded-xl
//         rotate-[-15deg]
//         flex items-center justify-center
//         shadow-xl
//       ">
//                                 SOLD
//                               </div>
//                             </div>
//                           )}

//                           {currentPlayer.status === "unsold" && (
//                             <div
//                               className="
//         absolute inset-0
//         z-20
//         flex items-center justify-center
//         pointer-events-none
//       "
//                             >
//                               <div className="
//         w-[72px] h-[75px]
//         bg-red-600/80
//         text-white font-bold text-[11px]
//         rounded-xl
//         rotate-[-15deg]
//         flex items-center justify-center
//         shadow-xl
//       ">
//                                 UNSOLD
//                               </div>
//                             </div>
//                           )}

//                         </div>

//                       )}
//                       <div className="flex-1 min-w-0">
//                         <h4 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-200 truncate">
//                           {currentPlayer.name}
//                         </h4>
//                         <p className="text-indigo-300/80 font-semibold text-xs mb-1">{currentPlayer.categoryName}</p>
//                         {currentPlayer.batchId && (
//                           <p className="text-xs text-indigo-300/60 mb-2">ID: {currentPlayer.batchId}</p>
//                         )}
//                         <div className="grid grid-cols-2 gap-1">
//                           <div className="bg-slate-800/50 rounded p-1.5 border border-slate-700/50">
//                             <p className="text-xs text-indigo-300/70 font-semibold">BASE</p>
//                             <p className="text-xs font-bold text-emerald-400">
//                               ₹{formatMoney(currentPlayer.basePrice)}
//                             </p>
//                           </div>
//                           <div className="bg-slate-800/50 rounded p-1.5 border border-slate-700/50">
//                             <p className="text-xs text-indigo-300/70 font-semibold">BID</p>
//                             <p className="text-xs font-bold text-indigo-400">
//                               ₹{formatMoney(currentPlayer.currentBid || currentPlayer.basePrice)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 text-center">
//                     <p className="text-2xl mb-1">⏳</p>
//                     <p className="text-slate-400 text-xs">Waiting for player...</p>
//                   </div>
//                 )}
//               </div>

//               {/* Live Status - Below Player */}
//               {selectedTeam && currentPlayer && (
//                 <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-indigo-500/30 rounded-2xl p-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-emerald-400 rounded"></div>
//                     <h3 className="text-sm font-bold text-slate-50">⚡ LIVE STATUS</h3>
//                   </div>
//                   {teamBiddingData ? (
//                     <div className="space-y-2">
//                       {teamBiddingData.isHighestBidder && (
//                         <div className="bg-gradient-to-r from-emerald-500/30 to-emerald-600/20 border border-emerald-500/50 rounded-lg p-3 animate-pulse">
//                           <p className="text-emerald-300 font-bold flex items-center gap-2 text-xs">
//                             <span className="text-lg">👑</span> HIGHEST BIDDER!
//                           </p>
//                         </div>
//                       )}

//                       {teamBiddingData.isCurrentBidder && !teamBiddingData.isHighestBidder && (
//                         <div className="bg-gradient-to-r from-amber-500/30 to-amber-600/20 border border-amber-500/50 rounded-lg p-3">
//                           <p className="text-amber-300 font-bold flex items-center gap-2 text-xs">
//                             <span className="text-lg">⏳</span> OUTBID
//                           </p>
//                         </div>
//                       )}
//                       <div className="grid grid-cols-2 gap-2">
//                         <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border border-emerald-500/30 rounded p-2">
//                           <p className="text-xs text-emerald-300/70 font-semibold">LAST BID</p>
//                           <p className="text-sm font-black text-emerald-300">
//                             ₹{formatMoney(teamBiddingData.lastBidAmount)}
//                           </p>
//                         </div>
//                         <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-900/10 border border-indigo-500/30 rounded p-2">
//                           <p className="text-xs text-indigo-300/70 font-semibold">TIME</p>
//                           <p className="text-xs text-indigo-200 font-mono">{teamBiddingData.lastBidTime}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-slate-800/50 rounded p-3 text-center">
//                       <p className="text-slate-400 text-xs">No bids yet</p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Place Bid - Below Budget */}
//               <div>
//                 {currentPlayer && selectedTeam && currentPlayer.status === "bidding" && (
//                   <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-indigo-500/30 rounded-2xl p-4">
//                     <div className="flex items-center gap-2 mb-3">
//                       <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-emerald-400 rounded"></div>
//                       <h3 className="text-sm font-bold text-slate-50">PLACE BID</h3>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="bg-slate-800/50 p-3 rounded-lg">
//                         <p className="text-xs text-indigo-300/70 font-semibold mb-1">NEXT BID</p>
//                         <p className="text-2xl font-black text-indigo-400">
//                           ₹{formatMoney(bidAmount)}
//                         </p>
//                       </div>
//                       <button
//                         onClick={handlePlaceBid}
//                         disabled={!canBid || bidding}
//                         className={`w-full py-2 rounded-lg font-bold text-xs transition-all duration-300 ${canBid && !bidding
//                           ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-slate-950 hover:from-indigo-600 hover:to-emerald-600 shadow-lg shadow-indigo-500/50'
//                           : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
//                           }`}
//                       >
//                         {bidding ? '⏳ PLACING...' : '🎯 BID'}
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Center Column: Budget + Place Bid */}
//             <div className="space-y-6 lg:col-span-1">
//               {/* Card 2: Budget - Compact */}
//               <div>
//                 {selectedTeam && (
//                   <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-emerald-500/30 rounded-2xl p-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-teal-400 rounded"></div>
//                       <h3 className="text-sm font-bold text-slate-50">💰 BUDGET</h3>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border border-emerald-500/30 rounded p-2">
//                         <p className="text-xs text-emerald-300/70 font-semibold">INITIAL</p>
//                         <p className="text-sm font-black text-emerald-300">
//                           ₹{(selectedTeam.teamAuctionDetails.initialBudget)}
//                         </p>
//                       </div>
//                       <div className={`bg-gradient-to-br border rounded p-2 ${remainingBudget > 0
//                         ? 'from-teal-900/30 to-teal-900/10 border-teal-500/30'
//                         : 'from-red-900/30 to-red-900/10 border-red-500/30'
//                         }`}>
//                         <p className={`text-xs font-semibold ${remainingBudget > 0 ? 'text-teal-300/70' : 'text-red-300/70'}`}>REMAINING</p>
//                         <p className={`text-sm font-black ${remainingBudget > 0 ? 'text-teal-300' : 'text-red-300'}`}>
//                           ₹{(selectedTeam.teamAuctionDetails.remainingBudget)}
//                         </p>
//                       </div>
//                       <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-900/10 border border-indigo-500/30 rounded p-2">
//                         <p className="text-xs text-indigo-300/70 font-semibold">SPENT</p>
//                         <p className="text-sm font-black text-indigo-300">
//                           ₹{formatMoney(selectedTeam.teamAuctionDetails.purseSpent)}
//                         </p>
//                       </div>
//                       <div className="bg-gradient-to-br from-violet-900/30 to-violet-900/10 border border-violet-500/30 rounded p-2">
//                         <p className="text-xs text-violet-300/70 font-semibold">SQUAD</p>
//                         <p className="text-sm font-black text-violet-300">
//                           {selectedTeam.teamAuctionDetails.currentSquadSize} / {selectedTeam.teamAuctionDetails.maxPlayers}
//                         </p>
//                       </div>
//                       {/* <div className="bg-gradient-to-br from-violet-900/30 to-violet-900/10 border border-violet-500/30 rounded p-2">
//                         <p className="text-xs text-violet-300/70 font-semibold">If wins</p>
//                         <p className="text-sm font-black text-violet-300">
//                           {selectedTeam.teamAuctionDetails.currentSquadSize} / {selectedTeam.teamAuctionDetails.maxPlayers}
//                         </p>
//                       </div> */}
//                       {/* Projected remaining if this player is bought at the next bid amount */}
//                       {/* {projectedRemaining !== null && (
//                         <div className={`mt-2 rounded p-2 border px-3 py-2 ${projectedRemaining >= 0 ? 'from-teal-900/30 to-teal-900/10 border-teal-500/30 bg-gradient-to-br text-teal-200' : 'from-red-900/30 to-red-900/10 border-red-500/30 bg-gradient-to-br text-red-200'}`}>
//                           <p className="text-xs font-semibold">PROJECTED REMAINING</p>
//                           <p className="text-sm font-black mt-1">₹{formatMoney(projectedRemaining)}</p>
//                         </div>
//                       )} */}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right Columns: History */}
//             <div className="lg:col-span-1">
//               <div className="bg-gradient-to-br from-slate-900/80 to-slate-950/80 border border-purple-500/30 rounded-2xl p-6 h-full flex flex-col">
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-indigo-400 rounded"></div>
//                   <h3 className="text-lg font-bold text-slate-50">📋 HISTORY</h3>
//                 </div>
//                 <div className="flex-1 overflow-y-auto space-y-2">
//                   {bidHistory.length === 0 ? (
//                     <div className="text-slate-400 text-sm text-center py-12">
//                       <p className="text-3xl mb-2">📋</p>
//                       <p>No bids yet</p>
//                     </div>
//                   ) : (
//                     bidHistory.map((bid, idx) => (
//                       <div key={idx} className={`flex justify-between items-center rounded-lg p-3 transition-all text-sm ${idx === 0
//                         ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/20 border border-amber-500/50 shadow-lg shadow-amber-500/20 sticky top-0'
//                         : 'bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60'
//                         }`}>
//                         <div className="flex items-center gap-2 min-w-0 flex-1">
//                           {idx === 0 && (
//                             <span className="text-amber-400 font-black text-lg">★</span>
//                           )}
//                           <span className={`font-bold truncate ${idx === 0 ? 'text-amber-100' : 'text-slate-200'}`}>
//                             {bid.teamName}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 ml-2 flex-shrink-0">
//                           <span className={`font-black ${idx === 0 ? 'text-amber-300' : 'text-emerald-400'}`}>
//                             ₹{formatMoney(bid.amount)}
//                           </span>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default BiddingPanel;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { connectAuctionSocket, disconnectSocket } from "../SocketClient";
import { toast } from "react-toastify";
import PurchasedPlayerCard from "./PurchasedPlayerCard";

/* ================= COMPONENT ================= */

const BiddingPanel = () => {
  const { auctionId } = useParams();

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [bidAmount, setBidAmount] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [teamBiddingData, setTeamBiddingData] = useState(null);
  const [bidding, setBidding] = useState(false);
  const [socketInstance, setSocketInstance] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [purchasedPlayers, setPurchasedPlayers] = useState([]);

  const dummyImage =
    "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";
  const BID_STEP = 250000;

  /* ---------- PLAYER ID ---------- */
  useEffect(() => {
    const storedPlayerId =
      localStorage.getItem("playerId") ||
      sessionStorage.getItem("playerId");
    setPlayerId("68da29826fe07f64bf45a1ee");
  }, []);

  // const { state } = useLocation();
  const state = localStorage.getItem("selectedTeamId");


  /* ---------- SOCKET ---------- */
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

  /* ---------- PURCHASED PLAYERS ---------- */
  useEffect(() => {
    axios
      .get(
        `/webSiteApi/auction/getAllPlayersAdmin/${auctionId}?teamId=${state}`
      )
      .then((res) => {
        const data = res.data?.data?.data || [];
        setPurchasedPlayers(data);
      })
      .catch((err) => console.error(err));
  }, [auctionId, state]);

  const remainingBudget = selectedTeam?.teamAuctionDetails?.remainingBudget || 0;
  const canBid = bidAmount && bidAmount <= remainingBudget && bidAmount > 0;
  // Projected remaining budget: subtract the current player's current bid (use 0 if no currentBid)
  const projectedRemaining= selectedTeam && currentPlayer
    ? (selectedTeam.teamAuctionDetails?.remainingBudget || 0) - (currentPlayer.currentBid ?? 0)
    : null;


  /* ---------- SOCKET DATA HANDLER ---------- */
  const handleSocketData = (data) => {
    const payload = data && data.data ? data.data : data;

    if (!payload?.currentPlayer) return;

    const player = payload.currentPlayer;
    setCurrentPlayer(player);

    const bh = player.bidHistory || [];

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
        teamName: b.teamName,
        teamId: b.teamId,
        amount: Number(b.bidAmount ?? b.amount ?? 0),
        time: formatBidTime(b.bidTime || b.createdAt || b.time),
      }))
      .sort((a, c) => c.amount - a.amount)
      .slice(0, 10);

    setBidHistory(normalized);

    if (selectedTeam?.teamId) {
      const teamBidData = normalized.find(
        (b) => String(b.teamId) === String(selectedTeam.teamId)
      );
      if (teamBidData) {
        setTeamBiddingData({
          lastBidAmount: teamBidData.amount,
          lastBidTime: teamBidData.time,
          isCurrentBidder:
            String(player.highestBidder) ===
            String(selectedTeam.teamId),
          isHighestBidder:
            normalized[0]?.teamId === selectedTeam.teamId,
        });
      } else {
        setTeamBiddingData(null);
      }
    }

    const increment = player.biddingIncrement || BID_STEP;
    setBidAmount(
      player.currentBid
        ? player.currentBid + increment
        : player.basePrice + increment
    );
  };

  /* ---------- TEAMS ---------- */
  useEffect(() => {
    if (!auctionId || !playerId) return;

    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/webSiteApi/auctionTeam/getTeamsByOwnerInAuction/${auctionId}?playerId=${playerId}`
        );
        const teamData = response.data?.data?.data || [];
        setTeams(teamData);
        if (teamData.length > 0) setSelectedTeam(teamData[0]);
        setError(null);
      } catch {
        setError("Failed to load teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [auctionId, playerId]);

  /* ---------- TEAM BID STATE ---------- */
  useEffect(() => {
    if (selectedTeam?.teamId && bidHistory.length > 0) {
      const teamBidData = bidHistory.find(
        (b) => String(b.teamId) === String(selectedTeam.teamId)
      );
      if (teamBidData) {
        setTeamBiddingData({
          lastBidAmount: teamBidData.amount,
          lastBidTime: teamBidData.time,
          isCurrentBidder:
            currentPlayer &&
            String(currentPlayer.highestBidder) ===
              String(selectedTeam.teamId),
          isHighestBidder:
            bidHistory[0]?.teamId === selectedTeam.teamId,
        });
      } else {
        setTeamBiddingData(null);
      }
    }
  }, [selectedTeam, bidHistory, currentPlayer]);

  /* ---------- HELPERS ---------- */
  const formatMoney = (amount) => {
    if (!amount || isNaN(amount)) return "0";
    if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)}Cr`;
    if (amount >= 100000) return `${(amount / 100000).toFixed(2)}L`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}k`;
    return amount.toString();
  };

  const handlePlaceBid = async () => {
    if (!selectedTeam || !currentPlayer || !bidAmount) {
      toast.error("Please fill all required fields");
      return;
    }

    const increment = currentPlayer.biddingIncrement || BID_STEP;
    const minBid =
      (currentPlayer.currentBid || currentPlayer.basePrice) +
      increment;

    if (bidAmount < minBid) {
      toast.error(`Minimum bid is ₹${formatMoney(minBid)}`);
      return;
    }

    try {
      setBidding(true);
      await axios.post(
        `/webSiteApi/auction/placeBid/${auctionId}`,
        {
          playerId: currentPlayer.playerId,
          teamId: selectedTeam.teamId,
          bidAmount,
        }
      );
      toast.success("Bid placed successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to place bid"
      );
    } finally {
      setBidding(false);
    }
  };

  /* ---------- LOADING / ERROR ---------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-slate-400">Loading teams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }
  return (
    <div className="w-screen min-h-screen overflow-y-auto bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 p-4 " style={{ marginRight: "10px" }}>
      <div className="w-full mx-auto">
        {/* Premium Header */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>

        </div>
        <div className="space-y-2">
          {selectedTeam && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-r from-indigo-900/50 to-emerald-900/30 border border-indigo-400/30 rounded-2xl p-2 flex items-center gap-6">
                <img src={selectedTeam.teamLogo} alt={selectedTeam.teamName} className="w-20 h-20 rounded-full border-3 border-indigo-400/50" />
                <div className="flex-1">
                  <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">
                    {selectedTeam.teamName.toUpperCase()}
                  </h2>
                  <p className="text-indigo-200/70 text-lg">{selectedTeam.teamCode}</p>
                </div>
              </div>
            </div>
          )}

          {teams.length > 1 && (
            <div className="bg-gradient-to-r from-slate-900/80 to-slate-950/80 border border-indigo-500/30 rounded-2xl p-4">
              <p className="text-sm text-indigo-300/70 mb-3 font-semibold">SWITCH TEAM</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {teams.map((team) => (
                  <button
                    key={team.teamId}
                    onClick={() => setSelectedTeam(team)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${selectedTeam?.teamId === team.teamId
                      ? 'bg-indigo-500/30 border border-indigo-400 text-indigo-100'
                      : 'bg-slate-800/40 border border-slate-700/50 text-slate-300 hover:border-indigo-500/50'
                      }`}
                  >
                    {team.teamName}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pr-4 pt-4">
            <div className="space-y-6 lg:col-span-2">
              <div>
                {currentPlayer ? (
                  <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-indigo-700/40 border border-indigo-400/40
 rounded-2xl p-4 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-emerald-400 rounded"></div>
                      <h3 className="text-sm font-bold text-slate-50">👤 PLAYER</h3>
                    </div>

                    <div className="flex gap-3">
                      {currentPlayer.profilePicture && (
                        <div className="relative flex-shrink-0 w-16 h-16">
                          {currentPlayer.profilePicture &&
                            currentPlayer.profilePicture !== dummyImage ? (
                            <img
                              src={currentPlayer.profilePicture}
                              alt={currentPlayer.name}
                              className="w-16 h-16 rounded-lg object-cover border-2 border-indigo-400/50"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-indigo-500 flex items-center justify-center
                    text-white text-xl font-bold border-2 border-indigo-400/50">
                              {getInitials(currentPlayer.name)}
                            </div>
                          )}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-400/20 to-transparent pointer-events-none"></div>
                          {currentPlayer.status === "sold" && (
                            <div
                              className="
        absolute inset-0
        z-20
        flex items-center justify-center
        pointer-events-none
      "
                            >
                              <div className="
        w-[72px] h-[75px]
        bg-green-600/80
        text-white font-bold text-[11px]
        rounded-xl
        rotate-[-15deg]
        flex items-center justify-center
        shadow-xl
      ">
                                SOLD
                              </div>
                            </div>
                          )}

                          {currentPlayer.status === "unsold" && (
                            <div
                              className="
        absolute inset-0
        z-20
        flex items-center justify-center
        pointer-events-none
      "
                            >
                              <div className="
        w-[72px] h-[75px]
        bg-red-600/80
        text-white font-bold text-[11px]
        rounded-xl
        rotate-[-15deg]
        flex items-center justify-center
        shadow-xl
      ">
                                UNSOLD
                              </div>
                            </div>
                          )}

                        </div>

                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-50 to-slate-200 truncate">
                          {currentPlayer.name}
                        </h4>
                        <p className="text-indigo-300/80 font-semibold text-xs mb-1">{currentPlayer.categoryName}</p>
                        {currentPlayer.batchId && (
                          <p className="text-xs text-indigo-300/60 mb-2">ID: {currentPlayer.batchId}</p>
                        )}
                        <div className="grid grid-cols-2 gap-1">
                          <div className="bg-slate-800/50 rounded p-1.5 border border-slate-700/50">
                            <p className="text-xs text-indigo-300/70 font-semibold">BASE</p>
                            <p className="text-xs font-bold text-emerald-400">
                              ₹{formatMoney(currentPlayer.basePrice)}
                            </p>
                          </div>
                          <div className="bg-slate-800/50 rounded p-1.5 border border-slate-700/50">
                            <p className="text-xs text-indigo-300/70 font-semibold">BID</p>
                            <p className="text-xs font-bold text-indigo-400">
                              ₹{formatMoney(currentPlayer.currentBid || currentPlayer.basePrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-4 text-center">
                    <p className="text-2xl mb-1">⏳</p>
                    <p className="text-slate-400 text-xs">Waiting for player...</p>
                  </div>
                )}
              </div>

              {/* Live Status - Below Player */}
              {selectedTeam && currentPlayer && (
                <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-indigo-700/40 border border-indigo-400/40
 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-emerald-400 rounded"></div>
                    <h3 className="text-sm font-bold text-slate-50">⚡ LIVE STATUS</h3>
                  </div>
                  {teamBiddingData ? (
                    <div className="space-y-2">
                      {teamBiddingData.isHighestBidder && (
                        <div className="bg-gradient-to-r from-emerald-500/30 to-emerald-600/20 border border-emerald-500/50 rounded-lg p-3 animate-pulse">
                          <p className="text-emerald-300 font-bold flex items-center gap-2 text-xs">
                            <span className="text-lg">👑</span> HIGHEST BIDDER!
                          </p>
                        </div>
                      )}

                      {teamBiddingData.isCurrentBidder && !teamBiddingData.isHighestBidder && (
                        <div className="bg-gradient-to-r from-amber-500/30 to-amber-600/20 border border-amber-500/50 rounded-lg p-3">
                          <p className="text-amber-300 font-bold flex items-center gap-2 text-xs">
                            <span className="text-lg">⏳</span> OUTBID
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border border-emerald-500/30 rounded p-2">
                          <p className="text-xs text-emerald-300/70 font-semibold">LAST BID</p>
                          <p className="text-sm font-black text-emerald-300">
                            ₹{formatMoney(teamBiddingData.lastBidAmount)}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-900/10 border border-indigo-500/30 rounded p-2">
                          <p className="text-xs text-indigo-300/70 font-semibold">TIME</p>
                          <p className="text-xs text-indigo-200 font-mono">{teamBiddingData.lastBidTime}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-800/50 rounded p-3 text-center">
                      <p className="text-slate-400 text-xs">No bids yet</p>
                    </div>
                  )}
                </div>
              )}

              <div>
                {currentPlayer && selectedTeam && currentPlayer.status === "bidding" && (
                  <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-indigo-700/40 border border-indigo-400/40
 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-emerald-400 rounded"></div>
                      <h3 className="text-sm font-bold text-slate-50">PLACE BID</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-slate-800/50 p-3 rounded-lg">
                        <p className="text-xs text-indigo-300/70 font-semibold mb-1">NEXT BID</p>
                        <p className="text-2xl font-black text-indigo-400">
                          ₹{formatMoney(bidAmount)}
                        </p>
                      </div>
                      <button
                        onClick={handlePlaceBid}
                        disabled={!canBid || bidding}
                        className={`w-full py-2 rounded-lg font-bold text-xs transition-all duration-300 ${canBid && !bidding
                          ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-slate-950 hover:from-indigo-600 hover:to-emerald-600 shadow-md shadow-indigo-500/50'
                          : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        {bidding ? '⏳ PLACING...' : '🎯 BID'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-indigo-700/40 border border-indigo-400/40
 rounded-2xl p-4 w-[152%]" style={{ marginTop: "0px" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-emerald-400 rounded"></div>
                  <h3 className="text-sm font-bold text-slate-50">🧾 PURCHASED PLAYERS</h3>
                </div>

                {purchasedPlayers.length === 0 ? (
                  <p className="text-slate-400 text-xs">No purchased players</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {purchasedPlayers.map((p, i) => (
                      <PurchasedPlayerCard key={i} player={p} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 lg:col-span-1">
              <div>
                {selectedTeam && (
                  <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-indigo-700/40 border border-indigo-400/40
 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-teal-400 rounded"></div>
                      <h3 className="text-sm font-bold text-slate-50">💰 BUDGET</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border border-emerald-500/30 rounded p-2">
                        <p className="text-xs text-emerald-300/70 font-semibold">INITIAL</p>
                        <p className="text-sm font-black text-emerald-300">
                          ₹{(selectedTeam.teamAuctionDetails.initialBudget)}
                        </p>
                      </div>
                      <div className={`bg-gradient-to-br border rounded p-2 ${remainingBudget > 0
                        ? 'from-teal-900/30 to-teal-900/10 border-teal-500/30'
                        : 'from-red-900/30 to-red-900/10 border-red-500/30'
                        }`}>
                        <p className={`text-xs font-semibold ${remainingBudget > 0 ? 'text-teal-300/70' : 'text-red-300/70'}`}>REMAINING</p>
                        <p className={`text-sm font-black ${remainingBudget > 0 ? 'text-teal-300' : 'text-red-300'}`}>
                          ₹{(selectedTeam.teamAuctionDetails.remainingBudget)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-900/30 to-indigo-900/10 border border-indigo-500/30 rounded p-2">
                        <p className="text-xs text-indigo-300/70 font-semibold">SPENT</p>
                        <p className="text-sm font-black text-indigo-300">
                          ₹{formatMoney(selectedTeam.teamAuctionDetails.purseSpent)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-violet-900/30 to-violet-900/10 border border-violet-500/30 rounded p-2">
                        <p className="text-xs text-violet-300/70 font-semibold">SQUAD</p>
                        <p className="text-sm font-black text-violet-300">
                          {selectedTeam.teamAuctionDetails.currentSquadSize} / {selectedTeam.teamAuctionDetails.maxPlayers}
                        </p>
                      </div>
                      {/* <div className="bg-gradient-to-br from-violet-900/30 to-violet-900/10 border border-violet-500/30 rounded p-2">
                        <p className="text-xs text-violet-300/70 font-semibold">If wins</p>
                        <p className="text-sm font-black text-violet-300">
                          {selectedTeam.teamAuctionDetails.currentSquadSize} / {selectedTeam.teamAuctionDetails.maxPlayers}
                        </p>
                      </div> */}
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-800/60 via-slate-800/50 to-indigo-700/40 border border-indigo-400/40
 rounded-2xl p-6 h-full flex flex-col ">
                <div className="flex items-center gap-2 mb-4 ">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-indigo-400 rounded"></div>
                  <h3 className="text-lg font-bold text-slate-50">📋 HISTORY</h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {bidHistory.length === 0 ? (
                    <div className="text-slate-400 text-sm text-center py-12">
                      <p className="text-3xl mb-2">📋</p>
                      <p>No bids yet</p>
                    </div>
                  ) : (
                    bidHistory.map((bid, idx) => (
                      <div key={idx} className={`flex justify-between items-center rounded-lg p-3 transition-all text-sm ${idx === 0
                        ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/20 border border-amber-500/50 shadow-lg shadow-amber-500/20 sticky top-0'
                        : 'bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60'
                        }`}>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {idx === 0 && (
                            <span className="text-amber-400 font-black text-lg">★</span>
                          )}
                          <span className={`font-bold truncate ${idx === 0 ? 'text-amber-100' : 'text-slate-200'}`}>
                            {bid.teamName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          <span className={`font-black ${idx === 0 ? 'text-amber-300' : 'text-emerald-400'}`}>
                            ₹{formatMoney(bid.amount)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingPanel;

