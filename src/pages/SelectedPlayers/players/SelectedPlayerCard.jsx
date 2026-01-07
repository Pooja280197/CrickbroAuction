// import React, { useEffect, useMemo, useState } from "react";
// import { Search, X } from "lucide-react";
// import PlayerCard from "./SelectedPlayerCard";
// import AssignCategoryModal from "./AssignCategoryModal";
// import PlayerDetailsPopup from "./PlayerDetailsPopup";
// import {
//   ratingOptions,
//   playerTypes,
// } from "../mock/mockPlayers";
// import axios from "axios";

// type SubTab = "unassignedSelected" | "auctionPlayers";

// type ToastState = {
//   type: "success" | "error";
//   message: string;
//   actionLabel?: string;
//   onAction?: () => void;
// } | null;

// interface SelectedAuctionManagerProps {
//   auctionId: string;
// }

// const SelectedAuctionManager: React.FC<SelectedAuctionManagerProps> = ({
//   auctionId,
// }) => {
//   const [selectPlayersList, SetSelectPlayersList] = useState<any[]>([]);
//   const [auctionPlayers, setAuctionPlayers] = useState<any[]>([]);
//   const [showResetUnassigned, setShowResetUnassigned] = useState(false);
//   const [showResetAuction, setShowResetAuction] = useState(false);
//   const [activeSubTab, setActiveSubTab] =
//     useState<SubTab>("unassignedSelected");
//   const [selectedIds, setSelectedIds] = useState<string[]>([]);
//   const [selectedAuctionIds, setSelectedAuctionIds] = useState<string[]>([]);
//   const [selectedCategoryId, setSelectedCategoryId] = useState<string[]>([]);
//   const [fromRating, setFromRating] = useState<number | "">("");
//   const [toRating, setToRating] = useState<number | "">("");
//   const [typeFilter, setTypeFilter] = useState<string>("");
//   const [appliedFilters, setAppliedFilters] = useState<{
//     from: number | "";
//     to: number | "";
//     type: string;
//   }>({ from: "", to: "", type: "" });

//   const [fromRatingA, setFromRatingA] = useState<number | "">("");
//   const [toRatingA, setToRatingA] = useState<number | "">("");
//   const [typeFilterA, setTypeFilterA] = useState<string>("");
//   const [appliedFiltersA, setAppliedFiltersA] = useState<{
//     from: number | "";
//     to: number | "";
//     type: string;
//   }>({ from: "", to: "", type: "" });
//   const [visibleUnassigned, setVisibleUnassigned] = useState(20);
//   const [visibleAuction, setVisibleAuction] = useState(20);
//   const [assignModalOpen, setAssignModalOpen] = useState(false);
//   const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
//   const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
//   const [toast, setToast] = useState<ToastState>(null);
//   // Category Filtering Auction Tab
//   const [categorySearchId, setCategorySearchId] = useState<string>("");
//   const [categorySearchName, setCategorySearchName] = useState<string>("");
//   const [showBulkActions, setShowBulkActions] = useState(false);
//   const [undoTimer, setUndoTimer] = useState<number | null>(null);
//   const [selectedPlayerDetails, setSelectedPlayerDetails] = useState<any | null>(null);
//   const [isPlayerDetailsOpen, setIsPlayerDetailsOpen] = useState(false);
//   const [searchTerm,setSearchTerm]=useState('')
  
//   // Pagination states
//   const [unassignedPage, setUnassignedPage] = useState(1);
//   const [auctionPage, setAuctionPage] = useState(1);
//   const [unassignedTotalPages, setUnassignedTotalPages] = useState(1);
//   const [auctionTotalPages, setAuctionTotalPages] = useState(1);
//   const [unassignedTotal, setUnassignedTotal] = useState(0);
//   const [auctionTotal, setAuctionTotal] = useState(0);

//   const enableBulkMode = Boolean(categorySearchId);

//   const [pendingDelete, setPendingDelete] = useState<{
//     ids: string[];
//     players: any[];
//     timeoutId: ReturnType<typeof setTimeout>;
//   } | null>(null);

//   const allCategories = useMemo(() => {
//     const map = new Map<string, { _id: string; name: string }>();

//     auctionPlayers.forEach((p: any) => {
//       p.assignedCategories?.forEach((c: any) => {
//         if (!map.has(c._id)) {
//           map.set(c._id, { _id: c._id, name: c.name });
//         }
//       });
//     });

//     return Array.from(map.values());
//   }, [auctionPlayers]);


//   const showToast = (data: ToastState) => {
//     setToast(data);
//     if (data && !data.actionLabel) {
//       setTimeout(() => setToast(null), 3000);
//     }
//   };

//   const fetchUnassignedPlayers = async (page: number = 1) => {
//     try {
//       const res = await axios.get(
//         `/webSiteApi/auction/getSelectPlayers/${auctionId}?categoryFilter=notassignincategory&page=${page}&limit=8`
//       );
//       console.log(res?.data?.data,"unassigned")
//       const { data, page: currentPage, pages, total } = res?.data?.data || {};
//       SetSelectPlayersList(data || []);
//       setUnassignedPage(currentPage || 1);
//       setUnassignedTotalPages(pages || 1);
//       setUnassignedTotal(total || 0);
//     } catch (err) {
//       console.error("Error loading unassigned", err);
//       showToast({
//         type: "error",
//         message: "Failed to load unassigned players.",
//       });
//     }
//   };

//   const fetchAssignedPlayers = async (page: number = 1) => {
//     try {
//       const res = await axios.get(
//         `/webSiteApi/auction/getSelectPlayers/${auctionId}?categoryFilter=assignincategory&page=${page}&limit=8`
//       );
//       console.log(res?.data?.data,"assigned")
//       const { data, page: currentPage, pages, total } = res?.data?.data || {};
//       setAuctionPlayers(data || []);
//       setAuctionPage(currentPage || 1);
//       setAuctionTotalPages(pages || 1);
//       setAuctionTotal(total || 0);
//     } catch (err) {
//       console.error("Error loading players for auction", err);
//       showToast({
//         type: "error",
//         message: "Failed to load players for auction.",
//       });
//     }
//   };

