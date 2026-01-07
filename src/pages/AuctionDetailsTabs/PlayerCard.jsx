// import React, { useState } from 'react';
// import { Eye, MapPin, Clock, Calendar, X, Check, Star } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

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

// const isDummyImage = (imageUrl: string | undefined): boolean => {
//   return imageUrl === DUMMY_IMAGE_URL;
// };

// interface Location {
//   venue?: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   pincode?: string;
// }

// interface RatingData {
//   avgRating?: number;
//   thresholdUsed?: number;
// }

// interface Player {
//   id: string;
//   name: string;
//   type: string;
//   image: string;
//   playerRole?: string;

//   // NEW FIELDS FROM API
//   selectionStatus?: string;

//   slotId?: string;
//   slotCode?: string;
//   slotName?: string;
//   slotType?: string;
//   slotDate?: string;
//   slotStartTime?: string;
//   slotEndTime?: string;

//   sessionId?: string;
//   sessionName?: string;
//   sessionStatus?: string;

//   batchId?: string;

//   assign?: {
//     venue?: string;
//     location?: Location;
//     slotName?: string;
//     sessionName?: string;
//     slotDate?: string;
//     slotStartTime?: string;
//     slotEndTime?: string;
//     sessionStatus?: string;
//     selectionStatus?: string;
//     rating?: {
//       avgRating?: number;
//       avgRatingComputed?: number;
//       thresholdUsed?: number;
//       ratings?: Array<{
//         batsman?: number;
//         bowler?: number;
//         fielding?: number;
//         attitude?: number;
//         selector?: {
//           name?: string;
//           mobile?: string;
//           logo?: string;
//         };
//       }>;
//     };

//   };

//   rating?: RatingData;

//   // Auction
//   basePrice?: number;
//   currentBid?: number;
//   category?: string;
//   isForeign?: boolean;
//   isUnsoldReEntry?: boolean;
//   status?: string;

//   // Contact
//   mobile?: string;
//   email?: string;
// }

// interface EnhancedPlayerCardProps {
//   player: Player;
//   mode: 'select' | 'view' | 'assigned';
//   isSelected?: boolean;
//   onSelect?: (id: string) => void;
//   onViewDetails?: (player: Player) => void;
//   onAssign?: (player: Player) => void;
//   showActions?: boolean;
//   selector?: boolean;
//   onRemove?: (player: Player) => void;
//   adminLogin?: boolean;
// }

// const getInitials = (name: string) => {
//   if (!name) return "NA";
//   const parts = name.trim().split(" ");
//   if (parts.length >= 2) {
//     return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
//   }
//   return name.substring(0, 2).toUpperCase();
// };

// const formatRole = (role: string | undefined) => {
//   if (!role) return "";
//   return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
// };

// interface RatingInputProps {
//   label: string;
//   value: number;
//   setValue: (value: number) => void;
// }

// const RatingInput: React.FC<RatingInputProps> = ({ label, value, setValue }) => {
//   const increase = () => value < 10 && setValue(value + 1);
//   const decrease = () => value > 1 && setValue(value - 1);

//   return (
//     <div className="space-y-1">
//       <div className="flex justify-between items-center">
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//         <span className="text-sm font-semibold">{value}/10</span>
//       </div>

//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           onClick={decrease}
//           className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
//         >
//           -
//         </button>

//         <input
//           type="range"
//           min="1"
//           max="10"
//           value={value}
//           onChange={(e) => setValue(parseInt(e.target.value))}
//           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//         />

//         <button
//           type="button"
//           onClick={increase}
//           className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
//         >
//           +
//         </button>
//       </div>
//     </div>
//   );
// };

// interface RatingFormProps {
//   player: Player;
//   onClose: () => void;
// }

// const formatDate = (iso: string) => {
//   if (!iso) return "";
//   const d = new Date(iso);
//   return d.toLocaleDateString("en-GB");
// };

// const formatTime = (t: string | undefined) => {
//   if (!t) return "";
//   let [h, m] = t.split(":");
//   let hour = parseInt(h);
//   const ampm = hour >= 12 ? "PM" : "AM";
//   hour = hour % 12 || 12;
//   return `${hour}:${m} ${ampm}`;
// };

