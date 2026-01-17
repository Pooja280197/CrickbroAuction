import axios from "axios";

const playerId = localStorage.getItem('playerId')
const tournamentId = localStorage.getItem('tournamentId')


// LOGIN
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
    dispatch({ type: "API_START", key: "verify" });

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
        key: "verify",
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
        key: "verify",
        payload:
          error?.response?.data?.message ||
          "Failed to send OTP",
      });
    }
  };
};

export const fetchUserRole = (auctionId, playerId) => {

  return async (dispatch) => {
    dispatch({ type: "API_START", key: "userRole" });
    const url = `/webSiteApi/auction/checkAuctionUserRole/${auctionId}/${playerId}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "userRole",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "userRole",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}



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
            Authorization: `Bearer `,
          },
        }
      );
      dispatch({
        type: "API_SUCCESS",
        key: "profile",
        payload: response?.data?.data,
      });


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

export const EnrollPlayer = (auctionId, playerId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "enrollPlayer" });
    const url = (`/webSiteApi/auction/addPlayers/${auctionId}`)
    try {
      const response = await axios.post(url, { playerIds: [playerId] });
      dispatch({
        type: "API_SUCCESS",
        key: "enrollPlayer",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "enrollPlayer",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}


// Auction Api
export const fetchAuctions = (tab, playerId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionList" });

    let url = "/webSiteApi/auction/list";

    if (tab === "my") {
      url += `?playerId=${playerId}&myAuction=true`;
    } else {
      url += `?status=${tab}`;
    }

    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "auctionList",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "auctionList",
        payload:
          error?.response?.data?.message || "Something went wrong",
      });
    }
  };
};



export const fetchAuctionDetails = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionDetails" });
    const url = `/webSiteApi/auction/getAuctionById/${auctionId}`;
    try {
      const response = await axios.get(url);
      localStorage.setItem('tournamentId', response?.data?.data?.tournament?.id)
      dispatch({
        type: "API_SUCCESS",
        key: "auctionDetails",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "auctionDetails",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const fetchAllAdmin = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionAdmins" });
    const url = `/webSiteApi/auctionAdmin/getAdminsForAuction/${auctionId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key: "auctionAdmins",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "auctionAdmins",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}
export const fetchSlotList = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "slotList" });
    const url = `/webSiteApi/auctionSlot/getListAuctionSlots?auctionId=${auctionId}`;
    try {
      const response = await axios.get(url);
      console.log(response)
      dispatch({
        type: "API_SUCCESS",
        key: "slotList",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "slotList",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const fetchSlotSessions = (slotId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "sessions" });
    const url = `/webSiteApi/auctionSlot/getAuctionSlot/${slotId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key: "sessions",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "sessions",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const fetchAuctionPlayers = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionPlayers" });
    const url = `/webSiteApi/auction/getAuctionPlayers/${auctionId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key: "auctionPlayers",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "auctionPlayers",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}


export const fetchAllSelectors = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionSelectors" });
    const url = `/webSiteApi/auctionSelector/getSelectorsForAuction/${auctionId}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "auctionSelectors",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "auctionSelectors",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const fetchTeamsData = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "TeamData" });
    const url = `/webSiteApi/auctionTeam/getTeamsByOwnerInAuction/${auctionId}?playerId=${playerId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key: "TeamData",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "TeamData",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const fetchAllTeamOwners = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionTeamOwners" });
    const url = `/webSiteApi/auctionTeam/getTeamOwnerList/${auctionId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key: "auctionTeamOwners",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "auctionTeamOwners",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const fetchPurchasedPlayers = (auctionId, selectedTeamId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "PurchasedPlayers" });
    const url = `/webSiteApi/auction/getAllPlayersAdmin/${auctionId}?teamId=${selectedTeamId}`;
    try {
      const response = await axios.get(url);
      dispatch({
        type: "API_SUCCESS",
        key: "PurchasedPlayers",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "PurchasedPlayers",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const searchUserByMobile = (mobileNum) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "searchUser" });
    const url = `/webSiteApi/auctionAdmin/getPlayerByNameAndContact`;
    try {
      const response = await axios.get(url, {
        params: { search: mobileNum },
      });
      dispatch({
        type: "API_SUCCESS",
        key: "searchUser",
        payload: response?.data?.data,
      });
      return response;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "searchUser",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const addAuctionAdmin = (auctionId, adminPayload) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "addAdmin" });
    const url = `/webSiteApi/auctionAdmin/addAdmin/${auctionId}`;
    const body = typeof adminPayload === "object" && !Array.isArray(adminPayload)
      ? adminPayload
      : { admin: adminPayload };
    try {
      const response = await axios.post(url, body);
      dispatch({
        type: "API_SUCCESS",
        key: "addAdmin",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "addAdmin",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const removeAdmin = (auctionId, adminId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "removeAdmin" });

    try {
      const response = await axios.post(
        `/webSiteApi/auctionAdmin/removeAdmin/${auctionId}`,
        {
          admin: adminId,
        }, // 👈 DELETE body goes in `data`

      );

      dispatch({
        type: "API_SUCCESS",
        key: "removeAdmin",
        payload: adminId,
      });

      return response;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "removeAdmin",
        payload:
          error?.response?.data?.message || "Failed to remove admin",
      });
      throw error;
    }
  };
};

export const addAuctionSelector = (auctionId, adminPayload) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "addSelector" });
    const url = `/webSiteApi/auctionSelector/addSelector/${auctionId}`;
    const body = typeof adminPayload === "object" && !Array.isArray(adminPayload)
      ? adminPayload
      : { admin: adminPayload };
    try {
      const response = await axios.post(url, body);
      dispatch({
        type: "API_SUCCESS",
        key: "addSelector",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "addSelector",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const removeSelector = (auctionId, selectorId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "removeSelector" });

    try {
      const response = await axios.post(
        `/webSiteApi/auctionSelector/removeSelector/${auctionId}`,
        {
          selector: selectorId,
        }, // 👈 DELETE body goes in `data`

      );

      dispatch({
        type: "API_SUCCESS",
        key: "removeSelector",
        payload: selectorId,
      });

      return response;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "removeSelector",
        payload:
          error?.response?.data?.message || "Failed to remove Selector",
      });
      throw error;
    }
  };
};

// export const getAllAuctionTeams = () => {
//   return async (dispatch) => {
//     dispatch({ type: "API_START", key: "auctionTeams" });
//     const url = `/webSiteApi/auction/getTeamList/${tournamentId}`;
//     try {
//       const response = await axios.get(url);
//       console.log(response, "response in action");
//       dispatch({
//         type: "API_SUCCESS",
//         key: "auctionTeams",
//         payload: response?.data?.data,
//       });
//     } catch (error) {
//       dispatch({
//         type: "API_ERROR",
//         key: "auctionTeams",
//         payload:
//           error?.response?.data?.message ||
//           "Something went wrong",
//       });
//     }
//   }
// }

export const addTeamToAuction = (auctionId, selectedTeam) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "addTeams" });
    const url = `/webSiteApi/auction/addTeams/${auctionId}`;
    try {
      const response = await axios.post(url, {
        teamsId: selectedTeam
      });
      dispatch({
        type: "API_SUCCESS",
        key: "addTeams",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "addTeams",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const addTeamOwner = (auctionId, selectedTeamId, adminPayload) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "addTeamOwner" });
    const url = `/webSiteApi/auctionTeam/addTeamOwner/${auctionId}`;
    const body = typeof adminPayload === "object" && !Array.isArray(adminPayload)
      ? adminPayload
      : {
        teamId: selectedTeamId,
        ownerId: adminPayload
      };
    try {
      const response = await axios.post(url,
        body);
      dispatch({
        type: "API_SUCCESS",
        key: "addTeamOwner",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "addTeamOwner",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const EditRules = (auctionId, formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "editRules" });
    const url = `/webSiteApi/auction/updateAuctionRules/${auctionId}`;
    try {
      const response = await axios.put(url, formData);
      dispatch({
        type: "API_SUCCESS",
        key: "editRules",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "editRules",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const removeTeamOwner = (auctionId, ownerId, teamId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "removeTeamOwner" });

    try {
      const response = await axios.post(
        `/webSiteApi/auctionTeam/removeTeamOwner/${auctionId}`,
        {
          teamId: teamId,
          ownerId: ownerId,
        } // 👈 DELETE body goes in `data`

      );

      dispatch({
        type: "API_SUCCESS",
        key: "removeTeamOwner",
        payload: {
          teamId: teamId,
          ownerId: ownerId,
        },
      });

      return response;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "removeTeamOwner",
        payload:
          error?.response?.data?.message || "Failed to remove team owner",
      });
      throw error;
    }
  };
};

export const UpateRating = (auctionId, formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "updateRating" });
    const url = `/webSiteApi/auction/updateTrailSettings/${auctionId}`;
    try {
      const response = await axios.put(url, formData);
      dispatch({
        type: "API_SUCCESS",
        key: "updateRating",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "updateRating",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const createSlot = (formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "createSlot" });
    const url = `/webSiteApi/auctionSlot/createAuctionSlot`;
    try {
      const response = await axios.post(url,
        formData);
      dispatch({
        type: "API_SUCCESS",
        key: "createSlot",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "createSlot",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

// redux action
export const updateSlotThunk = (slotId, formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "updateSlot" });

    const url = `/webSiteApi/auctionSlot/updateAuctionSlot/${slotId}`;
    try {
      const response = await axios.put(url, formData);

      dispatch({
        type: "API_SUCCESS",
        key: "updateSlot",
        payload: response?.data?.data,
      });

      return response;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "updateSlot",
        payload:
          error?.response?.data?.message || "Something went wrong",
      });
      throw error;
    }
  };
};

// Delete a slot
export const deleteSlot = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "deleteSlot" });
    const url = `/webSiteApi/auctionSlot/deleteAuctionSlot/${auctionId}`;
    try {
      const response = await axios.delete(url);
      dispatch({
        type: "API_SUCCESS",
        key: "deleteSlot",
        payload: response?.data?.data,
      });
      return response;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "deleteSlot",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  };
};

export const createSession = (selectedId, formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "createSession" });
    const url = `/webSiteApi/auctionSlot/addSession/${selectedId}`;
    try {
      const response = await axios.post(url,
        formData);
      dispatch({
        type: "API_SUCCESS",
        key: "createSession",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "createSession",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const editSession = (slotId, sessionId, sessionData) => {

  return async (dispatch) => {
    dispatch({ type: "API_START", key: "editSession" });

    try {
      const res = await axios.put(
        `/webSiteApi/auctionSlot/updateSession/${slotId}/${sessionId}`,
        sessionData
      );

      dispatch({
        type: "API_SUCCESS",
        key: "editSession",
        payload: res?.data?.data,
      });

      return res;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "editSession",
        payload:
          error?.response?.data?.message || "Failed to update session",
      });
      throw error;
    }
  };
};

export const deleteSession = (slotId, sessionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "deleteSession" });
    const url = `/webSiteApi/auctionSlot/removeSession/${slotId}/${sessionId}`;
    try {
      const response = await axios.delete(url);
      dispatch({
        type: "API_SUCCESS",
        key: "deleteSession",
        payload: response?.data?.data,
      });
      return response;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "deleteSession",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  };
};


export const getMyTournaments = () => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "myTournaments" });
    const url = `/webSiteApi/auction/listTournamentDropdown/${playerId}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "myTournaments",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "myTournaments",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const createAuction = (formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "createAuction" });
    const url = `/webSiteApi/auction/create`;
    try {
      const response = await axios.post(url,
        formData);
      dispatch({
        type: "API_SUCCESS",
        key: "createAuction",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "createAuction",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const editAuction = (auctionId, formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "editAuction" });
    const url = `/webSiteApi/auction/edit/${auctionId}`;
    try {
      const response = await axios.put(url,
        formData);
      dispatch({
        type: "API_SUCCESS",
        key: "editAuction",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "editAuction",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const createCategory = (formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "createCategory" });
    const url = `/webSiteApi/auctionCategory/createCategory`;
    try {
      const response = await axios.post(url,
        formData
      );
      dispatch({
        type: "API_SUCCESS",
        key: "createCategory",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "createCategory",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const getCategories = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "categories" });
    const url = `/webSiteApi/auctionCategory/listCategories?auctionId=${auctionId}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "categories",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "categories",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const updateCategories = (data, editId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "updateCategories" });
    const url = `/webSiteApi/auctionCategory/updateCategory/${editId}`;
    try {
      const response = await axios.put(url, data);

      dispatch({
        type: "API_SUCCESS",
        key: "updateCategories",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "updateCategories",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const deleteCategory = (deleteCategoryId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "deleteCategory" });
    const url = `/webSiteApi/auctionCategory/deleteCategory/${deleteCategoryId}`;
    try {
      const response = await axios.delete(url);
      dispatch({
        type: "API_SUCCESS",
        key: "deleteCategory",
        payload: response?.data?.data,
      });
      return response;
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "deleteCategory",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  };
};

export const getSelectorsSlot = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "mySlots" });
    const url = `/webSiteApi/auctionSelector/getSelectorAssignments/${auctionId}?selectorId=${playerId}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "mySlots",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "mySlots",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const getAuctionPlayers = ({
  auctionId,
  activePlayerTab,
  page = 1,
  itemsPerPage,
  statusSort,
  typeSort,
  debouncedSearch,
}) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionPlayers" });

    try {
      let url = `/webSiteApi/auction/getAuctionPlayers/${auctionId}`;

      const params = {
        limit: itemsPerPage,
        page,
      };

      if (activePlayerTab === "unassigned") {
        params.trailStatus = "not-assign";
      } else if (activePlayerTab === "assigned") {
        params.trailStatus = "assign";

        if (statusSort) {
          if (statusSort === "all") {
            params.selectionStatus = "";
            params.playerType = "";
          } else if (
            statusSort === "pending" ||
            statusSort === "not reached"
          ) {
            params.selectionStatus = statusSort;
            params.playerType = "";
          } else {
            params.selectionStatus = statusSort;
          }
        }

        if (typeSort) {
          params.playerType = typeSort === "none" ? "" : typeSort;
        }
      }

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const queryString = new URLSearchParams(params).toString();
      if (queryString) url += `?${queryString}`;

      const res = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "auctionPlayers",
        payload: {
          list: res?.data?.data?.data || [],
          pages: res?.data?.data?.pages || 0,
          total: res?.data?.data?.total || 0,
          page,
        },
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "auctionPlayers",
        payload:
          error?.response?.data?.message ||
          "Failed to fetch players",
      });
    }
  };
};

export const getAuctionTeams = (auctionId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionTeams" });
    const url = `/webSiteApi/auction/getAuctionTeams/${auctionId}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "auctionTeams",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "auctionTeams",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const getAllAuctionTeam = () => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "allAuctionTeams" });
    const url = `/webSiteApi/auction/getTeamList/${tournamentId}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "allAuctionTeams",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "allAuctionTeams",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const getSelectorPlayers = (auctionId, page, search) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "selectorPlayers" });
    const url = `/webSiteApi/auctionSelector/getPlayersBySelector/${auctionId}`;
    try {
      const response = await axios.get(url, {
        params: {
          selectorId: playerId,
          search: search,
          page: page,
          limit: 8
        }
      });

      dispatch({
        type: "API_SUCCESS",
        key: "selectorPlayers",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "selectorPlayers",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}

export const AssignPlayersToTrails = (selectedSlot, selectedSession, payload) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "assignPlayersToTrial" });
    const url = (`/webSiteApi/auctionSlot/addPlayerToSession/${selectedSlot}/${selectedSession}`)
    try {
      const response = await axios.post(url,payload);
      dispatch({
        type: "API_SUCCESS",
        key: "assignPlayersToTrial",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "assignPlayersToTrial",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const importPlayer = (auctionId, file) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "importPlayers" });
    const url = (`/webSiteApi/auction/addPlayersViaExcel/${auctionId}`)
    try {
      const response = await axios.post(url, file, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch({
        type: "API_SUCCESS",
        key: "importPlayers",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "importPlayers",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const addNewField = (auctionId, formData) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "addFields" });
    const url = `/webSiteApi/auction/addRatingFieldsToAuction/${auctionId}`;
    try {
      const response = await axios.put(url, formData);
      dispatch({
        type: "API_SUCCESS",
        key: "addFields",
        payload: response?.data?.data,
      });
      return response;
    }
    catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "addFields",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
      throw error;
    }
  }
}

export const getSelectedPlayers = ({
  auctionId,
  page = 1,
  itemsPerPage = 8,
  debouncedUnassignPlayer,
  searchUnassign,
  typeFilter,
  fromRating,
  toRating,
  slotFilter,
  slotSessionFilter,
}) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "selectedPlayers" });

    try {
      let url = `/webSiteApi/auction/getSelectPlayers/${auctionId}`;

      // ✅ params MUST be declared before use
      const params = {
        categoryFilter: "notassignincategory",
        page,
        limit: itemsPerPage,
      };

      // 🔍 Search
      const searchValue = debouncedUnassignPlayer || searchUnassign;
      if (searchValue) {
        params.search = searchValue;
      }

      // 🎯 Player Type Filter
      if (typeFilter) {
        params.playerType = typeFilter;
      }

      // ⭐ Rating Filters
      if (fromRating !== "") {
        params.ratingFrom = fromRating;
      }

      if (toRating !== "") {
        params.ratingTo = toRating;
      }

      // 🕒 Slot Filters
      if (slotFilter) {
        params.slotId = slotFilter;
      }

      if (slotSessionFilter) {
        params.sessionId = slotSessionFilter;
      }

      // ✅ Convert params object → query string
      const queryString = new URLSearchParams(params).toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "selectedPlayers",
        payload: {
          list: res?.data?.data?.data || [],
          page: res?.data?.data?.page || 1,
          pages: res?.data?.data?.pages || 1,
          total: res?.data?.data?.total || 0,
        },
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "selectedPlayers",
        payload:
          error?.response?.data?.message ||
          "Failed to load unassigned players",
      });
    }
  };
};

