// import axios from "axios";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Socket } from "socket.io-client";
// import { connectAuctionSocket, disconnectSocket } from "../../Live_Auction/SocketClient";
// import { toast } from "react-toastify";
// import ConfirmDialog from '../ConfirmDialog'

// // ---- TYPES ----
// interface ApiCategory {
//   _id: string;
//   name: string;
// }

// interface Category {
//   id: string;
//   name: string;
// }

// interface SocketTeam {
//   teamId: string;
//   teamName: string;
//   initialBudget: number;
//   remainingBudget: number;
//   currentSquadSize: number;
// }

// interface SocketBidEntry {
//   teamName: string;
//   amount: number;
//   time?: string;
//   createdAt?: string;
// }

// interface SocketPlayer {
//   playerId: string;
//   name: string;
//   basePrice: number;
//   currentBid: number | null;
//   status: "bidding" | "sold" | "unsold";
//   categoryId: string;
//   categoryName: string;
//   profilePicture?: string | null;
//   role?: string;
//   rating?: number;
//   bidHistory?: SocketBidEntry[];
//   highestBidder?: string; // teamId
//   highestBidderName?: string; // teamName
//   isUnsoldEntry?: boolean;
//   biddingIncrement: number;
//   batchId?: string;
// }

// interface SocketAuctionPayload {
//   auctionId: string;
//   auctionName: string;
//   auctionStatus: "scheduled" | "ongoing" | "paused" | string;
//   auctionType: string;
//   currentPlayer: SocketPlayer | null;
//   teams: SocketTeam[];
// }

// interface SoldRecord {
//   playerId: string;
//   playerName: string;
//   teamId: string | null;
//   teamName: string | null;
//   amount: number | null;
//   status: "sold" | "unsold";
//   categoryId: string | null;
//   categoryName: string | null;
// }

// const BID_STEP = 250000;

// const formatBidTime = (val?: string) => {
//   if (!val) return "";
//   const d = new Date(val);
//   if (isNaN(d.getTime())) return val;
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = d.toLocaleString("en-IN", { month: "short" });
//   const year = d.getFullYear();
//   const hours = String(d.getHours()).padStart(2, "0");
//   const mins = String(d.getMinutes()).padStart(2, "0");
//   const secs = String(d.getSeconds()).padStart(2, "0");
//   return `${day} ${month} ${year}, ${hours}:${mins}:${secs}`;
// };

// const formatMoney = (amount: number) => {
//   if (!amount || isNaN(amount)) return "0";

//   // CRORE (>= 1,00,00,000)
//   if (amount >= 10000000) {
//     const crore = amount / 10000000;
//     return `${parseFloat(crore.toFixed(2))}Cr`;
//   }

//   // LAKH (>= 1,00,000)
//   if (amount >= 100000) {
//     const lakh = amount / 100000;
//     return `${parseFloat(lakh.toFixed(2))}L`;
//   }

//   // THOUSAND (>= 1,000)
//   if (amount >= 1000) {
//     const thousand = amount / 1000;
//     return `${parseFloat(thousand.toFixed(1))}k`;
//   }

//   return amount.toString();
// };

// const AdminAuctionControl: React.FC = () => {
//   const { auctionId } = useParams<{ auctionId: string }>();

//   // ---- UI State ----
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
//   const [selectedStatus, setSelectedStatus] = useState<"available" | "unsold">(
//     "available"
//   );
//   const [categoryCounts, setCategoryCounts] = useState<{
//     total: number;
//     available: number;
//     sold: number;
//     unsold: number;
//   } | null>(null);
//   const [countsLoading, setCountsLoading] = useState(false);
//   const [countsError, setCountsError] = useState<string | null>(null);

//   // timer / flow
//   const [auctionStarted, setAuctionStarted] = useState(false); // local timer flag
//   const [isPaused, setIsPaused] = useState(false);
//   const [decisionPending, setDecisionPending] = useState(false);
//   const [auctionEnded, setAuctionEnded] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [auctionRound, setAuctionRound] = useState(0);

//   const [selectedTeamId, setSelectedTeamId] = useState<string>("");
//   const [currentBid, setCurrentBid] = useState<number | null>(null);
//   const [currentWinnerName, setCurrentWinnerName] = useState<string | null>(
//     null
//   );
//   const [isSold, setIsSold] = useState<boolean | null>(null);

//   const [soldHistory, setSoldHistory] = useState<SoldRecord[]>([]);

//   const [biddingHistory, setBiddingHistory] = useState<
//     { teamName: string; amount: number; time: string }[]
//   >([]);

//   const [socketData, setSocketData] = useState<SocketAuctionPayload | null>(
//     null
//   );
//   const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
//   const [teams, setTeams] = useState<SocketTeam[]>([]);

//   // search
//   const [teamSearch, setTeamSearch] = useState<string>("");
//   const [confirmState, setConfirmState] = useState<{
//     open: boolean;
//     title?: string;
//     message: string;
//     onConfirm: () => void;
//     danger?: boolean;
//   }>({
//     open: false,
//     title: "",
//     message: "",
//     onConfirm: () => { },
//   });

//   // ---- Fetch categories from API ----
//   useEffect(() => {
//     if (!auctionId) return;

//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(
//           `/webSiteApi/auctionCategory/listCategories?auctionId=${auctionId}`
//         );
//         const apiCats: ApiCategory[] = res.data?.data?.data || [];
//         const mapped: Category[] = apiCats.map((c) => ({
//           id: c._id,
//           name: c.name,
//         }));
//         setCategories(mapped);
//       } catch (error) {
//         console.error("Failed to fetch categories", error);
//       }
//     };

//     fetchCategories();
//   }, [auctionId]);

//   // ---- SOCKET PAYLOAD HANDLER ----
//   const handleSocketData = useCallback((data: SocketAuctionPayload | any) => {
//     const payload = data && (data as any).data ? (data as any).data : data;

//     // parse payload

//     setSocketData(payload);

//     if (Array.isArray(payload?.teams)) {
//       setTeams(payload.teams || []);
//     }

//     // sync auctionStarted / isPaused from backend status
//     if (payload?.auctionStatus === "ongoing") {
//       setAuctionStarted(true);
//       setIsPaused(false);
//     } else if (payload?.auctionStatus === "paused") {
//       // auction already started earlier but currently paused
//       setAuctionStarted(true);
//       setIsPaused(true);
//     } else {
//       // scheduled or something else
//       setAuctionStarted(false);
//       setIsPaused(false);
//     }