//   useEffect(() => {
//     if (!auctionId) return;
//     fetchUnassignedPlayers();
//     fetchAssignedPlayers();
//   }, [auctionId]);

//   const filteredUnassigned = useMemo(() => {
//     const { from, to, type } = appliedFilters;

//     return selectPlayersList.filter((p: any) => {
//       let ok = true;

//       const rating = p.bestAvgRating ?? 0;
//       const playerType = p.playerDoc?.playerRole;
//       const playerName = p.playerDoc?.name?.toLowerCase() || "";

//       // Search filter
//       if (searchTerm && !playerName.includes(searchTerm.toLowerCase())) {
//         return false;
//       }

//       if (type) ok = ok && playerType === type;

//       if (from !== "" && to !== "") {
//         ok = ok && rating >= from && rating <= to;
//       }

//       return ok;
//     });
//   }, [selectPlayersList, appliedFilters, searchTerm]);

//   // const filteredAuction = useMemo(() => {
//   //   const { from, to, type } = appliedFiltersA;
//   //   return auctionPlayers.filter((p: any) => {
//   //     let ok = true;
//   //     const rating = p.bestAvgRating ?? 0;
//   //     const playerType = p.playerDoc?.playerRole;
//   //     if (type) ok = ok && playerType === type;
//   //     if (from !== "" && to !== "") {
//   //       ok = ok && rating >= from && rating <= to;
//   //     }
//   //     return ok;
//   //   });
//   // }, [auctionPlayers, appliedFiltersA]);



//   const filteredAuction = useMemo(() => {
//     const { from, to, type } = appliedFiltersA;

//     return auctionPlayers.filter((p: any) => {
//       let ok = true;

//       const rating = p.bestAvgRating ?? 0;
//       const playerType = p.playerDoc?.playerRole;
//       const playerName = p.playerDoc?.name?.toLowerCase() || "";

//       // Search filter
//       if (searchTerm && !playerName.includes(searchTerm.toLowerCase())) {
//         return false;
//       }

//       if (type) ok = ok && playerType === type;

//       if (from !== "" && to !== "") {
//         ok = ok && rating >= from && rating <= to;
//       }

//       // ✅ NEW: CATEGORY FILTER
//       if (categorySearchId && showBulkActions) {
//         ok =
//           ok &&
//           p.assignedCategories?.some(
//             (c: any) => c._id === categorySearchId
//           );
//       }
//       // if (categorySearchId) {
//       //   ok =
//       //     ok &&
//       //     p.assignedCategories?.some(
//       //       (c: any) => c._id === categorySearchId
//       //     );
//       // }

//       return ok;
//     });
//   }, [auctionPlayers, appliedFiltersA, categorySearchId, showBulkActions, searchTerm]);

//   console.log(selectPlayersList, "players")


//   useEffect(() => {
//     setVisibleUnassigned(20);
//   }, [appliedFilters, selectPlayersList]);

//   useEffect(() => {
//     setVisibleAuction(20);
//   }, [appliedFiltersA, auctionPlayers, categorySearchId, showBulkActions]);

//   const handleSearchUnassigned = async () => {
//     setAppliedFilters({
//       from: fromRating,
//       to: toRating,
//       type: typeFilter,
//     });
//     setShowResetUnassigned(
//       fromRating !== "" || toRating !== "" || typeFilter !== "" || searchTerm !== ""
//     );
//     setUnassignedPage(1);
//     // Fetch with search query
//     try {
//       let url = `/webSiteApi/auction/getSelectPlayers/${auctionId}?categoryFilter=notassignincategory&page=1&limit=8`;
//       if (searchTerm) {
//         url += `&search=${encodeURIComponent(searchTerm)}`;
//       }
//       const res = await axios.get(url);
//       const { data, page: currentPage, pages, total } = res?.data?.data || {};
//       SetSelectPlayersList(data || []);
//       setUnassignedPage(currentPage || 1);
//       setUnassignedTotalPages(pages || 1);
//       setUnassignedTotal(total || 0);
//     } catch (err) {
//       console.error("Error searching unassigned", err);
//       showToast({
//         type: "error",
//         message: "Failed to search players.",
//       });
//     }
//   };

//   const handleSearchAuction = async () => {
//     setAppliedFiltersA({
//       from: fromRatingA,
//       to: toRatingA,
//       type: typeFilterA,
//     });
//     setShowResetAuction(
//       fromRatingA !== "" || toRatingA !== "" || typeFilterA !== "" || searchTerm !== ""
//     );
//     setAuctionPage(1);
//     // Fetch with search query
//     try {
//       let url = `/webSiteApi/auction/getSelectPlayers/${auctionId}?categoryFilter=assignincategory&page=1&limit=8`;
//       if (searchTerm) {
//         url += `&search=${encodeURIComponent(searchTerm)}`;
//       }
//       const res = await axios.get(url);
//       const { data, page: currentPage, pages, total } = res?.data?.data || {};
//       setAuctionPlayers(data || []);
//       setAuctionPage(currentPage || 1);
//       setAuctionTotalPages(pages || 1);
//       setAuctionTotal(total || 0);
//     } catch (err) {
//       console.error("Error searching auction", err);
//       showToast({
//         type: "error",
//         message: "Failed to search players.",
//       });
//     }
//     if (categorySearchId) {
//       setShowBulkActions(true);
//     }
//   };

//   const handleResetUnassigned = () => {
//     setFromRating("");
//     setToRating("");
//     setTypeFilter("");
//     setSearchTerm("");
//     setAppliedFilters({ from: "", to: "", type: "" });
//     setShowResetUnassigned(false);
//     setUnassignedPage(1);
//     // Refetch without filters
//     fetchUnassignedPlayers(1);
//   };

