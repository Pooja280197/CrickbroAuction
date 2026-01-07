const SlotMiniCard = ({ slot, onClick }) => {
  const session = slot.sessions?.[0];

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10"
    >
      {/* Accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-blue-500/70 opacity-0 transition group-hover:opacity-100" />

      {/* Title */}
      <h3 className="truncate text-base font-semibold text-white">
        {slot.slotName}
      </h3>

      {session && (
        <div className="mt-3 space-y-1.5">
          <p className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-blue-400">📅</span>
            {new Date(session.slotDate).toLocaleDateString()}
          </p>

          <p className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-purple-400">⏰</span>
            {session.slotStartTime} – {session.slotEndTime}
          </p>

          <span
            className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              session.status === "ongoing"
                ? "bg-green-500/15 text-green-400 ring-1 ring-green-500/30"
                : "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/30"
            }`}
          >
            {session.status}
          </span>
        </div>
      )}

      {/* CTA */}
      <div className="mt-4 flex items-center justify-end text-xs font-medium text-blue-400 transition group-hover:translate-x-1">
        View details →
      </div>
    </div>
  );
};

export default SlotMiniCard;