// const RatingForm: React.FC<RatingFormProps> = ({
//   player,
//   onClose,
// }) => {
//   const [ratingType, setRatingType] = useState('');
//   const [attitude, setAttitude] = useState(0);
//   const [batsman, setBatting] = useState(0);
//   const [bowler, setBowling] = useState(0);
//   const [fielding, setFielding] = useState(0);

//   const handleSubmit = async () => {
//     const ratingData = {
//       playerId: player.id,
//       playerType: ratingType,
//       ratings: [{
//         selectorId: localStorage.getItem('playerId'),
//         attitude,
//         ...(ratingType === 'batsman' || ratingType === 'allrounder' ? { batsman } : {}),
//         ...(ratingType === 'bowler' || ratingType === 'allrounder' ? { bowler } : {}),
//         ...(ratingType !== 'wicket-keeper' ? { fielding } : {}),
//         timestamp: new Date().toISOString()
//       }]
//     };

//     try {
//       let res = await axios.post(`/webSiteApi/auctionSelector/ratePlayer/${player.slotId}/${player.sessionId}`, ratingData);
//       toast.success('Scores Submitted Successfully');
//     } catch (error) {
//       console.log(error, "error submitting scores");
//     }

//     onClose();
//   };

//   const ratingTypes = [
//     { value: 'batsman', label: 'Batsman' },
//     { value: 'bowler', label: 'Bowler' },
//     { value: 'allrounder', label: 'All Rounder' },
//   ];

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
//       <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
//         >
//           <X className="w-4 h-4 text-gray-700" />
//         </button>

//         <div className="p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-2">Trials Scoring</h2>
//           <p className="text-gray-600 mb-6">Please provide scores for {player.name}</p>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Player Type
//             </label>
//             <select
//               value={ratingType}
//               onChange={(e) => setRatingType(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//             >
//               <option value="" disabled hidden>
//                 Select Type
//               </option>
//               {ratingTypes.map(type => (
//                 <option key={type.value} value={type.value}>
//                   {type.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {ratingType && (
//             <div className="space-y-6">
//               <RatingInput label="Attitude" value={attitude} setValue={setAttitude} />
//               {(ratingType === "batsman" || ratingType === "allrounder") && (
//                 <RatingInput label="Batsman" value={batsman} setValue={setBatting} />
//               )}
//               {(ratingType === "bowler" || ratingType === "allrounder") && (
//                 <RatingInput label="Bowler" value={bowler} setValue={setBowling} />
//               )}
//               {ratingType !== "wicket-keeper" && (
//                 <RatingInput label="Fielding" value={fielding} setValue={setFielding} />
//               )}
//             </div>
//           )}

