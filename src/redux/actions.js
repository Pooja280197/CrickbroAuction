import axios from "axios";

function decodeJWT(token) {
  try {
    const payloadBase64 = token.split('.')[1]; // Get the payload part
    const decodedPayload = atob(payloadBase64); // Decode Base64
    return JSON.parse(decodedPayload); // Parse JSON string
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}


// Login API

export const sendOtp = ({ key, payload }) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key });

    try {
      const response = await axios.post(
        "/webSiteApi/players/sendOtpToUser",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "API_SUCCESS",
        key,
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key,
        payload:
          error?.response?.data?.message ||
          "Failed to send OTP",
      });
    }
  };
};

export const verifyOtp = ({ payload }) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key:"verify" });

    try {
      const response = await axios.post(
        "/webSiteApi/players/verifyOtpAndLogin",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      dispatch({
        type: "API_SUCCESS",
        key:"verify",
        payload: response?.data?.data,
      })
    
      const token = response?.data?.data?.token;
      localStorage.setItem("token", token);
      localStorage.setItem('NewPlayer', JSON.stringify(response?.data?.data?.newPlayer));

      if (token) {
        const decoded = decodeJWT(token);
        localStorage.setItem("playerId", decoded.playerId);
        window.dispatchEvent(new Event("userLoggedIn"));
      }
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key:"verify",
        payload:
          error?.response?.data?.message ||
          "Failed to send OTP",
      });
    }
  };
};

// Player Profile
export const fetchProfile = (playerId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "profile" });

    try {
      const response = await axios.get(
        `/webSiteApi/players/profile?playerId=${playerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwbGF5ZXJJZCI6IjY4ZGEyOTgyNmZlMDdmNjRiZjQ1YTFlZSIsImlhdCI6MTc2NTU0NzM1Mn0.5W2YOa1aVYpTrTeT1eHye-K0mgR_48T3nWZoFpqAlfs`,
          },
        }
      );
      dispatch({
        type: "API_SUCCESS",
        key: "profile",
        payload: response?.data?.data,
      });
      console.log(response, "response")

      let obj = {
        name: response.data.data.name,
        mobile: response.data.data.mobile,
        profilePicture: response.data.data.profilePicture,
        batchId: response.data.data.batchId
      }
      localStorage.setItem('userDetail', JSON.stringify(obj));
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "profile",
        payload:
          error?.response?.data?.message ||
          "Failed to fetch profile",
      });
    }
  };
};


// Auction Api
export const fetchAuctions = () => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key:"auctionList" });

    const url = "/webSiteApi/auction/list";

    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key:"auctionList",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key:"auctionList",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  };
};

export const fetchAuctionDetails = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key:"auctionDetails" });
    const url = `/webSiteApi/auction/getAuctionById/${auctionId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key:"auctionDetails",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",  
        key:"auctionDetails",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const fetchAllAdmin = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key:"auctionAdmins" });
    const url = `/webSiteApi/auctionAdmin/getAdminsForAuction${auctionId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key:"auctionAdmins",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",  
        key:"auctionAdmins",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}
export const fetchSlotList = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key:"slotList" });
    const url = `/webSiteApi/auctionSlot/getListAuctionSlots?auctionId=${auctionId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key:"slotList",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",  
        key:"slotList",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}
export const fetchAuctionPlayers = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key:"auctionPlayers" });
    const url = `/webSiteApi/auction/getAuctionPlayers/${auctionId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key:"auctionPlayers",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",  
        key:"auctionPlayers",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}