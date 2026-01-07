// import React from "react";

// interface PlayerInfo {
//   name?: string;
//   logo?: string | null;
// }

// interface PurchasedPlayer {
//   player?: PlayerInfo;
//   role?: string;
//   finalPrice?: number;
// }

// interface Props {
//   player: PurchasedPlayer;

// }

// const PurchasedPlayerCard: React.FC<Props> = ({ player }) => {
//   const getInitials = (name?: string): string => {
//     if (!name) return "";
//     const parts = name.split(" ");
//     if (parts.length === 1) return parts[0][0].toUpperCase();
//     return (parts[0][0] + parts[1][0]).toUpperCase();
//   };

//   const gradients = [
//     "from-pink-500 to-purple-500",
//     "from-blue-500 to-cyan-500",
//     "from-green-500 to-emerald-500",
//     "from-orange-500 to-rose-500",
//     "from-indigo-500 to-violet-500",
//   ];

//   const getGradient = (text: string) => {
//     const index = text.charCodeAt(0) % gradients.length;
//     return gradients[index];
//   };


//   const initials = getInitials(player?.player?.name);
//   const image = player?.player?.logo;
//   const role = player?.player?.playerRole || "Player";
//   const finalPrice = player?.finalPrice || 0;
//   const DUMMY_IMAGE =
//     "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";
//   const showImage = image && image !== DUMMY_IMAGE;
//   const initialsGradient = getGradient(initials || "P");


//   return (
//     // <div className="flex items-center gap-4 p-2 rounded-2xl shadow-md border bg-gray-100 w-full max-w-[300px]">

//     //   {/* LEFT - IMAGE BOX */}
//     //   <div
//     //     className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
//     //     style={{
//     //       background:
//     //         "linear-gradient(135deg, x #8b5cf6)",
//     //     }}
//     //   >
//     //     {showImage ? (
//     //       <img
//     //         src={image}
//     //         alt={player?.player?.name || "player"}
//     //         className="w-16 h-16 object-cover rounded-xl"
//     //       />
//     //     ) : (
//     //       <div
//     //         className={`w-full h-full flex items-center justify-center text-white bg-gradient-to-br rounded-xl ${initialsGradient}`}
//     //       >
//     //         {initials}
//     //       </div>
//     //     )}
//     //   </div>

//     //   {/* RIGHT SIDE DETAILS */}
//     //   <div className="flex flex-col">
//     //     <h3 className="text-lg font-bold text-gray-800">
//     //       {player?.player?.name}
//     //     </h3>

//     //     <p className="text-xs text-pink-500 font-semibold">{role?.toUpperCase()}</p>

//     //     <p className="text-sm text-green-600 font-bold mt-1">
//     //       ₹{finalPrice.toLocaleString()}
//     //     </p>
//     //   </div>
//     // </div>
//     <div className="flex items-center gap-3 px-3 py-2 rounded-xl 
//       bg-slate-900/60 backdrop-blur-md 
//       border border-white/10 
//       hover:border-cyan-400/40 transition
//       w-full max-w-[240px] shadow-sm shadow-gray-500">

//       {/* Avatar */}
//       <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
//         {showImage ? (
//           <img
//             src={image}
//             alt={player?.player?.name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div
//             className={`w-full h-full flex items-center justify-center 
//             text-white text-sm font-bold 
//             bg-gradient-to-br ${initialsGradient}`}
//           >
//             {initials}
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div className="flex flex-col leading-tight">
//         <span className="text-sm font-semibold text-white truncate max-w-[140px]">
//           {player?.player?.name}
//         </span>

//         <span className="text-[10px] text-cyan-300 uppercase tracking-wide">
//           {role}
//         </span>

//         <span className="text-xs font-bold text-green-400 mt-0.5">
//           ₹{finalPrice.toLocaleString()}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default PurchasedPlayerCard;



import React from "react";

const PurchasedPlayerCard = ({ player }) => {
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const gradients = [
    "from-pink-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-rose-500",
    "from-indigo-500 to-violet-500",
  ];

  const getGradient = (text) => {
    const index = text.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  const initials = getInitials(player?.player?.name);
  const image = player?.player?.logo;
  const role = player?.player?.playerRole || "Player";
  const finalPrice = player?.finalPrice || 0;

  const DUMMY_IMAGE =
    "https://crickbro.s3.ap-south-1.amazonaws.com/uploads/dummyImage.png";

  const showImage = image && image !== DUMMY_IMAGE;
  const initialsGradient = getGradient(initials || "P");

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-xl 
      bg-slate-900/60 backdrop-blur-md 
      border border-white/10 
      hover:border-cyan-400/40 transition
      w-full max-w-[240px] shadow-sm shadow-gray-500"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
        {showImage ? (
          <img
            src={image}
            alt={player?.player?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center 
            text-white text-sm font-bold 
            bg-gradient-to-br ${initialsGradient}`}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-white truncate max-w-[140px]">
          {player?.player?.name}
        </span>

        <span className="text-[10px] text-cyan-300 uppercase tracking-wide">
          {role}
        </span>

        <span className="text-xs font-bold text-green-400 mt-0.5">
          ₹{finalPrice.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default PurchasedPlayerCard;
