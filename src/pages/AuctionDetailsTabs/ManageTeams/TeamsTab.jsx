import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTeamToAuction,
  fetchAuctionDetails,
  getAllAuctionTeam,
  getAuctionTeams,
} from "../../../redux/actions";
import Loader from "../../../components/Loader";
import TeamCard from "../../../components/TeamCard";
import EnhancedTeamCard from "../TeamCard";

const tabs = [
  { key: "addTeam", label: "Add/Remove Team" },
  { key: "auctionTeams", label: "Teams Added to Auction" },
];

const TeamsTab = ({ auctionId }) => {
  const dispatch = useDispatch();
  // const tournamentId = localStorage.getItem("tournamentId");
  const tournamentId = useSelector((state) => state.tournamentId);
  const [activeTab, setActiveTab] = useState("addTeam");
  const [searchAuctionTeam, setSearchAuctionTeam] = useState("");
  //   const [selectedTeamToAuction, setSelectedTeamToAuction] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const isTeamsLoading = useSelector((state) => state.loading?.allAuctionTeams);
  //   const [selectedTeam, setSelectedTeam] = useState([]);      // current UI selection
  // const [initialAuctionTeams, setInitialAuctionTeams] = useState([]); // server truth

  const auctionTeamLoading = useSelector(
    (state) => state.loading?.auctionTeams
  );
  const tournamentTeam = useSelector(
    (state) => state.data?.allAuctionTeams || null
  );
  const auctionTeam = useSelector(
    (state) => state.data?.auctionTeams?.data || null
  );

  useEffect(() => {
    if (!Array.isArray(tournamentTeam)) return;

    const alreadyAdded = tournamentTeam
      .filter((item) => item.auctionTeam === true)
      .map((item) => item.teamId._id);

    setSelectedTeam(alreadyAdded);
    //   setInitialAuctionTeams(alreadyAdded);
  }, [tournamentTeam]);

  // const handleSyncTeams = () => {
  //   const toAdd = selectedTeam.filter(
  //     (id) => !initialAuctionTeams.includes(id)
  //   );

  //   const toRemove = initialAuctionTeams.filter(
  //     (id) => !selectedTeam.includes(id)
  //   );

  //   dispatch(
  //     addTeamToAuction(auctionId, {
  //       add: toAdd,
  //       remove: toRemove,
  //     })
  //   );
  // };

  useEffect(() => {
    if (!auctionId) return;
    dispatch(getAllAuctionTeam(tournamentId));
    dispatch(getAuctionTeams(auctionId));
    dispatch(fetchAuctionDetails(auctionId));
  }, [auctionId]);

  const renderContent = () => {
    if (activeTab === "addTeam" && isTeamsLoading) {
      return <Loader text="Loading Teams..." />;
    }

    if (activeTab === "auctionTeams" && auctionTeamLoading) {
      return <Loader text="Loading Auction Teams..." />;
    }

    // if (activeTab === "auctionTeams" && isTeamOwnersLoading) {
    //   return <Loader text="Loading Team Owners..." />;
    // }

    const filteredAuctionTeam = Array.isArray(tournamentTeam)
      ? tournamentTeam?.filter((item) => {
          const player = item?.teamId;
          const matchesSearch = player?.name
            ?.toLowerCase()
            .includes(searchAuctionTeam.toLowerCase());
          return matchesSearch;
        })
      : [];

  

    switch (activeTab) {
      case "addTeam":
        return (
          <div className="bg-[var(--color-primary)]  flex justify-center items-center px-2">
            {/* MODAL */}
            <div className="w-full max-w-7xl h-[90vh] card-glass flex flex-col animate-slideDown ">
              {/* HEADER */}
              <div className="sticky top-0 z-20 px-5 py-3 border-b border-white/10 bg-primary-darker/80 backdrop-blur">
                <div className="flex flex-col gap-3">
                  {/* TITLE ROW */}
                  <div className="flex items-center justify-between ">
                    <h2 className="text-lg font-oswald tracking-wide text-crickbroYellow flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-gradient"></span>
                      All Teams
                    </h2>
                  </div>

                  {/* SEARCH + ACTIONS */}
                  <div className="flex flex-wrap gap-2 items-center font-inter">
                    {/* Search */}
                    <input
                      type="text"
                      placeholder="Search team..."
                      value={searchAuctionTeam}
                      onChange={(e) => setSearchAuctionTeam(e.target.value)}
                      className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:border-crickbroPurple outline-none"
                    />

                    {/* Select All */}
                    <button
                      onClick={() => {
                        if (
                          selectedTeam.length === filteredAuctionTeam.length
                        ) {
                          setSelectedTeam([]);
                        } else {
                          setSelectedTeam(
                            filteredAuctionTeam.map((i) => i?.teamId?._id)
                          );
                        }
                      }}
                      className="px-3 py-2 rounded-lg text-xs border border-white/10 text-white/80 hover:bg-white/5 transition"
                    >
                      {selectedTeam.length === filteredAuctionTeam.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>

                    {/* Add Button */}
                    {/* <button
                      disabled={selectedTeam.length === 0}
                      onClick={() => {
                        dispatch(addTeamToAuction(auctionId, selectedTeam));
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        selectedTeam.length > 0
                          ? "bg-accent-gradient text-primary-darker shadow-md"
                          : "bg-white/10 text-white/40 cursor-not-allowed"
                      }`}
                    >
                      Add ({selectedTeam.length})
                    </button> */}
                    <button
                      disabled={false}
                      onClick={() => {
                        dispatch(
                          addTeamToAuction(auctionId, selectedTeam)
                        ).then(() => {
                          // 🔄 refresh data after successful add/remove
                          dispatch(getAllAuctionTeam(tournamentId));
                          dispatch(getAuctionTeams(auctionId));
                          setActiveTab("auctionTeams")

                        });
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        selectedTeam.length > 0
                          ? "bg-accent-gradient text-primary-darker shadow-md"
                          : "bg-red-500/80 text-white"
                      }`}
                    >
                      Add Team ({selectedTeam.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* GRID */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 justify-items-center">
                  {filteredAuctionTeam.map((item) => {
                    const team = item.teamId;
                    return (
                      <TeamCard
                        key={team._id}
                        team={{
                          id: team._id,
                          name: team.name,
                          type: team.playerRole,
                          image: team.logo,
                        }}
                        // isSelected={selectedTeam.includes(team._id)}
                        isAdded={item.auctionTeam === true}
                        isSelected={selectedTeam.includes(team._id)}
                        onSelect={(id) =>
                          setSelectedTeam((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          )
                        }
                        showActions
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case "auctionTeams":
        return (
          <div className=" bg-[var(--color-primary)] flex justify-center items-center px-2">
            {/* MODAL */}
            <div className="w-full max-w-7xl h-[90vh] card-glass flex flex-col animate-slideDown">
              {/* HEADER */}
              <div className="sticky top-0 z-20 px-5 py-3 border-b border-white/10 bg-primary-darker/80 backdrop-blur">
                <div className="flex flex-col gap-3">
                  {/* TITLE ROW */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-oswald tracking-wide text-crickbroYellow flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-gradient"></span>
                      All Auction Teams
                    </h2>
                  </div>

                  {/* SEARCH + ACTIONS */}
                  <div className="flex flex-wrap gap-2 items-center font-inter">
                    {/* Search */}
                    <input
                      type="text"
                      placeholder="Search team..."
                      value={searchAuctionTeam}
                      onChange={(e) => setSearchAuctionTeam(e.target.value)}
                      className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:border-crickbroPurple outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* GRID */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 justify-items-center">
                  {auctionTeam.map((item) => {
                    const player = item.teamDoc;
                    return (
                      <EnhancedTeamCard
                        key={player._id}
                        player={{
                          id: player._id,
                          name: player.name,
                          type: player.playerRole,
                          image: player.logo,
                        }}
                        // mode="select"
                        // isSelected={selectedPlayers.includes(player._id)}
                        // onViewDetails={handleViewPlayerDetails}
                        showActions={true}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* ===== TABS ===== */}
      <div className="border-b border-gray-700 ">
        <ul className="flex gap-8">
          {tabs.map((tab) => (
            <li
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative cursor-pointer pb-3 text-sm font-medium transition
                ${
                  activeTab === tab.key
                    ? "text-yellow-400"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {tab.label}

              {activeTab === tab.key && (
                <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-yellow-400 rounded-full" />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="mt-6 p-4 bg-black rounded-lg text-white">
        {renderContent()}
      </div>
    </div>
  );
};

export default TeamsTab;