//   const handleResetAuction = () => {
//     setFromRatingA("");
//     setToRatingA("");
//     setTypeFilterA("");
//     setSearchTerm("");
//     setAppliedFiltersA({ from: "", to: "", type: "" });
//     setShowResetAuction(false);
//     setShowBulkActions(false);
//     setSelectedAuctionIds([]);
//     setAuctionPage(1);
//     // Refetch without filters
//     fetchAssignedPlayers(1);
//   };

//   const handleSelectAllVisible = () => {
//     const visibleIds = filteredUnassigned
//       .slice(0, visibleUnassigned)
//       .map((p: any) => p.playerDoc._id);

//     const allSelected = visibleIds.every((id) =>
//       selectedIds.includes(id)
//     );

//     if (allSelected) {
//       setSelectedIds((prev) =>
//         prev.filter((id) => !visibleIds.includes(id))
//       );
//     } else {
//       const newSet = new Set([...selectedIds, ...visibleIds]);
//       setSelectedIds(Array.from(newSet));
//     }
//   };

//   const handleAssignClick = (ids: string[]) => {
//     if (!ids.length) return;
//     setAssignModalOpen(true);
//   };

//   const handleAuctionPlayerSelect = (playerId: string) => {
//     if (!enableBulkMode) return;

//     // If category is "All Categories" (empty string), allow only single selection
//     if (categorySearchId === "") {
//       // Single selection mode
//       setSelectedAuctionIds(prev =>
//         prev.includes(playerId) ? [] : [playerId]
//       );
//     } else {
//       // Multiple selection mode for specific category
//       setSelectedAuctionIds(prev =>
//         prev.includes(playerId)
//           ? prev.filter(id => id !== playerId)
//           : [...prev, playerId]
//       );
//     }

//     // Get the selected player to set category IDs
//     const selectedPlayer = auctionPlayers.find(p => p.playerDoc._id === playerId);
//     if (selectedPlayer) {
//       setSelectedCategoryId(selectedPlayer.assignedCategories?.map((v: any) => v._id) || []);
//     }
//   };

//   const handleAssignSubmit = async (categoryId: string) => {
//     try {
//       await axios.post(`/webSiteApi/auction/assignPlayersToCategory`, {
//         auctionId,
//         categoryId,
//         playerIds: selectedIds,
//       });
//       setSelectedIds([]);
//       await fetchUnassignedPlayers();
//       await fetchAssignedPlayers();
//       setAssignModalOpen(false);
//       setActiveSubTab("auctionPlayers");
//       showToast({
//         type: "success",
//         message: "Players assigned to category successfully!",
//       });

//     } catch (error) {
//       console.error("Assign failed", error);

//       showToast({
//         type: "error",
//         message: "Failed to assign players.",
//       });
//     }
//   };
//   console.log('selectedCategoryId', selectedCategoryId)
//   const startOptimisticDelete = (ids: string[], cId: string[]) => {
//     const playersToRemove = auctionPlayers.filter(p =>
//       ids.includes(p.playerDoc._id)
//     );

//     // Immediately remove from UI
//     setAuctionPlayers(prev =>
//       prev.filter(p => !ids.includes(p.playerDoc._id))
//     );

//     // 🔥 TIMER = 5 seconds
//     let timeLeft = 5;
//     setUndoTimer(timeLeft);

//     // Countdown interval
//     const intervalId = setInterval(() => {
//       timeLeft -= 1;
//       setUndoTimer(timeLeft);

//       if (timeLeft === 0) {
//         clearInterval(intervalId);
//       }
//     }, 1000);

//     // Timeout to permanently delete
//     const timeoutId = setTimeout(async () => {
//       clearInterval(intervalId);
//       setUndoTimer(null);

//       try {
//         await axios.post(
//           `/webSiteApi/auctionCategory/removePlayersFromCategory/${cId}`,
//           { playerIds: ids }
//         );
//         await fetchUnassignedPlayers();
//         await fetchAssignedPlayers();
//         setSelectedAuctionIds([]);

//         showToast({
//           type: "success",
//           message: `${ids.length} player(s) permanently removed.`,
//         });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setPendingDelete(null);
//       }
//     }, 5000);

//     // Store pending delete info
//     setPendingDelete({
//       ids,
//       players: playersToRemove,
//       timeoutId,
//     });

//     // Show toast with Undo button + live timer
//     showToast({
//       type: "success",
//       message: `${ids.length} player(s) removed. Undo? (${timeLeft}s)`,
//       actionLabel: "Undo",
//       onAction: () => {
//         clearTimeout(timeoutId);
//         clearInterval(intervalId);
//         setUndoTimer(null);
//         setAuctionPlayers(prev => [...prev, ...playersToRemove]);
//         setPendingDelete(null);
//         setSelectedAuctionIds([]);

//         showToast({
//           type: "success",
//           message: "Undo successful",
//         });
//       },
//     });
//   };


//   const handleConfirmDelete = () => {
//     if (!deleteCandidate) return;
//     const id = deleteCandidate.playerDoc._id;
//     const cId = deleteCandidate.assignedCategories.map((v: any) => v._id)
//     startOptimisticDelete([id], cId);
//     setDeleteCandidate(null);
//   };

//   //   const handleBulkDeleteConfirm = () => {
//   //     if (!selectedAuctionIds.length) return;
//   //     startOptimisticDelete(selectedAuctionIds);
//   //     setBulkDeleteConfirmOpen(false);
//   //   };

//   // const handleBulkDeleteConfirm = () => {
//   //   if (!selectedAuctionIds.length || !categorySearchId) return;

//   //   startOptimisticDelete(
//   //     selectedAuctionIds,
//   //     [categorySearchId]
//   //   );

