// import { X, Trophy, User, MapPin, Phone, Mail, Calendar } from "lucide-react";

// const DUMMY_IMAGE_URL = "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";

// // Color gradients for initials
// const gradients = [
//   "from-blue-500 to-cyan-500",
//   "from-purple-500 to-pink-500",
//   "from-emerald-500 to-teal-500",
//   "from-orange-500 to-red-500",
//   "from-indigo-500 to-purple-500",
//   "from-rose-500 to-pink-500",
//   "from-green-500 to-emerald-500",
//   "from-amber-500 to-orange-500",
//   "from-sky-500 to-blue-500",
//   "from-violet-500 to-purple-500",
//   "from-fuchsia-500 to-pink-500",
//   "from-cyan-500 to-blue-500",
// ];

// const getGradientByName = (name: string): string => {
//   const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
//   return gradients[hash % gradients.length];
// };

// interface PlayerDetailsPopupProps {
//   isOpen: boolean;
//   onClose: () => void;
//   player: any;
// }

// export default function PlayerDetailsPopup({
//   isOpen,
//   onClose,
//   player,
// }: PlayerDetailsPopupProps) {
//   if (!isOpen || !player) return null;

//   const playerDoc = player?.playerDoc || {};
//   const rating = player?.bestAvgRating || 0;
//   const playerRole = playerDoc?.playerRole || "Unknown";
//   const matchedSlots = player?.matchedSlots || [];
//   const selectionStatus = player?.selectionStatus || "pending";

//   // Check if image is dummy (placeholder)
//   const isDummyImage = !playerDoc?.logo || playerDoc?.logo === DUMMY_IMAGE_URL || playerDoc?.logo?.includes("placeholder") || playerDoc?.logo?.includes("via.placeholder");

//   // Get player initials
//   const getInitials = (name: string) => {
//     if (!name) return "P";
//     const words = name.trim().split(" ");
//     return words.map((w) => w[0]?.toUpperCase()).join("").slice(0, 2);
//   };

//   // Extract all ratings from matchedSlots
//   const getAllRatings = () => {
//     const ratings: any[] = [];
//     matchedSlots.forEach((slot: any) => {
//       if (slot.rating?.ratings && Array.isArray(slot.rating.ratings)) {
//         slot.rating.ratings.forEach((r: any) => {
//           ratings.push({
//             ...r,
//             slotName: slot.slotName,
//             slotDate: slot.slotDate,
//             sessionName: slot.sessionName,
//             selectionStatus: slot.selectionStatus,
//           });
//         });
//       }
//     });
//     return ratings;
//   };
  

//   const allRatings = getAllRatings();

//   return (
//     <div className="fixed inset-0  bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
//       <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden py-20">
//         {/* Header with gradient */}
//         <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all"
//           >
//             <X className="w-5 h-5" />
//           </button>

//           {/* Player Image and Basic Info */}
//           <div className="flex flex-col items-center gap-4">
//             <div className={`w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br ${getGradientByName(playerDoc?.name)} flex items-center justify-center`}>
//               {isDummyImage ? (
//                 <span className="text-4xl font-bold text-white">
//                   {getInitials(playerDoc?.name)}
//                 </span>
//               ) : (
//                 <img
//                   src={playerDoc?.logo}
//                   alt={playerDoc?.name}
//                   className="h-full w-full object-cover"
//                 />
//               )}
//             </div>
//             <div className="text-center">
//               <h1 className="text-2xl font-bold">{playerDoc?.name}</h1>
//               <p className="text-sm opacity-90 capitalize">{player?.matchedSlots?.[0]?.rating?.playerType?.toUpperCase()}</p>
//               <div className="mt-2 flex items-center justify-center gap-2">
//                 <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-semibold">
//                   Rating: {rating.toFixed(2)} ⭐
//                 </span>
//                 {/* <span
//                   className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     selectionStatus === "select"
//                       ? "bg-green-400/30 text-green-900"
//                       : selectionStatus === "pending"
//                       ? "bg-yellow-400/30 text-yellow-900"
//                       : "bg-red-400/30 text-red-900"
//                   }`}
//                 >
//                   {selectionStatus.charAt(0).toUpperCase() + selectionStatus.slice(1)}
//                 </span> */}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6 space-y-6 max-h-[calc(95vh-250px)] overflow-y-auto">
//           {/* Player Details Grid */}
//           <div className="space-y-3">
//             {playerDoc?.batchId && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                   <User className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Batch ID</p>
//                   <p className="font-semibold text-gray-800">{playerDoc.batchId}</p>
//                 </div>
//               </div>
//             )}

