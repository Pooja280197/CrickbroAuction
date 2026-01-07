// import React, { useEffect, useRef, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import AuctionHeader from '../../../components/AuctionHeader'
// import axios from 'axios';
// import { connectAuctionSocket, disconnectSocket } from '../Socket';
// import { toast } from 'react-toastify';

// // AuctionOwnerComponent.jsx
// // Single-file React + Tailwind component that simulates the auction UI you shared.
// // - Exact color combinations, gradients and animations are approximated with Tailwind + inline gradients
// // - Countdown starts at 30, decrements, and resets to 30 on any new bid
// // - Right-hand scrollable list shows team bids with newest (current) on top
// // - Mock "socket" simulation included (can be removed when integrating real socket)

// const TeamOwnerId = '68da29826fe07f64bf45a1ee'
// const auctionId = '691f0a1bc6cc825cf1c4dec7'
// export default function AuctionOwnerComponent() {

//     const [teamDetail, setTeamDetail] = useState([])

//     // Wallet / purchase state for Team Owner
//     const [initialWallet, setInitialWallet] = useState(50000000); // default ₹5,00,00,000
//     const [totalSpent, setTotalSpent] = useState(0);
//     const remaining = Math.max(0, initialWallet - totalSpent);
//     const [playersBought, setPlayersBought] = useState(0);
//     const [purchasedPlayers, setPurchasedPlayers] = useState([]);
    

//     const fetchTeamDetails = async () => {
//         try {
//             const response = await axios.get(`webSiteApi/auctionTeam/getTeamsByOwnerInAuction/${auctionId}?playerId=${TeamOwnerId}`)
//             console.log(response?.data?.data?.data)
//             setTeamDetail(response?.data?.data?.data)
//         }
//         catch(error){
//             console.log('Error fetching Team Details')

//         }
//     }
//     useEffect(()=>{
//         fetchTeamDetails()
//     },[])


//     // Player / auction state (would normally come from API)
//     const [player] = useState({
//         name: 'Virat Sharma',
//         role: 'Batsman',
//         country: 'India',
//         matches: 150,
//         runs: 5420,
//         avg: 42.5,
//         sr: 138.2,
//         base: 2000000,
//         avatarLetter: 'VS',
//     });

//     // Bids: newest first (index 0 is current highest)
//     const [bids, setBids] = useState([
//         { id: 1, team: 'Mumbai Warriors', owner: 'Amit Shah', amount: 8500000, time: Date.now() - 12000 },
//         { id: 2, team: 'Chennai Kings', owner: 'Priya R', amount: 8200000, time: Date.now() - 45000 },
//     ]);

//     const [currentBid, setCurrentBid] = useState(bids[0]?.amount ?? player.base);
//     const [increment, setIncrement] = useState(500000); // bid increment input
//     const [countdown, setCountdown] = useState(30);
//     const timerRef = useRef(null);
//     const bidIdRef = useRef(3);
//     const [simulating, setSimulating] = useState(true);

//     // utility: format INR with commas like ₹85,00,000
//     const formatINR = (n) => {
//         if (n == null) return '-';
//         const s = Math.round(n).toString();
//         // Format to Indian system (lakh, crore)
//         let last3 = s.slice(-3);
//         let rest = s.slice(0, -3);
//         if (rest !== '') rest = rest.replace(/\B(?=(?:\d{2})+(?!\d))/g, ',') + ',';
//         return '₹' + rest + last3;
//     };

//     // start/clear timer
//     useEffect(() => {
//         startTimer();
//         return () => clearInterval(timerRef.current);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     function startTimer() {
//         clearInterval(timerRef.current);
//         setCountdown(30);
//         timerRef.current = setInterval(() => {
//             setCountdown((c) => {
//                 if (c <= 1) {
//                     clearInterval(timerRef.current);
//                     return 0;
//                 }
//                 return c - 1;
//             });
//         }, 1000);
//     }

