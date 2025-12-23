import React, { useState, useMemo } from "react";
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

// TAB CONTENT COMPONENTS
import TournamentDetails from "./AuctionDetailsTabs/TournamentDetails";
import DetailsOfAuction from "./AuctionDetailsTabs/DetailsOfAuction";
import AuctionPlayers from "./AuctionDetailsTabs/AuctionPlayers";
import AuctionTeams from "./AuctionDetailsTabs/AuctionTeams";
import AuctionMatches from "./AuctionDetailsTabs/AuctionMatches";

/* ===============================
   MOCK ROLE FLAGS (FROM BACKEND LATER)
================================ */
const adminLogin = true;       // ADMIN
const alreadyAdded = false;   // PLAYER
const isSelector = false;     // SELECTOR
const isTeamOwner = false;    // TEAM OWNER

/* ===============================
   BUILD USER ROLES
================================ */
const userRoles = [];

if (adminLogin) userRoles.push("admin");
if (isSelector) userRoles.push("selector");
if (isTeamOwner) userRoles.push("teamOwner");
if (alreadyAdded) userRoles.push("player");

if (userRoles.length === 0) {
  userRoles.push("newPlayer");
}

/* ===============================
   ROLE → ALLOWED TABS
================================ */
const roleTabs = {
  admin: ["info", "auction", "players","slot", "teams", "overview"],
  selector: ["info", "auction", "assignedPlayers", "trialslot"],
  teamOwner: ["info", "auction", "myteam"],
  player: ["info", "myScore"],
  newPlayer: ["info"],
};

/* ===============================
   MASTER TAB LIST
================================ */
const allTabs = [
  { key: "info", label: "Tournament Info", icon: LayoutDashboard },
  { key: "auction", label: "Auction", icon: Gavel },
  { key: "players", label: "Players", icon: Users },
  { key: "teams", label: "Teams", icon: Shield },
  { key: "overview", label: "Auction Overview", icon: Trophy },
  { key: "myteam", label: "My Team", icon: Users },
  { key: "myScore", label: "My Score", icon: Trophy },
  { key: "assignedPlayers", label: "Assigned Players", icon: Users },
  { key: "trialslot", label: "Trial Slot", icon: Trophy },
  { key: "slot", label: "Slot", icon: Gavel },

];

/* ===============================
   MAIN COMPONENT
================================ */
const AuctionDetails = () => {
  const { auctionId } = useParams();

  // highest priority role
  const currentRole = userRoles[0];

  const allowedTabKeys = roleTabs[currentRole] || [];

  const visibleTabs = useMemo(() => {
    return allTabs.filter((tab) =>
      allowedTabKeys.includes(tab.key)
    );
  }, [allowedTabKeys]);

  const [activeTab, setActiveTab] = useState(allowedTabKeys[0]);

  /* ===============================
     TAB CONTENT RENDER
  ================================ */
  const renderTab = () => {
    if (!allowedTabKeys.includes(activeTab)) {
      return <div className="text-white">Access Denied</div>;
    }

    switch (activeTab) {
      case "info":
        return <TournamentDetails auctionId={auctionId} />;

      case "auction":
        return <DetailsOfAuction auctionId={auctionId} />;

      case "players":
        return <AuctionPlayers auctionId={auctionId} />;

      case "teams":
        return <AuctionTeams auctionId={auctionId} />;

      case "overview":
        return <AuctionMatches auctionId={auctionId} />;

      case "myteam":
        return <div>My Team Component</div>;

      case "myScore":
        return <div>My Score Component</div>;

      case "assignedPlayers":
        return <div>Assigned Players Component</div>;

      case "trialslot":
        return <div>Trial Slot Component</div>;

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <main className="relative  ">
        {/* Background */}
        <div className="absolute inset-0 " />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10  grid grid-cols-12">
          {/* SIDEBAR */}
          <aside className="col-span-12 md:col-span-3">
            <div className="sticky  bg-black/80 backdrop-blur-md h-full p-3 space-y-1 border border-white/10">
              {visibleTabs.map((tab) => {
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
                          : "text-white/70 hover:bg-white/10"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}

              {/* CTA */}
              <div className="rounded-xl bg-[#154947] p-4 text-white mt-3">
                <h3 className="font-semibold mb-2">
                  Get Ready to Compete!
                </h3>
                <button className="w-full bg-[var(--color-warm)] text-[#02271E] font-semibold py-2 rounded-lg">
                  Register / Enroll
                </button>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="col-span-12 md:col-span-9">
            <div className="bg-black/80 backdrop-blur-md  p-6 min-h-[500px] text-white border border-white/10">
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