export const getUnassignedinCategory = ({
  auctionId,
  page = 1,
  itemsPerPage = 8,
  debouncedUnassignPlayer,
  searchUnassign,
  typeFilter,

}) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "unassignedPlayers" });

    try {
      let url = `/webSiteApi/auction/getAuctionPlayers/${auctionId}`;

      // ✅ params MUST be declared before use
      const params = {
        categoryFilter: "notassignincategory",
        page,
        limit: itemsPerPage,
      };

      // 🔍 Search
      const searchValue = debouncedUnassignPlayer || searchUnassign;
      if (searchValue) {
        params.search = searchValue;
      }
      // 🎯 Player Type Filter
      if (typeFilter) {
        params.playerType = typeFilter;
      }

     
      // ✅ Convert params object → query string
      const queryString = new URLSearchParams(params).toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const res = await axios.get(url);
      console.log(res,"api res")

      dispatch({
        type: "API_SUCCESS",
        key: "unassignedPlayers",
        payload: {
          list: res?.data?.data?.data || [],
          page: res?.data?.data?.page || 1,
          pages: res?.data?.data?.pages || 1,
          total: res?.data?.data?.total || 0,
        },
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "unassignedPlayers",
        payload:
          error?.response?.data?.message ||
          "Failed to load unassigned players",
      });
    }
  };
};

