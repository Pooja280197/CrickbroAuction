const SlotDetailsPopup = ({ slot, onClose }) => {
  if (!slot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">{slot.slotName}</h2>
          <p className="mt-1 text-sm text-gray-400">
            Slot Code: <span className="text-gray-300">{slot.slotCode}</span>
          </p>
        </div>

        {/* Slot Meta */}
        <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-800/50 p-4 text-sm text-gray-300 sm:grid-cols-2">
          <p>
            <b className="text-gray-400">Type:</b> {slot.slotType}
          </p>
          <p>
            <b className="text-gray-400">Country:</b> {slot.location?.country}
          </p>
          <p className="sm:col-span-2">
            <b className="text-gray-400">Venue:</b> {slot.location?.venue},{" "}
            {slot.location?.city}, {slot.location?.state}
          </p>
        </div>

        {/* Match Status */}
        <div className="mt-4">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${
              slot.slotMatched
                ? "bg-green-500/15 text-green-400 ring-green-500/30"
                : "bg-red-500/15 text-red-400 ring-red-500/30"
            }`}
          >
            {slot.slotMatched ? "Slot Matched" : "Not Matched"}
          </span>
        </div>

        {/* Sessions */}
        <div className="mt-6">
          <h4 className="mb-3 text-sm font-semibold text-gray-200">Sessions</h4>

          <div className="space-y-3">
            {slot.sessions.map((s) => (
              <div
                key={s.sessionId}
                className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 transition hover:border-blue-500/40"
              >
                <p className="text-sm font-medium text-white">
                  {s.sessionName}
                </p>

                <div className="mt-2 space-y-1 text-sm text-gray-400">
                  <p>📅 {new Date(s.slotDate).toLocaleDateString()}</p>
                  <p>
                    ⏰ {s.slotStartTime} – {s.slotEndTime}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-yellow-500/15 px-2.5 py-0.5 text-xs text-yellow-400 ring-1 ring-yellow-500/30">
                    {s.status}
                  </span>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ${
                      s.lockStatus === "locked"
                        ? "bg-red-500/15 text-red-400 ring-red-500/30"
                        : "bg-green-500/15 text-green-400 ring-green-500/30"
                    }`}
                  >
                    {s.lockStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotDetailsPopup;
