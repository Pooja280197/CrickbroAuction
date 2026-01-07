const RatingInput = ({
  label,
  value,
  setValue,
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-sm">{value}/10</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => value > 0 && setValue(value - 1)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        >
          -
        </button>

        <input
          type="range"
          min={0}
          max={10}
          value={value}
          onChange={(e) => setValue(+e.target.value)}
          className="w-full cursor-pointer"
        />

        <button
          type="button"
          onClick={() => value < 10 && setValue(value + 1)}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default RatingInput;