//     const bh: SocketBidEntry[] = payload?.currentPlayer?.bidHistory || [];

//     const normalized = bh
//       .map((b) => ({
//         teamName: b.teamName,
//         amount: Number((b as any).bidAmount ?? (b as any).amount ?? 0),
//         time: formatBidTime((b as any).bidTime || (b as any).createdAt || (b as any).time),
//       }))
//       .sort((a, c) => c.amount - a.amount)
//       .slice(0, 10);

//     setBiddingHistory(normalized);

//     if (payload?.currentPlayer) {
//       setCurrentBid(
//         payload.currentPlayer.currentBid ??
//         payload.currentPlayer.basePrice ??
//         null
//       );
//       setCurrentWinnerName(
//         payload.currentPlayer.highestBidderName ||
//         payload.currentPlayer.highestBidder ||
//         null
//       );

//       if (payload.currentPlayer.highestBidder) {
//         setSelectedTeamId(payload.currentPlayer.highestBidder);
//       }
//     } else {
//       setCurrentBid(null);
//       setCurrentWinnerName(null);
//       setBiddingHistory([]);
//       setSelectedTeamId("");
//     }
//   }, []);

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
//         fetchCounts();

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

//   const currentPlayer: SocketPlayer | null = socketData?.currentPlayer ?? null;

//   const [hasSelectedCategory, setHasSelectedCategory] = useState(false);

//   // ---- Default category: pick first category only on initial load ----
//   useEffect(() => {
//     if (!hasSelectedCategory && categories.length > 0 && !selectedCategoryId) {
//       setSelectedCategoryId(categories[0].id);
//       setHasSelectedCategory(true);
//     }
//   }, [categories, hasSelectedCategory, selectedCategoryId]);

//   // ---- Fetch category counts when category changes ----
//   // useEffect(() => {
//   //   if (!selectedCategoryId) {
//   //     setCategoryCounts(null);
//   //     return;
//   //   }

//   //   let cancelled = false;

//   //   const fetchCounts = async () => {
//   //     setCountsLoading(true);
//   //     setCountsError(null);
//   //     try {
//   //       const res = await axios.get(
//   //         `/webSiteApi/auctionCategory/getCategoryPlayerCounts/${selectedCategoryId}`
//   //       );

//   //       // API response shape can be nested; try common fallbacks
//   //       const payload = res.data?.data?.data || res.data?.data || res.data;
//   //       const counts = payload?.counts || payload?.data?.counts || null;

//   //       if (!cancelled) {
//   //         if (counts) {
//   //           setCategoryCounts({
//   //             total: Number(counts.total || 0),
//   //             available: Number(counts.available || 0),
//   //             sold: Number(counts.sold || 0),
//   //             unsold: Number(counts.unsold || 0),
//   //           });
//   //         } else {
//   //           setCategoryCounts({ total: 0, available: 0, sold: 0, unsold: 0 });
//   //         }
//   //       }
//   //     } catch (err: any) {
//   //       if (!cancelled) {
//   //         setCountsError("Failed to load counts");
//   //         setCategoryCounts(null);
//   //         console.error("Error fetching category counts", err);
//   //       }
//   //     } finally {
//   //       if (!cancelled) setCountsLoading(false);
//   //     }
//   //   };

//   //   fetchCounts();

//   //   return () => {
//   //     cancelled = true;
//   //   };
//   // }, [selectedCategoryId]);

//   const fetchCounts = useCallback(async () => {
//     if (!selectedCategoryId) {
//       setCategoryCounts(null);
//       return;
//     }

//     setCountsLoading(true);
//     setCountsError(null);

//     try {
//       const res = await axios.get(
//         `/webSiteApi/auctionCategory/getCategoryPlayerCounts/${selectedCategoryId}`
//       );

//       const payload = res.data?.data?.data || res.data?.data || res.data;
//       const counts = payload?.counts || payload?.data?.counts || null;

//       if (counts) {
//         setCategoryCounts({
//           total: Number(counts.total || 0),
//           available: Number(counts.available || 0),
//           sold: Number(counts.sold || 0),
//           unsold: Number(counts.unsold || 0),
//         });
//       } else {
//         setCategoryCounts({ total: 0, available: 0, sold: 0, unsold: 0 });
//       }
//     } catch (err) {
//       console.error("Error fetching counts:", err);
//       setCountsError("Failed to load counts");
//     } finally {
//       setCountsLoading(false);
//     }
//   }, [selectedCategoryId]);

//   useEffect(() => {
//     fetchCounts();
//   }, [fetchCounts]);

//   // ---- TIMER EFFECT ----
//   useEffect(() => {
//     // timer should run only while auction is locally "started"
//     if (!auctionStarted || decisionPending || auctionEnded || isPaused) return;

//     const id = window.setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           window.clearInterval(id);
//           setAuctionStarted(false);
//           setDecisionPending(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => window.clearInterval(id);
//   }, [auctionStarted, decisionPending, auctionEnded, auctionRound, isPaused]);

//   const resetLocalAuctionState = () => {
//     setAuctionStarted(false);
//     setIsPaused(false);
//     setDecisionPending(false);
//     setAuctionEnded(false);
//     setTimeLeft(30);
//     setCurrentBid(null);
//     setSelectedTeamId("");
//     setCurrentWinnerName(null);
//     setIsSold(null);
//   };

//   // ---- CATEGORY CHANGE -> load first player via callNext ----
//   const handleCategoryChange = (value: string) => {
//     if (!socketInstance || !auctionId) return;

//     setSelectedCategoryId(value);
//     setHasSelectedCategory(true);
//     resetLocalAuctionState();

//     socketInstance.emit("callNext", {
//       auctionId,
//       categoryId: value,
//       playerStatus: selectedStatus
//     });
//   };

//   const handleStatusChange = (value: string) => {
//     setSelectedStatus(value as "available" | "unsold");
//   };

//   // ---- START / PAUSE / RESUME ----
//   const handleStartAuction = async () => {
//     try {
//       const data = {
//         categoryId: selectedCategoryId,
//         playerStatus: selectedStatus
//       };

//       await axios.post(`/webSiteApi/auction/start/${auctionId}`, data);

//       setAuctionStarted(true);
//       console.log("✅ Auction started");

//     } catch (error) {
//       console.error("Start auction error", error);
//     }
//   };

//   const handlePlayPause = async () => {
//     try {
//       if (socketData?.auctionStatus === "paused") {
//         await axios.post(`/webSiteApi/auction/resume/${auctionId}`);
//         return;
//       }

