import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSelectorsSlot } from "../../../redux/actions";
import SlotMiniCard from "./SlotMiniCard";
import SlotDetailsPopup from "./SlotDetailsPopup";

const TrialSlot = ({ auctionId }) => {
  const dispatch = useDispatch();
  const [selectedSlot, setSelectedSlot] = useState(null);

  const slotsData = useSelector(
    (state) => state.data?.mySlots?.data || []
  );

  useEffect(() => {
    if (!slotsData.length) {
      dispatch(getSelectorsSlot(auctionId));
    }
  }, [auctionId]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slotsData.map((slot) => (
          <SlotMiniCard
            key={slot.slotId}
            slot={slot}
            onClick={() => setSelectedSlot(slot)}
          />
        ))}
      </div>

      <SlotDetailsPopup
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
      />
    </>
  );
};

export default TrialSlot;