//           <div className="mt-8 flex gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//             >
//               Submit Scores
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface PlayerDetailsModalProps {
//   player: Player | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onRate?: (player: Player) => void;
//   selector?: boolean;
//   onRemove?: (player: Player) => void;
//   adminLogin?: boolean;

// }

// const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({
//   player,
//   isOpen,
//   onClose,
//   onRate,
//   selector,
//   onRemove,
//   adminLogin,
//   type
  

// }) => {
 
//   const [showRatingForm, setShowRatingForm] = useState(false);

//   if (!isOpen || !player) return null;
//   const assign = player.assign || {};
//   const location = assign.location || {};

//   const handleRemove = async () => {
//     const slotId = player.assign?.slotId;
//     const sessionId = player.assign?.sessionId;

//     if (!slotId || !sessionId) {
//       toast.error("Slot ID or Session ID not found");
//       console.log("SlotId:", slotId, "SessionId:", sessionId, "Player:", player);
//       return;
//     }

//     try {
//       await axios.post(
//         `/webSiteApi/auctionSlot/removePlayerFromSession/${slotId}/${sessionId}`,
//         { playerIds: [player.id] }
//       );

//       toast.success("Player removed successfully");

//       if (onRemove) {
//         onRemove(player);
//       }

//       onClose();
//     } catch (error) {
//       console.error("Error removing player:", error);
//       toast.error("Failed to remove player");
//     }
//   };

//   if (showRatingForm) {
//     return (
//       <RatingForm
//         player={player}
//         onClose={() => {
//           setShowRatingForm(false);
//           onClose();
//         }}
//       />
//     );
//   }


//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
//       <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">

//         <button
//           type="button"
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full"
//         >
//           <X className="w-4 h-4 text-gray-700" />
//         </button>

//         <div className="p-6 overflow-y-auto flex-1">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
//               {player.image && !isDummyImage(player.image) ? (
//                 <img
//                   src={player.image}
//                   alt={player.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).style.display = 'none';
//                     const parent = (e.target as HTMLImageElement).parentElement;
//                     if (parent) {
//                       const initialsDiv = document.createElement('div');
//                       initialsDiv.className = `w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(player.name)} text-white font-bold`;
//                       initialsDiv.textContent = getInitials(player.name);
//                       parent.appendChild(initialsDiv);
//                     }
//                   }}
//                 />
//               ) : (
//                 <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getGradientByName(player.name)} text-white font-bold`}>
//                   {getInitials(player.name)}
//                 </div>
//               )}
//             </div>
//            {type && <div>
//               <h2 className="text-xl font-bold text-gray-900">{player.name}</h2>
//               <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-1">
//                 {/* {formatRole(player.playerRole || player.type)} */}
//                 {type?.toUpperCase()}
//               </span>
//             </div>}
//           </div>

//           <div className="space-y-3 mb-6">
//             <h3 className="font-semibold text-gray-900 mb-2">Personal Details</h3>
//             {player.email && (
//               <div className="text-sm">
//                 <span className="text-gray-600">Email: </span>
//                 <span className="font-medium text-gray-900">{player.email}</span>
//               </div>
//             )}
//             {player.mobile && (
//               <div className="text-sm">
//                 <span className="text-gray-600">Mobile: </span>
//                 <span className="font-medium text-gray-900">{player.mobile}</span>
//               </div>
//             )}
//             {player.batchId && (
//               <div className="text-sm">
//                 <span className="text-gray-600">Batch ID: </span>
//                 <span className="font-medium text-gray-900">{player.batchId}</span>
//               </div>
//             )}
//           </div>

//           {(player.basePrice || player.currentBid) && (
//             <div className="bg-blue-50 rounded-lg p-4 mb-6">
//               <h3 className="font-semibold text-gray-900 mb-3">Auction Details</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 {player.basePrice && (
//                   <div className="text-sm">
//                     <div className="text-gray-600">Base Price</div>
//                     <div className="font-semibold text-gray-900">₹{player.basePrice.toLocaleString()}</div>
//                   </div>
//                 )}
//                 {player.currentBid && (
//                   <div className="text-sm">
//                     <div className="text-gray-600">Current Bid</div>
//                     <div className="font-semibold text-gray-900">₹{player.currentBid.toLocaleString()}</div>
//                   </div>
//                 )}
//                 {player.category && (
//                   <div className="text-sm">
//                     <div className="text-gray-600">Category</div>
//                     <div className="font-semibold text-gray-900">{player.category}</div>
//                   </div>
//                 )}
//                 {player.status && (
//                   <div className="text-sm">
//                     <div className="text-gray-600">Status</div>
//                     <div className="font-semibold text-gray-900">{player.status}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {(assign.slotName || assign.sessionName || location.venue) && (
//             <div className="bg-gray-50 rounded-lg p-4 mb-6">
//               <h3 className="font-semibold text-gray-900 mb-3">Trial Assignment Details</h3>

//               {location.venue && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                   <MapPin className="w-4 h-4 text-pink-600" />
//                   <span className="font-medium">
//                     {location.venue},
//                     {location.address && ` ${location.address},`}
//                     {location.city && ` ${location.city},`}
//                     {location.state && ` ${location.state},`}
//                     {location.country && ` ${location.country}`}
//                     {location.pincode && ` - ${location.pincode}`}
//                   </span>
//                 </div>
//               )}

//               {assign.slotName && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                   <Calendar className="w-4 h-4 text-blue-600" />
//                   <span>Slot: {assign.slotName}</span>
//                 </div>
//               )}

//               {assign.sessionName && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                   <Calendar className="w-4 h-4 text-green-600" />
//                   <span>Session: {assign.sessionName}</span>
//                 </div>
//               )}

//               {(assign.slotDate || assign.slotStartTime) && (
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Clock className="w-4 h-4 text-orange-600" />
//                   <span>
//                     {assign.slotDate && formatDate(assign.slotDate)}
//                     {assign.slotStartTime && ` • ${formatTime(assign.slotStartTime)}`}
//                     {assign.slotEndTime && ` - ${formatTime(assign.slotEndTime)}`}
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}