//   //   setBulkDeleteConfirmOpen(false);
//   // };

//   const handleBulkDeleteConfirm = () => {
//     if (!selectedAuctionIds.length || !categorySearchId) return;

//     // Additional check for "All Categories"
//     if (categorySearchId === "") {
//       showToast({
//         type: "error",
//         message: "Cannot delete players when viewing all categories. Please select a specific category first.",
//       });
//       return;
//     }

//     startOptimisticDelete(
//       selectedAuctionIds,
//       [categorySearchId]
//     );

//     setBulkDeleteConfirmOpen(false);
//   };

//   const handleSelectAllAuctionVisible = () => {
//     // If category is "All Categories", don't allow select all
//     if (categorySearchId === "") {
//       showToast({
//         type: "error",
//         message: "Cannot select multiple players when viewing all categories. Please select a specific category first.",
//       });
//       return;
//     }

//     const visibleIds = filteredAuction
//       .slice(0, visibleAuction)
//       .map((p: any) => p.playerDoc._id);

//     const allSelected = visibleIds.every((id) =>
//       selectedAuctionIds.includes(id)
//     );

//     if (allSelected) {
//       setSelectedAuctionIds((prev) =>
//         prev.filter((id) => !visibleIds.includes(id))
//       );
//     } else {
//       const newSet = new Set([...selectedAuctionIds, ...visibleIds]);
//       setSelectedAuctionIds(Array.from(newSet));
//     }
//   };

//   console.log(auctionPlayers, "sdf")

//   // const handleSelectAllAuctionVisible = () => {
//   //   const visibleIds = filteredAuction
//   //     .slice(0, visibleAuction)
//   //     .map((p: any) => p.playerDoc._id);

//   //   const allSelected = visibleIds.every((id) =>
//   //     selectedAuctionIds.includes(id)
//   //   );

//   //   if (allSelected) {
//   //     setSelectedAuctionIds((prev) =>
//   //       prev.filter((id) => !visibleIds.includes(id))
//   //     );
//   //   } else {
//   //     const newSet = new Set([...selectedAuctionIds, ...visibleIds]);
//   //     setSelectedAuctionIds(Array.from(newSet));
//   //   }
//   // };

//   const handleScrollUnassigned: React.UIEventHandler<HTMLDivElement> = (e) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
//     if (scrollHeight - scrollTop <= clientHeight + 40) {
//       setVisibleUnassigned((prev) =>
//         Math.min(prev + 20, filteredUnassigned.length)
//       );
//     }
//   };

//   const handleScrollAuction: React.UIEventHandler<HTMLDivElement> = (e) => {
//     const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
//     if (scrollHeight - scrollTop <= clientHeight + 40) {
//       setVisibleAuction((prev) =>
//         Math.min(prev + 20, filteredAuction.length)
//       );
//     }
//   };

//   const renderFilterRow = (tab: "unassigned" | "auction"): React.ReactNode => {
//     const isUnassigned = tab === "unassigned";
//     const from = isUnassigned ? fromRating : fromRatingA;
//     const to = isUnassigned ? toRating : toRatingA;
//     const type = isUnassigned ? typeFilter : typeFilterA;
//     const setFrom = isUnassigned ? setFromRating : setFromRatingA;
//     const setTo = isUnassigned ? setToRating : setToRatingA;
//     const setType = isUnassigned ? setTypeFilter : setTypeFilterA;
//     const handleSearch = isUnassigned
//       ? handleSearchUnassigned
//       : handleSearchAuction;

//     const handleReset = isUnassigned
//       ? handleResetUnassigned
//       : handleResetAuction;

//     const showReset = isUnassigned
//       ? showResetUnassigned
//       : showResetAuction;

//     const count = isUnassigned
//       ? filteredUnassigned.length
//       : filteredAuction.length;

//     return (
//       <div className="w-full">
//         {/* All filters in one line */}
//         <div className="flex flex-col lg:flex-row gap-3 items-end w-full">
//           {/* Search Bar */}
//           <div className="relative flex-1 min-w-0">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by player name..."
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* Rating From */}
//           <div className="flex flex-col w-full lg:w-auto">
//             <label className="text-xs font-semibold text-gray-600 mb-1">Rating</label>
//             <div className="flex gap-2">
//               <select
//                 value={from === "" ? "" : from}
//                 onChange={(e) => {
//                   const value = e.target.value === "" ? "" : Number(e.target.value);
//                   setFrom(value);
//                   if (value !== "" && to !== "" && to < value) {
//                     setTo("");
//                   }
//                 }}
//                 className="border rounded-lg px-2 py-2 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-20"
//               >
//                 <option value="">From</option>
//                 {ratingOptions.map((r) => (
//                   <option key={r} value={r}>{r}</option>
//                 ))}
//               </select>

//               {/* Rating To */}
//               <select
//                 value={to === "" ? "" : to}
//                 disabled={from === ""}
//                 onChange={(e) => setTo(e.target.value === "" ? "" : Number(e.target.value))}
//                 className={`border rounded-lg px-2 py-2 text-sm w-20 transition ${
//                   from === "" ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 }`}
//               >
//                 <option value="">To</option>
//                 {ratingOptions
//                   .filter((r) => from === "" || r >= from)
//                   .map((r) => (
//                     <option key={r} value={r}>{r}</option>
//                   ))}
//               </select>
//             </div>
//           </div>

//           {/* Player Type */}
//           <div className="flex flex-col w-full lg:w-auto">
//             <label className="text-xs font-semibold text-gray-600 mb-1">Type</label>
//             <select
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               className="border rounded-lg px-3 py-2 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-32"
//             >
//               <option value="">All Types</option>
//               {playerTypes.map((t) => (
//                 <option key={t}>{t}</option>
//               ))}
//             </select>
//           </div>