//       if (socketData?.auctionStatus === "ongoing") {
//         await axios.post(`/webSiteApi/auction/pause/${auctionId}`);
//         return;
//       }

//       handleStartAuction();
//     } catch (err) {
//       console.error("Pause/Resume failed:", err);
//     }
//   };

//   //   const getNextBidPrice = (): number | null => {
//   //     if (!currentPlayer) return null;
//   //     const base = currentBid ?? currentPlayer.basePrice;
//   //     return base + BID_STEP;
//   //   };

//   const getNextBidPrice = (): number | null => {
//     if (!currentPlayer) return null;
//     return (
//       (currentBid ?? currentPlayer.basePrice) +
//       (currentPlayer.categoryBiddingIncrement || BID_STEP)
//     );
//   };

//   // ---- SOCKET BID / TEAM SELECT ----

//   const handleTeamBid = async (teamId: string) => {
//     if (!currentPlayer || !auctionId) return;

//     const bidIncrement =
//       socketData?.currentPlayer?.categoryBiddingIncrement ||
//       socketData?.currentPlayer?.biddingIncrement ||
//       0;

//     if (!bidIncrement) return;
//     try {
//       await axios.post(`/webSiteApi/auction/placeBid/${auctionId}`, {
//         playerId: currentPlayer.playerId,
//         teamId,
//         bidAmount: currentPlayer.currentBid + bidIncrement,
//       });

//       // On success, mark this team as last-selected (they placed the bid)
//       setSelectedTeamId(teamId);
//       console.log("✅ Bid placed");

//     } catch (err: any) {
//       console.error("❌ Bid failed", err);
//       toast.error(err.response?.data?.message || "Failed to place bid");
//     }
//   };

//   const canMarkDecision =
//     !!currentPlayer && currentPlayer.status === "bidding";

//   const handleMarkUnsold = async () => {
//     if (!currentPlayer || !auctionId) return;

//     // const confirmUnsold = window.confirm(
//     //   `Are you sure you want to mark ${currentPlayer.name} as UNSOLD?`
//     // );
//     // if (!confirmUnsold) return;

//     try {
//       await axios.post(
//         `/webSiteApi/auction/playerStatus/${auctionId}/${currentPlayer.playerId}`,
//         {
//           status: "unsold",
//         }
//       );

//       const record: SoldRecord = {
//         playerId: currentPlayer.playerId,
//         playerName: currentPlayer.name,
//         teamId: null,
//         teamName: null,
//         amount: null,
//         status: "unsold",
//         categoryId: currentPlayer.categoryId,
//         categoryName: currentPlayer.categoryName,
//       };

//       setSoldHistory((prev) => [...prev, record]);
//       setIsSold(false);
//       setCurrentBid(null);
//       setCurrentWinnerName(null);
//       setDecisionPending(false);
//       setAuctionStarted(false);
//       setIsPaused(false);
//       fetchCounts();
//     } catch (error) {
//       console.error("❌ Unsold API error:", error);
//       toast.error("Failed to mark player unsold.");
//     }
//   };

//   // ---- UNDO LAST BID ----
//   const handleUndoLastBid = async (teamId?: string) => {
//     if (!currentPlayer || !auctionId) return;

//     // const confirmUndo = window.confirm(
//     //   `Are you sure you want to undo the last bid for ${currentPlayer.name}?`
//     // );
//     // if (!confirmUndo) return;

//     try {
//       const payload: any = { playerId: currentPlayer.playerId };
//       if (teamId) payload.teamId = teamId;

//       const resp = await axios.post(
//         `/webSiteApi/auction/undoLastBid/${auctionId}`,
//         payload
//       );

//       console.log('✅ Undo success', resp?.data);
//       // refresh local socket/read state will come from socket; optionally refetch auction
//       // you may want to clear selected team if it was the last bidder
//       if (teamId && selectedTeamId === teamId) setSelectedTeamId('');
//     } catch (err: any) {
//       console.error('❌ Undo last bid failed', err?.response?.data || err);
//       toast.error(err?.response?.data?.message || 'Failed to undo last bid');
//     }
//   };

//   // ---- UNDO MARK (sold -> unsold) ----
//   const handleUndoMark = async () => {
//     if (!currentPlayer || !auctionId) return;

//     // Only allow undo mark when the current player is actually marked SOLD
//     if (currentPlayer.status !== 'sold') {
//       toast.error('Undo mark is allowed only when the current player is marked SOLD');
//       return;
//     }

//     // const confirmUndo = window.confirm(
//     //   `Are you sure you want to undo the SOLD mark for ${currentPlayer.name}? This will move the player back to unsold.`
//     // );
//     // if (!confirmUndo) return;

//     try {
//       const resp = await axios.post(
//         `/webSiteApi/auction/undoMark/${auctionId}`,
//         { playerId: currentPlayer.playerId }
//       );

//       console.log('✅ Undo mark success', resp?.data);
//       // UI updates should arrive via socket; optionally refresh or update local state
//       setIsSold(false);
//       setDecisionPending(false);
//       setAuctionStarted(false);
//       // clear sold record if present
//       setSoldHistory((prev) => prev.filter((s) => s.playerId !== currentPlayer.playerId));
//     } catch (err: any) {
//       console.error('❌ Undo mark failed', err?.response?.data || err);
//       toast.error(err?.response?.data?.message || 'Failed to undo sold mark');
//     }
//   };

//   // ---- SOLD ----
//   const handleMarkSold = async () => {
//     if (!currentPlayer || !auctionId) return;
//     if (!selectedTeamId) {
//       toast.error("No team has placed a bid or selected.");
//       return;
//     }
//     if (!currentBid) {
//       toast.error("No bid found to mark sold.");
//       return;
//     }

//     // const confirmSell = window.confirm(
//     //   `Are you sure you want to mark ${currentPlayer.name} as SOLD for ${formatMoney(
//     //     currentBid
//     //   )}?`
//     // );
//     // if (!confirmSell) return;

//     try {
//       await axios.post(
//         `/webSiteApi/auction/playerStatus/${auctionId}/${currentPlayer.playerId}`,
//         {
//           status: "sold",
//           soldTo: selectedTeamId,
//           finalPrice: currentBid,
//         }
//       );

//       const team = teams.find((t) => t.teamId === selectedTeamId);

//       const record: SoldRecord = {
//         playerId: currentPlayer.playerId,
//         playerName: currentPlayer.name,
//         teamId: selectedTeamId,
//         teamName: team?.teamName || null,
//         amount: currentBid,
//         status: "sold",
//         categoryId: currentPlayer.categoryId,
//         categoryName: currentPlayer.categoryName,
//       };

