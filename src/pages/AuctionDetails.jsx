import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  LayoutDashboard,
  Gavel,
  Users,
  Shield,
  Trophy,
} from "lucide-react";

import AuctionOverview from "../pages/AuctionDetailsTabs/AuctionOverview";
import AuctionLive from "../pages/AuctionDetailsTabs/AuctionLive";
import AuctionPlayers from "../pages/AuctionDetailsTabs/AuctionPlayers";
import AuctionTeams from "../pages/AuctionDetailsTabs/AuctionTeams";
import AuctionMatches from "../pages/AuctionDetailsTabs/AuctionMatches";

const tabs = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "auction", label: "Auction", icon: Gavel },
  { key: "players", label: "Players", icon: Users },
  { key: "teams", label: "Teams", icon: Shield },
  { key: "matches", label: "Matches", icon: Trophy },
];

const AuctionDetails = () => {
  const { auctionId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <AuctionOverview auctionId={auctionId} />;
      case "auction":
        return <AuctionLive auctionId={auctionId} />;
      case "players":
        return <AuctionPlayers auctionId={auctionId} />;
      case "teams":
        return <AuctionTeams auctionId={auctionId} />;
      case "matches":
        return <AuctionMatches auctionId={auctionId} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* <Header /> */}

      {/* IMPORTANT: pt-28 for fixed header */}
      <main className="min-h-screen bg-[#FFF9EC] px-6 py-10 pt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR */}
          <aside className="col-span-12 md:col-span-3">
            <div className="sticky top-28 bg-white rounded-2xl shadow-lg border border-black/5 p-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                      ${
                        isActive
                          ? "bg-[var(--color-primary)] text-white shadow"
                          : "text-black/60 hover:bg-black/5"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-3xl shadow-lg border border-black/5 p-6 md:p-8 min-h-[500px]">
              {renderTab()}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AuctionDetails;
