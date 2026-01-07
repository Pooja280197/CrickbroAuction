import React, { useState, useEffect } from "react";

const SlotPopup = ({
  isOpen,
  onClose,
  slotData,
  onSlotChange,
  onCreate,
  selectors = [],
  isEditing,
  onUpdate
}) => {
  // -------- STATE --------
  const [errors, setErrors] = useState({});
  const [openSelectorDropdown, setOpenSelectorDropdown] = useState(false);

  // Clear errors when opening/closing
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setOpenSelectorDropdown(false);
    }
  }, [isOpen]);

  // Early return - must come AFTER all hooks
  if (!isOpen) return null;

  const requiredLocationFields = [
    "venue",
    
  ];

 const validateForm = () => {
  let newErrors = {};

  // Slot name
  if (!slotData.slotName?.trim()) {
    newErrors.slotName = "Slot name is required";
  }

  // Venue (required)
  if (!slotData.location?.venue?.trim()) {
    newErrors["location.venue"] = "Venue is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // In SlotPopup component, change the handleSubmit function:
const handleSubmit = () => {
  if (!validateForm()) return;

  if (isEditing) {
    // Pass the slotData to onUpdate
    onUpdate(slotData);
  } else {
    onCreate();
  }
};

  // -------- CHECKBOX HANDLER --------
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const currentSelectors = slotData.selectors || [];
    const updated = checked
      ? [...currentSelectors, value]
      : currentSelectors.filter((id) => id !== value);

    onSlotChange({
      target: { name: "selectors", value: updated }
    });
    
    // Clear selector error if any
    if (errors.selectors) {
      setErrors(prev => ({ ...prev, selectors: undefined }));
    }
  };

  // -------- GENERAL INPUT HANDLER --------
   const handleChange = (e) => {
    const { name, value } = e.target;

    // Special rule for pincode → only digits, max 6
    if (name === "location.pincode") {
      let val = value.replace(/\D/g, ""); // keep only digits
      if (val.length > 6) val = val.slice(0, 6);

      onSlotChange({
        target: {
          name: "location",
          value: { ...slotData.location, pincode: val }
        },
      });

      return; // stop here, don't go further
    }

    // For other location fields
    if (name.includes("location.")) {
      const field = name.split(".")[1];

      onSlotChange({
        target: {
          name: "location",
          value: { ...slotData.location, [field]: value },
        },
      });

      return;
    }
    // Other fields
    onSlotChange(e);
  };

 
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center px-4 py-6">
      <div className="bg-gray-900/80 text-white rounded-2xl w-full max-w-5xl h-[80vh] overflow-hidden shadow-xl flex flex-col md:flex-row">
        {/* LEFT SECTION */}
        <div className="flex-1 flex flex-col border-r">
          <div className="sticky top-0 z-20 border-b p-4">
            <h2 className="text-xl font-semibold text-white">
              {isEditing ? "Edit Auction Slot" : "Create Auction Slot"}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Slot Name */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slot Name *
                </label>
                <input
                  type="text"
                  name="slotName"
                  value={slotData?.slotName || ""}
                  onChange={handleChange}
                  className={`w-full bg-gray-900/50 border p-2 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-500 outline-none transition ${
                    errors.slotName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter slot name"
                />
                {errors.slotName && (
                  <p className="text-red-500 text-xs mt-1">{errors.slotName}</p>
                )}
              </div>

              {/* Slot Code */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Slot Code {isEditing && "(Read-only)"}
                </label>
                <input
                  type="text"
                  name="slotCode"
                  value={slotData?.slotCode || ""}
                  onChange={handleChange}
                //   disabled={isEditing}
                  className={`w-full border bg-gray-900/50 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-purple-500 outline-none transition ${
                    errors.slotCode ? "border-red-500" : "border-gray-300"
                  } ${isEditing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Enter slot code"
                />
                {errors.slotCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.slotCode}</p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={slotData?.description || ""}
                  onChange={handleChange}
                  className={`w-full border bg-gray-900/50 p-2 rounded-lg min-h-[70px] focus:ring-2 focus:ring-gray-200 focus:border-purple-500 outline-none transition ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            {/* LOCATION FIELDS */}
            <h3 className=" mt-6 mb-3 text-lg font-semibold text-white border-b pb-2">
              Location Details *
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["venue", "city", "address", "state", "country", "pincode"].map((field) => {
                const errorKey = `location.${field}`;
                const showError = errors[errorKey];
                const isRequired = requiredLocationFields.includes(field);
                const value = slotData?.location?.[field] || "";

                return (
                  <div
                    key={field}
                    className={field === "address" ? "col-span-2" : "col-span-1"}
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {isRequired && " *"}
                    </label>

                    {field === "address" ? (
                      <textarea
                        name={`location.${field}`}
                        value={value}
                        onChange={handleChange}
                        className={`w-full border bg-gray-900/50 p-2 rounded-lg min-h-[70px] focus:ring-2 focus:ring-gray-200 focus:border-purple-500 outline-none transition ${
                          showError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={`Enter ${field}`}
                      />
                    ) : (
                      <input
                        type="text"
                        name={`location.${field}`}
                        value={value}
                        onChange={handleChange}
                        className={`w-full border bg-gray-900/50 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-purple-500 outline-none transition ${
                          showError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={`Enter ${field}`}
                      />
                    )}

                    {showError && (
                      <p className="text-red-500 text-xs mt-1">{errors[errorKey]}</p>
                    )}
                  </div>
                );
              })}

              {/* Map link → optional */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Map Link (optional)
                </label>
                <input
                  type="url"
                  name="location.link"
                  value={slotData?.location?.link || ""}
                  onChange={handleChange}
                  className="w-full border bg-gray-900/50 border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-purple-500 outline-none transition"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="sticky bottom-0 bg-gray-900/50 z-20 p-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg  transition"
            >
              {isEditing ? "Update Slot" : "Create Slot"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE SELECTORS */}
        <div className="w-full md:w-[300px] p-4 border-t md:border-t-0 md:border-l">
          <h3 className="mb-3 font-semibold text-white">Selectors</h3>

          <div className="relative">
            <div
              className="border border-gray-300 p-2 rounded-lg cursor-pointer flex justify-between items-center hover:border-gray-200 transition"
              onClick={() => setOpenSelectorDropdown(!openSelectorDropdown)}
            >
              <span className="text-gray-300 bg-gray-900/50">
                {slotData?.selectors?.length > 0
                  ? `${slotData?.selectors.length} selected`
                  : "Select selectors"}
              </span>
              <span className="text-gray-400">
                {openSelectorDropdown ? "▲" : "▼"}
              </span>
            </div>

            {openSelectorDropdown && (
              <div className="absolute top-full left-0 w-full  bg-gray-900/50 border border-gray-300 rounded-lg mt-1 max-h-56 overflow-y-auto p-3 shadow-lg z-30">
                {selectors.length > 0 ? (
                  selectors.map((item) => (
                    <label
                      key={item._id}
                      className="flex items-center gap-2 mb-2  hover:bg-purple-50 p-1 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={item._id}
                        checked={slotData?.selectors?.includes(item._id) || false}
                        onChange={handleCheckboxChange}
                        className="text-blue-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-300">{item.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-2">
                    No selectors available
                  </p>
                )}
              </div>
            )}
            {errors.selectors && (
              <p className="text-red-500 text-xs mt-1">{errors.selectors}</p>
            )}
          </div>

          {/* SELECTED NAMES */}
          {slotData?.selectors?.length > 0 && !openSelectorDropdown && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-300 mb-2">
                Selected ({slotData?.selectors.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectors
                  .filter((item) => slotData?.selectors.includes(item._id))
                  .map((item) => (
                    <span
                      key={item._id}
                      className="px-3 py-1 bg-purple-100 text-gray-700 text-sm rounded-full flex items-center gap-1"
                    >
                      {item.name}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = slotData.selectors.filter(id => id !== item._id);
                          onSlotChange({
                            target: { name: "selectors", value: updated }
                          });
                        }}
                        className="text-purple-500 hover:text-purple-700 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotPopup;