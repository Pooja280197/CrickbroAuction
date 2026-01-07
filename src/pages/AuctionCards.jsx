import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Edit, Delete, Trash } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { fetchAuctions } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/* ---------------- HELPERS ---------------- */

const formatAuctionDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getAuctionTabStatus = (status) => {
  if (status === "ongoing") return "live";
  if (status === "completed") return "completed";
  return "upcoming";
};

/* ---------------- TABS ---------------- */

const tabs = [
  { key: "ongoing", label: "Ongoing" },
  { key: "scheduled", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "my", label: "My auctions" },
];

const AuctionBrowse = () => {
  const [activeTab, setActiveTab] = useState("ongoing");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const playerId = localStorage.getItem("playerId");

  const isHome = window.location.pathname === "/";

  const isLoading = useSelector((state) => state.loading?.auctionList || false);

  const apiError = useSelector((state) => state.error?.auctionList || null);

  const auctionData = useSelector((state) => state.data?.auctionList || null);

  const auctions = auctionData?.data || [];

  useEffect(() => {
    if (playerId) {
      const isMyAuction = activeTab === "my";
      dispatch(fetchAuctions(activeTab, playerId, isMyAuction));
    }
  }, [dispatch, playerId, activeTab]);

  /* ---------------- FILTER ---------------- */

  const handleOpenAuction = (auctionId) => {
    navigate(`/auction-details/${auctionId}`);
  };

  console.log(auctions, "actionData");

  return (
    <>
      {!isHome && <Header />}
      <section
        className={`min-h-[60vh] px-6 sm:px-8 py-20
          ${
            isHome
              ? "bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[var(--color-primary-darker)]"
              : "bg-[#FFF9EC]"
          }`}
      >
        <div className="max-w-6xl mx-auto  ">
          {/* Title */}
          <div className="flex flex-row justify-between">
            <div
              className={`tracking-widest text-xl font-semibold border-l-4 pl-4 
              ${
                isHome
                  ? "text-[var(--color-warm)] border-[var(--color-warm)] "
                  : "text-[var(--color-primary)] border-[var(--color-primary)]"
              }`}
            >
              AUCTIONS
            </div>
            <div>
              <button
                onClick={() => {
                  navigate("/createAuction");
                }}
                className="animate-floatSoft px-5 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium shadow-md"
              >
                Create Auction
              </button>
            </div>
          </div>

          {/* <h1
            className={`text-4xl font-semibold mt-3 mb-8
              ${
                isHome
                  ? "text-white"
                  : "text-[var(--color-primary-darker)]"
              }`}
          >
            Browse live, upcoming & completed auctions
          </h1> */}

          {/* Tabs */}
          {!isHome && (
            <div className="flex flex-wrap gap-3 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2 rounded-full text-sm transition
                    ${
                      activeTab === tab.key
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-black/5 text-black/60 hover:bg-black/10"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4"
            >
              {isLoading && (
                <div className="col-span-full text-center py-20">
                  Loading auctions...
                </div>
              )}

              {!isLoading && auctions.length === 0 && (
                <div
                  className={`col-span-full py-16 text-center
                    ${isHome ? "text-white/50" : "text-black/40"}`}
                >
                  No auctions available
                </div>
              )}

              {auctions.map((auction) => (
                <motion.div
                  key={auction._id}
                  whileHover={{ scale: 1.03, y: -6 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`cursor-pointer rounded-3xl p-6 
                    ${
                      isHome
                        ? "card-glass accent-border text-white"
                        : "bg-white shadow-lg border border-black/5"
                    }`}
                >
                  {/* Top */}
                  <div
                    className="flex justify-between items-start relative"
                    onClick={() => handleOpenAuction(auction._id)}
                  >
                    <div>
                      <h3
                        className={`font-medium mb-1
                          ${isHome ? "text-white" : "text-black"}`}
                      >
                        {auction.auctionName}
                      </h3>

                      <p
                        className={`text-sm flex items-center gap-2
                          ${isHome ? "text-white/50" : "text-black/50"}`}
                      >
                        <MapPin className="w-4 h-4" />
                        {auction.tournamentId?.cityTown || "—"}
                      </p>
                    </div>
                   {activeTab === "my" && <div className="absolute top-0 right-0 flex gap-2 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200">
                      <button
                        className="p-2 rounded-lg bg-white shadow hover:bg-blue-50 "
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          navigate(`/editAuction/${auction._id}`);
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>

                      {/* <button
                        className="p-2 rounded-lg bg-white shadow hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </button> */}
                    </div>}

                    {auction.isBiddingActive && (
                      <span
                        className={`px-3 py-1 text-xs rounded-full
                          ${
                            isHome
                              ? "bg-[var(--color-warm)]/20 text-[var(--color-warm)]"
                              : "bg-green-100 text-green-700"
                          }`}
                      >
                        Live
                      </span>
                    )}
                  </div>

                  {/* Bottom */}
                  <div className="mt-4 flex items-end justify-between">
                    <div
                      className={`text-sm space-y-1
                        ${isHome ? "text-white/60" : "text-black/60"}`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[var(--color-accent-2)]" />
                        {formatAuctionDate(auction.auctionDate)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs opacity-60">TEAMS</div>
                      <div className="text-crickbroYellow text-lg font-semibold">
                        {auction.teams?.length || 0}
                      </div>
                      <span
                        className={`block text-sm underline mt-1
                          ${
                            isHome
                              ? "text-white/70"
                              : "text-[var(--color-primary)]"
                          }`}
                      >
                        View details
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {!isHome && <Footer />}
    </>
  );
};

export default AuctionBrowse;
