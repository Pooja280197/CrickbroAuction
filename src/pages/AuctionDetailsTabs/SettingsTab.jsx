import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addAuctionAdmin,
  addAuctionSelector,
  addTeamOwner,
  addTeamToAuction,
  fetchAllAdmin,
  fetchAllSelectors,
  fetchAllTeamOwners,
  fetchAuctionDetails,
  getAllAuctionTeams,
  removeAdmin,
  removeSelector,
  removeTeamOwner,
  searchUserByMobile,
} from "../../redux/actions";
import { X } from "lucide-react";
import Loader from "../../components/Loader";
import RatingInput from "../../components/RatingInput";
import { toast } from "react-toastify";
import TeamCard from "../../components/TeamCard";
import EditAuctionRules from "./EditAuctionRules";
import Rating from "./Rating";
// import { send } from "vite";

const tabs = [
  { key: "addAdmin", label: "Add Admin" },
  { key: "addSelectors", label: "Add Selectors" },
  { key: "manageTeam", label: "Manage Team" },
  { key: "addOwner", label: "Add Team Owner" },
  { key: "rules", label: "Edit Auction Rules" },
  { key: "rating", label: "Set Player Rating" },
  { key: "auctionScreen", label: "Auction Screen" },
];

const Settings = ({ auctionId }) => {
  const [activeTab, setActiveTab] = useState("addAdmin");
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [sendAdminId, setSendAdminId] = useState(null);
  const [searchAuctionTeam, setSearchAuctionTeam] = useState("");
  const [selectedTeamToAuction, setSelectedTeamToAuction] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState();
  const [showRulesPopup, setShowRulesPopup] = useState(false);

  const dispatch = useDispatch();

  const isAdminLoading = useSelector((state) => state.loading?.auctionAdmins);
  const isSelectorLoading = useSelector(
    (state) => state.loading?.auctionSelectors
  );
  const isTeamOwnersLoading = useSelector(
    (state) => state.loading?.auctionTeamOwners
  );
  const isTeamsLoading = useSelector((state) => state.loading?.auctionTeams);

  const adminData = useSelector((state) => state.data?.auctionAdmins || null);
  const selectorsData = useSelector(
    (state) => state.data?.auctionSelectors || null
  );
  const teamOwnersData = useSelector(
    (state) => state.data?.auctionTeamOwners || null
  );
  const tournamentTeam = useSelector(
    (state) => state.data?.auctionTeams || null
  );

  const auction = useSelector((state) => state.data?.auctionDetails || null);

  const searchUser = useSelector((state) => state.data?.searchUser || null);
  const adminList = adminData?.admins || [];
  const selectorList = selectorsData?.selectors || [];
  const ownerList = teamOwnersData?.data || [];

  useEffect(() => {
    if (activeTab === "addSelectors" || activeTab === "addAdmin") {
      setName("");
      setContact("");
    }
  }, [activeTab]);

  useEffect(() => {
    if (!auctionId) return;

    if (!adminData) {
      dispatch(fetchAllAdmin(auctionId));
    }
    if (!selectorsData) {
      dispatch(fetchAllSelectors(auctionId));
    }
    if (!teamOwnersData) {
      dispatch(fetchAllTeamOwners(auctionId));
    }
    if (!tournamentTeam) {
      dispatch(getAllAuctionTeams());
    }
    if (!auction) {
      dispatch(fetchAuctionDetails(auctionId));
    }
  }, [auctionId]);

  useEffect(() => {
    if (tournamentTeam?.length > 0) {
      const alreadySelected = tournamentTeam
        .filter((item) => item?.auctionTeam === true)
        .map((item) => item?.teamId?._id);

      setSelectedTeam(alreadySelected);
    }
  }, [tournamentTeam]);

  console.log(auction,"auction")

  const handleContactChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setContact(value);
    }
    if (value.length === 10) {
      try {
        const res = await dispatch(searchUserByMobile(value));

        if (res?.data?.data) {
          setName(res.data.data.name);
          setSendAdminId(res.data.data._id);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setName("");
    }
  };

  const handleAddAdmin = async () => {
    if (contact.length !== 10) {
      toast.error("Enter valid 10 digit mobile number");
      return;
    }
    if (!name.trim()) {
      toast.error("Admin name is Required");
      return;
    }
    try {
      const res = await dispatch(addAuctionAdmin(auctionId, sendAdminId));

      if (res?.data) {
        toast.success("Admin Added!");
        dispatch(fetchAllAdmin(auctionId));
        setSendAdminId(null);
        setContact("");
        setName("");
      }
    } catch (err) {
      toast.error("Admin already added or server error");
      console.log("Admin already added or server error", err);
    }
  };

  const handleRemoveAdmin = async (adminId) => {
    try {
      await dispatch(removeAdmin(auctionId, adminId));
      toast.success("Admin removed");
      dispatch(fetchAllAdmin(auctionId));
    } catch (err) {
      toast.error("Failed to remove admin");
      console.log("Error removing Admin", err);
    }
  };

  const handleAddSelector = async () => {
    if (contact.length !== 10) {
      toast.error("Enter valid 10 digit mobile number");
      return;
    }
    if (!name.trim()) {
      toast.error("Selector name is Required");
      return;
    }
    try {
      const res = await dispatch(addAuctionSelector(auctionId, sendAdminId));
      if (res?.data) {
        toast.success("Selector Added!");
        dispatch(fetchAllSelectors(auctionId));
        setSendAdminId(null);
        setContact("");
        setName("");
      }
    } catch (err) {
      toast.error("Selector already added or server error");
      console.log("Selector already added or server error", err);
    }
  };

  const handleRemoveSelector = async (selectorId) => {
    try {
      await dispatch(removeSelector(auctionId, selectorId));
      toast.success("Selector removed successfully");
      dispatch(fetchAllSelectors(auctionId));
    } catch (err) {
      toast.error("Failed to remove selector");
      console.log("Error removing selector", err);
    }
  };

  const handleAddTeamOwner = async () => {
    if (!selectedTeamId) {
      toast.error("Please select a team");
      return;
    }
    if (contact.length !== 10) {
      toast.error("Enter valid 10 digit mobile number");
      return;
    }
    if (!name.trim()) {
      toast.error("Owner name is required");
      return;
    }
    try {
      await dispatch(addTeamOwner(auctionId, selectedTeamId, sendAdminId));
      toast.success("Team Owner Added!");
      setSelectedTeamId(null);
      setSendAdminId(null);
      setContact("");
      setName("");
      dispatch(fetchAllTeamOwners(auctionId));
    } catch (err) {
      toast.error("Owner already exists or server error");
      console.log("Error adding Team Owner", err);
    }
  };

  const handleRemoveTeamOwner = async (ownerId, teamId) => {
    try {
      await dispatch(removeTeamOwner(auctionId, ownerId, teamId));
      toast.success("Team Owner removed successfully");
      dispatch(fetchAllTeamOwners(auctionId));
    } catch (err) {
      toast.error("Failed to remove team owner");
      console.log("Error removing team owner", err);
    }
  };

  const filteredAuctionTeam = Array.isArray(tournamentTeam)
    ? tournamentTeam?.filter((item) => {
        const player = item?.teamId;
        const matchesSearch = player?.name
          ?.toLowerCase()
          .includes(searchAuctionTeam.toLowerCase());
        return matchesSearch;
      })
    : [];

  const renderContent = () => {
    if (activeTab === "addAdmin" && isAdminLoading) {
      return <Loader text="Loading admins..." />;
    }

    if (activeTab === "addSelectors" && isSelectorLoading) {
      return <Loader text="Loading selector slots..." />;
    }

    if (activeTab === "addOwner" && isTeamOwnersLoading) {
      return <Loader text="Loading Team Owners..." />;
    }
    if (activeTab === "manageTeam" && isTeamsLoading) {
      return <Loader text="Loading Teams..." />;
    }

    switch (activeTab) {
      case "addAdmin":
        return (
          <div className="min-h-screen bg-hero-gradient flex justify-center px-2 py-3">
            <div className="w-full card-glass relative">
              {/* HEADER */}
              <div className="py-3 text-center border-b border-white/10">
                <h1 className="text-base font-oswald tracking-wide text-crickbroYellow">
                  Add Admin
                </h1>
              </div>

              {/* FORM */}
              <div className="px-4 py-3 space-y-2 font-inter">
                {/* Mobile */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-crickbroPurple">
                  <span className="text-crickbroPurple text-sm">📱</span>
                  <input
                    type="tel"
                    value={contact}
                    onChange={handleContactChange}
                    placeholder="Contact number"
                    maxLength={10}
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-white/40"
                  />
                </div>

                {/* Name */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-crickbroYellow text-sm">👤</span>
                  <input
                    type="text"
                    value={name}
                    disabled
                    placeholder="Auto fetched name"
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-white/40 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* ADMIN LIST */}
              <div className="px-4 max-h-[210px] overflow-y-auto font-inter">
                {adminList.map((admin) => (
                  <div
                    key={admin._id}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-none"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-[11px] font-bold text-primary-darker uppercase">
                        {admin?.name?.substring(0, 2)}
                      </div>
                      <span className="text-xs text-white truncate max-w-[160px]">
                        {admin.name}
                      </span>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => handleRemoveAdmin(admin._id)}
                      className="text-white/40 hover:text-red-400 transition text-sm"
                      title="Remove admin"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={handleAddAdmin}
                  className="w-full btn-primary py-2 text-sm"
                >
                  Add Admin
                </button>
              </div>
            </div>
          </div>
        );
      case "addSelectors":
        return (
          <div className="min-h-screen bg-hero-gradient flex justify-center px-2 py-3">
            <div className="w-full  card-glass relative">
              {/* HEADER */}
              <div className="py-3 text-center border-b border-white/10">
                <h1 className="text-base font-oswald tracking-wide text-crickbroYellow">
                  Add Selector
                </h1>
              </div>

              {/* FORM */}
              <div className="px-4 py-3 space-y-2 font-inter">
                {/* Mobile */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-crickbroPurple transition">
                  <span className="text-crickbroPurple text-sm">📱</span>
                  <input
                    type="tel"
                    value={contact}
                    onChange={handleContactChange}
                    placeholder="Contact number"
                    maxLength={10}
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-white/40"
                  />
                </div>

                {/* Name */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-crickbroYellow text-sm">👤</span>
                  <input
                    type="text"
                    value={name}
                    disabled
                    placeholder="Auto fetched name"
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-white/40 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* LIST */}
              <div className="px-4 max-h-[210px] overflow-y-auto font-inter">
                {selectorList.map((selector) => (
                  <div
                    key={selector._id}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-none"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-[11px] font-bold text-primary-darker uppercase">
                        {selector?.name?.substring(0, 2)}
                      </div>
                      <span className="text-xs text-white truncate max-w-[160px]">
                        {selector.name}
                      </span>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => handleRemoveSelector(selector._id)}
                      className="text-white/40 hover:text-red-400 transition text-sm"
                      title="Remove selector"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={handleAddSelector}
                  className="w-full btn-primary py-2 text-sm"
                >
                  Add Selector
                </button>
              </div>
            </div>
          </div>
        );

      case "manageTeam":
        return (
          <div className=" bg-black/50 flex justify-center items-center px-2">
            {/* MODAL */}
            <div className="w-full max-w-7xl h-[90vh] card-glass flex flex-col animate-slideDown">
              {/* HEADER */}
              <div className="sticky top-0 z-20 px-5 py-3 border-b border-white/10 bg-primary-darker/80 backdrop-blur">
                <div className="flex flex-col gap-3">
                  {/* TITLE ROW */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-oswald tracking-wide text-crickbroYellow flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-gradient"></span>
                      All Teams
                    </h2>
                  </div>

                  {/* SEARCH + ACTIONS */}
                  <div className="flex flex-wrap gap-2 items-center font-inter">
                    {/* Search */}
                    <input
                      type="text"
                      placeholder="Search team..."
                      value={searchAuctionTeam}
                      onChange={(e) => setSearchAuctionTeam(e.target.value)}
                      className="flex-1 min-w-[180px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-white/40 focus:border-crickbroPurple outline-none"
                    />

                    {/* Select All */}
                    <button
                      onClick={() => {
                        if (
                          selectedTeam.length === filteredAuctionTeam.length
                        ) {
                          setSelectedTeam([]);
                        } else {
                          setSelectedTeam(
                            filteredAuctionTeam.map((i) => i?.teamId?._id)
                          );
                        }
                      }}
                      className="px-3 py-2 rounded-lg text-xs border border-white/10 text-white/80 hover:bg-white/5 transition"
                    >
                      {selectedTeam.length === filteredAuctionTeam.length
                        ? "Deselect All"
                        : "Select All"}
                    </button>

                    {/* Add Button */}
                    <button
                      disabled={selectedTeam.length === 0}
                      onClick={() => {
                        dispatch(addTeamToAuction(auctionId, selectedTeam));
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                        selectedTeam.length > 0
                          ? "bg-accent-gradient text-primary-darker shadow-md"
                          : "bg-white/10 text-white/40 cursor-not-allowed"
                      }`}
                    >
                      Add ({selectedTeam.length})
                    </button>
                  </div>
                </div>
              </div>

              {/* GRID */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 justify-items-center">
                  {filteredAuctionTeam.map((item) => {
                    const team = item.teamId;

                    return (
                      <TeamCard
                        key={team._id}
                        team={{
                          id: team._id,
                          name: team.name,
                          type: team.playerRole,
                          image: team.logo,
                        }}
                        isSelected={selectedTeam.includes(team._id)}
                        onSelect={(id) =>
                          setSelectedTeam((prev) =>
                            prev.includes(id)
                              ? prev.filter((x) => x !== id)
                              : [...prev, id]
                          )
                        }
                        showActions
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case "addOwner":
        return (
          <div className="min-h-screen bg-hero-gradient flex justify-center px-2 py-3">
            <div className="w-full card-glass relative">
              {/* HEADER */}
              <div className="py-3 text-center border-b border-white/10">
                <h1 className="text-base font-oswald tracking-wide text-crickbroYellow">
                  Add Team Owner
                </h1>
              </div>

              {/* INPUTS */}
              <div className="px-4 py-3 space-y-2 font-inter">
                {/* TEAM SELECT */}
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-crickbroPurple transition">
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full bg-transparent text-black outline-none text-sm cursor-pointer"
                  >
                    <option value="">Select Team</option>
                    {tournamentTeam?.map((item) => (
                      <option key={item?.teamId?._id} value={item?.teamId?._id}>
                        {item?.teamId?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* MOBILE */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus-within:border-crickbroPurple">
                  <span className="text-crickbroPurple text-sm">📱</span>
                  <input
                    type="tel"
                    value={contact}
                    onChange={handleContactChange}
                    placeholder="Contact number"
                    maxLength={10}
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-white/40"
                  />
                </div>

                {/* NAME */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-crickbroYellow text-sm">👤</span>
                  <input
                    type="text"
                    value={name}
                    readOnly
                    placeholder="Auto fetched name"
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-white/40"
                  />
                </div>
              </div>

              {/* OWNER LIST */}
              <div className="px-4 max-h-[220px] overflow-y-auto font-inter">
                {ownerList.map((owner) =>
              // console.log(owner.teamId)
                  owner?.owners?.map((oname) => (
                    <div
                      key={oname._id}
                      className="flex items-center justify-between py-2 border-b border-white/5 last:border-none"
                    >
                      {/* LEFT */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-[11px] font-bold text-primary-darker uppercase">
                          {oname?.name?.substring(0, 2)}
                        </div>

                        <div className="flex flex-col leading-tight">
                          <span className="text-xs text-white">
                            {oname?.name}
                          </span>
                          <span className="text-[10px] text-white/50">
                            {owner?.team?.name}
                          </span>
                        </div>
                      </div>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleRemoveTeamOwner(oname._id, owner?.team?._id)
                        }
                        className="text-white/40 hover:text-red-400 transition text-sm"
                        title="Remove owner"
                      >
                        🗑
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* CTA */}
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={handleAddTeamOwner}
                  className="w-full btn-primary py-2 text-sm"
                >
                  Add Owner
                </button>
              </div>
            </div>
          </div>
        );

      case "rules":
        return (
          <EditAuctionRules
            currentRules={auction?.auctionRules}
            auctionId={auctionId}
            // fetchData={fetchAuction}
          />
        );

      case "rating":
        return <Rating
         auctionId={auctionId}
         details={{
            trailTypeAuction: auction?.trailTypeAuction,
            trailStart: auction?.trailStart,
            trailEnd: auction?.trailEnd,
            ratingToSelectPlayers: {
              allrounder: auction?.ratingToSelectPlayers?.allrounder,
              batsman: auction?.ratingToSelectPlayers?.batsman,
              bowler: auction?.ratingToSelectPlayers?.bowler,
              wicketkeeper:
                auction?.ratingToSelectPlayers?.wicketkeeper,
            },
          }}
           fetch={() => dispatch(fetchAuctionDetails(auctionId))}
          />;
      case "auctionScreen":
        return <div>Auction Screen Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* ===== TABS ===== */}
      <div className="border-b border-gray-700">
        <ul className="flex gap-8">
          {tabs.map((tab) => (
            <li
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative cursor-pointer pb-3 text-sm font-medium transition
                ${
                  activeTab === tab.key
                    ? "text-yellow-400"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              {tab.label}

              {activeTab === tab.key && (
                <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-yellow-400 rounded-full" />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="mt-6 p-4 bg-black rounded-lg text-white">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;