//           <div className="bg-gray-50 rounded-lg p-4 mb-6">
//             <h3 className="font-semibold text-gray-900 mb-3">Status</h3>

//             {assign.sessionStatus && (
//               <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                 <span>Session Status: {assign.sessionStatus.toUpperCase()}</span>
//               </div>
//             )}

//             {assign.selectionStatus && (
//               <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
//                 <span>Selection Status: {assign.selectionStatus.toUpperCase()}</span>
//               </div>
//             )}
//           </div>

//           {assign.rating && (
//             <div className="bg-yellow-50 rounded-lg p-4 mb-6">
//               <h3 className="font-semibold text-gray-900 mb-3">Rating Details</h3>

//               {/* Avg Rating */}
//               <div className="mb-4">
//                 <div className="text-sm text-gray-600">Average Rating</div>
//                 <div className="text-2xl font-bold text-yellow-700">
//                   {assign.rating.avgRatingComputed || assign.rating.avgRating}
//                 </div>
//               </div>

//               {assign.rating.ratings?.length > 0 && (
//                 <div className="space-y-3">
//                   {assign.rating.ratings.map((rate, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
//                     >
//                       {/* Selector info */}
//                       <div className="flex items-center gap-3 w-[40%]">
//                         <img
//                           src={rate.selector?.logo}
//                           className="w-10 h-10 rounded-full object-cover bg-gray-200"
//                           alt="selector"
//                         />
//                         <div className="text-sm">
//                           <div className="font-semibold text-gray-900">
//                             {rate.selector?.name}
//                           </div>
//                           <div className="text-gray-500 text-xs">
//                             {rate.selector?.mobile}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Ratings in one row */}
//                       <div className="flex items-center gap-4 text-sm w-[60%] justify-end">
//                         <div className="text-center">
//                           <div className="text-gray-500 text-xs">Bat</div>
//                           <div className="font-semibold text-gray-900">{rate.batsman}</div>
//                         </div>

//                         <div className="text-center">
//                           <div className="text-gray-500 text-xs">Bowl</div>
//                           <div className="font-semibold text-gray-900">{rate.bowler}</div>
//                         </div>

//                         <div class-name="text-center">
//                           <div className="text-gray-500 text-xs">Fld</div>
//                           <div className="font-semibold text-gray-900">{rate.fielding}</div>
//                         </div>

//                         <div className="text-center">
//                           <div className="text-gray-500 text-xs">Att</div>
//                           <div className="font-semibold text-gray-900">{rate.attitude}</div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}





//               {/* Selector Details */}
//               {/* {assign.rating.ratings?.[0]?.selector && (
//                 <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">
//                   <img
//                     src={assign.rating.ratings[0].selector.logo || ''}
//                     className="w-12 h-12 rounded-full object-cover bg-gray-200"
//                     alt="selector"
//                   />

//                   <div className="text-sm">
//                     <div className="font-semibold text-gray-900">
//                       {assign.rating.ratings[0].selector.name}
//                     </div>
//                     <div className="text-gray-500">
//                       {assign.rating.ratings[0].selector.mobile}
//                     </div>
//                   </div>
//                 </div>

//               )} */}
//             </div>

//           )}

