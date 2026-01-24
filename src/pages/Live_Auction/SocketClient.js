// import { io, Socket } from "socket.io-client";

// export interface SocketClientOptions<T = any> {
//   auctionId: string;
//   onSnapshot?: (data: T) => void; // called with first payload
//   onUpdate?: (data: T) => void; // called for subsequent updates
//   onDisconnect?: (reason: string) => void;
//   onError?: (error: Error) => void;
// }

// let socket: Socket | null = null;

//     // namespace URL - Auto-detect from current page URL (end se detect)
//     const getSocketUrl = () => {
//       // If explicitly set via environment variable, use it
//       if ((import.meta as any)?.env?.VITE_SOCKET_URL) {
//         return (import.meta as any).env.VITE_SOCKET_URL;
//       }

//       // Detect from current page hostname (end se check)
//       const hostname = window.location.hostname;

//       // Staging domain check (end mein staging ho)
//       if (hostname.includes('staging')) {
//         return 'https://stagingapi.crickbro.com:4001';
//       }

//       // Production domain check
//       if (hostname.includes('crickbro.com') && !hostname.includes('staging')) {
//         return 'https://api.crickbro.com';
//       }

//       // Local development
//       if (hostname === 'localhost' || hostname === '127.0.0.1') {
//         return 'http://localhost:4001';
//       }

//       // Default fallback
//       return 'https://stagingapi.crickbro.com:4001';
//     };

//     const socketUrl = getSocketUrl();

// // const socketUrl = "https://stagingapi.crickbro.com:4001";

// export const connectAuctionSocket = <T = any>({
//   auctionId,
//   onSnapshot,
//   onUpdate,
//   onDisconnect,
//   onError, 
// }: SocketClientOptions<T>): Socket => {
//   // create socket instance once
//   if (!socket) {
//     socket = io(socketUrl, {
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionAttempts: 10,
//     });
//   } 

//   // Prevent attaching duplicate handlers when this helper is called multiple times
//   socket.off("connect");
//   socket.off("auctionUpdate");
//   socket.off("joinAuctionRoom");
//   socket.off("disconnect");
//   socket.off("connect_error");

//   // track whether we've delivered the initial snapshot
//   let snapshotDelivered = false;

//   // on connect - join the auction room
//   socket.on("connect", () => {
//     console.log("⚡ Socket Connected:", socket?.id);
//     socket?.emit("joinAuctionRoom", auctionId);
//   });

//   // if already connected (reused socket) then join immediately
//   if (socket.connected) {
//     socket.emit("joinAuctionRoom", auctionId);
//   }

//   // server may emit a join acknowledgement with initial payload
//   socket.on("joinAuctionRoom", (data: T) => {
//     if (!snapshotDelivered) {
//       snapshotDelivered = true;
//       onSnapshot?.(data);
//     } else {
//       onUpdate?.(data);
//     }
//   });

//   // main update channel: treat the first message as snapshot, others as updates
//   socket.on("auctionUpdate", (data: T) => {
//     if (!snapshotDelivered) {
//       snapshotDelivered = true;
//       onSnapshot?.(data);
//     } else {
//       onUpdate?.(data);
//     }
//   });

//   socket.on("disconnect", (reason: string) => {
//     console.warn("⚠️ Socket Disconnected:", reason);
//     onDisconnect?.(reason);
//   });

//   socket.on("connect_error", (err: any) => {
//     const error = err instanceof Error ? err : new Error(String(err));
//     console.error("❌ Socket Error:", error.message);
//     onError?.(error);
//   });
  

//   return socket;
// };

// export const disconnectSocket = (): void => {
//   if (!socket) return;
//   socket.removeAllListeners();
//   socket.disconnect();
//   socket = null;
// };

// export const getSocket = (): Socket | null => socket;


import { io } from "socket.io-client";

/*
  NOTE:
  This is a pure JSX / JavaScript version.
  No TypeScript types are used.
*/

/* ================= SOCKET INSTANCE ================= */

let socket = null;

/* ================= SOCKET URL DETECTION ================= */

// namespace URL - Auto-detect from current page URL (end se detect)
const getSocketUrl = () => {
  // If explicitly set via environment variable, use it
  if (import.meta?.env?.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  // Detect from current page hostname (end se check)
  const hostname = window.location.hostname;

  // Staging domain check
  if (hostname.includes("staging")) {
    return "https://stagingapi.crickbro.com:4001";
  }

  // Production domain check
  if (hostname.includes("crickbro.com") && !hostname.includes("staging")) {
    return "https://api.crickbro.com";
  }

  // Local development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:4001";
  }

  // Default fallback
  return "https://stagingapi.crickbro.com:4001";
};

// const socketUrl = getSocketUrl();
const socketUrl ="https://stagingapi.crickbro.com:4001"

/* ================= CONNECT SOCKET ================= */

export const connectAuctionSocket = ({
  auctionId,
  onSnapshot,
  onUpdate,
  onDisconnect,
  onError,
}) => {
  // create socket instance once
  if (!socket) {
    socket = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });
  }

  // Prevent attaching duplicate handlers
  socket.off("connect");
  socket.off("auctionUpdate");
  socket.off("joinAuctionRoom");
  socket.off("disconnect");
  socket.off("connect_error");

  // track whether we've delivered the initial snapshot
  let snapshotDelivered = false;

  // on connect - join the auction room
  socket.on("connect", () => {
    console.log("⚡ Socket Connected:", socket?.id);
    socket?.emit("joinAuctionRoom", auctionId);
  });

  // if already connected (reused socket)
  if (socket.connected) {
    socket.emit("joinAuctionRoom", auctionId);
  }

  // join acknowledgement (initial payload)
  socket.on("joinAuctionRoom", (data) => {
    if (!snapshotDelivered) {
      snapshotDelivered = true;
      onSnapshot && onSnapshot(data);
    } else {
      onUpdate && onUpdate(data);
    }
  });

  // main update channel
  socket.on("auctionUpdate", (data) => {
    if (!snapshotDelivered) {
      snapshotDelivered = true;
      onSnapshot && onSnapshot(data);
    } else {
      onUpdate && onUpdate(data);
    }
  });

  socket.on("disconnect", (reason) => {
    console.warn("⚠️ Socket Disconnected:", reason);
    onDisconnect && onDisconnect(reason);
  });

  socket.on("connect_error", (err) => {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("❌ Socket Error:", error.message);
    onError && onError(error);
  });

  return socket;
};

/* ================= DISCONNECT SOCKET ================= */

export const disconnectSocket = () => {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
};

/* ================= GET SOCKET ================= */

export const getSocket = () => socket;

