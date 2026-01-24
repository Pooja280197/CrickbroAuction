import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Info,
  Gavel,
  Users,
  Shield,
  BarChart3,
  UserCircle,
  Trophy,
  UserCheck,
  FlaskConical,
  CalendarClock,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
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
import { EnrollPlayer, fetchAuctionDetails, fetchUserRole } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import TrialSlot from "./AuctionDetailsTabs/TrialSlotTab/TrialSlot";
import RegisterPopup from "./RegisterPopup";
import { toast } from "react-toastify";
import TeamsTab from "./AuctionDetailsTabs/ManageTeams/TeamsTab";
import OwnerTeamDetails from "./Live_Auction/TeamOwner/OwnerTeamDetails";
import SelectorPlayerCard from "./AuctionDetailsTabs/AssignedPlayersTab/SelectorPlayerCard";
import AssignedPlayersToSelector from "./AuctionDetailsTabs/AssignedPlayersTab/AssignedPlayersToSelector";

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
  player: ["info"],
  newPlayer: ["info"],
};

/* ===============================
   MASTER TAB LIST
================================ */
const allTabs = [
  { key: "info", label: "Tournament Info", icon: Info },

  { key: "auction", label: "Auction", icon: Gavel },

  { key: "players", label: "Players", icon: Users },

  { key: "teams", label: "Manage Teams", icon: Shield },

  { key: "overview", label: "Auction Overview", icon: BarChart3 },

  { key: "myteam", label: "My Team", icon: UserCircle },

  { key: "myScore", label: "My Score", icon: Trophy },

  { key: "assignedPlayers", label: "Assigned Players", icon: UserCheck },

  { key: "trialslot", label: "Trial Slot", icon: FlaskConical },

  { key: "slot", label: "Slot", icon: CalendarClock },

  { key: "settings", label: "Settings", icon: Settings },

  { key: "categories", label: "Category", icon: Layers },
];

/* ===============================
   MAIN COMPONENT
================================ */
const AuctionDetails = () => {
  const { auctionId } = useParams();
  const dispatch = useDispatch();
  const [registerPopupOpen, setRegisterPopupOpen] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const playerId = localStorage.getItem("playerId");
  const userRole = useSelector((state) => state.data?.userRole);
  const [activeTab, setActiveTab] = useState("info");
  // const tournamentId = localStorage.getItem("tournamentId");
  const tournamentId = useSelector((state) => state.tournamentId);

  const isTrialType = useSelector(
    (state) => state?.data?.auctionDetails?.trailTypeAuction
  );

  useEffect(() => {
    dispatch(fetchUserRole(auctionId, playerId));
    dispatch(fetchAuctionDetails(auctionId));
  }, [auctionId, playerId]);

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

    roles.forEach((role) => {
      const tabsForRole = roleTabs[role] || [];
      tabsForRole.forEach((tab) => allTabsSet.add(tab));
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

  const allowedTabKeys = useMemo(() => {
    let tabs = getAllAllowedTabs(userRoles);

    // ❌ Remove slot if NOT trial type
    if (!isTrialType) {
      tabs = tabs.filter((tab) => tab !== "slot");
    }

    return tabs;
  }, [userRoles, isTrialType]);

  const visibleTabs = useMemo(() => {
    return allTabs.filter((tab) => allowedTabKeys.includes(tab.key));
  }, [allowedTabKeys]);

  // Set default active tab when roles load
  useEffect(() => {
    if (allowedTabKeys.length > 0 && !allowedTabKeys.includes(activeTab)) {
      setActiveTab(allowedTabKeys[0]);
    }
  }, [allowedTabKeys, activeTab]);

  

  const enrollPlayer = async () => {
    const playerId = localStorage.getItem("playerId");

    try {
      await dispatch(EnrollPlayer(auctionId, playerId));
      toast.success("Successfully Registered For The Tournament");
      setRegisterPopupOpen(false);
      dispatch(fetchUserRole(auctionId, playerId));
      // dispatch(fetchAuctionDetails(auctionId));
    } catch (error) {
      console.error(error);
      toast.error("Enroll Player Error");
    }
  };

  /* ===============================
     TAB CONTENT RENDER
  ================================ */
  const renderTab = () => {
    if (!allowedTabKeys.includes(activeTab)) {
      return <div className="text-white">Access Denied</div>;
    }

    // Extra protection
    if (activeTab === "slot" && !isTrialType) {
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
        return <TeamsTab auctionId={auctionId} />;

      case "overview":
        return <AuctionMatches auctionId={auctionId} />;

      case "settings":
        return <SettingsTab auctionId={auctionId} isTrialType={isTrialType} />;

      case "categories":
        return <Categories auctionId={auctionId} />;

      case "myteam":
        return <OwnerTeamDetails auctionId={auctionId} playerId={playerId} />;

      case "assignedPlayers":
        return <AssignedPlayersToSelector auctionId={auctionId} />;

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
        <main className="relative min-h-screen ">
          <div className="absolute inset-0 bg-black/50 " />
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
        <div className="absolute inset-0  bg-gradient-to-b from-[#021b17] via-[#073b36] to-[#071a1d]" />

        <div className="relative z-10 grid grid-cols-12 gap-4">
          {/* SIDEBAR */}
          <aside className={`col-span-12 transition-all duration-300 ${sidebarCollapsed ? "md:col-span-1" : "md:col-span-3"}`}>
            <div className="sticky bg-black/80 backdrop-blur-md h-full p-3 space-y-1 border border-white/10">
              {/* Toggle Button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition mb-2"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
                {!sidebarCollapsed && <span className="text-xs font-medium">Collapse</span>}
              </button>

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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition justify-center md:justify-start
                      ${
                        isActive
                          ? "bg-[var(--color-primary)] text-white shadow"
                          : "text-white/70 hover:bg-white/10"
                      }`}
                    title={sidebarCollapsed ? tab.label : undefined}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{tab.label}</span>}
                  </button>
                );
              })}

              {/* CTA */}
              {!sidebarCollapsed && (
                <div className="rounded-xl bg-[#154947] p-4 text-white mt-3">
                  {userRole.auctionPlayer !== true && (
                    <h3 className="font-semibold mb-2">Get Ready to Compete!</h3>
                  )}
                  <button
                    className={`w-full  text-[#02271E] font-semibold py-2 rounded-lg ${
                      userRole.auctionPlayer
                        ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                        : "bg-[var(--color-warm)] text-black "
                    }`}
                    onClick={() => setRegisterPopupOpen(true)}
                    disabled={userRole.auctionPlayer}
                  >
                    {userRole.auctionPlayer ? "Registered" : "Register / Enroll"}
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* CONTENT */}
          <section className={`col-span-12 transition-all duration-300 ${sidebarCollapsed ? "md:col-span-11" : "md:col-span-9"}`}>
            <div className="bg-black/80 backdrop-blur-md p-6 h-full text-white border border-white/10">
              {renderTab()}
            </div>
          </section>
        </div>
        <RegisterPopup
          isOpen={registerPopupOpen}
          onClose={() => setRegisterPopupOpen(false)}
          onConfirm={enrollPlayer}
          tournamentId={selectedTournamentId}
        />
      </main>

      <Footer />
    </>
  );
};

export default AuctionDetails;