//     // Whenever bids change, recalc currentBid and reset timer
//     useEffect(() => {
//         const highest = bids[0]?.amount ?? player.base;
//         setCurrentBid(highest);
//         startTimer();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [bids]);

//     // Mock socket: randomly add a bid every 15-30s when simulating
//     useEffect(() => {
//         // Connect to socket and handle auction updates
//         const handleAuctionSnapshot = (data: any) => {
//             console.log('📸 Auction Snapshot:', data);
//             // Initialize with snapshot data
//             if (data.currentBid) {
//                 setCurrentBid(data.currentBid);
//             }
//             if (data.bids && Array.isArray(data.bids)) {
//                 setBids(data.bids);
//             }
//         };

//         const handleAuctionUpdate = (data: any) => {
//             console.log('⚡ Auction Update:', data);
//             // Handle real-time updates from socket
//             if (data.newBid) {
//                 const newBid = {
//                     id: bidIdRef.current++,
//                     team: data.newBid.teamName || 'Unknown Team',
//                     owner: data.newBid.ownerName || 'Unknown',
//                     amount: data.newBid.bidAmount,
//                     time: Date.now(),
//                 };
//                 setBids((prev) => [newBid, ...prev]);
//                 setCurrentBid(data.newBid.bidAmount);
//             }
//         };

//         const handleDisconnect = (reason: string) => {
//             console.warn('⚠️ Socket disconnected:', reason);
//         };

//         const handleError = (error: Error) => {
//             console.error('❌ Socket error:', error.message);
//         };

//         // Connect to socket
//         connectAuctionSocket({
//             auctionId,
//             onSnapshot: handleAuctionSnapshot,
//             onUpdate: handleAuctionUpdate,
//             onDisconnect: handleDisconnect,
//             onError: handleError,
//         });

//         // Cleanup on unmount
//         return () => {
//             disconnectSocket();
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [auctionId]);

//     // Fallback: Mock socket - randomly add a bid every 15-30s when simulating
//     useEffect(() => {
//         if (!simulating) return;
//         let alive = true;
//         const makeRemoteBid = () => {
//             if (!alive) return;
//             const interval = 15000 + Math.random() * 15000;
//             setTimeout(() => {
//                 const incOptions = [250000, 500000, 1000000];
//                 const inc = incOptions[Math.floor(Math.random() * incOptions.length)];
//                 const newAmount = (bids[0]?.amount ?? player.base) + inc;
//                 const newBid = {
//                     id: bidIdRef.current++,
//                     team: Math.random() > 0.5 ? 'Kolkata Royals' : 'Delhi Gladiators',
//                     owner: Math.random() > 0.5 ? 'Rahul' : 'Sonia',
//                     amount: newAmount,
//                     time: Date.now(),
//                 };
//                 setBids((prev) => [newBid, ...prev]);
//                 if (alive) makeRemoteBid();
//             }, interval);
//         };
//         makeRemoteBid();
//         return () => (alive = false);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [simulating, bids.length]);

//     function placeBid(teamName = 'You') {
//         const next = currentBid + increment;
//         const newBid = {
//             id: bidIdRef.current++,
//             team: teamName === 'You' ? 'Your Team' : teamName,
//             owner: teamName === 'You' ? 'You' : teamName,
//             amount: next,
//             time: Date.now(),
//         };
//         // this simulates emitting to socket and getting new bid
//         setBids((prev) => [newBid, ...prev]);
//     }

//     // Confirm purchase / finalize winning player for this owner
//     function confirmPurchase() {
//         // If current highest is by You, use that amount; otherwise place a final bid by You then buy
//         const highest = bids[0]?.amount ?? currentBid;
//         let buyAmount = highest;
//         if (bids[0]?.owner !== 'You') {
//             // place a final bid by You at next increment
//             const next = currentBid + increment;
//             const newBid = {
//                 id: bidIdRef.current++,
//                 team: 'Your Team',
//                 owner: 'You',
//                 amount: next,
//                 time: Date.now(),
//             };
//             setBids((prev) => [newBid, ...prev]);
//             buyAmount = next;
//         }