//           {/* Category - Only for Auction Tab */}
//           {!isUnassigned && (
//             <div className="flex flex-col w-full lg:w-auto">
//               <label className="text-xs font-semibold text-gray-600 mb-1">Category</label>
//               <select
//                 value={categorySearchId}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   const found = allCategories.find(c => c._id === value);
//                   setCategorySearchId(value);
//                   setCategorySearchName(found?.name || "");
//                 }}
//                 className="border rounded-lg px-3 py-2 text-sm bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-40"
//               >
//                 <option value="">All Categories</option>
//                 {allCategories.map(cat => (
//                   <option key={cat._id} value={cat._id}>{cat.name}</option>
//                 ))}
//               </select>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-2 w-full lg:w-auto">
//             <button
//               onClick={handleSearch}
//               className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 active:scale-[0.97] shadow transition whitespace-nowrap"
//             >
//               <Search className="w-4 h-4" />
//               Search
//             </button>
//             {showReset && (
//               <button
//                 onClick={handleReset}
//                 className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:scale-[0.97] transition whitespace-nowrap"
//               >
//                 Reset
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Results Count */}
//         <div className="text-right mt-2">
//           <span className="text-xs text-gray-600">
//             Found: <span className="text-purple-600 font-semibold">{count}</span> players
//           </span>
//         </div>
//       </div>
//     );
//   };
//   return (
//     <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//       <div className="bg-white border-b">
//         <div className="flex gap-3 px-4 py-3">
//           <button
//             onClick={() => setActiveSubTab("unassignedSelected")}
//             className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${activeSubTab === "unassignedSelected"
//               ? "bg-purple-600 text-white shadow"
//               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//           >
//             Selected (Not Assigned)
//           </button>
//           <button
//             onClick={() => setActiveSubTab("auctionPlayers")}
//             className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${activeSubTab === "auctionPlayers"
//               ? "bg-purple-600 text-white shadow"
//               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//               }`}
//           >
//             Players for Auction
//           </button>
//         </div>
//       </div>
//       <div className="p-5 space-y-5">
//         {activeSubTab === "unassignedSelected" ? (
//           <>
//             <div className="bg-white border rounded-xl p-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4 shadow-sm">
//               {renderFilterRow("unassigned")}
//               <div className="flex flex-wrap gap-2 justify-end">
//                 <button
//                   onClick={handleSelectAllVisible}
//                   className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
//                 >
//                   {filteredUnassigned
//                     .slice(0, visibleUnassigned)
//                     .every((p: any) =>
//                       selectedIds.includes(p.playerDoc._id)
//                     ) &&
//                     filteredUnassigned.slice(0, visibleUnassigned).length > 0
//                     ? "Deselect All"
//                     : "Select All (Visible)"}
//                 </button>
//                 <button
//                   disabled={selectedIds.length === 0}
//                   onClick={() => handleAssignClick(selectedIds)}
//                   className={`px-5 py-2 rounded-lg text-sm font-bold transition ${selectedIds.length > 0
//                     ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow"
//                     : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                 >
//                   Assign to Auction ({selectedIds.length})
//                 </button>
//               </div>
//             </div>

//             <div
//               className="max-h-[70vh] overflow-y-auto pt-3 pr-1"
//               onScroll={handleScrollUnassigned}
//             >
//               {filteredUnassigned.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-500 bg-white rounded-xl border">
//                   <Search className="w-8 h-8 mb-3 text-gray-400" />
//                   No players match this filter.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
//                   {filteredUnassigned
//                     .slice(0, visibleUnassigned)
//                     .map((player: any) => (
//                       <PlayerCard
//                         key={player.playerDoc._id}
//                         player={player}
//                         selected={selectedIds.includes(player.playerDoc._id)}
//                         selectable
//                         onSelect={() => {
//                           setSelectedIds((prev) =>
//                             prev.includes(player.playerDoc._id)
//                               ? prev.filter(
//                                 (id) => id !== player.playerDoc._id
//                               )
//                               : [...prev, player.playerDoc._id]
//                           );
//                         }}
//                         onViewDetails={() => {
//                           setSelectedPlayerDetails(player);
//                           setIsPlayerDetailsOpen(true);
//                         }}
//                       />
//                     ))}
//                 </div>
//               )}
//             </div>

//             {/* Unassigned Pagination Controls */}
//             {unassignedTotalPages > 1 && (
//               <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white rounded-lg border border-gray-200">
//                 <span className="text-sm text-gray-600">
//                   Page <span className="font-semibold text-purple-600">{unassignedPage}</span> of{" "}
//                   <span className="font-semibold">{unassignedTotalPages}</span> ({unassignedTotal} total)
//                 </span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => fetchUnassignedPlayers(unassignedPage - 1)}
//                     disabled={unassignedPage === 1}
//                     className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
//                       unassignedPage === 1
//                         ? "bg-gray-100 text-gray-500 cursor-not-allowed"
//                         : "bg-purple-600 text-white hover:bg-purple-700"
//                     }`}
//                   >
//                     ← Previous
//                   </button>
//                   <button
//                     onClick={() => fetchUnassignedPlayers(unassignedPage + 1)}
//                     disabled={unassignedPage === unassignedTotalPages}
//                     className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
//                       unassignedPage === unassignedTotalPages
//                         ? "bg-gray-100 text-gray-500 cursor-not-allowed"
//                         : "bg-purple-600 text-white hover:bg-purple-700"
//                     }`}
//                   >
//                     Next →
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <>
//             <div className="bg-white border rounded-xl p-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4 shadow-sm">
//               {renderFilterRow("auction")}
//               {/* Category Search */}
//               {/* <div className="flex gap-2 items-end">
//                 <div className="flex flex-col">
//                   <label className="text-xs font-semibold text-gray-600">
//                     Category
//                   </label>
//                   <select
//                     className="border rounded px-3 py-2 text-sm w-[200px]"
//                     value={categorySearchId}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       const found = allCategories.find(c => c._id === value);

