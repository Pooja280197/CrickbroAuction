import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { X } from "lucide-react";
import { getCategoryPlayers } from "../../../redux/actions";

const CategoryPlayers = ({ open, onClose, categoryId, auctionId }) => {
  const dispatch = useDispatch();
  const categoryplayers = useSelector(
    (state) => state?.data?.categoryPlayers
  );

  const reduxPlayers = categoryplayers?.data || [];

  const [localPlayers, setLocalPlayers] = useState([]);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  /* ---------- Sync Redux → Local ---------- */
  useEffect(() => {
    setLocalPlayers(reduxPlayers);
  }, [reduxPlayers]);

  /* ---------- Fetch Players ---------- */
  useEffect(() => {
    if (open && categoryId) {
      dispatch(getCategoryPlayers(categoryId));
    }
  }, [open, categoryId]);

  if (!open) return null;

  /* ---------- Drag handlers ---------- */

  const handleDragStart = (player) => {
    if (isSaving) return;
    setDraggedPlayer(player);
  };

  const allowDrop = (e) => e.preventDefault();

  const handleDrop = async (targetPlayer) => {
    if (!draggedPlayer || isSaving) return;
    if (draggedPlayer.playerId === targetPlayer.playerId) return;

    setIsSaving(true);
    setError("");

    const previousState = [...localPlayers];

    try {
      await axios.post(
        `/webSiteApi/auctionCategory/swapPlayerOrderInCategory/${categoryId}`,
        {
          auctionId,
          playerId: draggedPlayer.playerId,
          newOrder: targetPlayer.orderInCategory,
        }
      );

      // ✅ Source of truth
      dispatch(getCategoryPlayers(categoryId));
    } catch (err) {
      console.error(err);
      setError("Failed to reorder player. Please try again.");
      setLocalPlayers(previousState); // rollback
    } finally {
      setDraggedPlayer(null);
      setIsSaving(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90vw] h-[80vh] rounded-xl shadow-xl flex flex-col">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-5 py-3 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-black">
            Category Players ({localPlayers.length})
          </h2>

          <X
            className="cursor-pointer text-gray-600 hover:text-black"
            onClick={onClose}
          />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-4 py-2 border-b">
            {error}
          </div>
        )}

        {/* Grid View */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
            {localPlayers
              .sort((a, b) => a.orderInCategory - b.orderInCategory)
              .map((player) => (
                <div
                  key={player.playerId}
                  draggable={!isSaving}
                  onDragStart={() => handleDragStart(player)}
                  onDragOver={allowDrop}
                  onDrop={() => handleDrop(player)}
                  className={`border rounded-md p-2 text-center transition
                    ${
                      isSaving
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-gray-50 hover:bg-gray-100 cursor-move"
                    }`}
                >
                  <p className="text-xs font-medium truncate text-gray-900">
                    {player.name}
                  </p>

                  <p className="text-[10px] text-gray-500">
                    {player.batchId}
                  </p>

                  <span className="text-[10px] font-semibold text-blue-600">
                    #{player.orderInCategory}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 text-center py-2 border-t">
          Drag & drop to reorder • Changes save after drop
        </div>
      </div>
    </div>
  );
};

export default CategoryPlayers;
