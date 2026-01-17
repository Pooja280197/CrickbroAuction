import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import PlayerCard from "./SelectedPlayerCard";
import AssignCategoryModal from "./AssignCategoryModal";
import PlayerDetailsPopup from "./PlayerDetailsPopup";
import { ratingOptions } from "../mock/mockPlayers";
import axios from "axios";
import { useDebounce } from "../../../components/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedPlayers,
  getUnassignedinCategory,
} from "../../../redux/actions";

const SelectedAuctionManager = ({ auctionId, auctionTypeTrial }) => {
  const dispatch = useDispatch();
  const isTrialType = auctionTypeTrial;
  // const [selectPlayersList, SetSelectPlayersList] = useState([]);
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
  // Category Filtering Auction Tab
  const [categorySearchId, setCategorySearchId] = useState("");
  const [categorySearchName, setCategorySearchName] = useState("");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [undoTimer, setUndoTimer] = useState(null);
  const [selectedPlayerDetails, setSelectedPlayerDetails] = useState(null);
  const [isPlayerDetailsOpen, setIsPlayerDetailsOpen] = useState(false);
  const [searchUnassign, setSearchUnassign] = useState("");
  const [searchAssign, setSearchAssign] = useState("");

  // Pagination states
  // const [unassignedPage, setUnassignedPage] = useState(1);
  const [auctionPage, setAuctionPage] = useState(1);
  // const [unassignedTotalPages, setUnassignedTotalPages] = useState(1);
  const [auctionTotalPages, setAuctionTotalPages] = useState(1);
  // const [unassignedTotal, setUnassignedTotal] = useState(0);
  const [auctionTotal, setAuctionTotal] = useState(0);
  const [playerTypes, setPlayerTypes] = useState([
    { label: "Batsman", value: "batsman" },
    { label: "Bowler", value: "bowler" },
    { label: "All-rounder", value: "all-rounder" },
    { label: "Wicketkeeper", value: "wicketkeeper" },
  ]);

  const [slotDetail, setSlotDetail] = useState([]);
  const [selectedSlotSessions, setSelectedSlotSessions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const debouncedUnassignPlayer = useDebounce(searchUnassign, 400);
  const debouncedAssignPlayer = useDebounce(searchAssign, 200);

  const enableBulkMode = Boolean(categorySearchId);

  //  SetSelectPlayersList(data || []);
  //     setUnassignedPage(currentPage || 1);
  //     setUnassignedTotalPages(pages || 1);
  //     setUnassignedTotal(total || 0);
  const unassignedPlayers = useSelector((state) =>
    isTrialType ? state?.data?.selectedPlayers : state?.data?.unassignedPlayers
  );
  const selectPlayersList = unassignedPlayers?.list || [];
  const unassignedTotalPages = unassignedPlayers?.pages || 1;
  const unassignedTotal = unassignedPlayers?.total || 0;
  const unassignedPage = unassignedPlayers?.page || 1;

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

  // Fetch slot list
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

  // Fetch sessions for selected slot
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

  const fetchUnassignedPlayers = () => {
    if (isTrialType) {
      dispatch(
        getSelectedPlayers({
          auctionId,
          page: unassignedPage,
          itemsPerPage: 8,
          debouncedUnassignPlayer,
          searchUnassign,
          typeFilter,
          fromRating,
          toRating,
          slotFilter,
          slotSessionFilter,
        })
      );
    } else {
      dispatch(
        getUnassignedinCategory({
          auctionId,
          page: unassignedPage,
          itemsPerPage: 8,
          debouncedUnassignPlayer,
          searchUnassign,
          typeFilter,
        })
      );
    }
  };


  // const fetchUnassignedPlayers = async (page= 1) => {
  //   try {
  //     const params = new URLSearchParams({
  //       categoryFilter: "notassignincategory",
  //       page: page.toString(),
  //       limit: "8",
  //     });

  //     // Search filter
  //     const searchValue = debouncedUnassignPlayer || searchUnassign;
  //     if (searchValue) {
  //       params.append("search", searchValue);
  //     }

  //     // Type filter - ADD THIS
  //     if (typeFilter) {
  //       params.append("playerType", typeFilter); // Make sure parameter name matches your API
  //     }

  //     // Rating filters - ADD THESE
  //     if (fromRating !== "") {
  //       params.append("ratingFrom", fromRating.toString());
  //     }
  //     if (toRating !== "") {
  //       params.append("ratingTo", toRating.toString());
  //     }

  //     // Slot filters
  //     if (slotFilter) {
  //       params.append("slotId", slotFilter);
  //     }

  //     if (slotSessionFilter) {
  //       params.append("sessionId", slotSessionFilter);
  //     }

  //     const res = await axios.get(
  //       `/webSiteApi/auction/getSelectPlayers/${auctionId}?${params.toString()}`
  //     );

  //     const { data, page: currentPage, pages, total } = res?.data?.data || {};
  //     SetSelectPlayersList(data || []);
  //     setUnassignedPage(currentPage || 1);
  //     setUnassignedTotalPages(pages || 1);
  //     setUnassignedTotal(total || 0);

  //     if (debouncedUnassignPlayer && page === 1) {
  //       setSelectedIds([]);
  //     }
  //   } catch (err) {
  //     console.error("Error loading unassigned", err);
  //     showToast({
  //       type: "error",
  //       message: "Failed to load unassigned players.",
  //     });
  //   }
  // };

  

  const fetchAssignedPlayers = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        categoryFilter: "assignincategory",
        page: page.toString(),
        limit: "8",
      });

      // Add search if available
      if (debouncedAssignPlayer) {
        params.append("search", debouncedAssignPlayer);
      }

      // Type filter - ADD THIS
      if (typeFilterA) {
        params.append("playerType", typeFilterA); // Make sure parameter name matches your API
      }

      // Rating filters - ADD THESE
      if (fromRatingA !== "") {
        params.append("ratingFrom", fromRatingA.toString());
      }
      if (toRatingA !== "") {
        params.append("ratingTo", toRatingA.toString());
      }

      // Category filter - ADD THIS (use categoryId parameter)
      if (categorySearchId) {
        params.append("categoryId", categorySearchId);
      }

      // Slot filters - ADD THESE if your API supports them
      if (slotFilterA) {
        params.append("slotId", slotFilterA);
      }

      if (slotSessionFilterA) {
        params.append("sessionId", slotSessionFilterA);
      }

      const res = await axios.get(
        `/webSiteApi/auction/getSelectPlayers/${auctionId}?${params.toString()}`
      );

      const { data, page: currentPage, pages, total } = res?.data?.data || {};
      setAuctionPlayers(data || []);
      setAuctionPage(currentPage || 1);
      setAuctionTotalPages(pages || 1);
      setAuctionTotal(total || 0);

      // Reset selection when search changes
      if (debouncedAssignPlayer && page === 1) {
        setSelectedAuctionIds([]);
      }
    } catch (err) {
      console.error("Error loading players for auction", err);
      showToast({
        type: "error",
        message: "Failed to load players for auction.",
      });
    }
  };
  
  useEffect(() => {
    if (!auctionId) return;
    // Fetch slot list on component mount
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
      // setUnassignedPage(1);
      fetchUnassignedPlayers(1);
    } else {
      setAuctionPage(1);
      fetchAssignedPlayers(1);
    }
  }, [activeSubTab]);

  useEffect(() => {
    // Reset session filter when slot changes
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
    // setUnassignedPage(1);
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
        categorySearchId !== "" // Add category to reset condition
    );
    setAuctionPage(1);
    fetchAssignedPlayers(1);

    // Set showBulkActions based on category selection
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
    // setUnassignedPage(1);

    // Fetch with empty filters
    const params = new URLSearchParams({
      categoryFilter: "notassignincategory",
      page: "1",
      limit: "8",
    });

    axios
      .get(
        `/webSiteApi/auction/getSelectPlayers/${auctionId}?${params.toString()}`
      )
      .then((res) => {
        // const { data, page: currentPage, pages, total } = res?.data?.data || {};
        // SetSelectPlayersList(data || []);
        // setUnassignedPage(currentPage || 1);
        // setUnassignedTotalPages(pages || 1);
        // setUnassignedTotal(total || 0);
      })
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
    setSearchAssign(""); // Clear search input
    setCategorySearchId(""); // Also reset category filter
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
    setAuctionPage(1);
    fetchAssignedPlayers(1);
  };

  useEffect(() => {
    if (activeSubTab === "auctionPlayers" && categorySearchId) {
      // Trigger search when category is selected
      setAuctionPage(1);
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

    // If category is "All Categories" (empty string), allow only single selection
    if (categorySearchId === "") {
      // Single selection mode
      setSelectedAuctionIds((prev) =>
        prev.includes(playerId) ? [] : [playerId]
      );
    } else {
      // Multiple selection mode for specific category
      setSelectedAuctionIds((prev) =>
        prev.includes(playerId)
          ? prev.filter((id) => id !== playerId)
          : [...prev, playerId]
      );
    }

    // Get the selected player to set category IDs
    const selectedPlayer = auctionPlayers.find(
      (p) => p.player._id === playerId
    );
    if (selectedPlayer) {
      setSelectedCategoryId(selectedPlayer?.category?._id || []);
    }
  };

  useEffect(() => {
    if (activeSubTab === "unassignedSelected") {
      // setUnassignedPage(1);
      fetchUnassignedPlayers(1);
    }
  }, [debouncedUnassignPlayer]);

  useEffect(() => {
    if (activeSubTab === "auctionPlayers") {
      setAuctionPage(1);
      fetchAssignedPlayers(1);
    }
  }, [debouncedAssignPlayer]);

  // const handleAssignSubmit = async (categoryId) => {
  //   try {
  //     await axios.post(`/webSiteApi/auction/assignPlayersToCategory`, {
  //       auctionId,
  //       categoryId,
  //       playerIds: selectedIds,
  //     });
  //     setSelectedIds([]);
  //     await fetchUnassignedPlayers();
  //     await fetchAssignedPlayers();
  //     setAssignModalOpen(false);
  //     setActiveSubTab("auctionPlayers");
  //     showToast({
  //       type: "success",
  //       message: "Players assigned to category successfully!",
  //     });

  //   } catch (error) {
  //     console.error("Assign failed", error);

  //     showToast({
  //       type: "error",
  //       message: "Failed to assign players.",
  //     });
  //   }
  // };

  const startOptimisticDelete = (ids, cId) => {
    const playersToRemove = auctionPlayers.filter((p) =>
      ids.includes(p.player._id)
    );

    // Immediately remove from UI
    setAuctionPlayers((prev) =>
      prev.filter((p) => !ids.includes(p.player._id))
    );

    // 🔥 TIMER = 5 seconds
    let timeLeft = 5;
    setUndoTimer(timeLeft);

    // Countdown interval
    const intervalId = setInterval(() => {
      timeLeft -= 1;
      setUndoTimer(timeLeft);

      if (timeLeft === 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Timeout to permanently delete
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

    // Store pending delete info
    setPendingDelete({
      ids,
      players: playersToRemove,
      timeoutId,
    });

    // Show toast with Undo button + live timer
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
  console.log(deleteCandidate, "delete");

  const handleConfirmDelete = () => {
    if (!deleteCandidate) return;
    const id = deleteCandidate.player._id;
    const cId = deleteCandidate?.category?._id;
    startOptimisticDelete([id], cId);
    setDeleteCandidate(null);
  };

  const handleBulkDeleteConfirm = () => {
    if (!selectedAuctionIds.length || !categorySearchId) return;

    // Additional check for "All Categories"
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
      // Deselect all on current page
      setSelectedIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      // Select all on current page
      const newSet = new Set([...selectedIds, ...currentPageIds]);
      setSelectedIds(Array.from(newSet));
    }
  };
  const handleSelectAllAuctionVisible = () => {
    // If category is "All Categories" or empty, don't allow select all
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

    // In renderFilterRow, update the showReset condition:
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

    const count = isUnassigned
      ? unassignedTotal // Use total from API response
      : auctionTotal; // Use total from API response

    console.log(selectPlayersList, "playerList");

    return (
      <div className="w-full">
        {/* All filters in one line */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search by player name or batch ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            value={isUnassigned ? searchUnassign : searchAssign}
            onChange={(e) =>
              isUnassigned
                ? setSearchUnassign(e.target.value)
                : setSearchAssign(e.target.value)
            }
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 items-end w-full">
          {/* Search Bar */}

          {/* Rating From */}
         {isTrialType && <div className="flex flex-col w-full lg:w-auto">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Rating
            </label>
            <div className="flex gap-2">
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
                className="border rounded-lg px-2 py-2 text-sm text-black bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-20"
              >
                <option value="">From</option>
                {ratingOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* Rating To */}
              <select
                value={to === "" ? "" : to}
                disabled={from === ""}
                onChange={(e) =>
                  setTo(e.target.value === "" ? "" : Number(e.target.value))
                }
                className={`border rounded-lg px-2 py-2 text-sm w-20 transition text-black ${
                  from === ""
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                }`}
              >
                <option value="">To</option>
                {ratingOptions
                  .filter((r) => from === "" || r >= from)
                  .map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
              </select>
            </div>
          </div>}

          {/* Player Type */}
          <div className="flex flex-col w-full lg:w-auto">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm text-black bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-32"
            >
              <option value="">All Types</option>
              {playerTypes.map((t) => (
                <option value={t.value} key={t.label}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {(isUnassigned && isTrialType) && (
            <div className="flex flex-col w-full lg:w-auto">
              <label className="text-xs font-semibold text-gray-600 mb-1">
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
                className="border rounded-lg px-3 py-2 text-sm text-black bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-40"
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

          {/* Session Filter (only visible when slot is selected) */}
          {slot && selectedSlotSessions.length > 0 && (
            <div className="flex flex-col w-full lg:w-auto">
              <label className="text-xs font-semibold text-gray-600 mb-1">
                Session
              </label>
              <select
                value={slotSession}
                onChange={(e) => setSlotSession(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm text-black bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-40"
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

          {/* Category - Only for Auction Tab */}
          {!isUnassigned && (
            <div className="flex flex-col w-full lg:w-auto">
              <label className="text-xs font-semibold text-gray-600 mb-1">
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
                className="border rounded-lg px-3 py-2 text-sm text-black bg-gray-50 hover:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full lg:w-40"
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

          {/* Action Buttons */}
          <div className="flex gap-2 w-full lg:w-auto">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 active:scale-[0.97] shadow transition whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            {showReset && (
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 active:scale-[0.97] transition whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-right mt-2">
          <span className="text-xs text-gray-600">
            Found:{" "}
            <span className="text-purple-600 font-semibold">{count}</span>{" "}
            players
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-white border-b">
        <div className="flex gap-3 px-4 py-3">
          <button
            onClick={() => setActiveSubTab("unassignedSelected")}
            className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "unassignedSelected"
                ? "bg-purple-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Selected (Not Assigned)
          </button>
          <button
            onClick={() => setActiveSubTab("auctionPlayers")}
            className={`px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-all ${
              activeSubTab === "auctionPlayers"
                ? "bg-purple-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Players for Auction
          </button>
        </div>
      </div>
      <div className="p-5 space-y-5">
        {activeSubTab === "unassignedSelected" ? (
          <>
            <div className="bg-white border rounded-xl p-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4 shadow-sm">
              {renderFilterRow("unassigned")}
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  onClick={handleSelectAllVisible}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                >
                  {selectPlayersList.every((p) =>
                    selectedIds.includes(p.player?._id)
                  ) && selectPlayersList.length > 0
                    ? "Deselect All"
                    : "Select All (Visible)"}
                </button>
                <button
                  disabled={selectedIds.length === 0}
                  onClick={() => handleAssignClick(selectedIds)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
                    selectedIds.length > 0
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Assign to Auction ({selectedIds.length})
                </button>
              </div>
            </div>

            <div
              className="max-h-[70vh] overflow-y-auto pt-3 pr-1"
              // onScroll={handleScrollUnassigned}
            >
              {selectPlayersList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-500 bg-white rounded-xl border">
                  <Search className="w-8 h-8 mb-3 text-gray-400" />
                  No players match this filter.
                </div>
              ) : (
                <div className="w-full overflow-x-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                </div>
              )}
            </div>

            {/* Unassigned Pagination Controls */}
            {unassignedTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">
                  Page{" "}
                  <span className="font-semibold text-purple-600">
                    {unassignedPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">{unassignedTotalPages}</span>{" "}
                  ({unassignedTotal} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchUnassignedPlayers(unassignedPage - 1)}
                    disabled={unassignedPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      unassignedPage === 1
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => fetchUnassignedPlayers(unassignedPage + 1)}
                    disabled={unassignedPage === unassignedTotalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      unassignedPage === unassignedTotalPages
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
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
            <div className="bg-white border rounded-xl p-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4 shadow-sm">
              {renderFilterRow("auction")}

              <div className="flex flex-col items-end gap-2 text-xs text-gray-500">
                {enableBulkMode && (
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={handleSelectAllAuctionVisible}
                        className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                      >
                        {auctionPlayers.every((p) =>
                          selectedAuctionIds.includes(p.player._id)
                        ) && auctionPlayers.length > 0
                          ? "Deselect All"
                          : "Select All (Visible)"}
                      </button>

                      <button
                        disabled={
                          selectedAuctionIds.length === 0 ||
                          categorySearchId === ""
                        }
                        onClick={() => setBulkDeleteConfirmOpen(true)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition ${
                          selectedAuctionIds.length > 0 &&
                          categorySearchId !== ""
                            ? "bg-red-600 text-white hover:bg-red-700 shadow"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Delete Selected ({selectedAuctionIds.length})
                      </button>
                    </div>
                    <div className="text-xs text-gray-600 italic">
                      Currently viewing players in:{" "}
                      <span className="font-semibold text-purple-600">
                        {categorySearchName}
                      </span>
                    </div>
                  </div>
                )}

                {!enableBulkMode && (
                  <div className="flex flex-col items-end gap-2 text-xs text-gray-500">
                    <div className="italic">
                      Tip: Select a category and click Search to enable bulk
                      actions
                    </div>
                    <div className="italic">
                      Hover on a player to remove individually.
                    </div>
                  </div>
                )}
                {enableBulkMode && categorySearchId === "" && (
                  <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-md mt-1">
                    ⚠️ Single selection only when viewing all categories
                  </div>
                )}

                {/* <div className="italic">
                  Tip: hover on a player to remove individually.
                </div> */}
              </div>
            </div>

            {/* Auction grid */}
            <div
              className="max-h-[70vh] overflow-y-auto pt-3 pr-1"
              // onScroll={handleScrollAuction}
            >
              {auctionPlayers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-sm text-gray-500 bg-white rounded-xl border">
                  <Search className="w-8 h-8 mb-3 text-gray-400" />
                  No players in auction for this filter.
                </div>
              ) : (
                // <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                <div className="w-full overflow-x-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {auctionPlayers.map((player) => (
                      <PlayerCard
                        key={player.player._id}
                        player={player}
                        selectable
                        selected={selectedAuctionIds.includes(
                          player.player._id
                        )}
                        onSelect={() =>
                          handleAuctionPlayerSelect(player.player._id)
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
                </div>
              )}
            </div>

            {/* Auction Pagination Controls */}
            {auctionTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">
                  Page{" "}
                  <span className="font-semibold text-purple-600">
                    {auctionPage}
                  </span>{" "}
                  of <span className="font-semibold">{auctionTotalPages}</span>{" "}
                  ({auctionTotal} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchAssignedPlayers(auctionPage - 1)}
                    disabled={auctionPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      auctionPage === 1
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => fetchAssignedPlayers(auctionPage + 1)}
                    disabled={auctionPage === auctionTotalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      auctionPage === auctionTotalPages
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
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

      {/* Assign modal */}
      <AssignCategoryModal
        isOpen={assignModalOpen}
        count={selectedIds.length}
        onClose={() => setAssignModalOpen(false)}
        // onSubmit={handleAssignSubmit}
        auctionId={auctionId}
        selectedIds={selectedIds}
        fetchUnassignedPlayers={fetchUnassignedPlayers}
        fetchAssignedPlayers={fetchAssignedPlayers}
        resetSelectedIds={() => setSelectedIds([])}
      />

      {/* Single delete confirm modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Remove from Auction?
              </h2>
              <button
                onClick={() => setDeleteCandidate(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-semibold">
                {deleteCandidate?.player?.name}
              </span>{" "}
              will be removed from{" "}
              <span className="font-semibold text-emerald-600">
                Players for Auction
              </span>{" "}
              and moved back to{" "}
              <span className="font-semibold text-purple-600">
                Selected (Not Assigned)
              </span>
              .
            </p>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-sm rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk delete confirm modal */}
      {bulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Remove {selectedAuctionIds.length} players from Auction?
            </h2>
            <p className="text-sm text-gray-600">
              They will be moved back to{" "}
              <span className="font-semibold text-purple-600">
                Selected (Not Assigned)
              </span>
              . You can undo for 5 seconds after removing.
            </p>
            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setBulkDeleteConfirmOpen(false)}
                className="px-4 py-2 text-sm rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDeleteConfirm}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 shadow"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <span>
            {toast.message.replace(/\(\d+s\)/, "")}
            {undoTimer !== null && ` (${undoTimer}s)`}
          </span>

          {toast.actionLabel && (
            <button
              onClick={toast.onAction}
              className="ml-3 underline text-green-300"
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
