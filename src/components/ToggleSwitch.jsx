const ToggleSwitch = ({
  enabled,
  setEnabled,
  label,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{label}</span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? "bg-blue-600" : "bg-gray-300"
          }`}
        onClick={() => setEnabled(!enabled)}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
