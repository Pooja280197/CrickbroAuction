import React, { useEffect, useMemo, useState } from "react";
import { Search, X, Filter, Users, Trash2, CheckSquare, Square } from "lucide-react";
import PlayerCard from "./SelectedPlayerCard";
import AssignCategoryModal from "./AssignCategoryModal";
import PlayerDetailsPopup from "./PlayerDetailsPopup";
import { ratingOptions } from "../mock/mockPlayers";
import axios from "axios";
import { useDebounce } from "../../../components/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssignedinCategory,
  getAssignedPlayers,
  getSelectedPlayers,
  getUnassignedinCategory,
} from "../../../redux/actions";
import { a } from "framer-motion/client";

const SelectedAuctionManager = ({ auctionId, auctionTypeTrial }) => {
  const dispatch = useDispatch();
  const isTrialType = auctionTypeTrial;
  const [showResetUnassigned, setShowResetUnassigned] = useState(false);
  const [showResetAuction, setShowResetAuction] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("unassignedSelected");
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedAuctionIds, setSelectedAuctionIds] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [fromRating, setFromRating] = useState("");
  const [toRating, setToRating] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [slotFilter, setSlotFilter] = useState("");
  const [slotSessionFilter, setSlotSessionFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    from: "",
    to: "",
    type: "",
    slot: "",
    slotSession: "",
  });

  const [fromRatingA, setFromRatingA] = useState("");
  const [toRatingA, setToRatingA] = useState("");
  const [typeFilterA, setTypeFilterA] = useState("");
  const [slotFilterA, setSlotFilterA] = useState("");
  const [slotSessionFilterA, setSlotSessionFilterA] = useState("");
  const [appliedFiltersA, setAppliedFiltersA] = useState({
    from: "",
    to: "",
    type: "",
    slot: "",
    slotSession: "",
  });

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
  const [searchUnassign, setSearchUnassign] = useState("");
  const [searchAssign, setSearchAssign] = useState("");

  // const [auctionTotalPages, setAuctionTotalPages] = useState(1);
  // const [auctionTotal, setAuctionTotal] = useState(0);
  const [playerTypes, setPlayerTypes] = useState([
    { label: "Batsman", value: "batsman", color: "text-cyan-400" },
    { label: "Bowler", value: "bowler", color: "text-emerald-400" },
    { label: "All-rounder", value: "allrounder", color: "text-amber-400" },
    { label: "Wicketkeeper", value: "wicketkeeper", color: "text-pink-400" },
  ]);

  const [slotDetail, setSlotDetail] = useState([]);
  const [selectedSlotSessions, setSelectedSlotSessions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const debouncedUnassignPlayer = useDebounce(searchUnassign, 400);
  const debouncedAssignPlayer = useDebounce(searchAssign, 200);

  const enableBulkMode = Boolean(categorySearchId);

  const unassignedPlayers = useSelector((state) =>
    isTrialType ? state?.data?.selectedPlayers : state?.data?.unassignedPlayers
  );
  const selectPlayersList = unassignedPlayers?.list || [];
  const unassignedTotalPages = unassignedPlayers?.pages || 1;
  const unassignedTotal = unassignedPlayers?.total || 0;
  const unassignedPage = unassignedPlayers?.page;

  const assignedPlayers = useSelector((state) =>
    isTrialType ? state?.data?.assignedinCategory : state?.data?.assignedPlayers
  );

  const auctionPlayers = assignedPlayers?.list || [];
  const auctionPage=assignedPlayers?.page
  const auctionTotalPages = assignedPlayers?.pages || 1;
  const auctionTotal=assignedPlayers?.total || 0;



  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `/webSiteApi/auctionCategory/listCategories?auctionId=${auctionId}`
        );

        const categoryData = res.data?.data?.data || res.data?.data || res.data;
        if (Array.isArray(categoryData)) {
          setAllCategories(categoryData);
        }
      } catch (error) {
        console.error("❌ Failed to fetch categories:", error);
      }
    };

    if (auctionId) {
      fetchCategories();
    }
  }, [auctionId]);

  const fetchSlotList = async () => {
    try {
      const res = await axios.get(
        `/webSiteApi/auctionSlot/getListAuctionSlots?auctionId=${auctionId}`
      );
      setSlotDetail(res?.data?.data?.data || []);
      return res?.data?.data?.data || [];
    } catch (error) {
      console.log("Error fetching slots:", error);
      showToast({
        type: "error",
        message: "Failed to fetch slots",
      });
      return [];
    }
  };

  const fetchSessionsForSlot = (slotId) => {
    const slot = slotDetail.find((s) => s._id === slotId);
    if (slot && slot.sessions) {
      setSelectedSlotSessions(slot.sessions);
    } else {
      setSelectedSlotSessions([]);
    }
  };

  const showToast = (data) => {
    setToast(data);
    if (data && !data.actionLabel) {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const fetchUnassignedPlayers = (page = 1) => {
    dispatch(
      isTrialType
        ? getSelectedPlayers({
            auctionId,
            page,
            itemsPerPage: 8,
            debouncedUnassignPlayer,
            typeFilter,
            fromRating,
            toRating,
            slotFilter,
            slotSessionFilter,
          })
        : getUnassignedinCategory({
            auctionId,
            page,
            itemsPerPage: 8,
            debouncedUnassignPlayer,
            typeFilter,
          })
    );
  };

  const fetchAssignedPlayers = (page = 1) => {
    dispatch(
      isTrialType
        ? getAssignedinCategory({
            auctionId,
            page,
            itemsPerPage: 8,
            debouncedAssignPlayer,
            typeFilter: typeFilterA,
            fromRating: fromRatingA,
            toRating: toRatingA,
            categorySearchId,
            slotFilter: slotFilterA,
            slotSessionFilter: slotSessionFilterA,
          })
        : getAssignedPlayers({
            auctionId,
            page,
            itemsPerPage: 8,
            debouncedAssignPlayer,
            typeFilter: typeFilterA,
            fromRating: fromRatingA,
            toRating: toRatingA,
            categorySearchId,
            slotFilter: slotFilterA,
            slotSessionFilter: slotSessionFilterA,
          })
    );
  };

  useEffect(() => {
    if (!auctionId) return;
    fetchSlotList();

    if (activeSubTab === "unassignedSelected") {
      fetchUnassignedPlayers(1);
    } else {
      fetchAssignedPlayers(1);
    }
  }, [auctionId, debouncedUnassignPlayer, debouncedAssignPlayer, activeSubTab]);

  useEffect(() => {
    if (!auctionId) return;

    if (activeSubTab === "unassignedSelected") {
      fetchUnassignedPlayers(1);
    } else {
      fetchAssignedPlayers(1);
    }
  }, [activeSubTab]);

  useEffect(() => {
    if (activeSubTab === "unassignedSelected") {
      setSlotSessionFilter("");
      if (slotFilter) {
        fetchSessionsForSlot(slotFilter);
      } else {
        setSelectedSlotSessions([]);
      }
    } else {
      setSlotSessionFilterA("");
      if (slotFilterA) {
        fetchSessionsForSlot(slotFilterA);
      } else {
        setSelectedSlotSessions([]);
      }
    }
  }, [slotFilter, slotFilterA, activeSubTab]);

  const handleSearchUnassigned = async () => {
    setAppliedFilters({
      from: fromRating,
      to: toRating,
      type: typeFilter,
      slot: slotFilter,
      slotSession: slotSessionFilter,
    });
    setShowResetUnassigned(
      fromRating !== "" ||
        toRating !== "" ||
        typeFilter !== "" ||
        debouncedUnassignPlayer !== "" ||
        slotFilter !== "" ||
        slotSessionFilter !== ""
    );
    fetchUnassignedPlayers(1);
  };

  const handleSearchAuction = async () => {
    setAppliedFiltersA({
      from: fromRatingA,
      to: toRatingA,
      type: typeFilterA,
      slot: slotFilterA,
      slotSession: slotSessionFilterA,
    });
    setShowResetAuction(
      fromRatingA !== "" ||
        toRatingA !== "" ||
        typeFilterA !== "" ||
        debouncedAssignPlayer !== "" ||
        slotFilterA !== "" ||
        slotSessionFilterA !== "" ||
        categorySearchId !== ""
    );
  
    fetchAssignedPlayers(1);
    setShowBulkActions(!!categorySearchId);
  };

  const handleResetUnassigned = () => {
    setFromRating("");
    setToRating("");
    setTypeFilter("");
    setSlotFilter("");
    setSlotSessionFilter("");
    setSearchUnassign("");
    setAppliedFilters({
      from: "",
      to: "",
      type: "",
      slot: "",
      slotSession: "",
    });
    setShowResetUnassigned(false);
    setSelectedIds([]);
    setSelectedSlotSessions([]);
    
    const params = new URLSearchParams({
      categoryFilter: "notassignincategory",
      page: "1",
      limit: "8",
    });

    axios
      .get(
        `/webSiteApi/auction/getSelectPlayers/${auctionId}?${params.toString()}`
      )
      .catch((err) => {
        console.error("Error resetting unassigned", err);
        showToast({
          type: "error",
          message: "Failed to reset filters.",
        });
      });
  };

  const handleResetAuction = () => {
    setFromRatingA("");
    setToRatingA("");
    setTypeFilterA("");
    setSlotFilterA("");
    setSlotSessionFilterA("");
    setSearchAssign("");
    setCategorySearchId("");
    setCategorySearchName("");
    setAppliedFiltersA({
      from: "",
      to: "",
      type: "",
      slot: "",
      slotSession: "",
    });
    setShowResetAuction(false);
    setShowBulkActions(false);
    setSelectedAuctionIds([]);
  
    fetchAssignedPlayers(1);
  };

  useEffect(() => {
    if (activeSubTab === "auctionPlayers" && categorySearchId) {
      fetchAssignedPlayers(1);
      setShowBulkActions(true);
    }
  }, [categorySearchId]);

  const handleAssignClick = (ids) => {
    if (!ids.length) return;
    setAssignModalOpen(true);
  };

  const handleAuctionPlayerSelect = (playerId) => {
    if (!enableBulkMode) return;

    if (categorySearchId === "") {
      setSelectedAuctionIds((prev) =>
        prev.includes(playerId) ? [] : [playerId]
      );
    } else {
      setSelectedAuctionIds((prev) =>
        prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId]
      );
    }

    const selectedPlayer = auctionPlayers.find(
      (p) => p.player._id === playerId
    );
    if (selectedPlayer) {
      setSelectedCategoryId(selectedPlayer?.category?._id || []);
    }
  };

  useEffect(() => {
    if (activeSubTab === "unassignedSelected") {
      fetchUnassignedPlayers(1);
    }
  }, [debouncedUnassignPlayer]);

  useEffect(() => {
    if (activeSubTab === "auctionPlayers") {
      fetchAssignedPlayers(1);
    }
  }, [debouncedAssignPlayer]);

  const startOptimisticDelete = (ids, cId) => {
    const playersToRemove = auctionPlayers.filter((p) =>
      ids.includes(p.player._id)
    );

    let timeLeft = 5;
    setUndoTimer(timeLeft);

    const intervalId = setInterval(() => {
      timeLeft -= 1;
      setUndoTimer(timeLeft);

      if (timeLeft === 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    const timeoutId = setTimeout(async () => {
      clearInterval(intervalId);
      setUndoTimer(null);

      try {
        await axios.post(
          `/webSiteApi/auctionCategory/removePlayersFromCategory/${cId}`,
          { auctionId, playerIds: ids }
        );
        await fetchAssignedPlayers(auctionPage);
        await fetchUnassignedPlayers(unassignedPage);

        setSelectedAuctionIds([]);

        showToast({
          type: "success",
          message: `${ids.length} player(s) permanently removed.`,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setPendingDelete(null);
      }
    }, 5000);

    setPendingDelete({
      ids,
      players: playersToRemove,
      timeoutId,
    });

    showToast({
      type: "success",
      message: `${ids.length} player(s) removed. Undo? (${timeLeft}s)`,
      actionLabel: "Undo",
      onAction: () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
        setUndoTimer(null);
        setPendingDelete(null);
        setSelectedAuctionIds([]);
        fetchAssignedPlayers(auctionPage);

        showToast({
          type: "success",
          message: "Undo successful",
        });
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    const id = deleteCandidate.player._id;
    const cId = deleteCandidate?.category?._id;
    startOptimisticDelete([id], cId);
    setDeleteCandidate(null);
  };

  const handleBulkDeleteConfirm = () => {
    if (!selectedAuctionIds.length || !categorySearchId) return;

    if (categorySearchId === "") {
      showToast({
        type: "error",
        message:
          "Cannot delete players when viewing all categories. Please select a specific category first.",
      });
      return;
    }

    startOptimisticDelete(selectedAuctionIds, categorySearchId);
    setBulkDeleteConfirmOpen(false);
  };

  const handleSelectAllVisible = () => {
    const currentPageIds = selectPlayersList.map((p) => p.player._id);
    const allSelected = currentPageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      const newSet = new Set([...selectedIds, ...currentPageIds]);
      setSelectedIds(Array.from(newSet));
    }
  };

  const handleSelectAllAuctionVisible = () => {
    if (!categorySearchId || categorySearchId === "") {
      showToast({
        type: "error",
        message:
          "Cannot select multiple players when viewing all categories. Please select a specific category first.",
      });
      return;
    }

    const currentPageIds = auctionPlayers.map((p) => p.player._id);
    const allSelected = currentPageIds.every((id) =>
      selectedAuctionIds.includes(id)
    );

    if (allSelected) {
      setSelectedAuctionIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      const newSet = new Set([...selectedAuctionIds, ...currentPageIds]);
      setSelectedAuctionIds(Array.from(newSet));
    }
  };

  const renderFilterRow = (tab = "unassigned") => {
    const isUnassigned = tab === "unassigned";
    const from = isUnassigned ? fromRating : fromRatingA;
    const to = isUnassigned ? toRating : toRatingA;
    const type = isUnassigned ? typeFilter : typeFilterA;
    const slot = isUnassigned ? slotFilter : slotFilterA;
    const slotSession = isUnassigned ? slotSessionFilter : slotSessionFilterA;
    const setFrom = isUnassigned ? setFromRating : setFromRatingA;
    const setTo = isUnassigned ? setToRating : setToRatingA;
    const setType = isUnassigned ? setTypeFilter : setTypeFilterA;
    const setSlot = isUnassigned ? setSlotFilter : setSlotFilterA;
    const setSlotSession = isUnassigned
      ? setSlotSessionFilter
      : setSlotSessionFilter;
    const handleSearch = isUnassigned
      ? handleSearchUnassigned
      : handleSearchAuction;
    const handleReset = isUnassigned
      ? handleResetUnassigned
      : handleResetAuction;

    const showReset = isUnassigned
      ? showResetUnassigned ||
        searchUnassign !== "" ||
        slotFilter !== "" ||
        slotSessionFilter !== ""
      : showResetAuction ||
        searchAssign !== "" ||
        categorySearchId !== "" ||
        slotFilterA !== "" ||
        slotSessionFilterA !== "";

    const count = isUnassigned ? unassignedTotal : auctionTotal;

    return (
      <div className="w-full space-y-4">
        {/* Top row: Search + Filters button */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by player name or batch ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
              value={isUnassigned ? searchUnassign : searchAssign}
              onChange={(e) =>
                isUnassigned
                  ? setSearchUnassign(e.target.value)
                  : setSearchAssign(e.target.value)
              }
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filters</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {/* Rating filters */}
          {isTrialType && (
            <>
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-400 mb-1.5">
                  Rating From
                </label>
                <select
                  value={from === "" ? "" : from}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Number(e.target.value);
                    setFrom(value);
                    if (value !== "" && to !== "" && to < value) {
                      setTo("");
                    }
                  }}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="">Select rating</option>
                  {ratingOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-400 mb-1.5">
                  Rating To
                </label>
                <select
                  value={to === "" ? "" : to}
                  disabled={from === ""}
                  onChange={(e) =>
                    setTo(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className={`bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${
                    from === "" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">Select rating</option>
                  {ratingOptions
                    .filter((r) => from === "" || r >= from)
                    .map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {/* Player Type */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-400 mb-1.5">
              Player Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">All Types</option>
              {playerTypes.map((t) => (
                <option value={t.value} key={t.label} className={t.color}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Slot filter */}
          {isUnassigned && isTrialType && (
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-400 mb-1.5">
                Slot
              </label>
              <select
                value={slot}
                onChange={(e) => {
                  const value = e.target.value;
                  setSlot(value);
                  if (value) {
                    fetchSessionsForSlot(value);
                  } else {
                    setSelectedSlotSessions([]);
                    setSlotSession("");
                  }
                }}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="">All Slots</option>
                {slotDetail.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.slotName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Session Filter */}
          {slot && selectedSlotSessions.length > 0 && (
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-400 mb-1.5">
                Session
              </label>
              <select
                value={slotSession}
                onChange={(e) => setSlotSession(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="">All Sessions</option>
                {selectedSlotSessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {session.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category filter - Only for Auction Tab */}
          {!isUnassigned && (
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-400 mb-1.5">
                Category
              </label>
              <select
                value={categorySearchId}
                onChange={(e) => {
                  const value = e.target.value;
                  const found = allCategories.find((c) => c._id === value);
                  setCategorySearchId(value);
                  setCategorySearchName(found?.name || "");
                }}
                className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="">All Categories</option>
                {allCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action buttons and results */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:from-cyan-600 hover:to-blue-700 active:scale-[0.98] shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Search className="w-4 h-4" />
              Apply Filters
            </button>
            
            {showReset && (
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-gray-600 text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:border-gray-500 active:scale-[0.98] transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              Found:{" "}
              <span className="font-semibold text-cyan-400">{count}</span> players
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-black border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex gap-3 px-6 py-4">
          <button
            onClick={() => setActiveSubTab("unassignedSelected")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${
              activeSubTab === "unassignedSelected"
                ? "bg-gradient-to-r from-cyan-900/30 to-blue-900/30 text-cyan-300 border border-cyan-800/50 shadow-lg shadow-cyan-900/20"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-700"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeSubTab === "unassignedSelected" ? "bg-cyan-400" : "bg-gray-600"}`} />
            {isTrialType ? "Selected (Not Assigned)" : "Assign to Category"}
            {selectedIds.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-cyan-900/50 text-cyan-300 border border-cyan-700">
                {selectedIds.length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveSubTab("auctionPlayers")}
            className={`px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition-all ${
              activeSubTab === "auctionPlayers"
                ? "bg-gradient-to-r from-emerald-900/30 to-green-900/30 text-emerald-300 border border-emerald-800/50 shadow-lg shadow-emerald-900/20"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300 border border-gray-700"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeSubTab === "auctionPlayers" ? "bg-emerald-400" : "bg-gray-600"}`} />
            Players for Auction
            {selectedAuctionIds.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700">
                {selectedAuctionIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-3">
        {activeSubTab === "unassignedSelected" ? (
          <>
            {/* Unassigned Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 space-y-3 backdrop-blur-sm">
              {renderFilterRow("unassigned")}
              
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSelectAllVisible}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
                  >
                    {selectPlayersList.every((p) =>
                      selectedIds.includes(p.player?._id)
                    ) && selectPlayersList.length > 0 ? (
                      <>
                        <CheckSquare className="h-4 w-4" />
                        Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="h-4 w-4" />
                        Select All (Visible)
                      </>
                    )}
                  </button>
                  
                  <span className="text-sm text-gray-500">
                    {selectedIds.length} selected
                  </span>
                </div>

                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => handleAssignClick(selectedIds)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedIds.length > 0
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/20"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Assign to Auction ({selectedIds.length})
                </button>
              </div>
            </div>

            {/* Players Grid */}
            <div className="max-h-[65vh] overflow-y-auto pt-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {selectPlayersList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400 rounded-2xl border-2 border-dashed border-gray-800 bg-gray-900/30">
                  <Search className="w-12 h-12 mb-4 text-gray-600" />
                  <p className="text-lg font-medium text-gray-500 mb-1">No players found</p>
                  <p className="text-gray-600">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {selectPlayersList.map((player) => (
                    <PlayerCard
                      key={player?.player?._id}
                      player={player}
                      selected={selectedIds.includes(player?.player?._id)}
                      selectable
                      onSelect={() => {
                        setSelectedIds((prev) =>
                          prev.includes(player.player._id)
                            ? prev.filter((id) => id !== player.player._id)
                            : [...prev, player.player._id]
                        );
                      }}
                      isTrialType={isTrialType}
                      onViewDetails={() => {
                        setSelectedPlayerDetails(player);
                        setIsPlayerDetailsOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {unassignedTotalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Page{" "}
                    <span className="font-semibold text-cyan-400">
                      {unassignedPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">{unassignedTotalPages}</span>
                  </span>
                  <span className="text-xs text-gray-600 px-2 py-1 bg-gray-800 rounded">
                    {unassignedTotal} total
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchUnassignedPlayers(unassignedPage - 1)}
                    disabled={unassignedPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      unassignedPage === 1
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => fetchUnassignedPlayers(unassignedPage + 1)}
                    disabled={unassignedPage === unassignedTotalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      unassignedPage === unassignedTotalPages
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Auction Players Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 space-y-3 backdrop-blur-sm">
              {renderFilterRow("auction")}
              
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  {enableBulkMode && (
                    <>
                      <button
                        onClick={handleSelectAllAuctionVisible}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
                      >
                        {auctionPlayers.every((p) =>
                          selectedAuctionIds.includes(p.player._id)
                        ) && auctionPlayers.length > 0 ? (
                          <>
                            <CheckSquare className="h-4 w-4" />
                            Deselect All
                          </>
                        ) : (
                          <>
                            <Square className="h-4 w-4" />
                            Select All (Visible)
                          </>
                        )}
                      </button>
                      
                      <button
                        disabled={
                          selectedAuctionIds.length === 0 ||
                          categorySearchId === ""
                        }
                        onClick={() => setBulkDeleteConfirmOpen(true)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                          selectedAuctionIds.length > 0 &&
                          categorySearchId !== ""
                            ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/20"
                            : "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                        }`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected ({selectedAuctionIds.length})
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {categorySearchName && (
                    <div className="text-sm text-gray-400">
                      Viewing:{" "}
                      <span className="font-semibold text-emerald-400">
                        {categorySearchName}
                      </span>
                    </div>
                  )}
                  
                  {!enableBulkMode && (
                    <div className="text-xs text-amber-400 bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-800/30">
                      💡 Select a category to enable bulk actions
                    </div>
                  )}
                  
                  {enableBulkMode && categorySearchId === "" && (
                    <div className="text-xs text-yellow-400 bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-800/30">
                      ⚠️ Single selection only in "All Categories"
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Auction Players Grid */}
            <div className="max-h-[65vh] overflow-y-auto pt-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {auctionPlayers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-400 rounded-2xl border-2 border-dashed border-gray-800 bg-gray-900/30">
                  <Users className="w-12 h-12 mb-4 text-gray-600" />
                  <p className="text-lg font-medium text-gray-500 mb-1">No auction players</p>
                  <p className="text-gray-600">Select a category or adjust filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {auctionPlayers.map((player) => (
                    <PlayerCard
                      key={player.player._id}
                      player={player}
                      selectable
                      selected={selectedAuctionIds.includes(player.player._id)}
                      onSelect={() => handleAuctionPlayerSelect(player.player._id)}
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

            {/* Pagination */}
            {auctionTotalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Page{" "}
                    <span className="font-semibold text-emerald-400">
                      {auctionPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">{auctionTotalPages}</span>
                  </span>
                  <span className="text-xs text-gray-600 px-2 py-1 bg-gray-800 rounded">
                    {auctionTotal} total
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchAssignedPlayers(auctionPage - 1)}
                    disabled={auctionPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      auctionPage === 1
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => fetchAssignedPlayers(auctionPage + 1)}
                    disabled={auctionPage === auctionTotalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      auctionPage === auctionTotalPages
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals and Toasts */}
      <AssignCategoryModal
        isOpen={assignModalOpen}
        count={selectedIds.length}
        onClose={() => setAssignModalOpen(false)}
        auctionId={auctionId}
        selectedIds={selectedIds}
        fetchUnassignedPlayers={fetchUnassignedPlayers}
        fetchAssignedPlayers={fetchAssignedPlayers}
        resetSelectedIds={() => setSelectedIds([])}
      />

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4 w-full max-w-md space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Remove Player
              </h2>
              <button
                onClick={() => setDeleteCandidate(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-300 leading-relaxed">
                Remove <span className="font-semibold text-white">{deleteCandidate?.player?.name}</span> from{" "}
                <span className="font-semibold text-emerald-400">Auction Players</span>?
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Player will be moved back to <span className="text-cyan-400">Selected (Not Assigned)</span>
              </p>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-red-600 to-pink-700 text-white hover:from-red-700 hover:to-pink-800 shadow-lg shadow-red-500/20 transition-all"
              >
                Remove Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Delete Modal */}
      {bulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-5">
            <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Remove {selectedAuctionIds.length} Players
            </h2>
            
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-sm text-gray-300">
                Are you sure you want to remove <span className="font-bold text-white">{selectedAuctionIds.length}</span> players from auction?
              </p>
              <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                ⚡ You can undo this action for 5 seconds
              </p>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setBulkDeleteConfirmOpen(false)}
                className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-red-600 to-pink-700 text-white hover:from-red-700 hover:to-pink-800 shadow-lg shadow-red-500/20 transition-all"
              >
                Remove All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border ${
          toast.type === 'error' 
            ? 'bg-red-900/20 border-red-800 text-red-300' 
            : 'bg-emerald-900/20 border-emerald-800 text-emerald-300'
        } backdrop-blur-sm`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`} />
          <span>
            {toast.message.replace(/\(\d+s\)/, "")}
            {undoTimer !== null && (
              <span className="ml-1 font-semibold text-cyan-400">({undoTimer}s)</span>
            )}
          </span>
          
          {toast.actionLabel && (
            <button
              onClick={toast.onAction}
              className="ml-3 px-3 py-1 text-sm rounded-lg bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors"
            >
              {toast.actionLabel}
            </button>
          )}
        </div>
      )}

      {/* Player Details Popup */}
      <PlayerDetailsPopup   
        isOpen={isPlayerDetailsOpen}
        onClose={() => {
          setIsPlayerDetailsOpen(false);
          setSelectedPlayerDetails(null);
        }}
        player={selectedPlayerDetails}
        isTrialType={isTrialType}
      />
    </div>
  );
};

export default SelectedAuctionManager;