//             {playerDoc?.location && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
//                   <MapPin className="w-5 h-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Location</p>
//                   <p className="font-semibold text-gray-800">{playerDoc.location}</p>
//                 </div>
//               </div>
//             )}

//             {playerDoc?.mobile && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
//                   <Phone className="w-5 h-5 text-orange-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Mobile</p>
//                   <p className="font-semibold text-gray-800">{playerDoc.mobile}</p>
//                 </div>
//               </div>
//             )}

//             {playerDoc?.email && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//                   <Mail className="w-5 h-5 text-red-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Email</p>
//                   <p className="font-semibold text-gray-800 break-all text-sm">
//                     {playerDoc.email}
//                   </p>
//                 </div>
//               </div>
//             )}

//             {playerDoc?.dateOfBirth && (
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
//                   <Calendar className="w-5 h-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500">Date of Birth</p>
//                   <p className="font-semibold text-gray-800">
//                     {new Date(playerDoc.dateOfBirth).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* All Ratings Section */}
//           {allRatings.length > 0 && (
//             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//               <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
//                 <Trophy className="w-5 h-5 text-blue-600" />
//                 All Ratings ({allRatings.length})
//               </h3>

//               <div className="space-y-3 max-h-64 overflow-y-auto">
//                 {allRatings.map((ratingData, idx) => (
//                   <div key={idx} className="bg-white border border-blue-100 rounded-lg p-3">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <p className="font-semibold text-sm text-gray-800">
//                           {ratingData.slotName}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {ratingData.sessionName} • {new Date(ratingData.slotDate).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <span
//                         className={`px-2 py-1 rounded text-xs font-semibold ${
//                           ratingData.selectionStatus === "select"
//                             ? "bg-green-100 text-green-700"
//                             : "bg-yellow-100 text-yellow-700"
//                         }`}
//                       >
//                         {ratingData.selectionStatus}
//                       </span>
//                     </div>

//                     {/* Rating Details Grid */}
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                       {ratingData.batting !== undefined && (
//                         <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-2 rounded">
//                           <p className="text-xs text-gray-600">Batting</p>
//                           <p className="text-lg font-bold text-blue-600">{ratingData.batting}</p>
//                         </div>
//                       )}
//                       {ratingData.bowling !== undefined && (
//                         <div className="bg-gradient-to-br from-red-100 to-red-50 p-2 rounded">
//                           <p className="text-xs text-gray-600">Bowling</p>
//                           <p className="text-lg font-bold text-red-600">{ratingData.bowling}</p>
//                         </div>
//                       )}
//                       {ratingData.fielding !== undefined && (
//                         <div className="bg-gradient-to-br from-green-100 to-green-50 p-2 rounded">
//                           <p className="text-xs text-gray-600">Fielding</p>
//                           <p className="text-lg font-bold text-green-600">{ratingData.fielding}</p>
//                         </div>
//                       )}
//                       {ratingData.attitude !== undefined && (
//                         <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-2 rounded">
//                           <p className="text-xs text-gray-600">Attitude</p>
//                           <p className="text-lg font-bold text-purple-600">{ratingData.attitude}</p>
//                         </div>
//                       )}
//                       {ratingData.bowler !== undefined && (
//                         <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-2 rounded">
//                           <p className="text-xs text-gray-600">Bowler</p>
//                           <p className="text-lg font-bold text-orange-600">{ratingData.bowler}</p>
//                         </div>
//                       )}
//                       {ratingData.fitness !== undefined && (
//                         <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 p-2 rounded">
//                           <p className="text-xs text-gray-600">Fitness</p>
//                           <p className="text-lg font-bold text-cyan-600">{ratingData.fitness}</p>
//                         </div>
//                       )}
//                     </div>

//                     {/* Selector Info */}
//                     {ratingData.selector && (
//                       <div className="mt-2 pt-2 border-t border-gray-200">
//                         <p className="text-xs text-gray-500">
//                           Rated by: <span className="font-semibold">{ratingData.selector.name}</span>
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Assigned Categories */}
//           {player?.assignedCategories && player.assignedCategories.length > 0 && (
//             <div>
//               <h3 className="font-semibold text-gray-800 mb-2">Assigned Categories</h3>
//               <div className="flex flex-wrap gap-2">
//                 {player.assignedCategories.map((cat: any) => (
//                   <span
//                     key={cat._id}
//                     className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold"
//                   >
//                     {cat.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Additional Info */}
//           {playerDoc?.description && (
//             <div>
//               <h3 className="font-semibold text-gray-800 mb-2">About</h3>
//               <p className="text-sm text-gray-600 leading-relaxed">
//                 {playerDoc.description}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Close Button */}
//         <div className="bg-gray-50 border-t px-6 py-4">
//           <button
//             onClick={onClose}
//             className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { X, Trophy, User, MapPin, Phone, Mail, Calendar } from "lucide-react";

const DUMMY_IMAGE_URL =
  "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";

// Color gradients for initials
const gradients = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-rose-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-500",
  "from-violet-500 to-purple-500",
  "from-fuchsia-500 to-pink-500",
  "from-cyan-500 to-blue-500",
];