//                       setCategorySearchId(value);
//                       setCategorySearchName(found?.name || "");
//                       setSelectedAuctionIds([]); // clear old selections
//                     }}
//                   >
//                     <option value="">All Categories</option>
//                     {allCategories.map(cat => (
//                       <option key={cat._id} value={cat._id}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <button
//                   onClick={() => { }}
//                   className="px-4 py-[9px] rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700"
//                 >
//                   Search
//                 </button>
//               </div> */}
//               <div className="flex flex-col items-end gap-2 text-xs text-gray-500">
//                 {/* <div className="flex flex-wrap gap-2 justify-end">
//                   <button
//                     onClick={handleSelectAllAuctionVisible}
//                     className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
//                   >
//                     {filteredAuction
//                       .slice(0, visibleAuction)
//                       .every((p: any) =>
//                         selectedAuctionIds.includes(p.playerDoc._id)
//                       ) &&
//                     filteredAuction.slice(0, visibleAuction).length > 0
//                       ? "Deselect All"
//                       : "Select All (Visible)"}
//                   </button>
//                   <button
//                     disabled={selectedAuctionIds.length === 0}
//                     onClick={() => setBulkDeleteConfirmOpen(true)}
//                     className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
//                       selectedAuctionIds.length > 0
//                         ? "bg-red-600 text-white hover:bg-red-700 shadow"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     Delete Selected ({selectedAuctionIds.length})
//                   </button>
//                 </div> */}

//                 {enableBulkMode && (
//                   <div className="flex flex-col items-end gap-2">
//                     <div className="flex flex-wrap gap-2 justify-end">
//                       <button
//                         onClick={handleSelectAllAuctionVisible}
//                         className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
//                       >
//                         {filteredAuction
//                           .slice(0, visibleAuction)
//                           .every((p: any) =>
//                             selectedAuctionIds.includes(p.playerDoc._id)
//                           ) &&
//                           filteredAuction.length > 0
//                           ? "Deselect All"
//                           : "Select All (Visible)"}
//                       </button>

//                       {/* <button
//                       disabled={selectedAuctionIds.length === 0}
//                       onClick={() => setBulkDeleteConfirmOpen(true)}
//                       className={`px-5 py-2 rounded-lg text-sm font-bold transition ${selectedAuctionIds.length > 0
//                           ? "bg-red-600 text-white hover:bg-red-700 shadow"
//                           : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         }`}
//                     >
//                       Delete Selected ({selectedAuctionIds.length})
//                     </button> */}

//                       <button
//                         disabled={selectedAuctionIds.length === 0 || categorySearchId === ""}
//                         onClick={() => setBulkDeleteConfirmOpen(true)}
//                         className={`px-5 py-2 rounded-lg text-sm font-bold transition ${selectedAuctionIds.length > 0 && categorySearchId !== ""
//                           ? "bg-red-600 text-white hover:bg-red-700 shadow"
//                           : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                           }`}
//                       >
//                         Delete Selected ({selectedAuctionIds.length})
//                       </button>
//                     </div>
//                     <div className="text-xs text-gray-600 italic">
//                       Currently viewing players in: <span className="font-semibold text-purple-600">{categorySearchName}</span>
//                     </div>
//                   </div>
//                 )}

//                 {!enableBulkMode && (
//                   <div className="flex flex-col items-end gap-2 text-xs text-gray-500">
//                     <div className="italic">
//                       Tip: Select a category and click Search to enable bulk actions
//                     </div>
//                     <div className="italic">
//                       Hover on a player to remove individually.
//                     </div>
//                   </div>
//                 )}
//                 {enableBulkMode && categorySearchId === "" && (
//                   <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-md mt-1">
//                     ⚠️ Single selection only when viewing all categories
//                   </div>
//                 )}

//                 {/* <div className="italic">
//                   Tip: hover on a player to remove individually.
//                 </div> */}
//               </div>
//             </div>

//             {/* Auction grid */}
//             <div
//               className="max-h-[70vh] overflow-y-auto pt-3 pr-1"
//               onScroll={handleScrollAuction}
//             >
//               {filteredAuction.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-500 bg-white rounded-xl border">
//                   <Search className="w-8 h-8 mb-3 text-gray-400" />
//                   No players in auction for this filter.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
//                   {filteredAuction
//                     .slice(0, visibleAuction)
//                     .map((player: any) => (
//                       <PlayerCard
//                         key={player.playerDoc._id}
//                         player={player}
//                         selectable
//                         selected={selectedAuctionIds.includes(
//                           player.playerDoc._id
//                         )}
//                         onSelect={() => handleAuctionPlayerSelect(player.playerDoc._id)}
//                         showDelete
//                         onDelete={() => setDeleteCandidate(player)}
//                         onViewDetails={() => {
//                           setSelectedPlayerDetails(player);
//                           setIsPlayerDetailsOpen(true);
//                         }}
//                       />
//                     ))}
//                 </div>
//               )}
//             </div>

