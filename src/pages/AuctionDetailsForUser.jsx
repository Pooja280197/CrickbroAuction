import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  PlayCircle
} from "lucide-react";
import { fetchAuctionDetails } from "../redux/actions";

/* -------------------- Small Reusable UI -------------------- */

const StatCard = ({ label, value }) => (
  <div className="rounded-xl bg-white/5 border border-white/10 p-4">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-lg font-semibold mt-1">{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {title}
    </h2>
    {children}
  </div>
);

/* -------------------- Page -------------------- */

const AuctionDetailsPage = () => {
  const { auctionId } = useParams();
  const dispatch = useDispatch();
  

  const isLoading = useSelector(
    (state) => state.loading?.auctionDetails
  );

  const auctionData = useSelector(
    (state) => state.data?.auctionDetails
  );

  useEffect(() => {
    if (auctionId) dispatch(fetchAuctionDetails(auctionId));
  }, [auctionId, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <div className="h-10 w-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!auctionData) return null;

  const {
    auctionName,
    auctionDate,
    auctionStatus,
    auctionType,
    auctionRules,
    tournament,
    teams,
    stream,
    currentPlayer
  } = auctionData;

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">

      {/* ================= Sticky Header ================= */}
      <div className="sticky top-0 z-30 backdrop-blur bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">{auctionName}</h1>
            <p className="text-xs text-gray-400">
              {tournament?.name} • {auctionType?.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
              {auctionStatus}
            </span>
            <button className="px-4 py-2 text-sm rounded-lg bg-purple-600 hover:bg-purple-700">
              {auctionStatus === "ongoing" ? "Join Auction" : "Notify Me"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= Main Layout ================= */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ================= LEFT ================= */}
        <div className="space-y-8">

          {/* Overview */}
          <Section title="Overview">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Teams" value={teams?.length || 0} />
              <StatCard label="Budget / Team" value={`₹${auctionRules?.budgetCap}`} />
              <StatCard label="Min Bid" value={`₹${auctionRules?.minimumBid}`} />
              <StatCard
                label="Players / Team"
                value={auctionRules?.maxPlayersPerTeam}
              />
            </div>
          </Section>

          {/* Tournament Info */}
          <Section title="Tournament Details">
            <div className="rounded-xl bg-white/5 border border-white/10 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Location</p>
                <p>{tournament?.cityTown} • {tournament?.groundName}</p>
              </div>
              <div>
                <p className="text-gray-400">Match Type</p>
                <p>{tournament?.matchType}</p>
              </div>
              <div>
                <p className="text-gray-400">Organizer</p>
                <p>{tournament?.organizerName}</p>
              </div>
              <div>
                <p className="text-gray-400">Entry Fees</p>
                <p className="text-green-400">₹{tournament?.entryFees}</p>
              </div>
            </div>
          </Section>

          {/* Teams Preview */}
          <Section title="Teams">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams?.slice(0, 4)?.map((team) => (
                <div
                  key={team.teamId}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 flex justify-between"
                >
                  <div>
                    <p className="font-medium">{team.teamName}</p>
                    <p className="text-xs text-gray-400">
                      Players: {team.currentSquadSize}/{auctionRules?.maxPlayersPerTeam}
                    </p>
                  </div>
                  <p className="text-green-400 font-semibold">
                    ₹{team.remainingBudget}
                  </p>
                </div>
              ))}
            </div>
          </Section>

        </div>

        {/* ================= RIGHT (Sticky) ================= */}
        <div className="space-y-4 sticky top-20">

          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs text-gray-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Auction Time
            </p>
            <p className="font-semibold mt-1">{formatDate(auctionDate)}</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4">
            <p className="text-xs text-gray-300">Status</p>
            <p className="text-lg font-semibold">{auctionStatus}</p>
          </div>

          {currentPlayer && (
            <div className="rounded-xl bg-white/5 border border-purple-500/30 p-4">
              <p className="text-xs text-gray-400">Current Player</p>
              <p className="font-semibold">{currentPlayer.name}</p>
              <p className="text-green-400 font-bold mt-1">
                ₹{currentPlayer.currentBid}
              </p>
            </div>
          )}

          {stream?.isLive && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-center gap-3">
              <PlayCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="font-semibold">Live Now</p>
                <p className="text-xs text-gray-400">
                  {stream?.viewers} viewers
                </p>
              </div>
            </div>
          )}

          <button className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold">
            {auctionStatus === "ongoing" ? "Join Auction" : "Set Reminder"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AuctionDetailsPage;
