import React, { useState, useEffect } from "react";
import TeamCard from "./TeamCard";
import { Search } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAuctionTeams } from "../../redux/actions";

const AuctionTeams = () => {
  const { auctionId } = useParams();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state?.loading?.auctionTeams);
  const TeamsData = useSelector((state) => state?.data?.auctionTeams);

  const [selectedTeamToAuction, setSelectedTeamToAuction] = useState([]);
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [searchTeam, setSearchTeam] = useState("");
  const [searchAuctionTeam, setSearchAuctionTeam] = useState("");

  const filteredTeams = selectedTeamToAuction.filter((item) => {
    const player = item?.teamDoc;
    const matchesSearch = player?.name
      ?.toLowerCase()
      .includes(searchTeam.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    if (auctionId) {
      dispatch(getAuctionTeams(auctionId));
    }
  }, [auctionId]);



  return (
    <div>
      AuctionTeams
      <div className="space-y-4">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTeam}
              onChange={(e) => setSearchTeam(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={filteredTeams.length === 0}
              className={`px-5 py-2 rounded-lg text-sm font-bold ${
                filteredTeams.length > 0
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Teams ({filteredTeams.length})
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-6">
          {filteredTeams.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {filteredTeams.map((item) => {
                const player = item.teamDoc;
                return (
                  <TeamCard
                    key={player._id}
                    player={{
                      id: player._id,
                      name: player.name,
                      type: player.playerRole,
                      image: player.logo,
                    }}
                    mode="select"
                    isSelected={selectedPlayers.includes(player._id)}
                    onViewDetails={handleViewPlayerDetails}
                    showActions={true}
                  />
                );
              })}
            </div>
          ) : ( 
            <div className="text-center py-14">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-md font-semibold text-gray-900">
                No players found
              </h3>
              <p className="text-gray-500 text-sm">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default AuctionTeams;