//             {/* Auction Pagination Controls */}
//             {auctionTotalPages > 1 && (
//               <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white rounded-lg border border-gray-200">
//                 <span className="text-sm text-gray-600">
//                   Page <span className="font-semibold text-purple-600">{auctionPage}</span> of{" "}
//                   <span className="font-semibold">{auctionTotalPages}</span> ({auctionTotal} total)
//                 </span>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => fetchAssignedPlayers(auctionPage - 1)}
//                     disabled={auctionPage === 1}
//                     className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
//                       auctionPage === 1
//                         ? "bg-gray-100 text-gray-500 cursor-not-allowed"
//                         : "bg-purple-600 text-white hover:bg-purple-700"
//                     }`}
//                   >
//                     ← Previous
//                   </button>
//                   <button
//                     onClick={() => fetchAssignedPlayers(auctionPage + 1)}
//                     disabled={auctionPage === auctionTotalPages}
//                     className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
//                       auctionPage === auctionTotalPages
//                         ? "bg-gray-100 text-gray-500 cursor-not-allowed"
//                         : "bg-purple-600 text-white hover:bg-purple-700"
//                     }`}
//                   >
//                     Next →
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Assign modal */}
//       <AssignCategoryModal
//         isOpen={assignModalOpen}
//         count={selectedIds.length}
//         onClose={() => setAssignModalOpen(false)}
//         onSubmit={handleAssignSubmit}
//         auctionId={auctionId}
//         selectedIds={selectedIds}
//         fetchUnassignedPlayers={fetchUnassignedPlayers}
//         fetchAssignedPlayers={fetchAssignedPlayers}
//         resetSelectedIds={() => setSelectedIds([])}
//       />

//       {/* Single delete confirm modal */}
//       {deleteCandidate && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Remove from Auction?
//               </h2>
//               <button
//                 onClick={() => setDeleteCandidate(null)}
//                 className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
//               >
//                 <X className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>
//             <p className="text-sm text-gray-600 leading-relaxed">
//               <span className="font-semibold">
//                 {deleteCandidate?.playerDoc?.name}
//               </span>{" "}
//               will be removed from{" "}
//               <span className="font-semibold text-emerald-600">
//                 Players for Auction
//               </span>{" "}
//               and moved back to{" "}
//               <span className="font-semibold text-purple-600">
//                 Selected (Not Assigned)
//               </span>
//               .
//             </p>
//             <div className="flex justify-end gap-2 pt-3">
//               <button
//                 onClick={() => setDeleteCandidate(null)}
//                 className="px-4 py-2 text-sm rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
//                 className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Bulk delete confirm modal */}
//       {bulkDeleteConfirmOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Remove {selectedAuctionIds.length} players from Auction?
//             </h2>
//             <p className="text-sm text-gray-600">
//               They will be moved back to{" "}
//               <span className="font-semibold text-purple-600">
//                 Selected (Not Assigned)
//               </span>
//               . You can undo for 5 seconds after removing.
//             </p>
//             <div className="flex justify-end gap-2 pt-3">
//               <button
//                 onClick={() => setBulkDeleteConfirmOpen(false)}
//                 className="px-4 py-2 text-sm rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleBulkDeleteConfirm}
//                 className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
//               >
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast */}
//       {toast && (
//         <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">

//           <span>
//             {toast.message.replace(/\(\d+s\)/, "")}
//             {undoTimer !== null && ` (${undoTimer}s)`}
//           </span>

//           {toast.actionLabel && (
//             <button
//               onClick={toast.onAction}
//               className="ml-3 underline text-green-300"
//             >
//               {toast.actionLabel}
//             </button>
//           )}
//         </div>
//       )}

//       {/* Player Details Popup */}
//       <PlayerDetailsPopup
//         isOpen={isPlayerDetailsOpen}
//         onClose={() => {
//           setIsPlayerDetailsOpen(false);
//           setSelectedPlayerDetails(null);
//         }}
//         player={selectedPlayerDetails}
//       />

//     </div>
//   );
// };

// export default SelectedAuctionManager;

import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import PlayerCard from "./SelectedPlayerCard";
import AssignCategoryModal from "./AssignCategoryModal";
import PlayerDetailsPopup from "./PlayerDetailsPopup";
import { ratingOptions, playerTypes } from "../mock/mockPlayers";
import axios from "axios";