export const getAssignedinCategory = ({
  auctionId,
  page = 1,
  itemsPerPage = 8,
  debouncedAssignPlayer,
  searchAssign,
  typeFilter,
  fromRating,
  toRating,
  categorySearchId,
  slotFilter,
  slotSessionFilter,
}) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "assignedinCategory" });

    try {
      let url = `/webSiteApi/auction/getSelectPlayers/${auctionId}`;

      const params = {
        categoryFilter: "assignincategory",
        page,
        limit: itemsPerPage,
      };

      const searchValue = debouncedAssignPlayer || searchAssign;
      if (searchValue) params.search = searchValue;

      if (typeFilter) params.playerType = typeFilter;
      if (fromRating !== "") params.ratingFrom = fromRating;
      if (toRating !== "") params.ratingTo = toRating;
      if (categorySearchId) params.categoryId = categorySearchId;
      if (slotFilter) params.slotId = slotFilter;
      if (slotSessionFilter) params.sessionId = slotSessionFilter;

      url += `?${new URLSearchParams(params).toString()}`;

      const res = await axios.get(url);
      console.log(res,"getAssignedinCategory")

      dispatch({
        type: "API_SUCCESS",
        key: "assignedinCategory",
        payload: {
          list: res?.data?.data?.data || [],
          page: res?.data?.data?.page || 1,
          pages: res?.data?.data?.pages || 1,
          total: res?.data?.data?.total || 0,
        },
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "assignedinCategory",
        payload:
          error?.response?.data?.message ||
          "Failed to load assigned players",
      });
    }
  };
};



