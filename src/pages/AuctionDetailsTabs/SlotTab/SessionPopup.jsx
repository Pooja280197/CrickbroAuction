import React, { useEffect, useState } from "react";
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

const SessionPopup = ({
  isOpen,
  onClose,
  sessionData = {
    name: "",
    slotDate: "",
    slotStartTime: "",
    slotEndTime: "",
    status: "scheduled",
    lockStatus: "unlocked",
  },
  onSessionChange,
  onSave,
  isEditing = false,
  slotName = "",
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) setErrors({});
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    let valid = true;
    const newErrors = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!sessionData.slotDate) {
      newErrors.slotDate = "Date is required";
      valid = false;
    } else {
      const selectedDate = new Date(sessionData.slotDate);
      selectedDate.setHours(0, 0, 0, 0);
    }

    if (!sessionData.name?.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (
      sessionData.slotStartTime &&
      sessionData.slotEndTime &&
      sessionData.slotStartTime >= sessionData.slotEndTime
    ) {
      newErrors.time = "Start time must be earlier than end time";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    // Reuse Slot's expected onChange signature
    onSessionChange(e);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-lg bg-gray-900/80 text-white rounded-xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {isEditing ? "Edit Session" : "Create Session"}
            </h3>
            {slotName && (
              <div className="text-sm text-gray-400">Slot: {slotName}</div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name *</label>
            <input
              name="name"
              value={sessionData.name || ""}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-900/50 border ${
                errors.name ? "border-red-500" : "border-gray-700"
              } focus:border-cyan-500 focus:ring-cyan-500 outline-none`}
              placeholder="Session name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Date *</label>
              <input
                name="slotDate"
                type="date"
                value={formatDateForInput(sessionData.slotDate) || ""}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg bg-gray-900/50 border ${
                  errors.slotDate ? "border-red-500" : "border-gray-700"
                } focus:border-cyan-500 focus:ring-cyan-500 outline-none`}
              />
              {errors.slotDate && (
                <p className="text-red-500 text-xs mt-1">{errors.slotDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Start time
              </label>
              <input
                name="slotStartTime"
                type="time"
                value={sessionData.slotStartTime || ""}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                End time
              </label>
              <input
                name="slotEndTime"
                type="time"
                value={sessionData.slotEndTime || ""}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Session Status</label>
              <select
                value={sessionData.status}
                name="status"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 outline-none"
              >
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Session Access</label>
              <select
                value={sessionData.lockStatus}
                name="lockStatus"
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-900/50 border border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 outline-none"
              >
                <option value="unlocked">Unlock</option>
                <option value="locked">Lock</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg"
            >
              {isEditing ? "Save Changes" : "Create Session"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionPopup;
