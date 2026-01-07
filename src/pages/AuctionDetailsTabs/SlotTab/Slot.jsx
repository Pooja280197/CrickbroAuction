import React, { useEffect, useState } from "react";
import {
  createSession,
  createSlot,
  deleteSession,
  deleteSlot,
  editSession,
  fetchAllSelectors,
  fetchSlotList,
  updateSlotThunk,
} from "../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import SlotPopup from "./SlotPopup";
import SessionPopup from "./SessionPopup";
import { toast } from "react-toastify";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";

const Slot = ({ auctionId }) => {
  const [slotPopup, setSlotPopup] = useState(false);
  const [isEditingSlot, setIsEditingSlot] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteContext, setDeleteContext] = useState({
    type: null, // "slot" | "session"
    slotId: null,
    sessionId: null,
  });

  const [slotData, setSlotData] = useState({
    tournamentId: localStorage.getItem("tournamentId") || "",
    auctionId: auctionId || "",
    slotName: "",
    slotCode: "",
    description: "",
    selectors: [],
    location: {
      venue: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      link: "",
    },
  });

  const slotLoading = useSelector((state) => state?.loading?.slotList);
  const slotDetails = useSelector((state) => state?.data?.slotList);
  const selectorsList = useSelector(
    (state) => state?.data?.auctionSelectors?.selectors
  );

  const slotList = slotDetails?.data || [];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchSlotList(auctionId));
    dispatch(fetchAllSelectors(auctionId));
  }, [auctionId, dispatch]);

  const [slotLocalList, setSlotLocalList] = useState([]);

  useEffect(() => {
    if (!Array.isArray(slotList)) return;

    // Avoid updating local state if content is identical to prevent update loops
    const slotSig = slotList
      .map((s) => `${s._id}|${s.updatedAt || ""}`)
      .join(",");
    const localSig = slotLocalList
      .map((s) => `${s._id}|${s.updatedAt || ""}`)
      .join(",");

    if (slotSig !== localSig) {
      setSlotLocalList(slotList);
    }
  }, [slotList, slotLocalList]);

  const resetSlotForm = () => {
    setSlotData({
      slotName: "",
      slotCode: "",
      description: "",
      location: {
        venue: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        link: "",
      },
      selectors: [],
    });
  };

  const [expandedSlots, setExpandedSlots] = useState([]);
  const [sessionForm, setSessionForm] = useState({
    isOpen: false,
    slotId: null,
    isEditing: false,
    editSessionId: null,
    data: {
      name: "",
      slotDate: "",
      slotStartTime: "",
      slotEndTime: "",
      status: "scheduled",
      lockStatus: "unlocked",
    },
  });

  const toggleSlotSessions = (slotId) => {
    setExpandedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const openCreateSession = (slotId) => {
    setSessionForm({
      isOpen: true,
      slotId,
      isEditing: false,
      editSessionId: null,
      data: {
        name: "",
        slotDate: "",
        slotStartTime: "",
        slotEndTime: "",
        status: "scheduled",
        lockStatus: "unlocked",
      },
    });
  };

  const openEditSession = (slotId, session) => {
    setSessionForm({
      isOpen: true,
      slotId,
      isEditing: true,
      editSessionId: session._id,
      data: {
        name: session.name || "",
        slotDate: session.slotDate || "",
        slotStartTime: session.slotStartTime || "",
        slotEndTime: session.slotEndTime || "",
        status: session.status || "scheduled",
        lockStatus: session.lockStatus,
      },
    });
  };

  const closeSessionForm = () =>
    setSessionForm({
      isOpen: false,
      slotId: null,
      isEditing: false,
      editSessionId: null,
      data: { name: "", slotDate: "", slotStartTime: "", slotEndTime: "" },
    });

  const handleSessionChange = (e) => {
    const { name, value } = e.target;
    setSessionForm((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
    }));
  };

  const handleSaveSession = async () => {
    const { slotId, isEditing, editSessionId, data } = sessionForm;

    if (
      !slotId ||
      !data.name ||
      !data.slotDate ||
      !data.slotStartTime ||
      !data.slotEndTime
    ) {
      toast.error("Please fill all session fields");
      return;
    }

    if (!slotId) return;

    try {
      if (isEditing) {
        await dispatch(editSession(slotId, editSessionId, data));
        toast.success("Session updated successfully");
      } else {
        await dispatch(createSession(slotId, data));
        toast.success("Session created successfully");
      }
      dispatch(fetchSlotList(auctionId));
      closeSessionForm();
      // optionally refresh sessions list here
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleConfirmDelete = async () => {
    const { type, slotId, sessionId } = deleteContext;

    try {
      if (type === "session") {
        await dispatch(deleteSession(slotId, sessionId));
        toast.success("Session deleted successfully");
      }

      if (type === "slot") {
        await dispatch(deleteSlot(slotId));
        toast.success("Slot deleted successfully");
      }

      dispatch(fetchSlotList(auctionId));
      setOpenDelete(false);
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;

    if (name === "selectors") {
      setSlotData((prev) => ({
        ...prev,
        selectors: Array.isArray(value) ? value : [],
      }));
      return;
    }

    if (name === "location") {
      setSlotData((prev) => ({
        ...prev,
        location: value,
      }));
      return;
    }

    setSlotData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSlot = (slot) => {
    setSelectedSlot(slot._id);
    setIsEditingSlot(true);

    setSlotData({
      slotName: slot.slotName || "",
      slotCode: slot.slotCode || "",
      description: slot.description || "",
      selectors: slot.selectors || [],
      location: {
        venue: slot.location?.venue || "",
        address: slot.location?.address || "",
        city: slot.location?.city || "",
        state: slot.location?.state || "",
        country: slot.location?.country || "",
        pincode: slot.location?.pincode || "",
        link: slot.location?.link || "",
      },
      tournamentId:
        slot.tournamentId?._id ||
        slot.tournamentId ||
        localStorage.getItem("tournamentId") ||
        "",
      auctionId: slot.auctionId?._id || slot.auctionId || auctionId || "",
      _id: slot._id,
    });

    setSlotPopup(true);
  };

  const handleUpdateSlot = async (slotData) => {
    if (!selectedSlot) {
      toast.error("No slot selected for update");
      return;
    }

    try {
      const updateData = {
        ...slotData,
        tournamentId:
          slotData.tournamentId || localStorage.getItem("tournamentId") || "",
        auctionId: slotData.auctionId || auctionId || "",
        _id: selectedSlot,
      };

      await dispatch(updateSlotThunk(selectedSlot, updateData));
      toast.success("Slot updated successfully!");
      setSlotLocalList((prev) =>
        prev.map((s) => (s._id === selectedSlot ? { ...s, ...updateData } : s))
      );
      dispatch(fetchSlotList(auctionId));
      setSlotPopup(false);
      setIsEditingSlot(false);
      setSelectedSlot(null);
      resetSlotForm();
    } catch (error) {
      console.error("Error updating slot:", error);
      toast.error(error.message || "Error updating slot");
    }
  };

  // const handleDeleteSlot = async (slotId) => {
  //   try {
  //     await dispatch(deleteSlot(slotId));
  //     toast.success("Slot removed successfully");
  //     const updated = slotLocalList.filter((s) => s._id !== slotId);
  //     setSlotLocalList(updated);
  //     dispatch(fetchSlotList(auctionId));
  //   } catch (err) {
  //     toast.error("Failed to remove slot");
  //     console.log("Error removing slot", err);
  //   }
  // };

  const handleCreateSlot = async () => {
    if (!slotData.tournamentId) {
      slotData.tournamentId = localStorage.getItem("tournamentId");
    }
    if (!slotData.auctionId) {
      slotData.auctionId = auctionId;
    }
    try {
      await dispatch(createSlot(slotData));
      toast.success("Slot created successfully!");
      dispatch(fetchSlotList(auctionId));
      setSlotPopup(false);
      resetSlotForm();
    } catch (error) {
      console.error("Error creating slot:", error);
      toast.error("Error creating slot");
    }
  };

  return (
    <div className=" text-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6 max-w-6xl">
        <h4 className="text-xl font-semibold text-white">Slots</h4>
        <button
          onClick={() => setSlotPopup(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-cyan-500/20"
        >
          Create Slot
        </button>
      </div>

      {/* Slots Table */}
      {slotLocalList.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
          <div className="text-gray-400 mb-2">No slots available</div>
          <div className="text-sm text-gray-500">
            Create your first slot to get started
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/30 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Venue / City
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-300 uppercase tracking-wider border-b border-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {slotLocalList.map((slot, idx) => (
                  <React.Fragment key={slot._id}>
                    <tr
                      className={`hover:bg-gray-800/40 transition-colors duration-150 ${
                        idx % 2 === 0 ? "bg-gray-900/20" : "bg-gray-900/10"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {slot.slotName}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {slot.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded inline-block">
                          {slot.slotCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {slot.location?.venue}
                        </div>
                        <div className="text-xs text-gray-500">
                          {slot.location?.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            slot.status === "active"
                              ? "bg-emerald-900/30 text-emerald-300 border border-emerald-800"
                              : "bg-gray-800/50 text-gray-400 border border-gray-700"
                          }`}
                        >
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(slot.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditSlot(slot)}
                            className="px-3 py-1.5 text-xs bg-cyan-900/20 text-cyan-300 rounded-lg border border-cyan-800 hover:bg-cyan-900/30 hover:border-cyan-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            // onClick={() => handleDeleteSlot(slot._id)}
                            onClick={() => {
                              setDeleteContext({
                                type: "slot",
                                slotId: slot._id,
                                sessionId: null,
                              });
                              setOpenDelete(true);
                            }}
                            className="px-3 py-1.5 text-xs bg-red-900/20 text-red-300 rounded-lg border border-red-800 hover:bg-red-900/30 hover:border-red-700 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => toggleSlotSessions(slot._id)}
                            className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-900/30 to-purple-900/30 text-blue-300 rounded-lg border border-blue-800 hover:from-blue-900/40 hover:to-purple-900/40 hover:border-blue-700 transition-all"
                          >
                            {expandedSlots.includes(slot._id)
                              ? "Hide Sessions"
                              : "View Sessions"}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedSlots.includes(slot._id) && (
                      <tr>
                        <td
                          colSpan={6}
                          className="bg-gray-900/50 border-t border-gray-800"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h5 className="text-lg font-semibold text-white mb-1">
                                  Sessions
                                </h5>
                                <div className="text-sm text-gray-400">
                                  Total: {(slot.sessions || []).length} sessions
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => openCreateSession(slot._id)}
                                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 border border-gray-700"
                                >
                                  + Create Session
                                </button>
                                {/* <button
                                  onClick={() =>
                                    dispatch(fetchSlotList(auctionId))
                                  }
                                  className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700"
                                >
                                  ↻ Refresh
                                </button> */}
                              </div>
                            </div>

                            {slot.sessions && slot.sessions.length > 0 ? (
                              <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/30">
                                <table className="min-w-full">
                                  <thead className="bg-gray-900/50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                        Name
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                        Date
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                        Time
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                        Players
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                                        Actions
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-800">
                                    {slot.sessions.map((sess, sidx) => (
                                      <tr
                                        key={sess._id}
                                        className={`hover:bg-gray-800/30 transition-colors ${
                                          sidx % 2 === 0
                                            ? "bg-gray-900/10"
                                            : "bg-gray-900/20"
                                        }`}
                                      >
                                        <td className="px-4 py-3">
                                          <div className="text-sm font-medium text-white">
                                            {sess.name}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="text-sm text-cyan-300">
                                            {sess.slotDate
                                              ? new Date(
                                                  sess.slotDate
                                                ).toLocaleDateString("en-US", {
                                                  weekday: "short",
                                                  month: "short",
                                                  day: "numeric",
                                                })
                                              : "-"}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="text-sm text-emerald-300">
                                            {(sess.slotStartTime || "") +
                                              (sess.slotEndTime
                                                ? ` - ${sess.slotEndTime}`
                                                : "")}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="text-sm font-medium text-purple-300">
                                            {(sess.players || []).length ||
                                              sess.currentPlayersCount ||
                                              0}
                                          </div>
                                        </td>
                                        <td className="px-4 py-3">
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() =>
                                                openEditSession(slot._id, sess)
                                              }
                                              className="px-3 py-1 text-xs bg-cyan-900/20 text-cyan-300 rounded-lg border border-cyan-800 hover:bg-cyan-900/30 transition-colors"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={() => {
                                                setDeleteContext({
                                                  type: "session",
                                                  slotId: slot._id,
                                                  sessionId: sess._id,
                                                });
                                                setOpenDelete(true);
                                              }}
                                              className="px-3 py-1 text-xs bg-red-900/20 text-red-300 rounded-lg border border-red-800 hover:bg-red-900/30 transition-colors"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-8 bg-gray-900/30 rounded-lg border border-gray-800">
                                <div className="text-gray-400 mb-1">
                                  No sessions available
                                </div>
                                <div className="text-sm text-gray-500">
                                  Create a session to get started
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SessionPopup
        isOpen={sessionForm.isOpen}
        onClose={closeSessionForm}
        sessionData={sessionForm.data}
        onSessionChange={handleSessionChange}
        onSave={handleSaveSession}
        isEditing={sessionForm.isEditing}
        slotName={
          slotLocalList.find((s) => s._id === sessionForm.slotId)?.slotName ||
          ""
        }
      />

      <SlotPopup
        isOpen={slotPopup}
        onClose={() => {
          setSlotPopup(false);
          setIsEditingSlot(false);
          setSelectedSlot(null);
          resetSlotForm();
        }}
        slotData={slotData}
        onSlotChange={handleSlotChange}
        onCreate={handleCreateSlot}
        onUpdate={handleUpdateSlot}
        selectors={selectorsList}
        isEditing={isEditingSlot}
      />

      <DeleteConfirmModal
        open={openDelete}
        title={deleteContext.type === "slot" ? "Delete Slot" : "Delete Session"}
        description={
          deleteContext.type === "slot"
            ? "This slot and all its sessions will be permanently deleted."
            : "This session will be permanently deleted."
        }
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Slot;