export const getAssignedPlayers = ({
  auctionId,
  page = 1,
  itemsPerPage = 8,
  debouncedAssignPlayer,
  searchAssign,
  typeFilter,
  fromRating,
  toRating,
  categorySearchId,
  slotFilter,
  slotSessionFilter,
}) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "assignedPlayers" });

    try {
      let url = `/webSiteApi/auction/getAuctionPlayers/${auctionId}`;

      const params = {
        categoryFilter: "assignincategory",
        page,
        limit: itemsPerPage,
      };

      // 🔍 Search
      const searchValue = debouncedAssignPlayer || searchAssign;
      if (searchValue) params.search = searchValue;

      // 🎯 Filters
      if (typeFilter) params.playerType = typeFilter;
      if (fromRating !== "") params.ratingFrom = fromRating;
      if (toRating !== "") params.ratingTo = toRating;
      if (categorySearchId) params.categoryId = categorySearchId;
      if (slotFilter) params.slotId = slotFilter;
      if (slotSessionFilter) params.sessionId = slotSessionFilter;

      url += `?${new URLSearchParams(params).toString()}`;

      const res = await axios.get(url);
       console.log(res,"getAssignedPlayers")

      dispatch({
        type: "API_SUCCESS",
        key: "assignedPlayers",
        payload: {
          list: res?.data?.data?.data || [],
          page: res?.data?.data?.page || 1,
          pages: res?.data?.data?.pages || 1,
          total: res?.data?.data?.total || 0,
        },
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "assignedPlayers",
        payload:
          error?.response?.data?.message ||
          "Failed to load assigned players",
      });
    }
  };
};


export const getCategoryPlayers = (categoryId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "categoryPlayers" });
    const url = `/webSiteApi/auctionCategory/getPlayersByCategory/${categoryId}`;
    try {
      const response = await axios.get(url);

      dispatch({
        type: "API_SUCCESS",
        key: "categoryPlayers",
        payload: response?.data?.data,
      });
    } catch (error) {
      dispatch({
        type: "API_ERROR",
        key: "categoryPlayers",
        payload:
          error?.response?.data?.message ||
          "Something went wrong",
      });
    }
  }
}





















