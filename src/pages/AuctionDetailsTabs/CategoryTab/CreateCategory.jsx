import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const CreateCategory = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    baseAmount: "",
    biddingIncrement: "",
    maxBid: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
 

  // Initialize form with initialData if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        baseAmount: initialData.baseAmount?.toString() || "",
        biddingIncrement: initialData.biddingIncrement?.toString() || "",
        maxBid: initialData.maxBid?.toString() || "",
      });
    } else {
      // Reset form for creating new category
      setForm({
        name: "",
        description: "",
        baseAmount: "",
        biddingIncrement: "",
        maxBid: "",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  /* ---------- CHANGE HANDLER ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numbers for numeric fields, but allow empty string
    if (["baseAmount", "biddingIncrement", "maxBid"].includes(name)) {
      // Allow empty or numbers
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on change
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ---------- VALIDATION ---------- */
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!form.baseAmount.trim()) {
      newErrors.baseAmount = "Base amount is required";
    } else if (isNaN(Number(form.baseAmount)) || Number(form.baseAmount) <= 0) {
      newErrors.baseAmount = "Base amount must be a positive number";
    }

    if (!form.biddingIncrement.trim()) {
      newErrors.biddingIncrement = "Bid increment is required";
    } else if (
      isNaN(Number(form.biddingIncrement)) ||
      Number(form.biddingIncrement) <= 0
    ) {
      newErrors.biddingIncrement = "Bid increment must be a positive number";
    }

    if (!form.maxBid.trim()) {
      newErrors.maxBid = "Maximum bid is required";
    } else if (isNaN(Number(form.maxBid)) || Number(form.maxBid) <= 0) {
      newErrors.maxBid = "Maximum bid must be a positive number";
    }

    if (
      form.baseAmount &&
      form.maxBid &&
      Number(form.maxBid) <= Number(form.baseAmount)
    ) {
      newErrors.maxBid = "Max bid must be greater than base amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        baseAmount: Number(form.baseAmount),
        biddingIncrement: Number(form.biddingIncrement),
        maxBid: Number(form.maxBid),
      };

      // If editing, include the id
      if (initialData?.id) {
        payload.id = initialData.id;
      }

      await onSubmit?.(payload);
      onClose?.();
    } catch (error) {
      console.error("Error submitting category:", error);
      setErrors({ submit: "Failed to save category. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- HANDLE KEYDOWN ---------- */
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose?.();
    }
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-lg bg-gray-900/90 text-white rounded-xl shadow-xl border border-gray-700 overflow-hidden backdrop-blur-sm">
        {/* HEADER */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {initialData ? "Edit Category" : "Create Category"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {/* CATEGORY NAME */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800/50 border ${
                errors.name ? "border-red-500" : "border-gray-600"
              } focus:border-cyan-500 outline-none transition-colors`}
              placeholder="Enter category name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-600 focus:border-cyan-500 outline-none transition-colors min-h-[80px]"
              placeholder="Optional description"
              disabled={isSubmitting}
            />
          </div>

          {/* AMOUNTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Base Amount *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="text"
                  name="baseAmount"
                  inputMode="decimal"
                  value={form.baseAmount}
                  onChange={handleChange}
                  className={`w-full p-3 pl-8 rounded-lg bg-gray-800/50 border ${
                    errors.baseAmount ? "border-red-500" : "border-gray-600"
                  } focus:border-cyan-500 outline-none transition-colors`}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>
              {errors.baseAmount && (
                <p className="text-red-500 text-xs mt-1">{errors.baseAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Bid Increment *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ₹
                </span>
                <input
                  type="text"
                  name="biddingIncrement"
                  inputMode="decimal"
                  value={form.biddingIncrement}
                  onChange={handleChange}
                  className={`w-full p-3 pl-8 rounded-lg bg-gray-800/50 border ${
                    errors.biddingIncrement
                      ? "border-red-500"
                      : "border-gray-600"
                  } focus:border-cyan-500 outline-none transition-colors`}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>
              {errors.biddingIncrement && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.biddingIncrement}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Maximum Bid *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="text"
                  name="maxBid"
                  inputMode="decimal"
                  value={form.maxBid}
                  onChange={handleChange}
                  className={`w-full p-3 pl-8 rounded-lg bg-gray-800/50 border ${
                    errors.maxBid ? "border-red-500" : "border-gray-600"
                  } focus:border-cyan-500 outline-none transition-colors`}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>
              {errors.maxBid && (
                <p className="text-red-500 text-xs mt-1">{errors.maxBid}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : initialData ? (
                "Update Category"
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;