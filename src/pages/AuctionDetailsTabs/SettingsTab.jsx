import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import {
  addAuctionAdmin,
  addAuctionSelector,
  addNewField,
  addTeamOwner,
  addTeamToAuction,
  fetchAllAdmin,
  fetchAllSelectors,
  fetchAllTeamOwners,
  fetchAuctionDetails,
  getAllAuctionTeam,
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
  { key: "addOwner", label: "Add Team Owner" },
  { key: "rules", label: "Edit Auction Rules" },
  { key: "rating", label: "Set Player Rating" },
  { key: "addFields", label: "Add New Field" },
];

const Settings = ({ auctionId ,isTrialType}) => {
  const [activeTab, setActiveTab] = useState("addAdmin");
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [sendAdminId, setSendAdminId] = useState(null);
  const [searchAuctionTeam, setSearchAuctionTeam] = useState("");
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState();
  const [fields, setFields] = useState([]);
  const [addName, setAddName] = useState("");

  const dispatch = useDispatch();

  const isAdminLoading = useSelector((state) => state.loading?.auctionAdmins);
  const isSelectorLoading = useSelector(
    (state) => state.loading?.auctionSelectors
  );
  const isTeamOwnersLoading = useSelector(
    (state) => state.loading?.auctionTeamOwners
  );
  const isTeamsLoading = useSelector((state) => state.loading?.allAuctionTeams);

  const adminData = useSelector((state) => state.data?.auctionAdmins || null);
  const selectorsData = useSelector(
    (state) => state.data?.auctionSelectors || null
  );
  const teamOwnersData = useSelector(
    (state) => state.data?.auctionTeamOwners || null
  );
  const tournamentTeam = useSelector(
    (state) => state.data?.allAuctionTeams || null
  );

  const auction = useSelector((state) => state.data?.auctionDetails || null);
  const searchUser = useSelector((state) => state.data?.searchUser || null);
  const adminList = adminData?.admins || [];
  const selectorList = selectorsData?.selectors || [];
  const ownerList = teamOwnersData?.data || [];
  const ratingFields = auction?.ratingField || [];

  

  useEffect(() => {
    if (activeTab === "addSelectors" || activeTab === "addAdmin") {
      setName("");
      setContact("");
    }
  }, [activeTab]);

  useEffect(() => {
    if (ratingFields.length) {
      setFields(
        ratingFields.map((field) => ({
          id: field._id, // keep backend id
          label: field.label,
          type: field.type,
        }))
      );
    }
  }, [ratingFields]);

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
      dispatch(getAllAuctionTeam());
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
      setSendAdminId("");
      setName("");
      setAddName(true);
    }
  };

  const handleAddAdmin = async () => {
    const payload=sendAdminId?sendAdminId:{mobile:contact,name:name}
    if (contact.length !== 10) {
      toast.error("Enter valid 10 digit mobile number");
      return;
    }
    if (!name.trim()) {
      toast.error("Admin name is Required");
      return;
    }

    try {
     
      const res = await dispatch(addAuctionAdmin(auctionId, payload));

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
    const payload=sendAdminId?sendAdminId:{mobile:contact,name:name}
    if (contact.length !== 10) {
      toast.error("Enter valid 10 digit mobile number");
      return;
    }
    if (!name.trim()) {
      toast.error("Selector name is Required");
      return;
    }
    try {
      const res = await dispatch(addAuctionSelector(auctionId, payload));
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
    const payload=sendAdminId?sendAdminId:{mobile:contact,name:name,teamId: selectedTeamId}
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
      await dispatch(addTeamOwner(auctionId, selectedTeamId, payload));
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

  const visibleTabs = isTrialType
  ? tabs:
   tabs.filter((tab) => tab.key !== "addSelectors" && tab.key !== "rating" && tab.key !== "addFields" )

  

  const filteredAuctionTeam = Array.isArray(tournamentTeam)
    ? tournamentTeam?.filter((item) => {
        const player = item?.teamId;
        const matchesSearch = player?.name
          ?.toLowerCase()
          .includes(searchAuctionTeam.toLowerCase());
        return matchesSearch;
      })
    : [];

  const handleAddField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: "",
        type: "string",
      },
    ]);
  };

  const handleChange = (id, key, value) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const handleDelete = (id) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ratingFields: fields.map(({ label, type }) => ({
          label,
          type,
        })),
      };

      await dispatch(addNewField(auctionId, payload));
      dispatch(fetchAuctionDetails(auctionId));

      toast.success("Fields updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  

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

    

    switch (activeTab) {
      case "addAdmin":
        return (
          <div className="min-h-screen bg-black/50 flex justify-center px-2 py-3">
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
                    disabled={!addName}
                    placeholder={addName ? "Type Name" : "Auto fetched name"}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
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
          <div className="min-h-screen bg-black/50 flex justify-center px-2 py-3">
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
                    disabled={!addName}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    placeholder={addName ? "Type Name" : "Auto fetched name"}
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

      case "addOwner":
        return (
          <div className="min-h-screen bg-black/50 flex justify-center px-2 py-3">
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
                    className="w-full bg-transparent text-white outline-none text-sm cursor-pointer"
                  >
                    <option value="" className="bg-black">
                      Select Team
                    </option>
                    {tournamentTeam?.map((item) => (
                      <option
                        key={item?.teamId?._id}
                        value={item?.teamId?._id}
                        className="bg-black"
                      >
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
                    disabled={!addName}
                    placeholder={addName ? "Type Name" : "Auto fetched name"}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-white/40"
                  />
                </div>
              </div>

              {/* OWNER LIST */}
              <div className="px-4 max-h-[220px] overflow-y-auto font-inter">
                {ownerList.map((owner) =>
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
        return (
          <Rating
            auctionId={auctionId}
            details={{
              trailTypeAuction: auction?.trailTypeAuction,
              trailStart: auction?.trailStart,
              trailEnd: auction?.trailEnd,
              ratingToSelectPlayers: {
                allrounder: auction?.ratingToSelectPlayers?.allrounder,
                batsman: auction?.ratingToSelectPlayers?.batsman,
                bowler: auction?.ratingToSelectPlayers?.bowler,
                wicketkeeper: auction?.ratingToSelectPlayers?.wicketkeeper,
              },
            }}
            fetch={() => dispatch(fetchAuctionDetails(auctionId))}
          />
        );

      case "addFields":
        return (
          <div className="p-4 border rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className=" text-lg text-crickbroYellow">
                Add Custom Fields
              </h3>

              <button
                onClick={handleAddField}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                + Add Field
              </button>
            </div>

            {fields.length === 0 && (
              <p className="text-gray-500">No fields added yet</p>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-3 mb-2 items-center">
                <input
                  type="text"
                  value={field.label}
                  placeholder="Label"
                  onChange={(e) =>
                    handleChange(field.id, "label", e.target.value)
                  }
                  className="border p-2 rounded w-1/2 bg-transparent"
                />

                <select
                  value={field.type}
                  onChange={(e) =>
                    handleChange(field.id, "type", e.target.value)
                  }
                  className="border p-2 rounded bg-transparent"
                >
                  <option value="string" className="bg-black">
                    String
                  </option>
                  <option value="number" className="bg-black">
                    Number
                  </option>
                </select>

                <button
                  onClick={() => handleDelete(field.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}

            {fields.length > 0 && (
              <button
                onClick={handleUpdate}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* ===== TABS ===== */}
      <div className="border-b border-gray-700">
        <ul className="flex gap-8">
          {visibleTabs.map((tab) => (
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
