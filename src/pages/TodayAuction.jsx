import React, { useEffect } from "react";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuctions } from "../redux/actions";
import { Calendar, Users, Trophy, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getStatusBadge = (status) => {
  switch (status) {
    case "ongoing":
      return "bg-green-100 text-green-700";
    case "upcoming":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-slate-200 text-slate-600";
    default:
      return "bg-slate-200 text-slate-600";
  }
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function Auctions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playerId = localStorage.getItem("playerId");

  // ✅ Correct selectors
  const isLoading = useSelector(
    (state) => state.loading?.auctionList || false
  );

  const apiError = useSelector(
    (state) => state.error?.auctionList || null
  );

  const auctionData = useSelector(
    (state) => state.data?.auctionList || null
  );

  // Extract auctions array - adjust based on your API response structure
  const auctions = auctionData?.data || auctionData || [];

  useEffect(() => {
    if (playerId) {
      dispatch(fetchAuctions());
    }
  }, [dispatch, playerId]);

  // Debug logging
  console.log("Loading:", isLoading);
  console.log("Error:", apiError);
  console.log("Auction Data:", auctionData);
  console.log("Auctions array:", auctions);

  const handleOpenAuction = (auctionId) => {
    navigate(`/auction/${auctionId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Today's Auctions
          </h1>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 bg-slate-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {apiError && !isLoading && (
          <div className="text-center text-red-600 mt-10">
            Error: {apiError}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !apiError && auctions.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            No auctions available
          </div>
        )}

        {/* Auctions Grid */}
        {!isLoading && !apiError && auctions.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction) => {
              const {
                _id,
                auctionName,
                auctionStatus,
                auctionDate,
                auctionType,
                isBiddingActive,
                teams = [],
                players = [],
                tournamentId,
              } = auction;

              return (
                <div
                  key={_id}
                  onClick={() => handleOpenAuction(_id)}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden"
                >
                  {/* Top Status Strip */}
                  <div className="flex items-center justify-between px-5 py-3 border-b">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(
                        auctionStatus
                      )}`}
                    >
                      {auctionStatus?.toUpperCase() || "UNKNOWN"}
                    </span>

                    {isBiddingActive && (
                      <span className="flex items-center gap-1 text-xs text-red-600 font-semibold animate-pulse">
                        <span className="h-2 w-2 bg-red-600 rounded-full" />
                        LIVE BIDDING
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition">
                        {auctionName || "Unnamed Auction"}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {tournamentId?.name || "Tournament"} • {tournamentId?.cityTown || "Location"}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDateTime(auctionDate)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>
                          {teams.length} Teams • {players.length} Players
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Trophy size={16} />
                        <span className="capitalize">
                          {auctionType || "standard"} Auction
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="px-5 py-4 border-t bg-slate-50 flex justify-between items-center">
                    <span className="text-sm text-slate-500">
                      View Details
                    </span>

                    <button className="flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:translate-x-1 transition">
                      <PlayCircle size={16} />
                      Enter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}