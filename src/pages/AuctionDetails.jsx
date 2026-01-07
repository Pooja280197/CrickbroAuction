import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  LayoutDashboard,
  Gavel,
  Users,
  Shield,
  Trophy,
  Settings,
  SquareMenu,
} from "lucide-react";

// TAB CONTENT COMPONENTS
import TournamentDetails from "./AuctionDetailsTabs/TournamentDetails";
import DetailsOfAuction from "./AuctionDetailsTabs/DetailsOfAuction";
import AuctionPlayers from "./AuctionDetailsTabs/AuctionPlayers";
import AuctionTeams from "./AuctionDetailsTabs/AuctionTeams";
import AuctionMatches from "./AuctionDetailsTabs/AuctionMatches";
import SettingsTab from "./AuctionDetailsTabs/SettingsTab";
import Slot from "../pages/AuctionDetailsTabs/SlotTab/Slot";
import Categories from "./AuctionDetailsTabs/CategoryTab/Categories";
import { fetchUserRole } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import TrialSlot from "./AuctionDetailsTabs/TrialSlotTab/TrialSlot";

/* ===============================
   ROLE PRIORITY ORDER (Highest to Lowest)
================================ */
const ROLE_PRIORITY = ["admin", "selector", "teamOwner", "player"];

/* ===============================
   ROLE → ALLOWED TABS
================================ */
const roleTabs = {
  admin: [
    "info",
    "auction",
    "players",
    "slot",
    "teams",
    "overview",
    "settings",
    "categories",
  ],
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
  { key: "settings", label: "Settings", icon: Settings },
  { key: "categories", label: "Category", icon: SquareMenu },
];

/* ===============================
   MAIN COMPONENT
================================ */
const AuctionDetails = () => {
  const { auctionId } = useParams();
  const dispatch = useDispatch();
  const playerId = localStorage.getItem("playerId");

  const userRole = useSelector((state) => state.data?.userRole);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    dispatch(fetchUserRole(auctionId, playerId));
  }, [auctionId, playerId]);

  // Get all roles that are true
  // const getUserRoles = () => {
  //   if (!userRole) return ["newPlayer"];
    
  //   const roles = [];
    
  //   // Check each role flag
  //   if (userRole.admin === true) roles.push("admin");
  //   if (userRole.selector === true) roles.push("selector");
  //   if (userRole.teamOwner === true) roles.push("teamOwner");
  //   if (userRole.auctionPlayer === true) roles.push("player");
    
  //   // If no roles found, treat as new player
  //   if (roles.length === 0) roles.push("newPlayer");
    
  //   return roles;
  // };

  // Determine the highest priority role
  const getPrimaryRole = (roles) => {
    if (!roles || roles.length === 0) return "newPlayer";
    
    // Find the highest priority role
    for (const role of ROLE_PRIORITY) {
      if (roles.includes(role)) {
        return role;
      }
    }
    
    return roles[0]; // Fallback to first role
  };

  // Get all roles and merge allowed tabs (if needed)
  const getAllAllowedTabs = (roles) => {
    const allTabsSet = new Set();
    
    roles.forEach(role => {
      const tabsForRole = roleTabs[role] || [];
      tabsForRole.forEach(tab => allTabsSet.add(tab));
    });
    
    return Array.from(allTabsSet);
  };

  const userRoles = useMemo(() => {
    if (!userRole) return ["newPlayer"];
    
    const roles = [];
    
    // Check each role flag
    if (userRole.admin === true) roles.push("admin");
    if (userRole.selector === true) roles.push("selector");
    if (userRole.teamOwner === true) roles.push("teamOwner");
    if (userRole.auctionPlayer === true) roles.push("player");
    
    // If no roles found, treat as new player
    if (roles.length === 0) roles.push("newPlayer");
    
    return roles;
  }, [userRole]);
  const primaryRole = useMemo(() => getPrimaryRole(userRoles), [userRoles]);
  
  // Choose one of these approaches:
  
  // APPROACH 1: Use highest priority role only (current behavior)
  // const allowedTabKeys = useMemo(() => 
  //   roleTabs[primaryRole] || [], 
  // [primaryRole]);
  
  // APPROACH 2: Merge all tabs from all roles (if user can access multiple role tabs)
  const allowedTabKeys = useMemo(() => 
    getAllAllowedTabs(userRoles), 
  [userRoles]);

  const visibleTabs = useMemo(() => {
    return allTabs.filter((tab) => allowedTabKeys.includes(tab.key));
  }, [allowedTabKeys]);

  // Set default active tab when roles load
  useEffect(() => {
    if (allowedTabKeys.length > 0 && !allowedTabKeys.includes(activeTab)) {
      setActiveTab(allowedTabKeys[0]);
    }
  }, [allowedTabKeys, activeTab]);

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

      case "settings":
        return <SettingsTab auctionId={auctionId} />;

      case "categories":
        return <Categories auctionId={auctionId} />;

      case "myteam":
        return <div>My Team Component</div>;

      case "myScore":
        return <div>My Score Component</div>;

      case "assignedPlayers":
        return <div>Assigned Players Component</div>;

      case "trialslot":
        return <TrialSlot auctionId={auctionId} />;

      case "slot":
        return <Slot auctionId={auctionId} />;

      default:
        return null;
    }
  };

  // Show loading state while fetching roles
  if (!userRole) {
    return (
      <>
        <Header />
        <main className="relative min-h-screen">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex items-center justify-center h-screen">
            <div className="text-white">Loading...</div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Debug information (remove in production)
  const showDebug = false;

  return (
    <>
      <Header />
      <main className="relative">
        {/* Background */}
        <div className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 grid grid-cols-12">
          {/* SIDEBAR */}
          <aside className="col-span-12 md:col-span-3">
            <div className="sticky bg-black/80 backdrop-blur-md h-full p-3 space-y-1 border border-white/10">
              {/* Debug info (optional) */}
              {showDebug && (
                <div className="p-2 mb-3 text-xs bg-gray-900 rounded text-gray-300">
                  <div>Roles: {userRoles.join(", ")}</div>
                  <div>Primary: {primaryRole}</div>
                  <div>Tabs: {allowedTabKeys.join(", ")}</div>
                </div>
              )}

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
                <h3 className="font-semibold mb-2">Get Ready to Compete!</h3>
                <button className="w-full bg-[var(--color-warm)] text-[#02271E] font-semibold py-2 rounded-lg">
                  Register / Enroll
                </button>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="col-span-12 md:col-span-9">
            <div className="bg-black/80 backdrop-blur-md p-6 min-h-[500px] text-white border border-white/10">
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