//       setSoldHistory((prev) => [...prev, record]);
//       setCurrentWinnerName(team?.teamName || null);
//       setIsSold(true);
//       setDecisionPending(false);
//       setAuctionEnded(true);
//       setAuctionStarted(false);
//       setIsPaused(false);
//     } catch (error) {
//       console.error("❌ Sold API error:", error);
//       toast.error("Failed to mark player sold.");
//     }
//   };

//   // ---- NEXT PLAYER ----
//   const handleNextPlayer = async () => {
//     if (!selectedCategoryId) {
//       toast.error("Please select a category first");
//       return;
//     }
//     if (!auctionId) return;

//     try {
//       const data = {
//         categoryId: selectedCategoryId,
//         playerStatus: selectedStatus,
//       };

//       await axios.post(`/webSiteApi/auction/callNext/${auctionId}`, data);
//       resetLocalAuctionState();
//     } catch (error) {
//       console.error("Next player error", error);
//     }
//   };

//   // ---- Teams: filtered from socket ----
//   const filteredTeams = useMemo(() => {
//     const list = teams || [];
//     const term = teamSearch.trim().toLowerCase();
//     if (!term) return list;

//     return list.filter((t) =>
//       t.teamName.toLowerCase().includes(term)
//     );
//   }, [teamSearch, teams]);

//   const selectedTeam = teams.find((t) => t.teamId === selectedTeamId);
//   const nextBidPrice = getNextBidPrice();

//   // ---- TOP STATS using soldHistory ----
//   const globalStats = useMemo(() => {
//     const sold = soldHistory.filter((x) => x.status === "sold");
//     const unsold = soldHistory.filter((x) => x.status === "unsold");
//     const totalSpent = sold.reduce((sum, r) => sum + (r.amount || 0), 0);
//     const avgSale = sold.length ? Math.round(totalSpent / sold.length) : 0;
//     const highestSale = sold.reduce(
//       (max, r) => (r.amount && r.amount > max ? r.amount : max),
//       0
//     );

//     return {
//       soldCount: sold.length,
//       unsoldCount: unsold.length,
//       totalSpent,
//       avgSale,
//       highestSale,
//     };
//   }, [soldHistory]);

//   const allPlayersCount = 6; // placeholder
//   const activeStats = globalStats;

//   const auctionStatus = socketData?.auctionStatus;
//   const buttonText =
//     auctionStatus === "paused"
//       ? "Resume"
//       : auctionStatus === "ongoing"
//         ? "Pause"
//         : "Start Auction";

//   const openUnsoldConfirm = () => {
//     setConfirmState({
//       open: true,
//       danger: true,
//       message: `Are you sure you want to mark ${currentPlayer?.name} as UNSOLD?`,
//       onConfirm: async () => {
//         setConfirmState((p) => ({ ...p, open: false }));
//         await handleMarkUnsold();
//       },
//     });
//   };

//   const openSoldConfirm = () => {
//     if (!currentPlayer || !selectedTeamId || !currentBid) {
//       toast.error("No bid found to mark sold.");
//       return;
//     }

//     setConfirmState({
//       open: true,
//       title: "Confirm Sale",
//       danger: false, // SOLD positive action hai
//       message: `Are you sure you want to sell ${currentPlayer.name} to ${teams.find(t => t.teamId === selectedTeamId)?.teamName
//         } for ${formatMoney(currentBid)}?`,
//       onConfirm: async () => {
//         setConfirmState(p => ({ ...p, open: false }));
//         await handleMarkSold(); // existing SOLD logic reuse
//       },
//     });
//   };

//   const openUndoConfirm = () => {
//     if (!currentPlayer) {
//       toast.error("No player selected.");
//       return;
//     }

//     setConfirmState({
//       open: true,
//       title: "Undo Last Action",
//       danger: true, // undo destructive ho sakta hai
//       message: `Are you sure you want to undo the SOLD mark for ${currentPlayer.name}? This will move the player back to unsold.`,
//       onConfirm: async () => {
//         setConfirmState(p => ({ ...p, open: false }));
//         await handleUndoMark(); // existing undo logic
//       },
//     });
//   };

//   const openUndoLastBidConfirm = () => {
//     if (!currentBid) {
//       toast.error("No bid available to undo.");
//       return;
//     }

//     setConfirmState({
//       open: true,
//       title: "Undo Last Bid",
//       danger: true, // bid undo destructive hai
//       message: `Are you sure you want to undo the last bid of ${formatMoney(
//         currentBid
//       )}?`,
//       onConfirm: async () => {
//         setConfirmState(p => ({ ...p, open: false }));
//         await handleUndoLastBid(); // existing logic
//       },
//     });
//   };

import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { connectAuctionSocket, disconnectSocket } from "../SocketClient";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog";

/* ================= CONSTANTS ================= */

const BID_STEP = 250000;

/* ================= HELPERS ================= */

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

const formatMoney = (amount) => {
  if (!amount || isNaN(amount)) return "0";

  if (amount >= 10000000)
    return `${parseFloat((amount / 10000000).toFixed(2))}Cr`;
  if (amount >= 100000) return `${parseFloat((amount / 100000).toFixed(2))}L`;
  if (amount >= 1000) return `${parseFloat((amount / 1000).toFixed(1))}k`;

  return amount.toString();
};

/* ================= COMPONENT ================= */

