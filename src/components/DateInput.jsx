const DateInput = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-1">
      <label className="font-medium block">{label}</label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {/* <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} /> */}
      </div>
    </div>
  );
};
export default DateInput;