//         if (remaining < buyAmount) {
//             // Simple feedback - in a real app use toasts/modal
//             toast.error('Insufficient funds to complete purchase.');
//             return;
//         }

//         // Finalize purchase
//         setTotalSpent((s) => s + buyAmount);
//         setPlayersBought((c) => c + 1);
//         setPurchasedPlayers((arr) => [{ ...player, price: buyAmount, boughtAt: Date.now() }, ...arr]);
//     }

//     function handleSetInitialWallet(value) {
//         const v = Number(value) || 0;
//         if (v < totalSpent) {
//             toast.error('Initial wallet cannot be less than already spent amount.');
//             return;
//         }
//         setInitialWallet(v);
//     }

//     // simple helper for time ago
//     const timeAgo = (ts) => {
//         const s = Math.floor((Date.now() - ts) / 1000);
//         if (s < 60) return `${s}s`;
//         const m = Math.floor(s / 60);
//         return `${m}m`;
//     };



import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuctionHeader from "../../../components/AuctionHeader";
import axios from "axios";
import { connectAuctionSocket, disconnectSocket } from "../Socket";
import { toast } from "react-toastify";

const TeamOwnerId = "68da29826fe07f64bf45a1ee";
const auctionId = "691f0a1bc6cc825cf1c4dec7";