const AdminAuctionControl = () => {
  const { auctionId } = useParams();

  /* ---------- UI STATE ---------- */

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("available");

  const [categoryCounts, setCategoryCounts] = useState(null);
  const [countsLoading, setCountsLoading] = useState(false);
  const [countsError, setCountsError] = useState(null);

  const [auctionStarted, setAuctionStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [decisionPending, setDecisionPending] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [currentBid, setCurrentBid] = useState(null);
  const [currentWinnerName, setCurrentWinnerName] = useState(null);
  const [isSold, setIsSold] = useState(null);

  const [soldHistory, setSoldHistory] = useState([]);
  const [biddingHistory, setBiddingHistory] = useState([]);

  const [socketData, setSocketData] = useState(null);
  const [socketInstance, setSocketInstance] = useState(null);
  const [teams, setTeams] = useState([]);

  const [teamSearch, setTeamSearch] = useState("");
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: () => {},
    danger: false,
  });

  const currentPlayer = socketData?.currentPlayer || null;

  /* ---------- FETCH CATEGORIES ---------- */

  useEffect(() => {
    if (!auctionId) return;

    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `/webSiteApi/auctionCategory/listCategories?auctionId=${auctionId}`
        );

        const apiCats = res.data?.data?.data || [];
        setCategories(apiCats.map((c) => ({ id: c._id, name: c.name })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [auctionId]);

  /* ---------- SOCKET HANDLER ---------- */

  const auctionStatus = socketData?.auctionStatus;

  const handleSocketData = useCallback((data) => {
    const payload = data?.data || data;
    console.log("Socket payload received:", payload);

    setSocketData(payload);
    setTeams(payload?.teams || []);

    if (payload?.auctionStatus === "ongoing") {
      setAuctionStarted(true);
      setIsPaused(false);
    } else if (payload?.auctionStatus === "paused") {
      setAuctionStarted(true);
      setIsPaused(true);
    } else {
      setAuctionStarted(false);
      setIsPaused(false);
    }

    const bh = payload?.currentPlayer?.bidHistory || [];

    setBiddingHistory(
      bh
        .map((b) => ({
          teamName: b.teamName,
          amount: Number(b.bidAmount ?? b.amount ?? 0),
          time: formatBidTime(b.bidTime || b.createdAt || b.time),
        }))
        .sort((a, c) => c.amount - a.amount)
        .slice(0, 10)
    );

    if (payload?.currentPlayer) {
      setCurrentBid(
        payload.currentPlayer.currentBid ??
          payload.currentPlayer.basePrice ??
          null
      );

      setCurrentWinnerName(
        payload.currentPlayer.highestBidderName ||
          payload.currentPlayer.highestBidder ||
          null
      );

      if (payload.currentPlayer.highestBidder) {
        setSelectedTeamId(payload.currentPlayer.highestBidder);
      }
    } else {
      setCurrentBid(null);
      setCurrentWinnerName(null);
      setBiddingHistory([]);
      setSelectedTeamId("");
    }
  }, []);

  /* ---------- CONNECT SOCKET ---------- */
  const resetLocalAuctionState = () => {
    setAuctionStarted(false);
    setIsPaused(false);
    setDecisionPending(false);
    setAuctionEnded(false);
    setTimeLeft(30);
    setCurrentBid(null);
    setSelectedTeamId("");
    setCurrentWinnerName(null);
    setIsSold(null);
  };

  //   // ---- CATEGORY CHANGE -> load first player via callNext ----
  const handleCategoryChange = (value) => {
    if (!socketInstance || !auctionId) return;

    setSelectedCategoryId(value);
    setHasSelectedCategory(true);
    resetLocalAuctionState();

    socketInstance.emit("callNext", {
      auctionId,
      categoryId: value,
      playerStatus: selectedStatus,
    });
  };

  const handleNextPlayer = async () => {
    if (!selectedCategoryId) {
      toast.error("Please select a category first");
      return;
    }
    if (!auctionId) return;

    try {
      const data = {
        categoryId: selectedCategoryId,
        playerStatus: selectedStatus,
      };

      await axios.post(`/webSiteApi/auction/callNext/${auctionId}`, data);
      resetLocalAuctionState();
    } catch (error) {
      console.error("Next player error", error);
    }
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  // ---- START / PAUSE / RESUME ----
  const handleStartAuction = async () => {
    try {
      const data = {
        categoryId: selectedCategoryId,
        playerStatus: selectedStatus,
      };

      await axios.post(`/webSiteApi/auction/start/${auctionId}`, data);

      setAuctionStarted(true);
      console.log("✅ Auction started");
    } catch (error) {
      console.error("Start auction error", error);
    }
  };

  //   const handlePlayPause = async () => {
  //     try {
  //       if (socketData?.auctionStatus === "paused") {
  //         await axios.post(`/webSiteApi/auction/resume/${auctionId}`);
  //         return;
  //       }

  //       if (socketData?.auctionStatus === "ongoing") {
  //         await axios.post(`/webSiteApi/auction/pause/${auctionId}`);
  //         return;
  //       }

  //       handleStartAuction();
  //     } catch (err) {
  //       console.error("Pause/Resume failed:", err);
  //     }
  //   };
  const getNextBidPrice = () => {
    if (!currentPlayer) return null;
    return (
      (currentBid ?? currentPlayer.basePrice) +
      (currentPlayer.categoryBiddingIncrement || BID_STEP)
    );
  };

  const nextBidPrice = getNextBidPrice();

  const handlePlayPause = async () => {
    try {
      if (socketData?.auctionStatus === "paused") {
        await axios.post(`/webSiteApi/auction/resume/${auctionId}`);
        return;
      }

      if (socketData?.auctionStatus === "ongoing") {
        await axios.post(`/webSiteApi/auction/pause/${auctionId}`);
        return;
      }

      handleStartAuction();
    } catch (err) {
      console.error("Pause/Resume failed:", err);
    }
  };

  useEffect(() => {
    if (!auctionId) return;

    const socket = connectAuctionSocket({
      auctionId,
      onSnapshot: handleSocketData,
      onUpdate: handleSocketData,
      onDisconnect: (r) => console.log("Socket disconnected:", r),
      onError: (e) => console.error("Socket error:", e),
    });

    setSocketInstance(socket);

    return () => {
      disconnectSocket();
      setSocketInstance(null);
    };
  }, [auctionId, handleSocketData]);

  /* ---------- TIMER ---------- */

  //   // ---- UNDO MARK (sold -> unsold) ----
  const handleUndoMark = async () => {
    if (!currentPlayer || !auctionId) return;

    // Only allow undo mark when the current player is actually marked SOLD
    if (currentPlayer.status !== "sold") {
      toast.error(
        "Undo mark is allowed only when the current player is marked SOLD"
      );
      return;
    }

    // const confirmUndo = window.confirm(
    //   `Are you sure you want to undo the SOLD mark for ${currentPlayer.name}? This will move the player back to unsold.`
    // );
    // if (!confirmUndo) return;

    try {
      const resp = await axios.post(
        `/webSiteApi/auction/undoMark/${auctionId}`,
        { playerId: currentPlayer.playerId }
      );

      console.log("✅ Undo mark success", resp?.data);
      // UI updates should arrive via socket; optionally refresh or update local state
      setIsSold(false);
      setDecisionPending(false);
      setAuctionStarted(false);
      // clear sold record if present
      setSoldHistory((prev) =>
        prev.filter((s) => s.playerId !== currentPlayer.playerId)
      );
    } catch (err) {
      console.error("❌ Undo mark failed", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to undo sold mark");
    }
  };

  const openUndoConfirm = () => {
    if (!currentPlayer) {
      toast.error("No player selected.");
      return;
    }

    setConfirmState({
      open: true,
      title: "Undo Last Action",
      danger: true, // undo destructive ho sakta hai
      message: `Are you sure you want to undo the SOLD mark for ${currentPlayer.name}? This will move the player back to unsold.`,
      onConfirm: async () => {
        setConfirmState((p) => ({ ...p, open: false }));
        await handleUndoMark(); // existing undo logic
      },
    });
  };

  useEffect(() => {
    if (!auctionStarted || decisionPending || auctionEnded || isPaused) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setAuctionStarted(false);
          setDecisionPending(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [auctionStarted, decisionPending, auctionEnded, isPaused]);

  const canMarkDecision = !!currentPlayer && currentPlayer.status === "bidding";

  /* ---------- TEAM BID ---------- */

  const handleTeamBid = async (teamId) => {
    if (!currentPlayer || !auctionId) return;

    const increment =
      currentPlayer.categoryBiddingIncrement ||
      currentPlayer.biddingIncrement ||
      BID_STEP;

    try {
      await axios.post(`/webSiteApi/auction/placeBid/${auctionId}`, {
        playerId: currentPlayer.playerId,
        teamId,
        // bidAmount: currentBid + increment,
        bidAmount: currentPlayer.currentBid === 0 ? currentPlayer.basePrice : currentPlayer.currentBid + increment,
      });

      setSelectedTeamId(teamId);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Bid failed");
    }
  };

  /* ---------- SOLD / UNSOLD ---------- */

  const handleMarkSold = async () => {
    if (!currentPlayer || !selectedTeamId || !currentBid) return;

    try {
      await axios.post(
        `/webSiteApi/auction/playerStatus/${auctionId}/${currentPlayer.playerId}`,
        {
          status: "sold",
          soldTo: selectedTeamId,
          finalPrice: currentBid,
        }
      );

      setIsSold(true);
      setAuctionEnded(true);
    } catch {
      toast.error("Failed to mark sold");
    }
  };

  const handleMarkUnsold = async () => {
    if (!currentPlayer) return;

    try {
      await axios.post(
        `/webSiteApi/auction/playerStatus/${auctionId}/${currentPlayer.playerId}`,
        { status: "unsold" }
      );

      setIsSold(false);
    } catch {
      toast.error("Failed to mark unsold");
    }
  };

  const openSoldConfirm = () => {
    if (!currentPlayer || !selectedTeamId || !currentBid) {
      toast.error("No bid found to mark sold.");
      return;
    }

    setConfirmState({
      open: true,
      title: "Confirm Sale",
      danger: false, // SOLD positive action hai
      message: `Are you sure you want to sell ${currentPlayer.name} to ${
        teams.find((t) => t.teamId === selectedTeamId)?.teamName
      } for ${formatMoney(currentBid)}?`,
      onConfirm: async () => {
        setConfirmState((p) => ({ ...p, open: false }));
        await handleMarkSold(); // existing SOLD logic reuse
      },
    });
  };

  //   // ---- UNDO LAST BID ----
  const handleUndoLastBid = async (teamId) => {
    if (!currentPlayer || !auctionId) return;

    // const confirmUndo = window.confirm(
    //   `Are you sure you want to undo the last bid for ${currentPlayer.name}?`
    // );
    // if (!confirmUndo) return;

    try {
      const payload = { playerId: currentPlayer.playerId };
      if (teamId) payload.teamId = teamId;

      const resp = await axios.post(
        `/webSiteApi/auction/undoLastBid/${auctionId}`,
        payload
      );

      console.log("✅ Undo success", resp?.data);
      // refresh local socket/read state will come from socket; optionally refetch auction
      // you may want to clear selected team if it was the last bidder
      if (teamId && selectedTeamId === teamId) setSelectedTeamId("");
    } catch (err) {
      console.error("❌ Undo last bid failed", err?.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to undo last bid");
    }
  };

  const openUnsoldConfirm = () => {
    setConfirmState({
      open: true,
      danger: true,
      message: `Are you sure you want to mark ${currentPlayer?.name} as UNSOLD?`,
      onConfirm: async () => {
        setConfirmState((p) => ({ ...p, open: false }));
        await handleMarkUnsold();
      },
    });
  };

  const openUndoLastBidConfirm = () => {
    if (!currentBid) {
      toast.error("No bid available to undo.");
      return;
    }

    setConfirmState({
      open: true,
      title: "Undo Last Bid",
      danger: true, // bid undo destructive hai
      message: `Are you sure you want to undo the last bid of ${formatMoney(
        currentBid
      )}?`,
      onConfirm: async () => {
        setConfirmState((p) => ({ ...p, open: false }));
        await handleUndoLastBid(); // existing logic
      },
    });
  };

  /* ---------- FILTER TEAMS ---------- */

  const filteredTeams = useMemo(() => {
    if (!teamSearch) return teams;
    return teams.filter((t) =>
      t.teamName.toLowerCase().includes(teamSearch.toLowerCase())
    );
  }, [teamSearch, teams]);

  const buttonText =
    auctionStatus === "paused"
      ? "Resume"
      : auctionStatus === "ongoing"
      ? "Pause"
      : "Start Auction";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 shadow-sm shadow-blue-950 ">
            <span className="text-sm text-slate-400">AUCTION STATUS</span>
            <div className="text-lg font-semibold text-emerald-400 capitalize">
              {auctionStatus || "Loading..."}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 shadow-sm shadow-blue-950">
            <span className="text-sm text-slate-400">Current Category</span>
            <div className="text-2xl font-bold">
              {categories.find((c) => c.id === selectedCategoryId)?.name ||
                currentPlayer?.categoryName ||
                "-"}
            </div>

            <div className="mt-2 text-sm text-slate-400">
              {countsLoading ? (
                <span>Loading counts…</span>
              ) : countsError ? (
                <span>{countsError}</span>
              ) : categoryCounts ? (
                <div className="flex gap-3 text-xs">
                  <div>
                    <div className="text-xs text-slate-400">Total</div>
                    <div className="font-semibold text-slate-100">
                      {categoryCounts.total}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Available</div>
                    <div className="font-semibold text-emerald-300">
                      {categoryCounts.available}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Sold</div>
                    <div className="font-semibold text-amber-300">
                      {categoryCounts.sold}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Unsold</div>
                    <div className="font-semibold text-pink-300">
                      {categoryCounts.unsold}
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-slate-400">No data</span>
              )}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 shadow-sm shadow-blue-950">
            <span className="text-sm text-slate-400">TOTAL TEAMS</span>
            <div className="text-2xl font-bold">{teams?.length}</div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 shadow-sm shadow-blue-950">
            <span className="text-sm text-slate-400">CURRENT BID</span>
            <div className="text-2xl font-bold text-sky-400">
              {currentPlayer ? formatMoney(currentPlayer?.currentBid) : "—"}
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl px-5 py-4 shadow-sm shadow-blue-950">
            <span className="text-sm text-slate-400">HIGHEST BIDDER</span>
            <div className="text-lg font-semibold text-amber-400">
              {currentPlayer?.highestBidderName || "—"}
            </div>
          </div>
        </div>

        {/* MIDDLE LAYOUT */}
        <div className="grid lg:grid-cols-[2fr,1.1fr] gap-6">
          {/* LIVE AUCTION */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 text-xl">
                  🔥
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-200">
                    LIVE AUCTION
                  </h2>
                  <p className="text-sm text-slate-500">
                    Category wise player bidding
                  </p>
                </div>
              </div>

              {/* Category + Status */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="available">Available</option>
                  <option value="unsold">Unsold</option>
                </select>
              </div>

              {/* Play/Pause */}
              <button
                type="button"
                onClick={handlePlayPause}
                disabled={!selectedCategoryId}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  !selectedCategoryId
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-500 text-slate-950 hover:bg-emerald-600"
                }`}
              >
                {buttonText}
              </button>
            </div>

            {/* EMPTY STATES */}
            {!selectedCategoryId && (
              <div className="flex-1 min-h-[160px] flex flex-col items-center justify-center text-slate-400 text-base">
                <div className="text-4xl mb-3">⚙️</div>
                <div className="font-semibold mb-1">No Active Lot</div>
                <p className="text-sm text-slate-500">
                  Select a category to load players.
                </p>
              </div>
            )}

            {!currentPlayer && socketData?.auctionStatus === "ongoing" && (
              <p className="text-slate-400">
                No player available for this category
              </p>
            )}

            {/* ACTIVE PLAYER CARD */}
            {currentPlayer && (
              <>
                <div className="relative grid md:grid-cols-[1.2fr,1fr] gap-5 bg-slate-950/30 rounded-2xl border border-slate-800/80 p-4 mt-3">
                  {/* {currentPlayer.status === "sold" && (
                    <div className="absolute -top-3 left-6 px-4 py-1.5 bg-emerald-500 text-white font-bold text-sm rounded-full shadow-lg">
                      ✓ SOLD
                    </div>
                  )}
                  {currentPlayer.status === "unsold" && (
                    <div className="absolute -top-3 left-6 px-4 py-1.5 bg-red-500 text-white font-bold text-sm rounded-full shadow-lg">
                      ✗ UNSOLD
                    </div>
                  )} */}

                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                        {currentPlayer.profilePicture ? (
                          <img
                            src={currentPlayer.profilePicture}
                            alt={currentPlayer.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {currentPlayer.status === "unsold" && (
                        <div className="absolute inset-0 bg-red-600/70 flex items-center justify-center text-white font-bold text-lg rounded-2xl rotate-[-15deg]">
                          UNSOLD
                        </div>
                      )}
                      {currentPlayer.status === "sold" && (
                        <div className="absolute inset-0 bg-green-600/70 flex items-center justify-center text-white font-bold text-lg rounded-2xl rotate-[-15deg]">
                          SOLD
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold text-slate-50">
                          {currentPlayer.name}
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/40 text-xs text-sky-300 font-semibold">
                          {currentPlayer?.role?.toUpperCase() || "Player"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400">
                        Batch{" "}
                        <span className="font-semibold">
                          {currentPlayer.batchId || "-"}
                        </span>
                      </p>

                      <div className="mt-3">
                        <span className="text-xs text-slate-500">
                          Base Price
                        </span>
                        <div className="text-2xl font-bold text-emerald-400">
                          {formatMoney(currentPlayer.basePrice)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CURRENT BID SUMMARY */}
                  <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 flex flex-col justify-between shadow-sm shadow-amber-100">
                    <div>
                      {currentPlayer.status === "sold" ? (
                        <>
                          <span className="text-xs text-emerald-400 font-semibold">
                            SOLD ✓
                          </span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <div className="text-3xl font-bold text-emerald-400">
                              {formatMoney(currentBid)}
                            </div>
                          </div>
                          {currentWinnerName && (
                            <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                              <p className="text-xs text-emerald-400 font-semibold mb-1">
                                SOLD TO
                              </p>
                              <p className="text-sm font-bold text-emerald-100">
                                {currentWinnerName}
                              </p>
                            </div>
                          )}
                        </>
                      ) : currentPlayer.status === "unsold" ? (
                        <>
                          <span className="text-xs text-red-400 font-semibold">
                            UNSOLD ✗
                          </span>
                          <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-xs text-red-400 font-semibold">
                              NOT SOLD IN THIS ROUND
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-xs text-slate-500">
                            CURRENT BID
                          </span>
                          <div className="text-2xl font-bold text-sky-400 animate-pulse">
                            {formatMoney(currentBid)}
                          </div>
                          {currentWinnerName && (
                            <p className="mt-1 text-sm text-slate-300">
                              Highest bidder:{" "}
                              <span className="font-semibold text-slate-50">
                                {currentWinnerName}
                              </span>
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {selectedTeamId && (
                      <div className="mt-4 pt-3 border-t border-slate-800">
                        <p className="text-xs text-slate-500">
                          Last Selected Team
                        </p>
                        <p className="text-sm font-semibold text-slate-100">
                          {selectedTeamId.teamName}
                        </p>
                        <p className="text-sm text-slate-400">
                          Remaining Purse:{" "}
                          <span className="text-emerald-400 font-semibold">
                            {formatMoney(selectedTeamId.remainingBudget)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* PLACE YOUR BID + controls */}
                <div className="mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="text-sm text-slate-300 font-medium">
                      PLACE YOUR BID
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {auctionStarted && !auctionEnded && (
                        <div className="text-sm text-sky-300">
                          Next Bid Price:{" "}
                          <span className="font-semibold">
                            {formatMoney(nextBidPrice)}
                          </span>
                        </div>
                      )}

                      {teams.length > 4 && (
                        <div className=" flex justify-end">
                          <input
                            type="text"
                            value={teamSearch}
                            onChange={(e) => setTeamSearch(e.target.value)}
                            placeholder="Search team"
                            className="w-full sm:w-40 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                      )}

                      {/* Sold / Unsold / Next buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          // onClick={handleMarkSold}
                          onClick={openSoldConfirm}
                          disabled={!canMarkDecision}
                          className={`px-3 py-2 rounded-full text-xs font-semibold transition 
                            ${
                              !canMarkDecision
                                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                : "bg-emerald-500 text-slate-950 hover:bg-emerald-600"
                            }
                          `}
                        >
                          Sold
                        </button>

                        <button
                          type="button"
                          // onClick={handleMarkUnsold}
                          onClick={openUnsoldConfirm}
                          disabled={!canMarkDecision}
                          className={`px-3 py-2 rounded-full text-xs font-semibold transition 
                            ${
                              !canMarkDecision
                                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                : "bg-red-500 text-slate-50 hover:bg-red-600"
                            }
                          `}
                        >
                          Unsold
                        </button>

                        <button
                          type="button"
                          onClick={handleNextPlayer}
                          className="px-3 py-2 rounded-full text-xs font-semibold transition bg-slate-200 text-slate-900 hover:bg-white"
                        >
                          Next Player
                        </button>
                        <button
                          type="button"
                          // onClick={() => handleUndoLastBid(selectedTeamId || undefined)}
                          onClick={openUndoLastBidConfirm}
                          disabled={!canMarkDecision}
                          className={`px-3 py-2 rounded-full text-xs font-semibold transition 
                            ${
                              !canMarkDecision
                                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                : "bg-amber-500 text-slate-900 hover:bg-amber-600"
                            }
                          `}
                        >
                          Undo Last Bid
                        </button>
                        <button
                          type="button"
                          // onClick={handleUndoMark}
                          onClick={openUndoConfirm}
                          disabled={
                            !(currentPlayer && currentPlayer.status === "sold")
                          }
                          className={`px-3 py-2 rounded-full text-xs font-semibold transition 
                            ${
                              !(
                                currentPlayer && currentPlayer.status === "sold"
                              )
                                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                : "bg-indigo-500 text-slate-50 hover:bg-indigo-600"
                            }
                          `}
                        >
                          Undo Mark
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result info */}
                {auctionEnded && (
                  <div className="mt-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl px-5 py-4 text-center">
                      {isSold && currentWinnerName && currentBid ? (
                        <>
                          <div className="text-xl font-semibold text-emerald-300 mb-1">
                            🎉 Sold to {currentWinnerName}
                          </div>
                          <p className="text-sm text-emerald-100">
                            {currentPlayer.name} sold for{" "}
                            <span className="font-semibold">
                              {formatMoney(currentBid)}
                            </span>
                            .
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-xl font-semibold text-slate-100 mb-1">
                            Player Unsold
                          </div>
                          <p className="text-sm text-slate-300">
                            {currentPlayer.name} remained unsold in this round.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TEAMS GRID – ALWAYS VISIBLE WHEN TEAMS EXIST */}
            {teams.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-200">
                    Teams &amp; Purses
                  </p>
                  {teams.length > 4 && !currentPlayer && (
                    <input
                      type="text"
                      value={teamSearch}
                      onChange={(e) => setTeamSearch(e.target.value)}
                      placeholder="Search team"
                      className="w-full sm:w-64 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {filteredTeams.map((team) => {
                    const canBid =
                      socketData?.auctionStatus === "ongoing" &&
                      !!currentPlayer &&
                      currentPlayer.status === "bidding";

                    const isSelected = team.teamId === selectedTeamId;
                    const isDisabled = !canBid || isSelected;

                    const displayBudget = team.remainingBudget;
                    const remainingIfWin = (() => {
                      if (!currentPlayer) return null;
                      if (team.teamId !== selectedTeamId) return null;
                      const payAmount = Number(
                        currentBid ?? currentPlayer.basePrice ?? 0
                      );
                      return Math.max(team.remainingBudget - payAmount, 0);
                    })();

                    return (
                      <button
                        key={team.teamId}
                        disabled={isDisabled}
                        onClick={() => handleTeamBid(team.teamId)}
                        className={`rounded-xl p-3 text-sm border transition 
        ${
          isSelected
            ? "bg-sky-600 border-sky-400"
            : "bg-slate-900 border-slate-700"
        }
        ${isDisabled ? "opacity-70 cursor-not-allowed" : "hover:border-sky-400"}
      `}
                      >
                        <div className="font-semibold">{team.teamName}</div>

                        <div className="text-xs text-slate-400">
                          ₹{displayBudget.toLocaleString()}
                          {remainingIfWin !== null &&
                            currentPlayer?.status !== "sold" && (
                              <div className="text-[11px] text-slate-300 mt-1">
                                If wins:{" "}
                                <span className="font-semibold text-emerald-300">
                                  ₹{remainingIfWin.toLocaleString()}
                                </span>
                              </div>
                            )}
                        </div>
                      </button>
                    );
                  })}

                  {filteredTeams.length === 0 && (
                    <div className="col-span-full text-center text-sm text-slate-400 py-4">
                      No teams found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl p-5 h-full flex flex-col shadow-lg">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-100 tracking-wide">
                  BIDDING HISTORY
                </h3>
              </div>

              <div className="flex-1">
                {biddingHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="text-4xl mb-3 opacity-50">📭</div>
                    <p className="text-sm">No bids yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-full overflow-y-auto">
                    {biddingHistory.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                          idx === 0
                            ? "bg-amber-500/20 border border-amber-500/40 ring-2 ring-amber-400/30 animate-pulse shadow-lg shadow-amber-400/20"
                            : "bg-slate-800/50 border border-slate-700/30 hover:bg-slate-800/70"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {idx === 0 && (
                            <span className="text-amber-400 font-bold text-lg">
                              ★
                            </span>
                          )}
                          <span
                            className={`text-sm font-semibold truncate ${
                              idx === 0 ? "text-amber-100" : "text-slate-200"
                            }`}
                          >
                            {entry.teamName}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`font-bold min-w-20 text-right ${
                              idx === 0
                                ? "text-amber-300 text-base"
                                : "text-emerald-400 text-sm"
                            }`}
                          >
                            {formatMoney(entry.amount)}
                          </span>
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {entry.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        danger={confirmState.danger}
        confirmText={
          confirmState.title === "Undo Last Bid"
            ? "Yes, Undo Bid"
            : confirmState.title === "Undo Last Action"
            ? "Yes, Undo"
            : "Confirm"
        }
        cancelText="Cancel"
        onCancel={() => setConfirmState((p) => ({ ...p, open: false }))}
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
};

export default AdminAuctionControl;
