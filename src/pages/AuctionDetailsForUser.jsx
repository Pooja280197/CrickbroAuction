import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchAuctionDetails, EnrollPlayer, fetchUserRole } from "../redux/actions";
import Header from "../components/Header";
import RegisterPopup from "./RegisterPopup";
import { toast } from "react-toastify";
// import { fetchAuctionDetails } from "@/store/actions/auctionActions";

const StatCard = ({ label, value }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition"
  >
    <p className="text-[11px] uppercase tracking-wide text-white/60">{label}</p>
    <p className="text-lg font-semibold text-white">{value}</p>
  </motion.div>
);

const Skeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-56 bg-white/5 rounded-xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-white/5 rounded-lg" />
      ))}
    </div>
    <div className="h-32 bg-white/5 rounded-xl" />
  </div>
);

export default function AuctionDetailsPage() {
  const { auctionId } = useParams();
  const dispatch = useDispatch();
  const [registerPopupOpen, setRegisterPopupOpen] = useState(false);

  const isLoading = useSelector(
    (state) => state.loading?.auctionDetails || false
  );

  const auctionData = useSelector(
    (state) => state.data?.auctionDetails || null
  );

  const userRole = useSelector((state) => state.data?.userRole || {});

  useEffect(() => {
    if (auctionId ) {
      dispatch(fetchAuctionDetails(auctionId));
      const playerId = localStorage.getItem("playerId");
      if (playerId) {
        dispatch(fetchUserRole(auctionId, playerId));
      }
    }
  }, [dispatch, auctionId]);

  const enrollPlayer = async () => {
    const playerId = localStorage.getItem("playerId");

    try {
      await dispatch(EnrollPlayer(auctionId, playerId));
      toast.success("Successfully Registered For The Tournament");
      setRegisterPopupOpen(false);
      dispatch(fetchUserRole(auctionId, playerId));
    } catch (error) {
      console.error(error);
      toast.error("Enrollment Failed");
    }
  };

  if (isLoading || !auctionData) {
    return <Skeleton />;
  }

  const { auctionRules, teams, tournamentId } = auctionData;
  console.log(auctionData,"dataa")

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-primary-darker)] text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-56 rounded-2xl overflow-hidden border border-white/10"
        >
          <img
            src={tournamentId.bannerLogo}
            alt="banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 flex items-end">
            <div className="flex items-center gap-4">
              <img
                src={tournamentId.logo}
                alt="logo"
                className="h-16 w-16 rounded-full bg-white object-cover border-2 border-white/20"
              />
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white leading-tight">
                  {auctionData.auctionName}
                </h1>
                <p className="text-sm text-white/70">
                  {tournamentId?.name} • {auctionData.cityTown}
                </p>
                <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${
                  auctionData.auctionStatus === 'ongoing' 
                    ? 'bg-green-500/80 text-white' 
                    : auctionData.auctionStatus === 'completed'
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-[var(--color-warm)]/80 text-[var(--color-primary-darker)]'
                }`}>
                  {auctionData.auctionStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Teams" value={teams.length} />
          <StatCard label="Budget Cap" value={`₹${auctionRules.budgetCap / 100000}L`} />
          <StatCard label="Match Type" value={auctionData.matchType?.toUpperCase()} />
          <StatCard label="Ball Type" value={tournamentId.ballType.charAt(0)?.toUpperCase() + tournamentId.ballType.slice(1)} />
        </div>

        {/* TOURNAMENT */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
          <h2 className="text-lg font-bold mb-4 text-[var(--color-warm)]">Tournament Details</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-white/80">
            <div>
              <p className="text-xs text-white/60 mb-1">📍 Ground</p>
              <p className="font-semibold text-white">{tournamentId.groundName}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">📅 Duration</p>
              <p className="font-semibold text-white">{tournamentId.date}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">👤 Organizer</p>
              <p className="font-semibold text-white">{tournamentId.organizerName}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">💰 Entry Fee</p>
              <p className="font-semibold text-white">₹{tournamentId.entryFees}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">🏟️ Pitch Type</p>
              <p className="font-semibold text-white">{tournamentId.pitchType.charAt(0).toUpperCase() + tournamentId.pitchType.slice(1)}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">🏏 Tournament Type</p>
              <p className="font-semibold text-white">{tournamentId.tournamentType.charAt(0).toUpperCase() + tournamentId.tournamentType.slice(1)}</p>
            </div>
          </div>
        </div>

        {/* TEAMS */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-[var(--color-warm)]">Teams</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teams.map((team) => (
              <motion.div
                key={team.teamId}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition"
              >
                <h3 className="text-base font-semibold text-white">{team.teamName}</h3>
                <p className="text-xs text-white/60 mt-1">
                  ₹{team.remainingBudget} left • {team.currentSquadSize} players
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RULES */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
          <h2 className="text-lg font-bold mb-4 text-[var(--color-warm)]">Auction Rules</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-white/80">
            <p>• Min Bid: ₹{auctionRules.minimumBid}</p>
            <p>• Increment: ₹{auctionRules.biddingIncrement}</p>
            <p>• Min Players: {auctionRules.minPlayersPerTeam}</p>
            <p>• Max Players: {auctionRules.maxPlayersPerTeam}</p>
            <p>• Max Foreign: {auctionRules.maxForeignPlayers}</p>
            <p>• Max Wicket Keepers: {auctionRules.maxWicketKeepers}</p>
            <p>• RTM: {auctionRules.rtmEnabled ? "✓ Enabled" : "✗ Disabled"}</p>
            <p>• Unsold Re-entry: {auctionRules.unsoldPlayerReEntry ? "✓ Enabled" : "✗ Disabled"}</p>
          </div>
        </div>

        {/* AUCTION STATUS */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
          <h2 className="text-lg font-bold mb-4 text-[var(--color-warm)]">Auction Status</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-white/60 mb-1">Auction Type</p>
              <p className="font-semibold text-white capitalize">{auctionData.auctionType === 'auto' ? '⚡ Automated' : '👨 Manual'} Auction</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Bidding Status</p>
              <p className={`font-semibold ${auctionData.isBiddingActive ? 'text-green-400' : 'text-red-400'}`}>
                {auctionData.isBiddingActive ? '🟢 Active' : '🔴 Paused'}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Started At</p>
              <p className="font-semibold text-white">{new Date(auctionData.startedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-white/60 mb-1">Total Teams</p>
              <p className="font-semibold text-white">{teams.length} Teams</p>
            </div>
          </div>
        </div>

        {/* CURRENT PLAYER */}
        {auctionData.currentPlayer && (
          <div className="bg-gradient-to-r from-[var(--color-warm)]/20 to-[#FF6B35]/20 border border-[var(--color-warm)]/30 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4 text-[var(--color-warm)]">🎯 Currently Auctioning</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <span className="text-2xl">🏏</span>
              </div>
              <div>
                <p className="text-xs text-white/60">Player ID</p>
                <p className="font-bold text-white text-lg">{auctionData.currentPlayer.playerId}</p>
                <p className="text-xs text-white/60 mt-2">Started: {new Date(auctionData.currentPlayer.startedAt).toLocaleTimeString('en-IN')}</p>
              </div>
            </div>
          </div>
        )}

        {/* AWARDS */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-[var(--color-warm)]">Awards</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {auctionData.tournament.awardList.map((award, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-[var(--color-warm)]/80 to-[#FF6B35]/80 rounded-2xl p-4 border border-white/10"
              >
                <p className="text-xs font-medium ]">{award.award}</p>
                <p className="text-sm font-semibold text-white mt-1">{award.cashValue}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* STREAM */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex justify-between items-center hover:bg-white/10 transition">
          <div>
            <p className="text-sm font-medium text-white">Live Stream</p>
            <p className="text-xs text-white/60">{auctionData.stream.platform}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-xl text-xs font-bold ${
              auctionData.stream.isLive
                ? "bg-red-500/80 text-white animate-pulse"
                : "bg-white/10 text-white/60"
            }`}
          >
            {auctionData.stream.isLive ? "🔴 LIVE" : "⚫ OFFLINE"}
          </span>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          {/* <button className="px-8 py-3 bg-gradient-to-r from-[var(--color-warm)] to-[#FF6B35] text-[var(--color-primary-darker)] font-bold rounded-xl hover:shadow-lg hover:shadow-[var(--color-warm)]/50 transition">
            Explore Teams
          </button> */}
          
          {localStorage.getItem("playerId") && (
            <button
              onClick={() => setRegisterPopupOpen(true)}
              disabled={userRole.auctionPlayer}
              className={`px-8 py-3 font-bold rounded-xl transition ${
                userRole.auctionPlayer
                  ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                  : "bg-white text-[var(--color-primary-darker)] hover:shadow-lg hover:shadow-white/50"
              }`}
            >
              {userRole.auctionPlayer ? "✓ Already Registered" : "Register for Auction"}
            </button>
          )}
        </div>
      </div>

      {/* Register Popup */}
      <RegisterPopup
        isOpen={registerPopupOpen}
        onClose={() => setRegisterPopupOpen(false)}
        onConfirm={enrollPlayer}
        tournamentId={auctionId}
      />
    </div>
  );
}