//         </div>
//         {adminLogin && (
//           <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t z-50">
//             <button
//               type="button"
//               onClick={handleRemove}
//               className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
//             >
//               Remove Player
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const PlayerCard: React.FC<EnhancedPlayerCardProps> = ({
//   player,
//   mode = 'view',
//   isSelected = false,
//   onSelect,
//   onViewDetails,
//   onAssign,
//   showActions = true,
//   selector,
//   onRemove,
//   adminLogin,
//   type


// }) => {

  
  

//   const [imageError, setImageError] = useState(false);
//   const [detailsModalOpen, setDetailsModalOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);
//   const initials = getInitials(player.name);
//   const role = formatRole(player.playerRole || player.type);

//   const handleViewDetails = (e?: React.MouseEvent) => {
//     e?.stopPropagation();
//     setDetailsModalOpen(true);

//     if (onViewDetails) {
//       try {
//         onViewDetails(player);
//       } catch (err) {
//         console.error('onViewDetails callback failed:', err);
//       }
//     }
//   };

//   const handleAssign = () => {
//     if (onAssign) {
//       onAssign(player);
//     }
//   };

//   const handleSelect = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (onSelect) {
//       onSelect(player.id);
//     }
//   };

//   if (mode === 'select') {
//     return (
//       <>
//         <div className="flex flex-col items-center gap-2 w-full max-w-[140px]">
//           <div className="relative w-full flex justify-center">
//             {showActions && (
//               <div
//                 onClick={handleSelect}
//                 className={`absolute -top-1 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer border ${isSelected
//                   ? "bg-green-500 border-white text-white shadow-md"
//                   : "bg-white border-gray-300 text-gray-400 hover:border-gray-400"
//                   }`}
//               >
//                 <Check className="w-4 h-4" />
//               </div>
//             )}

//             <div
//               // onClick={handleViewDetails}
//               className={`w-20 h-20 rounded-full overflow-hidden shadow-lg  transition-all ${isSelected
//                 ? "ring-4 ring-green-400 shadow-green-200"
//                 : "ring-2 ring-gray-200 hover:ring-blue-400"
//                 }`}
//             >
//               {!imageError && player.image && !isDummyImage(player.image) ? (
//                 <img
//                   src={player.image}
//                   alt={player.name}
//                   className="w-20 h-20 object-cover"
//                   onError={() => setImageError(true)}
//                 />
//               ) : (
//                 <div className={`w-full h-full bg-gradient-to-br ${getGradientByName(player.name)} flex items-center justify-center text-white text-xl font-bold`}>
//                   {initials}
//                 </div>
//               )}
//             </div>

//             <span className="absolute -bottom-2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-semibold rounded-full shadow-lg">
//               {role}
//             </span>
//           </div>

//           <div className="text-center w-full px-1">
//             <p className="text-xs font-semibold text-gray-900 truncate">
//               {player.name}
//             </p>
//             {player.batchId && (
//               <p className="text-xs text-gray-500 truncate mt-1">
//                 {player.batchId}
//               </p>
//             )}
//           </div>
//         </div>

//         <PlayerDetailsModal
//           player={player}
//           isOpen={detailsModalOpen}
//           onClose={() => setDetailsModalOpen(false)}
//           selector={selector}
//         // onRemove={onRemove}
//         // adminLogin={adminLogin}
//         />
//       </>
//     );
//   }

//   if (mode === "assigned") {
//     const assign = player.assign || {};
//     const location = assign.location || {};

//     return (
//       <>
//         <div
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           className="relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 
//           border border-gray-200 overflow-hidden flex w-full max-w-sm p-3 gap-3"
//         >
//           <div
//             onClick={(e) => handleViewDetails(e)}
//             className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
//           >
//             {!imageError && player.image && !isDummyImage(player.image) ? (
//               <img
//                 src={player.image}
//                 alt={player.name}
//                 className="w-full h-full object-cover"
//                 onError={() => setImageError(true)}
//               />
//             ) : (
//               <div className={`w-full h-full bg-gradient-to-br ${getGradientByName(player.name)} flex items-center justify-center text-white text-xl font-bold`}>
//                 {initials}
//               </div>
//             )}

//             <span
//               className={`absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[9px] font-semibold shadow 
//                 ${player.playerRole?.toLowerCase() === "batsman" || player.type?.toLowerCase() === "batsman"
//                   ? "bg-blue-600 text-white"
//                   : player.playerRole?.toLowerCase() === "bowler" || player.type?.toLowerCase() === "bowler"
//                     ? "bg-red-600 text-white"
//                     : "bg-orange-500 text-white"
//                 }`}
//             >
//               {role}
//             </span>
//           </div>

//           <div
//             // onClick={(e) => handleViewDetails(e)}
//             className="flex flex-col justify-center flex-grow "
//           >
//             <h3 className="font-semibold text-gray-900 text-sm leading-tight">
//               {player.name}
//             </h3>

//             <div className="flex items-center gap-1 mt-1">
//               <MapPin className="w-3 h-3 text-pink-500" />
//               <span className="text-xs text-gray-700 truncate">
//                 {location.venue}
//               </span>
//             </div>

//             <div className="flex items-center gap-1 mt-1">
//               <Clock className="w-3 h-3 text-green-600" />
//               <span className="text-xs text-gray-600">
//                 {formatTime(assign.slotStartTime)}-{formatTime(assign.slotEndTime)}
//               </span>
//             </div>
//           </div>

//           {isHovered && (
//             <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all duration-200">
//               <button
//                 type="button"
//                 onClick={(e) => handleViewDetails(e)}
//                 className="bg-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-100"
//               >
//                 <Eye className="w-4 h-4 text-gray-700" />
//                 <span className="text-sm font-medium text-gray-900">View</span>
//               </button>
//             </div>
//           )}
//         </div>

//         <PlayerDetailsModal
//           player={player}
//           isOpen={detailsModalOpen}
//           onClose={() => setDetailsModalOpen(false)}
//           onRate={() => {
//             console.log('Rate player clicked');
//           }}
//           selector={selector}
//           onRemove={onRemove}
//           adminLogin={adminLogin}
//           type={type}
//         />
//       </>
//     );
//   }

//   return (
//     <>
//       <div className="flex flex-col items-center gap-2 w-full max-w-[140px]">
//         <div className="relative w-full flex justify-center">
//           <div
//             // onClick={handleViewDetails}
//             className="w-20 h-20 rounded-full overflow-hidden shadow-lg transition-all ring-2 ring-gray-200 hover:ring-blue-400"
//           >
//             {!imageError && player.image && !isDummyImage(player.image) ? (
//               <img
//                 src={player.image}
//                 alt={player.name}
//                 className="w-20 h-20 object-cover"
//                 onError={() => setImageError(true)}
//               />
//             ) : (
//               <div className={`w-full h-full bg-gradient-to-br ${getGradientByName(player.name)} flex items-center justify-center text-white text-xl font-bold`}>
//                 {initials}
//               </div>
//             )}
//           </div>

//           <span className="absolute -bottom-2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-semibold rounded-full shadow-lg">
//             {role}
//           </span>
//         </div>

//         <p className="text-xs font-semibold text-gray-900 text-center truncate w-full px-1">
//           {player.name}
//         </p>
//         {player.batchId && (
//           <p className="text-xs text-gray-500 truncate mt-1">
//             {player.batchId}
//           </p>
//         )}

//         {showActions && (
//           <div className="flex gap-1 mt-1">
//             <button
//               type="button"
//               onClick={handleViewDetails}
//               className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
//             >
//               View
//             </button>
//             {onAssign && (
//               <button
//                 type="button"
//                 onClick={handleAssign}
//                 className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
//               >
//                 Assign
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       <PlayerDetailsModal
//         player={player}
//         isOpen={detailsModalOpen}
//         onClose={() => setDetailsModalOpen(false)}
//         selector={selector}
//       // onRemove={onRemove}
//       // adminLogin={adminLogin}
//       />
//     </>
//   );
// };

// export default PlayerCard;

import React, { useState } from "react";
import { Eye, MapPin, Clock, Calendar, X, Check } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const DUMMY_IMAGE_URL =
  "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";

/* ================= GRADIENTS ================= */
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

const isDummyImage = (url) => url === DUMMY_IMAGE_URL;

const getInitials = (name = "") => {
  if (!name) return "NA";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
};

const formatRole = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() : "";

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB") : "";

const formatTime = (t) => {
  if (!t) return "";
  let [h, m] = t.split(":");
  let hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

/* ================= RATING INPUT ================= */
const RatingInput = ({ label, value, setValue }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-semibold">{value}/10</span>
    </div>

    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => value > 1 && setValue(value - 1)}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
      >
        -
      </button>

      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
      />

      <button
        type="button"
        onClick={() => value < 10 && setValue(value + 1)}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
      >
        +
      </button>
    </div>
  </div>
);

/* ================= RATING FORM ================= */
const RatingForm = ({ player, onClose }) => {
  const [ratingType, setRatingType] = useState("");
  const [attitude, setAttitude] = useState(0);
  const [batsman, setBatting] = useState(0);
  const [bowler, setBowling] = useState(0);
  const [fielding, setFielding] = useState(0);

  const handleSubmit = async () => {
    try {
      await axios.post(
        `/webSiteApi/auctionSelector/ratePlayer/${player.slotId}/${player.sessionId}`,
        {
          playerId: player.id,
          playerType: ratingType,
          ratings: [
            {
              selectorId: localStorage.getItem("playerId"),
              attitude,
              ...(ratingType !== "bowler" && { batsman }),
              ...(ratingType !== "batsman" && { bowler }),
              fielding,
              timestamp: new Date().toISOString(),
            },
          ],
        }
      );
      toast.success("Scores Submitted Successfully");
    } catch (err) {
      console.error(err);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-bold mb-4">Trials Scoring</h2>

        <select
          className="w-full mb-4 border rounded-lg p-2"
          value={ratingType}
          onChange={(e) => setRatingType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="batsman">Batsman</option>
          <option value="bowler">Bowler</option>
          <option value="allrounder">All Rounder</option>
        </select>

        {ratingType && (
          <div className="space-y-4">
            <RatingInput label="Attitude" value={attitude} setValue={setAttitude} />
            <RatingInput label="Batsman" value={batsman} setValue={setBatting} />
            <RatingInput label="Bowler" value={bowler} setValue={setBowling} />
            <RatingInput label="Fielding" value={fielding} setValue={setFielding} />
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border rounded-lg py-2">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= PLAYER DETAILS MODAL ================= */
const PlayerDetailsModal = ({
  player,
  isOpen,
  onClose,
  selector,
  onRemove,
  adminLogin,
  type,
}) => {
  const [showRatingForm, setShowRatingForm] = useState(false);

  if (!isOpen || !player) return null;

  if (showRatingForm) {
    return <RatingForm player={player} onClose={onClose} />;
  }

  const initials = getInitials(player.name);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${getGradientByName(
              player.name
            )}`}
          >
            {initials}
          </div>

          <div>
            <h2 className="text-xl font-bold">{player.name}</h2>
            {type && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {type.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {adminLogin && (
          <button
            onClick={() => onRemove && onRemove(player)}
            className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg"
          >
            Remove Player
          </button>
        )}
      </div>
    </div>
  );
};

/* ================= PLAYER CARD ================= */
const PlayerCard = ({
  player,
  mode = "view",
  isSelected = false,
  onSelect,
  onViewDetails,
  onAssign,
  showActions = true,
  selector,
  onRemove,
  adminLogin,
  type,
}) => {
  const [imageError, setImageError] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const initials = getInitials(player.name);
  const role = formatRole(player.playerRole || player.type);

  const handleViewDetails = (e) => {
    e?.stopPropagation();
    setDetailsModalOpen(true);
    onViewDetails && onViewDetails(player);
  };

  if (mode === "select") {
    return (
      <>
        <div className="flex flex-col items-center gap-2 max-w-[140px]">
          <div className="relative">
            <div
              onClick={() => onSelect && onSelect(player.id)}
              className={`absolute -top-1 right-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                isSelected
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-400"
              }`}
            >
              <Check className="w-4 h-4" />
            </div>

            <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200">
              {!imageError && player.image && !isDummyImage(player.image) ? (
                <img
                  src={player.image}
                  alt={player.name}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${getGradientByName(
                    player.name
                  )}`}
                >
                  {initials}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs font-semibold truncate">{player.name}</p>
        </div>

        <PlayerDetailsModal
          player={player}
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          selector={selector}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2 max-w-[140px]">
        <div
          className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200"
          onClick={handleViewDetails}
        >
          {!imageError && player.image && !isDummyImage(player.image) ? (
            <img
              src={player.image}
              alt={player.name}
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${getGradientByName(
                player.name
              )}`}
            >
              {initials}
            </div>
          )}
        </div>

        <p className="text-xs font-semibold truncate">{player.name}</p>

        {showActions && (
          <button
            onClick={handleViewDetails}
            className="text-xs bg-gray-600 text-white px-2 py-1 rounded"
          >
            View
          </button>
        )}
      </div>

      <PlayerDetailsModal
        player={player}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        selector={selector}
        onRemove={onRemove}
        adminLogin={adminLogin}
        type={type}
      />
    </>
  );
};

export default PlayerCard;