const getGradientByName = (name = "") => {
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

export default function PlayerDetailsPopup({
  isOpen,
  onClose,
  player,
  isTrialType
}) {
  if (!isOpen || !player) return null;
  console.log(player,"player")

  const playerDoc = player?.player|| {};
  const rating = player?.playersRatings?.avgRating || 0;
  const matchedSlots = player?.matchedSlots || [];

  // Check if image is dummy
  const isDummyImage =
    !playerDoc?.logo ||
    playerDoc?.logo === DUMMY_IMAGE_URL ||
    playerDoc?.logo?.includes("placeholder") ||
    playerDoc?.logo?.includes("via.placeholder");

  // Get player initials
  const getInitials = (name = "") => {
    if (!name) return "P";
    return name
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // Extract all ratings
  const getAllRatings = () => {
    const ratings = [];
    matchedSlots.forEach((slot) => {
      if (slot?.rating?.ratings && Array.isArray(slot.rating.ratings)) {
        slot.rating.ratings.forEach((r) => {
          ratings.push({
            ...r,
            slotName: slot.slotName,
            slotDate: slot.slotDate,
            sessionName: slot.sessionName,
            selectionStatus: slot.selectionStatus,
          });
        });
      }
    });
    return ratings;
  };

  const allRatings = getAllRatings();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center gap-4">
            <div
              className={`w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br ${getGradientByName(
                playerDoc?.name
              )} flex items-center justify-center`}
            >
              {isDummyImage ? (
                <span className="text-4xl font-bold text-white">
                  {getInitials(playerDoc?.name)}
                </span>
              ) : (
                <img
                  src={playerDoc?.logo}
                  alt={playerDoc?.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold">{playerDoc?.name}</h1>
              <p className="text-sm opacity-90 capitalize">
                {player?.matchedSlots?.[0]?.rating?.playerType?.toUpperCase()}
              </p>
            {isTrialType &&  <div className="mt-2">
                <span className="bg-white/30 px-3 py-1 rounded-full text-sm font-semibold">
                  Rating: {rating.toFixed(2)} ⭐
                </span>
              </div>}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Player Details */}
          <div className="space-y-3">
            {playerDoc?.batchId && (
              <DetailItem icon={<User />} label="Batch ID" value={playerDoc.batchId} color="blue" />
            )}
            {playerDoc?.location && (
              <DetailItem icon={<MapPin />} label="Location" value={playerDoc.location} color="green" />
            )}
            {playerDoc?.mobile && (
              <DetailItem icon={<Phone />} label="Mobile" value={playerDoc.mobile} color="orange" />
            )}
            {playerDoc?.email && (
              <DetailItem icon={<Mail />} label="Email" value={playerDoc.email} color="red" />
            )}
            {playerDoc?.dateOfBirth && (
              <DetailItem
                icon={<Calendar />}
                label="Date of Birth"
                value={new Date(playerDoc.dateOfBirth).toLocaleDateString()}
                color="purple"
              />
            )}
          </div>

          {/* Ratings */}
          {allRatings.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                All Ratings ({allRatings.length})
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {allRatings.map((r, idx) => (
                  <div key={idx} className="bg-white border rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{r.slotName}</p>
                        <p className="text-xs text-gray-500">
                          {r.sessionName} • {new Date(r.slotDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        r.selectionStatus === "select"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {r.selectionStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {renderRating("Batting", r.batting, "blue")}
                      {renderRating("Bowling", r.bowling, "red")}
                      {renderRating("Fielding", r.fielding, "green")}
                      {renderRating("Attitude", r.attitude, "purple")}
                      {renderRating("Bowler", r.bowler, "orange")}
                      {renderRating("Fitness", r.fitness, "cyan")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {player?.assignedCategories?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Assigned Categories</h3>
              <div className="flex flex-wrap gap-2">
                {player.assignedCategories.map((cat) => (
                  <span
                    key={cat._id}
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {playerDoc?.description && (
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-gray-600">{playerDoc.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* Helper Components */

const DetailItem = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-3">
    <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 text-sm break-all">{value}</p>
    </div>
  </div>
);

const renderRating = (label, value, color) =>
  value !== undefined && (
    <div className={`bg-${color}-100 p-2 rounded`}>
      <p className="text-xs">{label}</p>
      <p className={`text-lg font-bold text-${color}-600`}>{value}</p>
    </div>
  );