export default function AuctionOwnerComponent() {
  const [teamDetail, setTeamDetail] = useState([]);

  // Wallet / purchase state
  const [initialWallet, setInitialWallet] = useState(50000000);
  const [totalSpent, setTotalSpent] = useState(0);
  const remaining = Math.max(0, initialWallet - totalSpent);
  const [playersBought, setPlayersBought] = useState(0);
  const [purchasedPlayers, setPurchasedPlayers] = useState([]);

  const fetchTeamDetails = async () => {
    try {
      const response = await axios.get(
        `webSiteApi/auctionTeam/getTeamsByOwnerInAuction/${auctionId}?playerId=${TeamOwnerId}`
      );
      setTeamDetail(response?.data?.data?.data || []);
    } catch (error) {
      console.log("Error fetching Team Details");
    }
  };

  useEffect(() => {
    fetchTeamDetails();
  }, []);

  // Player state
  const [player] = useState({
    name: "Virat Sharma",
    role: "Batsman",
    country: "India",
    matches: 150,
    runs: 5420,
    avg: 42.5,
    sr: 138.2,
    base: 2000000,
    avatarLetter: "VS",
  });

  const [bids, setBids] = useState([
    {
      id: 1,
      team: "Mumbai Warriors",
      owner: "Amit Shah",
      amount: 8500000,
      time: Date.now() - 12000,
    },
    {
      id: 2,
      team: "Chennai Kings",
      owner: "Priya R",
      amount: 8200000,
      time: Date.now() - 45000,
    },
  ]);

  const [currentBid, setCurrentBid] = useState(
    bids[0]?.amount ?? player.base
  );
  const [increment, setIncrement] = useState(500000);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);
  const bidIdRef = useRef(3);
  const [simulating, setSimulating] = useState(true);

  const formatINR = (n) => {
    if (n == null) return "-";
    const s = Math.round(n).toString();
    let last3 = s.slice(-3);
    let rest = s.slice(0, -3);
    if (rest !== "")
      rest = rest.replace(/\B(?=(?:\d{2})+(?!\d))/g, ",") + ",";
    return "₹" + rest + last3;
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  function startTimer() {
    clearInterval(timerRef.current);
    setCountdown(30);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    const highest = bids[0]?.amount ?? player.base;
    setCurrentBid(highest);
    startTimer();
  }, [bids]);

  // Socket connection
  useEffect(() => {
    const handleAuctionSnapshot = (data) => {
      if (data?.currentBid) setCurrentBid(data.currentBid);
      if (Array.isArray(data?.bids)) setBids(data.bids);
    };

    const handleAuctionUpdate = (data) => {
      if (data?.newBid) {
        const newBid = {
          id: bidIdRef.current++,
          team: data.newBid.teamName || "Unknown Team",
          owner: data.newBid.ownerName || "Unknown",
          amount: data.newBid.bidAmount,
          time: Date.now(),
        };
        setBids((prev) => [newBid, ...prev]);
        setCurrentBid(data.newBid.bidAmount);
      }
    };

    const handleDisconnect = (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    };

    const handleError = (error) => {
      console.error("❌ Socket error:", error.message);
    };

    connectAuctionSocket({
      auctionId,
      onSnapshot: handleAuctionSnapshot,
      onUpdate: handleAuctionUpdate,
      onDisconnect: handleDisconnect,
      onError: handleError,
    });

    return () => disconnectSocket();
  }, []);

  // Mock auto-bids
  useEffect(() => {
    if (!simulating) return;
    let alive = true;

    const makeRemoteBid = () => {
      if (!alive) return;
      const interval = 15000 + Math.random() * 15000;
      setTimeout(() => {
        const incOptions = [250000, 500000, 1000000];
        const inc =
          incOptions[Math.floor(Math.random() * incOptions.length)];
        const newAmount = (bids[0]?.amount ?? player.base) + inc;

        const newBid = {
          id: bidIdRef.current++,
          team: Math.random() > 0.5 ? "Kolkata Royals" : "Delhi Gladiators",
          owner: Math.random() > 0.5 ? "Rahul" : "Sonia",
          amount: newAmount,
          time: Date.now(),
        };

        setBids((prev) => [newBid, ...prev]);
        if (alive) makeRemoteBid();
      }, interval);
    };

    makeRemoteBid();
    return () => (alive = false);
  }, [simulating, bids.length]);

  function placeBid(teamName = "You") {
    const next = currentBid + increment;
    const newBid = {
      id: bidIdRef.current++,
      team: teamName === "You" ? "Your Team" : teamName,
      owner: teamName === "You" ? "You" : teamName,
      amount: next,
      time: Date.now(),
    };
    setBids((prev) => [newBid, ...prev]);
  }

  function confirmPurchase() {
    const highest = bids[0]?.amount ?? currentBid;
    let buyAmount = highest;

    if (bids[0]?.owner !== "You") {
      const next = currentBid + increment;
      const newBid = {
        id: bidIdRef.current++,
        team: "Your Team",
        owner: "You",
        amount: next,
        time: Date.now(),
      };
      setBids((prev) => [newBid, ...prev]);
      buyAmount = next;
    }

    if (remaining < buyAmount) {
      toast.error("Insufficient funds to complete purchase.");
      return;
    }

    setTotalSpent((s) => s + buyAmount);
    setPlayersBought((c) => c + 1);
    setPurchasedPlayers((arr) => [
      { ...player, price: buyAmount, boughtAt: Date.now() },
      ...arr,
    ]);
  }

  const timeAgo = (ts) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m`;
  };
    return (
        <div className="min-h-screen p-6 bg-gradient-to-r from-[#0f1724] via-[#0b2130] to-[#10212a] text-white">
            <AuctionHeader />
            <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6">
                {/* Main left: Live Auction Panel */}

                <div className="col-span-8">
                    <div
                        className="rounded-2xl p-6 shadow-2xl"
                        style={{
                            background: 'linear-gradient(180deg, rgba(24,32,50,0.9), rgba(7,12,20,0.6))',
                            border: '1px solid rgba(255,255,255,0.03)',
                        }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl">🔥</span>
                                <h2 className="text-3xl font-extrabold tracking-wide">LIVE AUCTION</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-[#081426] px-4 py-2 rounded-lg border border-[#25415a] shadow-sm">
                                    <div className="text-sm text-[#7dd3fc]">⏱️</div>
                                    <div className="text-xl font-bold">{String(countdown).padStart(2, '0')}</div>
                                </div>
                            </div>
                        </div>

                        {/* Player card */}
                        <div className="mt-6 rounded-xl p-6" style={{ background: 'linear-gradient(90deg,#081124 0%, #081b2b 100%)', border: '1px solid rgba(60,130,190,0.08)' }}>
                            <div className="flex items-center gap-6">
                                <div className="w-28 h-28 rounded-xl flex items-center justify-center text-3xl font-extrabold" style={{ background: 'linear-gradient(135deg,#2b8cff,#0057d8)' }}>
                                    {player.avatarLetter}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-extrabold flex items-center gap-2">{player.name} <span className="text-yellow-300">⚡</span></h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="px-3 py-1 bg-[#0b2233] rounded-full text-sm">{player.role.toUpperCase()}</span>
                                                <span className="px-3 py-1 bg-[#09302a] rounded-full text-sm">{player.country.toUpperCase()}</span>
                                                <span className="px-3 py-1 bg-[#3b2a18] rounded-full text-sm">BUCKET: MARQUEE</span>
                                                <span className="px-3 py-1 bg-[#4b2a5a] rounded-full text-sm">BASE: {formatINR(player.base)}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-xs text-gray-300">MATCHES</div>
                                            <div className="text-xl font-bold">{player.matches}</div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-4 gap-4">
                                        <div className="bg-[#082233] rounded-lg p-3 text-center">
                                            <div className="text-sm text-gray-300">RUNS</div>
                                            <div className="font-bold text-lg">{player.runs}</div>
                                        </div>
                                        <div className="bg-[#082233] rounded-lg p-3 text-center">
                                            <div className="text-sm text-gray-300">AVERAGE</div>
                                            <div className="font-bold text-lg">{player.avg}</div>
                                        </div>
                                        <div className="bg-[#082233] rounded-lg p-3 text-center">
                                            <div className="text-sm text-gray-300">SR</div>
                                            <div className="font-bold text-lg">{player.sr}</div>
                                        </div>
                                        <div className="bg-[#082233] rounded-lg p-3 text-center">
                                            <div className="text-sm text-gray-300">CURRENT BID</div>
                                            <div className="font-extrabold text-2xl text-green-400">{formatINR(currentBid)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bidding Actions (below the card) */}
                        <div className="mt-6 grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-8 flex gap-4 items-center">
                                <div className="flex items-center gap-2 bg-[#071421] rounded-lg px-3 py-2 border border-[#113246]">
                                    <label className="text-sm text-gray-300">Increment</label>
                                    <select value={increment} onChange={(e) => setIncrement(Number(e.target.value))} className="ml-2 bg-transparent outline-none">
                                        <option value={250000}>₹2,50,000</option>
                                        <option value={500000}>₹5,00,000</option>
                                        <option value={1000000}>₹10,00,000</option>
                                    </select>
                                </div>

                                <button
                                    className="px-5 py-3 bg-gradient-to-r from-[#ff7a59] to-[#ffb86b] rounded-xl font-bold shadow-lg transform hover:scale-[1.02] transition"
                                    onClick={() => placeBid('You')}
                                >
                                    Bid {formatINR(currentBid + increment)}
                                </button>

                                <button
                                    className="px-4 py-3 bg-[#0b2b3a] rounded-xl border border-[#19536a] text-sm"
                                    onClick={() => setSimulating((s) => !s)}
                                >
                                    {simulating ? 'Stop Auto-Bids' : 'Start Auto-Bids'}
                                </button>
                            </div>

                            <div className="col-span-4 text-right">
                                <div className="inline-flex items-center gap-3 bg-[#071222] px-4 py-2 rounded-lg border border-[#163544]">
                                    <div className="text-xs text-gray-400">Highest Bid</div>
                                    <div className="text-2xl font-extrabold text-green-400">{formatINR(currentBid)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Big current highest bid card (visual emphasis) */}
                        <div className="mt-6 rounded-2xl p-6" style={{ background: 'linear-gradient(90deg, rgba(6,40,26,0.95), rgba(5,36,26,0.85))', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-gray-300">CURRENT HIGHEST BID</div>
                                    <div className="text-4xl font-extrabold text-green-400 tracking-tight">{formatINR(currentBid)}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-200">By</div>
                                    <div className="font-bold">{bids[0]?.team ?? '—'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Teams / Bids list */}
               <div className="col-span-4">
    <div className="rounded-2xl p-4 h-[75vh] sticky top-6 overflow-hidden" style={{ 
        background: 'linear-gradient(180deg, rgba(12,20,30,0.7), rgba(6,12,18,0.6))', 
        border: '1px solid rgba(255,255,255,0.03)' 
    }}>
        {/* Wallet summary */}
        <h4 className="text-lg font-extrabold mb-4">⭐ TOP TEAMS</h4>

        <div className="h-[60vh] overflow-y-auto pr-2 space-y-3" id="bids-scroll">
            <AnimatePresence initial={false}>
                {/* First 4 cards - fully highlighted */}
                {bids.slice(0, 4).map((b) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        key={b.id}
                        className={`p-3 rounded-xl border ${b.id === bids[0].id ? 'border-green-400 bg-gradient-to-r from-[#042b1d] to-[#06312a]' : 'bg-[#051726] border-[#193142]'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg" style={{ 
                                    background: 'linear-gradient(135deg,#8b5cf6,#ec4899)' 
                                }}>
                                    {b.team.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{b.team}</div>
                                    <div className="text-xs text-gray-300">{b.owner} · {timeAgo(b.time)}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-300">Bid</div>
                                <div className="font-extrabold text-lg text-white">{formatINR(b.amount)}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
                
                {/* Remaining cards - light/faded colors */}
                {bids.slice(4).map((b) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={b.id}
                        className="p-3 rounded-xl border bg-[#0a1e30]/30 border-[#1a3a52]/50"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-md flex items-center justify-center font-bold text-lg opacity-70" style={{ 
                                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(236, 72, 153, 0.5))' 
                                }}>
                                    {b.team.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-400">{b.team}</div>
                                    <div className="text-xs text-gray-500">{b.owner} · {timeAgo(b.time)}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Bid</div>
                                <div className="font-bold text-lg text-gray-400">{formatINR(b.amount)}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {/* Show message if there are faded cards */}
            {bids.length > 4 && (
                <div className="mt-2 pt-3 border-t border-[#193142]/20 text-center">
                    {/* <div className="text-xs text-gray-500 italic">
                        Showing {Math.min(4, bids.length)} highlighted teams of {bids.length} total
                    </div> */}
                </div>
            )}
        </div>

        {purchasedPlayers.length > 0 && (
            <div className="mt-4">
                <div className="text-sm text-gray-300 mb-2">Purchased Players</div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {purchasedPlayers.map((pp, idx) => (
                        <div key={idx} className="p-2 rounded bg-[#071f24] border border-[#16363b] flex items-center justify-between text-sm">
                            <div>
                                <div className="font-bold">{pp.name}</div>
                                <div className="text-xs text-gray-400">{pp.role} · {formatINR(pp.price)}</div>
                            </div>
                            <div className="text-xs text-gray-400">{new Date(pp.boughtAt).toLocaleTimeString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="mt-4 flex gap-3">
            <button className="flex-1 py-2 rounded-lg bg-[#06222e] border border-[#164b52]" onClick={() => placeBid('Mumbai Warriors')}>Bid as Mumbai</button>
            <button className="flex-1 py-2 rounded-lg bg-[#2b1530] border border-[#5c2f2f]" onClick={() => placeBid('Chennai Kings')}>Bid as Chennai</button>
        </div>
    </div>
</div>
            </div>
        </div>
    );
}
