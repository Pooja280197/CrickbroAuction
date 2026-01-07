import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Award,
  Shield,
  Gavel,
  Clock,
  DollarSign,
  Settings,
  User,
  Users as UsersIcon,
  Star,
  Globe,
  Pencil,
  Trash,
  UserPlus,
  X,
  Search,
  CheckSquare,
  Square,
  UserCheck,
  Filter,
  Plus, // Added missing Plus icon
  Edit,
  Trash2,
  Wallet,
  Info,
  Trophy,
  ScrollText
} from 'lucide-react';

import PlayerAssign from '../../pages/AuctionDetailsTabs/PlayerAssign';
import PlayerCard from '../../pages/AuctionDetailsTabs/PlayerCard';
import SelectedAuctionManager from '../../pages/SelectedPlayers/players/SelectedAuctionManager';
import { useDebounce } from '../../components/useDebounce';
import axios from 'axios';
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';

const AuctionPlayers = () => {
  const { id } = useParams()

  const [activeTab, setActiveTab] = useState('players');
  const [activePlayerTab, setActivePlayerTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusSort, setStatusSort] = useState('');
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [typeSort, setTypeSort] = useState('');
  const hasRating = !!localStorage.getItem(`playerRating${id}`);

  const debouncedSearch = useDebounce(searchQuery, 400);
  const [playerList, setPlayerList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 16;

  const sortPlayers = [
    { value: 'all', label: 'All' },
    { value: 'select', label: 'Selected' },
    { value: 'not select', label: 'Not Selected' },
    { value: 'pending', label: 'Pending' },
    { value: 'not reached', label: 'Not Reached' },
  ]
  const handlePlayerTabChange = (tab) => {
    setActivePlayerTab(tab);
  };

  const handleAssignClick = () => {
    setAssignmentModalOpen(true);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayers(prev => {
      if (prev.some(p => p.id === player.id)) {
        return prev.filter(p => p.id !== player.id);
      } else {
        return [...prev, player];
      }
    });
  };

  const handleRemovePlayer = (player) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
  };

  const fetchPlayers = async (tab = "all", page = 1) => {
    setLoading(true);

    try {
      let url = `/webSiteApi/auction/getAuctionPlayers/${id}`;

      const params = {
        limit: itemsPerPage,
        page: page,
      };

      // Tab conditions
      if (tab === "unassigned") {
        params.trailStatus = "not-assign";
      } else if (tab === "assigned") {
        params.trailStatus = "assign";

        if (statusSort) {
          if (statusSort === "all") {
            params.selectionStatus = "";
            params.playerType = "";
          } else if (statusSort === "pending") {
            params.selectionStatus = statusSort;
            params.playerType = "";
          } else if (statusSort === "not reached") {
            params.selectionStatus = statusSort;
            params.playerType = "";
          } else {
            params.selectionStatus = statusSort;
          }
        }

        if (typeSort) {
          if (typeSort === "none") {
            params.playerType = "";
          } else {
            params.playerType = typeSort;
          }
        }
      }

      // Search (applies to all tabs)
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      // Convert params to query string
      const queryString = new URLSearchParams(params).toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await axios.get(url);

      setPlayerList(res?.data?.data?.data || []);
      setCurrentPage(page);
      setTotalPages(res?.data?.data?.pages || 0);
      setTotalPlayers(res?.data?.data?.total || 0);
    } catch (error) {
      console.log("Error fetching players:", error);
      toast.error("Failed to fetch players");
      setPlayerList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusSort === 'pending' || statusSort === 'not reached' || statusSort === 'all') {
      setTypeSort('')
    }
    fetchPlayers('assigned');
  }, [statusSort, typeSort])

  useEffect(() => {
    setCurrentPage(1);
    fetchPlayers(activePlayerTab, 1)
  }, [debouncedSearch])

  const handleAssignmentSuccess = () => {
    fetchPlayers(activePlayerTab);
    setSelectedPlayers([]);
  };

  const getFilteredPlayers = () => {
    let filtered = playerList
    return filtered;
  };

  const handleSelectAll = () => {
    const currentPlayers = getFilteredPlayers();
    if (selectedPlayers.length === currentPlayers.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(currentPlayers.map(item => item.playerDoc?._id));
    }
  };

  const handleAssignPlayers = () => {
    if (selectedPlayers.length === 0) {
      toast.info("Please select at least one player");
      return;
    }
    setAssignmentModalOpen(true);
  };
  return (
    <div>
      {activeTab === "players" && (
        <div className="space-y-4">
          {/* Tabs */}
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex gap-3">
              <button
                onClick={() => handlePlayerTabChange("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${activePlayerTab === "all"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600 border"
                  }`}
              >
                <Users className="w-4 h-4" /> All
              </button>
              <button
                onClick={() => handlePlayerTabChange("unassigned")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${activePlayerTab === "unassigned"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 border"
                  }`}
              >
                <Users className="w-4 h-4" /> Unassigned
              </button>
              <button
                onClick={() => handlePlayerTabChange("assigned")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${activePlayerTab === "assigned"
                  ? "bg-emerald-500 text-white"
                  : "bg-white text-gray-600 border"
                  }`}
              >
                <UserCheck className="w-4 h-4" /> Assigned Trials
              </button>
              <button
                onClick={() => handlePlayerTabChange("selected")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${activePlayerTab === "selected"
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-600 border"
                  }`}
              >
                <Users className="w-4 h-4" /> Selected Players
              </button>
            </div>
          </div>

          {/* Search + Buttons Row - Only show for unassigned tab */}
          {(activePlayerTab === "all" ||
            activePlayerTab === "unassigned" ||
            activePlayerTab === "assigned") && (
              <>
                <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-3">

                  {/* TOP SECTION → Search + (Filters if assigned) */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search player..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    {/* Filters only for assigned */}
                    {activePlayerTab === "assigned" && (
                      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">

                        {/* Sort By Status */}
                        <select
                          className="w-full sm:w-40 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                          value={statusSort}
                          onChange={(e) => setStatusSort(e.target.value)}
                        >
                          <option value="" disabled>Sort By Status</option>
                          {sortPlayers?.map((item) => (
                            <option key={item.value} value={item.value}>{item.label}</option>
                          ))}
                        </select>

                        {/* Sort By Type (Visible Only When Needed) */}
                        {(statusSort === "select" || statusSort === "not select") && (
                          <select
                            className="w-full sm:w-40 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                            value={typeSort}
                            onChange={(e) => setTypeSort(e.target.value)}
                          >
                            <option value="" disabled>Sort By Player Type</option>
                            <option value="batsman">Batsman</option>
                            <option value="bowler">Bowler</option>
                            <option value="allrounder">All Rounder</option>
                            <option value="wicketkeeper">Wicket Keeper</option>
                          </select>
                        )}
                      </div>
                    )}

                  </div>

                  {/* ACTION BUTTONS → For Unassigned */}
                  {activePlayerTab === "unassigned" && (
                    <div className="flex flex-row gap-2 w-full justify-end">

                      {/* Select All */}
                      <button
                        onClick={handleSelectAll}
                        className="px-3 py-2 bg-gray-100 border rounded-lg text-sm font-semibold hover:bg-gray-200"
                      >
                        {selectedPlayers.length === getFilteredPlayers().length
                          ? "Deselect All"
                          : "Select All"}
                      </button>

                      {/* Assign */}
                      <button
                        disabled={selectedPlayers.length === 0}
                        onClick={handleAssignPlayers}
                        className={`px-5 py-2 rounded-lg text-sm font-bold ${selectedPlayers.length > 0
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        Assign ({selectedPlayers.length})
                      </button>
                    </div>
                  )}
                </div>

                <PlayerAssign
                  isOpen={assignmentModalOpen}
                  onClose={() => setAssignmentModalOpen(false)}
                  selectedPlayers={selectedPlayers}
                  playerCount={selectedPlayers.length}
                  onAssignSuccess={handleAssignmentSuccess}
                />

                {/* Players Grid */}
                <div className="max-w-7xl mx-auto px-4 pb-6">
                  {getFilteredPlayers().length > 0 ? (
                    <div className={
                      activePlayerTab === "assigned"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        : "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4"
                    }>
                      {getFilteredPlayers().map((item) => {

                        const role = item?.assignedSlots?.[0]?.rating?.playerType
                        const player = item?.playerDoc;

                        const assignedInfo = activePlayerTab === "assigned" ? {
                          assign: item?.assignedSlots?.[0]
                        } : {};
                        return (
                          <PlayerCard
                            key={player._id}
                            player={{
                              id: player._id,
                              name: player.name,
                              type: player.playerRole || 'player',
                              image: player.logo,
                              batchId: player.batchId,
                              location: player.location,
                              ...assignedInfo,

                            }}
                            type={role}
                            selector={isSelector}
                            adminLogin={adminLogin}
                            mode={activePlayerTab === "unassigned" ? "select" :
                              activePlayerTab === "assigned" ? "assigned" : "view"}
                            isSelected={selectedPlayers.includes(player._id)}
                            onRemove={() => fetchPlayers('assigned')}
                            onSelect={(id) => {
                              if (selectedPlayers.includes(id)) {
                                setSelectedPlayers(selectedPlayers.filter((x) => x !== id));
                              } else {
                                setSelectedPlayers([...selectedPlayers, id]);
                              }
                            }}
                            onViewDetails={handleViewPlayerDetails}
                            onAssign={handleIndividualAssign}
                            showActions={activePlayerTab === "unassigned"}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-14">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <h3 className="text-md font-semibold text-gray-900">No players found</h3>
                      <p className="text-gray-500 text-sm">
                        {activePlayerTab === "all"
                          ? "No players available"
                          : activePlayerTab === "unassigned"
                            ? "Try adjusting your search"
                            : "No assigned players found"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {(activePlayerTab === "all" || activePlayerTab === "unassigned" || activePlayerTab === "assigned") && totalPages > 1 && (
                  <div className="max-w-7xl mx-auto px-4 pb-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => fetchPlayers(activePlayerTab, currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => fetchPlayers(activePlayerTab, pageNum)}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${currentPage === pageNum
                            ? "bg-purple-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => fetchPlayers(activePlayerTab, currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>

                    <span className="text-sm text-gray-600 ml-3">
                      Page <span className="font-semibold text-purple-600">{currentPage}</span> of <span className="font-semibold text-purple-600">{totalPages}</span> | Total: <span className="font-semibold text-purple-600">{totalPlayers}</span> players
                    </span>
                  </div>
                )}
              </>

            )}
          {/* ========= NEW FLOW: Selected / Auction ========= */}
          {activePlayerTab === "selected" && (
            <div className="max-w-7xl mx-auto px-4 pb-6">
              <SelectedAuctionManager defaultTab="selected" auctionId={id} />
            </div>
          )}

          {activePlayerTab === "auction" && (
            <div className="max-w-7xl mx-auto px-4 pb-6">
              <SelectedAuctionManager defaultTab="auction" auctionId={id} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AuctionPlayers
