import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  Users,
  Gavel,
  PlayCircle,
  Radio,
  Settings,
  CircleDot,
} from "lucide-react";
import { fetchAuctionDetails } from "../../redux/actions";
import { useNavigate } from "react-router-dom";

const DetailsOfAuction = ({ auctionId }) => {
  const dispatch = useDispatch();
  const navigate =useNavigate()

  const isLoading = useSelector(
    (state) => state.loading?.auctionDetails || false
  );

  const auctionData = useSelector(
    (state) => state.data?.auctionDetails || null
  );

  useEffect(() => {
    if (auctionId && !auctionData) {
      dispatch(fetchAuctionDetails(auctionId));
    }
  }, [dispatch, auctionId, auctionData]);

  if (isLoading || !auctionData) {
    return (
      <div className="text-center text-white/60 py-20">
        Loading auction details...
      </div>
    );
  }

  const {
    auctionName,
    auctionDate,
    auctionStatus,
    auctionType,
    isBiddingActive,
    // players,
    teams,
    auctionRules,
    // autoSettings,
    stream,
  } = auctionData;

  console.log(auctionData, "auction");

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">{auctionName}</h2>
          <p className="text-sm text-white/60 mt-1">
            Auction Type: {auctionType}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white">
            {auctionStatus.toUpperCase()}
          </span>

          {isBiddingActive && (
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
              LIVE BIDDING
            </span>
          )}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat
          icon={Calendar}
          label="Auction Date"
          value={formatDate(auctionDate)}
        />
        {/* <Stat
          icon={Clock}
          label="Started At"
          value={formatDate(startedAt)}
        /> */}
        <Stat icon={Users} label="Teams" value={teams?.length} />
        <div>{""}</div>
          <button
          onClick={() => navigate(`/live-auction/${auctionId}`)}
          className="gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg h-12 flex items-center justify-center"
        >
          <CircleDot className="w-4 h-4 text-white" />
          Live Auction
        </button>
      
        {/* {<Stat icon={Users} label="Players" value={players?.length} />} */}
      </div>
      

      {/* ================= RULES ================= */}
      <div className="rounded-2xl bg-[var(--color-primary)] backdrop-blur-md border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Gavel className="w-5 h-5 text-[var(--color-warm)]" />
          Auction Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Rule label="Budget Cap" value={`₹ ${auctionRules.budgetCap}`} />
          <Rule label="Minimum Bid" value={`₹ ${auctionRules.minimumBid}`} />
          <Rule
            label="Bid Increment"
            value={`₹ ${auctionRules.biddingIncrement}`}
          />
          <Rule
            label="Players / Team"
            value={`${auctionRules.minPlayersPerTeam} - ${auctionRules.maxPlayersPerTeam}`}
          />
          <Rule
            label="Foreign Players"
            value={auctionRules.maxForeignPlayers}
          />
          <Rule
            label="Wicket Keepers"
            value={`${auctionRules.minWicketKeepers} - ${auctionRules.maxWicketKeepers}`}
          />
          <Rule
            label="RTM Enabled"
            value={auctionRules.rtmEnabled ? "Yes" : "No"}
          />
          <Rule
            label="Unsold Re-entry"
            value={auctionRules.unsoldPlayerReEntry ? "Allowed" : "Not Allowed"}
          />
          <Rule
            label="Accelerated After"
            value={`${auctionRules.acceleratedRoundAfter} players`}
          />
        </div>
      </div>

      {/* ================= AUTO SETTINGS ================= */}
      {/* <div className="rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[var(--color-warm)]" />
          Auto Auction Settings
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniStat
            label="Player Time"
            value={`${autoSettings.playerDisplayDuration}s`}
          />
          <MiniStat
            label="Bid Interval"
            value={`${autoSettings.bidIncrementInterval}s`}
          />
          <MiniStat
            label="Auto Increment"
            value={`₹ ${autoSettings.autoBidIncrementAmount}`}
          />
          <MiniStat
            label="Extend Time"
            value={`${autoSettings.extendTimeOnBid}s`}
          />
        </div>
      </div> */}

      {/* ================= STREAM ================= */}
      {stream?.isLive && (
        <div className="rounded-2xl bg-[#154947] p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Radio className="w-5 h-5 text-[var(--color-warm)]" />
                Live Stream
              </h3>
              <p className="text-white/70 text-sm mt-1">
                Platform: {stream.platform}
              </p>
            </div>

            <a
              href={stream.streamUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-[var(--color-warm)] text-[#02271E] px-5 py-2 rounded-xl font-semibold hover:brightness-110 transition"
            >
              <PlayCircle className="w-5 h-5" />
              Watch Live
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsOfAuction;

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl bg-[var(--color-primary)] backdrop-blur-md border border-white/10 p-4">
    <Icon className="w-5 h-5 text-[var(--color-warm)] mb-2" />
    <p className="text-xs text-white/60">{label}</p>
    <p className="font-semibold text-white">{value}</p>
  </div>
);

const Rule = ({ label, value }) => (
  <div className="flex justify-between border-b border-white/10 pb-2">
    <span className="text-white/60">{label}</span>
    <span className="font-medium text-white">{value}</span>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="rounded-xl bg-black/60 backdrop-blur-md border border-white/10 p-4 text-center">
    <p className="text-xs text-white/60">{label}</p>
    <p className="font-semibold text-white mt-1">{value}</p>
  </div>
);

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