const SelectedAuctionManager = ({ auctionId }) => {
  const [selectPlayersList, SetSelectPlayersList] = useState([]);
  const [auctionPlayers, setAuctionPlayers] = useState([]);
  const [showResetUnassigned, setShowResetUnassigned] = useState(false);
  const [showResetAuction, setShowResetAuction] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("unassignedSelected");

  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedAuctionIds, setSelectedAuctionIds] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);

  const [fromRating, setFromRating] = useState("");
  const [toRating, setToRating] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ from: "", to: "", type: "" });

  const [fromRatingA, setFromRatingA] = useState("");
  const [toRatingA, setToRatingA] = useState("");
  const [typeFilterA, setTypeFilterA] = useState("");
  const [appliedFiltersA, setAppliedFiltersA] = useState({ from: "", to: "", type: "" });

  const [visibleUnassigned, setVisibleUnassigned] = useState(20);
  const [visibleAuction, setVisibleAuction] = useState(20);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  const [toast, setToast] = useState(null);

  const [categorySearchId, setCategorySearchId] = useState("");
  const [categorySearchName, setCategorySearchName] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);

  const [undoTimer, setUndoTimer] = useState(null);
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState(null);
  const [isPlayerDetailsOpen, setIsPlayerDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [unassignedPage, setUnassignedPage] = useState(1);
  const [auctionPage, setAuctionPage] = useState(1);
  const [unassignedTotalPages, setUnassignedTotalPages] = useState(1);
  const [auctionTotalPages, setAuctionTotalPages] = useState(1);
  const [unassignedTotal, setUnassignedTotal] = useState(0);
  const [auctionTotal, setAuctionTotal] = useState(0);

  const enableBulkMode = Boolean(categorySearchId);

  /* ===================== CATEGORIES ===================== */
  const allCategories = useMemo(() => {
    const map = new Map();
    auctionPlayers.forEach(p => {
      p.assignedCategories?.forEach(c => {
        if (!map.has(c._id)) map.set(c._id, { _id: c._id, name: c.name });
      });
    });
    return Array.from(map.values());
  }, [auctionPlayers]);

  /* ===================== TOAST ===================== */
  const showToast = (data) => {
    setToast(data);
    if (data && !data.actionLabel) {
      setTimeout(() => setToast(null), 3000);
    }
  };

  /* ===================== API ===================== */
  const fetchUnassignedPlayers = async (page = 1) => {
    try {
      const res = await axios.get(
        `/webSiteApi/auction/getSelectPlayers/${auctionId}?categoryFilter=notassignincategory&page=${page}&limit=8`
      );
      const { data, page: cp, pages, total } = res?.data?.data || {};
      SetSelectPlayersList(data || []);
      setUnassignedPage(cp || 1);
      setUnassignedTotalPages(pages || 1);
      setUnassignedTotal(total || 0);
    } catch {
      showToast({ type: "error", message: "Failed to load unassigned players." });
    }
  };

  const fetchAssignedPlayers = async (page = 1) => {
    try {
      const res = await axios.get(
        `/webSiteApi/auction/getSelectPlayers/${auctionId}?categoryFilter=assignincategory&page=${page}&limit=8`
      );
      const { data, page: cp, pages, total } = res?.data?.data || {};
      setAuctionPlayers(data || []);
      setAuctionPage(cp || 1);
      setAuctionTotalPages(pages || 1);
      setAuctionTotal(total || 0);
    } catch {
      showToast({ type: "error", message: "Failed to load auction players." });
    }
  };

  useEffect(() => {
    if (!auctionId) return;
    fetchUnassignedPlayers();
    fetchAssignedPlayers();
  }, [auctionId]);

  /* ===================== FILTERING ===================== */
  const filteredUnassigned = useMemo(() => {
    const { from, to, type } = appliedFilters;
    return selectPlayersList.filter(p => {
      const rating = p.bestAvgRating ?? 0;
      const role = p.playerDoc?.playerRole;
      const name = p.playerDoc?.name?.toLowerCase() || "";

      if (searchTerm && !name.includes(searchTerm.toLowerCase())) return false;
      if (type && role !== type) return false;
      if (from !== "" && to !== "" && (rating < from || rating > to)) return false;

      return true;
    });
  }, [selectPlayersList, appliedFilters, searchTerm]);

  const filteredAuction = useMemo(() => {
    const { from, to, type } = appliedFiltersA;
    return auctionPlayers.filter(p => {
      const rating = p.bestAvgRating ?? 0;
      const role = p.playerDoc?.playerRole;
      const name = p.playerDoc?.name?.toLowerCase() || "";

      if (searchTerm && !name.includes(searchTerm.toLowerCase())) return false;
      if (type && role !== type) return false;
      if (from !== "" && to !== "" && (rating < from || rating > to)) return false;

      if (categorySearchId && showBulkActions) {
        return p.assignedCategories?.some(c => c._id === categorySearchId);
      }
      return true;
    });
  }, [auctionPlayers, appliedFiltersA, categorySearchId, showBulkActions, searchTerm]);

  /* ===================== SCROLL ===================== */
  const handleScrollUnassigned = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 40) {
      setVisibleUnassigned(v => Math.min(v + 20, filteredUnassigned.length));
    }
  };

  const handleScrollAuction = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 40) {
      setVisibleAuction(v => Math.min(v + 20, filteredAuction.length));
    }
  };

  /* ===================== JSX ===================== */
  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* --- HEADER TABS --- */}
      <div className="bg-white border-b px-4 py-3 flex gap-3">
        <button
          onClick={() => setActiveSubTab("unassignedSelected")}
          className={`px-5 py-2 rounded-full text-sm font-semibold ${
            activeSubTab === "unassignedSelected"
              ? "bg-purple-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Selected (Not Assigned)
        </button>
        <button
          onClick={() => setActiveSubTab("auctionPlayers")}
          className={`px-5 py-2 rounded-full text-sm font-semibold ${
            activeSubTab === "auctionPlayers"
              ? "bg-purple-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Players for Auction
        </button>
      </div>

      {/* --- CONTENT --- */}
      <div className="p-5 space-y-5">
        {activeSubTab === "unassignedSelected" ? (
          <div
            className="max-h-[70vh] overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4"
            onScroll={handleScrollUnassigned}
          >
            {filteredUnassigned.slice(0, visibleUnassigned).map(player => (
              <PlayerCard
                key={player.playerDoc._id}
                player={player}
                selectable
                selected={selectedIds.includes(player.playerDoc._id)}
                onSelect={() =>
                  setSelectedIds(prev =>
                    prev.includes(player.playerDoc._id)
                      ? prev.filter(id => id !== player.playerDoc._id)
                      : [...prev, player.playerDoc._id]
                  )
                }
                onViewDetails={() => {
                  setSelectedPlayerDetails(player);
                  setIsPlayerDetailsOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="max-h-[70vh] overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4"
            onScroll={handleScrollAuction}
          >
            {filteredAuction.slice(0, visibleAuction).map(player => (
              <PlayerCard
                key={player.playerDoc._id}
                player={player}
                selectable
                selected={selectedAuctionIds.includes(player.playerDoc._id)}
                onSelect={() =>
                  setSelectedAuctionIds(prev =>
                    prev.includes(player.playerDoc._id)
                      ? prev.filter(id => id !== player.playerDoc._id)
                      : [...prev, player.playerDoc._id]
                  )
                }
                showDelete
                onDelete={() => setDeleteCandidate(player)}
                onViewDetails={() => {
                  setSelectedPlayerDetails(player);
                  setIsPlayerDetailsOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* PLAYER DETAILS */}
      <PlayerDetailsPopup
        isOpen={isPlayerDetailsOpen}
        onClose={() => {
          setIsPlayerDetailsOpen(false);
          setSelectedPlayerDetails(null);
        }}
        player={selectedPlayerDetails}
      />

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex gap-3">
          <span>
            {toast.message}
            {undoTimer !== null && ` (${undoTimer}s)`}
          </span>
          {toast.actionLabel && (
            <button onClick={toast.onAction} className="underline text-green-300">
              {toast.actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectedAuctionManager;
