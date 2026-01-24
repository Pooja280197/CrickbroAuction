import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react"; // Optional: if using icons
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchasedPlayers, fetchTeamsData } from "../../../redux/actions";

const OwnerTeamDetails = ({ auctionId, playerId }) => {
  const dispatch = useDispatch();
 
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("team-details");
  const navigate = useNavigate();

  const loading = useSelector((state) => state.loading?.TeamData || false);

  const teams = useSelector((state) => state.data?.TeamData?.data || null);
  const purchasedPlayers = useSelector((state) => state.data?.PurchasedPlayers?.data || null);

  useEffect(() => {
    if (!auctionId || !playerId) return;

    const fetchTeams = async () => {
      try {
        await dispatch(fetchTeamsData(auctionId));
      } catch (err) {
        setError("Failed to load team details");
      }
    };

    fetchTeams();
  }, [auctionId, playerId]);

  const team = teams?.[0];
  const selectedTeamId = team?.teamId;

  useEffect(() => {
    if (!selectedTeamId) return; // Wait until teamId is available

     const fetchPlayers = async () => {
      try {
        await dispatch(fetchPurchasedPlayers(auctionId,selectedTeamId));
      } catch (err) {
        setError("Failed to load team details");
      }
    };

   
      fetchPlayers()
  }, [selectedTeamId]);

  if (loading)
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-white border border-blue-100 shadow-sm">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading team details...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-red-50 to-white border border-red-200 shadow-sm">
          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-500 text-sm">!</span>
          </div>
          <span className="text-red-600">{error}</span>
        </div>
      </div>
    );

  //   if (teams.length === 0) return (
  //     <div className="p-8 text-center">
  //       <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200 shadow-sm">
  //         <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
  //           <span className="text-gray-500 text-sm">?</span>
  //         </div>
  //         <span className="text-gray-500">No team found.</span>
  //       </div>
  //     </div>
  //   );

  const details = team?.teamAuctionDetails;

  // Handle live bidding navigation
  const handleLiveBiddingClick = () => {
    // navigate(`/team-bidding/${auctionId}`,{state:selectedTeamId});
    localStorage.setItem("selectedTeamId", selectedTeamId);
    window.open(`/team-bidding/${auctionId}`, "_blank");
  };

  // Tab Navigation Component
  const TabNavigation = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab("team-details")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "team-details"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Team Details
        </button>
        <button
          onClick={() => setActiveTab("my-wallet")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "my-wallet"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          My Wallet
        </button>
        <button
          onClick={() => setActiveTab("live-bidding")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "live-bidding"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Live Bidding
        </button>
        <button
          onClick={() => setActiveTab("players")}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "players"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-400 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Players
        </button>
      </nav>
    </div>
  );

  // Team Details Tab
  const TeamDetailsTab = () => (
    <div className="space-y-6">
      {/* Main Team Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)] shadow-lg ">
        <div className="relative flex items-center gap-5 p-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl blur-sm opacity-20"></div>
            <img
              src={team?.teamLogo}
              alt={team?.teamName}
              className="relative w-20 h-20 rounded-xl border-2 border-white object-cover shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-white">
                {details?.currentSquadSize}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {team?.teamName}
            </h2>
            <p className="text-blue-500 text-sm font-medium mt-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
              {team?.teamCity}
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="px-3 py-1.5 bg-[var(--color-primary-light)] shadow-lg  rounded-lg border border-green-100 ">
                <span className="text-gray-200 text-sm">Budget: </span>
                <span className="font-bold text-green-400">
                  ₹{details?.remainingBudget?.toLocaleString()}
                </span>
                <span className="text-gray-400 text-xs ml-1">
                  / {details?.initialBudget?.toLocaleString()}
                </span>
              </div>
              <div className="px-3 py-1.5 bg-[var(--color-primary-light)] shadow-lg rounded-lg border border-purple-100 ">
                <span className="text-gray-200 text-sm">RTM Available: </span>
                <span className="font-bold text-purple-400">
                  {details?.rtmCardsAvailable}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Owners Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)] shadow-lg ">
        <div className="relative p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
            Team Owner(s)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team?.owners?.map((owner, index) => (
              <div
                key={owner?._id}
                className={`p-4 rounded-xl bg-[var(--color-primary-light)] shadow-lg   hover:shadow-md transition-shadow duration-300  ${
                  index === 0 ? "ring-1 ring-purple-100" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[var(--color-primary)] shadow-lg  text-white rounded-full blur opacity-20"></div>
                    <img
                      src={owner?.logo}
                      alt={owner?.name}
                      className="relative w-14 h-14 rounded-full border-2 border-white object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {owner.name}
                    </p>
                    {owner?.email && (
                      <p className="text-gray-400 text-sm truncate mt-1 flex items-center gap-1">
                        {/* <span className="w-3 h-3">✉️</span> */}
                        {owner.email}
                      </p>
                    )}
                    {owner?.mobile && (
                      <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                        {/* <span className="w-3 h-3">📱</span> */}
                        {owner.mobile}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Rules Section */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)] shadow-lg ">
        <div className="relative p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
            Team Rules & Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-[var(--color-primary-light)] rounded-lg border border-amber-100 shadow-sm">
                <div className="text-sm font-medium text-amber-600 mb-1">
                  Squad Composition
                </div>
                <div className="text-xs text-gray-200">
                  Min {details?.minPlayers} - Max {details?.maxPlayers} players
                </div>
              </div>
              <div className="p-3 bg-[var(--color-primary-light)] rounded-lg border border-amber-100 shadow-sm">
                <div className="text-sm font-medium text-amber-600 mb-1">
                  Foreign Players
                </div>
                <div className="text-xs text-gray-200">
                  Max {details?.maxForeignPlayers} overseas players allowed
                </div>
              </div>
              <div className="p-3 bg-[var(--color-primary-light)] rounded-lg border border-amber-100 shadow-sm">
                <div className="text-sm font-medium text-amber-600 mb-1">
                  Wicket Keepers
                </div>
                <div className="text-xs text-gray-200">
                  Min {details?.minWicketKeepers} - Max{" "}
                  {details?.maxWicketKeepers}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-[var(--color-primary-light)] rounded-lg border border-amber-100 shadow-sm">
                <div className="text-sm font-medium text-amber-600 mb-1">
                  Purchase Limits
                </div>
                <div className="text-xs text-gray-200">
                  Min {details?.minPurchasePlayers} - Max{" "}
                  {details?.maxPurchasePlayers} players per session
                </div>
              </div>
              <div className="p-3 bg-[var(--color-primary-light)]  rounded-lg border border-amber-100 shadow-sm">
                <div className="text-sm font-medium text-amber-600 mb-1">
                  Return Players
                </div>
                <div className="text-xs text-gray-200">
                  Maximum {details?.maxReturnPlayers} players can be returned
                </div>
              </div>
              <div className="p-3 bg-[var(--color-primary-light)] rounded-lg border border-amber-100 shadow-sm">
                <div className="text-sm font-medium text-amber-600 mb-1">
                  Team Status
                </div>
                <div className="text-xs text-gray-200">
                  {team?.isOwner ? "You are an owner" : "Viewing as spectator"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // My Wallet Tab
  const MyWalletTab = () => (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)] shadow-lg  border border-emerald-100 ">
        <div className="relative p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
            Budget Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
              <div className="text-sm font-medium text-emerald-100 mb-1">
                Initial Budget
              </div>
              <div className="text-3xl font-bold text-white">
                ₹{details?.initialBudget?.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-200 mt-2">
                Starting amount
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 shadow-lg">
              <div className="text-sm font-medium text-rose-100 mb-1">
                Purse Spent
              </div>
              <div className="text-3xl font-bold text-white">
                ₹{details?.purseSpent?.toLocaleString()}
              </div>
              <div className="text-xs text-rose-200 mt-2">
                {((details?.purseSpent / details?.initialBudget) * 100).toFixed(
                  1
                )}
                % spent
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
              <div className="text-sm font-medium text-green-100 mb-1">
                Remaining Budget
              </div>
              <div className="text-3xl font-bold text-white">
                ₹{details?.remainingBudget?.toLocaleString()}
              </div>
              <div className="text-xs text-green-200 mt-2">
                {(
                  (details?.remainingBudget / details?.initialBudget) *
                  100
                ).toFixed(1)}
                % remaining
              </div>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-200">
                Budget Utilization
              </span>
              <span className="text-sm font-bold text-gray-200">
                ₹{details?.purseSpent?.toLocaleString()} / ₹
                {details?.initialBudget?.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 h-4 rounded-full shadow-md shadow-emerald-200 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (details?.purseSpent / details?.initialBudget) * 100
                    )}%`,
                  }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-4 border-emerald-500 shadow-lg"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-200">0%</span>
                <span className="text-xs text-gray-200">100%</span>
              </div>
            </div>
          </div>

          {/* Per Player Budget */}
          <div className="p-4 rounded-xl bg-[var(--color-primary-light)] shadow-lg  border border-blue-100 ">
            <h4 className="font-semibold text-gray-200 mb-3">
              Average Cost Per Player
            </h4>
            <div className="text-2xl font-bold text-blue-400">
              ₹
              {details?.currentSquadSize > 0
                ? Math.round(
                    details?.purseSpent / details?.currentSquadSize
                  )?.toLocaleString()
                : 0}
            </div>
            <div className="text-sm text-gray-200 mt-1">
              Based on {details?.currentSquadSize} players bought so far
            </div>
          </div>
        </div>
      </div>

      {/* RTM Cards Status */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)] shadow-lg border border-purple-100 ">
        <div className="relative p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
            RTM Cards Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--color-primary-light)] shadow-lg  border border-purple-100 ">
              <div className="text-sm font-medium text-purple-400 mb-1">
                Available
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {details?.rtmCardsAvailable}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--color-primary-light)] shadow-lg  border border-purple-100 ">
              <div className="text-sm font-medium text-gray-200 mb-1">Used</div>
              <div className="text-2xl font-bold text-gray-200">
                {details?.rtmCardsUsed}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Live Bidding Tab
  const LiveBiddingTab = () => (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)] shadow-lg  border border-orange-100 ">
        <div className="relative p-8">
          {/* Decorative elements */}

          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#F97316"
                d="M44.3,-76.1C57.1,-69.1,67.1,-57,75.9,-43.1C84.7,-29.2,92.3,-13.6,91.6,0.4C90.8,14.4,81.7,28.8,71.3,41.6C60.9,54.3,49.3,65.4,36.1,73.7C22.9,82,8.3,87.5,-5.5,85.8C-19.3,84.1,-38.6,75.2,-52.6,62.7C-66.6,50.1,-75.3,33.9,-79.1,17.4C-82.9,0.9,-81.8,-15.9,-75.2,-31.1C-68.5,-46.3,-56.3,-59.9,-42.1,-66.4C-27.9,-72.8,-11.7,-72.2,2.1,-75.4C15.9,-78.6,31.5,-83.1,44.3,-76.1Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          <div className="relative max-w-2xl mx-auto text-center ">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">🏏</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready for Live Bidding?
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Join the live auction room to bid on players in real-time! Watch
              as teams compete to build their squads, make strategic bids, and
              use your RTM cards wisely to secure your favorite players.
            </p>

            {/* Stats Box */}

            {/* CTA Section */}
            {/* <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 shadow-sm mb-8"> */}

            {/* <button
              onClick={handleLiveBiddingClick}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto"
            >
              <span>Go to Live Bidding Page</span>
              <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">
                →
              </span>
            </button> */}
            {/* </div> */}

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200 shadow-sm mb-8">
              <button
                onClick={handleLiveBiddingClick}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto"
              >
                <span>Go to Live Bidding Page</span>
                <span className="ml-3 group-hover:translate-x-2 transition-transform duration-300">
                  →
                </span>
              </button>
            </div>

            {/* Tips Section */}
            {/* <div className="text-left bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                Bidding Tips
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600">💡</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Plan Your Budget</p>
                    <p className="text-sm text-gray-500">Allocate funds for key players before bidding starts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600">🃏</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Use RTM Wisely</p>
                    <p className="text-sm text-gray-500">Save RTM cards for must-have players</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );

  // Players Tab
  const PlayersTab = () => {
    const players = purchasedPlayers || [];

    const totalSpent = players?.reduce(
      (sum, p) => sum + (p.finalPrice || p.currentBid || 0),
      0
    );

    const indianCount = players?.filter((p) => !p.isForeign).length;
    const foreignCount = players?.filter((p) => p.isForeign).length;

    const avgRating = players?.length
      ? (
          players?.reduce(
            (sum, p) =>
              sum + (p.rating?.avgRatingComputed || p.rating?.avgRating || 0),
            0
          ) / players.length
        ).toFixed(1)
      : 0;

    return (
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--color-primary)] shadow-lg border border-sky-100 ">
          <div className="relative p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-sky-500 to-sky-600 rounded-full"></div>
                Squad Players ({players?.length})
              </h3>

              <div className="px-3 py-1.5 bg-[var(--color-primary-light)] shadow-lg  rounded-lg border border-sky-200">
                <span className="text-sm font-medium text-sky-100">
                  Total Spent: ₹{totalSpent?.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Players Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players?.map((p) => (
                <div
                  key={p.playerId}
                  className="group relative overflow-hidden rounded-xl border bg-[var(--color-primary-light)] border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-4">
                    {/* TOP SECTION */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-white group-hover:text-sky-700 transition-colors">
                          {p.player?.name}
                        </h4>

                        <div className="flex items-center gap-2 mt-1">
                          {/* Role / Category */}
                          {/* <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                          {p.category || "N/A"}
                        </span> */}

                          {/* Country */}
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              p.playerRole
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {p.playerRole || "Player"}
                          </span>
                        </div>
                      </div>

                      {/* Rating (if available) */}
                      {p.rating?.avgRatingComputed ? (
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span className="font-semibold text-gray-200">
                            {p.rating.avgRatingComputed}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* BOTTOM SECTION */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-xs text-gray-200">
                            Bought Price
                          </div>
                          <div className="font-bold text-green-400">
                            ₹
                            {(
                              p.finalPrice ||
                              p.currentBid ||
                              0
                            )?.toLocaleString()}
                          </div>
                        </div>

                        {/* <button className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white text-sm rounded-lg hover:shadow-md transition-shadow">
                        View Stats
                      </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY SECTION */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-200 mb-4">
                Squad Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-[var(--color-primary-light)] shadow-lg border border-gray-200">
                  <div className="text-xs text-gray-200 mb-1">
                    Total Players
                  </div>
                  <div className="text-xl font-bold text-gray-200">
                    {players?.length}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-primary-light)] shadow-lg to-white border border-green-200">
                  <div className="text-xs text-gray-200 mb-1">
                    Indian Players
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    {indianCount}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-primary-light)] shadow-lg  to-white border border-purple-200">
                  <div className="text-xs text-gray-200 mb-1">
                    Foreign Players
                  </div>
                  <div className="text-xl font-bold text-purple-400">
                    {foreignCount}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--color-primary-light)] shadow-lg to-white border border-amber-200">
                  <div className="text-xs text-gray-200 mb-1">
                    Average Rating
                  </div>
                  <div className="text-xl font-bold text-amber-400">
                    {avgRating}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Team Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={team?.teamLogo}
            alt={team?.teamName}
            className="w-16 h-16 rounded-xl border-2 border-white shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              {team?.teamName}
            </h1>
            <p className="text-gray-300">{team?.teamCity}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation />

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "team-details" && <TeamDetailsTab />}
        {activeTab === "my-wallet" && <MyWalletTab />}
        {activeTab === "live-bidding" && <LiveBiddingTab />}
        {activeTab === "players" && <PlayersTab />}
      </div>
    </div>
  );
};

export default OwnerTeamDetails;
