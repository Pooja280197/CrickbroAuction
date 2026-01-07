import axios from "axios";

const playerId=localStorage.getItem('playerId')
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

export const fetchUserRole = (auctionId,playerId) => {
  
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "userRole" });
    const url = `/webSiteApi/auction/checkAuctionUserRole/${auctionId}/${playerId}`;
    try {
      const response = await axios.get(url);
      console.log(response,"res")
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

export const addAuctionAdmin = (auctionId, AdminId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "addAdmin" });
    const url = `/webSiteApi/auctionAdmin/addAdmin/${auctionId}`;
    try {
      const response = await axios.post(url, {
        admin: AdminId
      });
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

export const addAuctionSelector = (auctionId, AdminId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "addSelector" });
    const url = `/webSiteApi/auctionSelector/addSelector/${auctionId}`;
    try {
      const response = await axios.post(url, {
        selector: AdminId
      });
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

export const getAllAuctionTeams = () => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "auctionTeams" });
    const url = `/webSiteApi/auction/getTeamList/${tournamentId}`;
    try {
      const response = await axios.get(url);
      console.log(response, "response in action");
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

export const addTeamOwner = (auctionId, selectedTeamId, AdminId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "addTeamOwner" });
    const url = `/webSiteApi/auctionTeam/addTeamOwner/${auctionId}`;
    try {
      const response = await axios.post(url,
        {
          teamId: selectedTeamId,
          ownerId: AdminId
        });
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

export const createSession = (selectedId,formData) => {
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
  console.log("edit")
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

export const deleteSession = (slotId,sessionId) => {
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
      console.log(response, "response my tournaments");
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

export const editAuction = (auctionId,formData) => {
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
      console.log(response, "response my tournaments");
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

export const updateCategories = (data,editId) => {
  return async (dispatch) => {
    dispatch({ type: "API_START", key: "updateCategories" });
    const url = `/webSiteApi/auctionCategory/updateCategory/${editId}`;
    try {
      const response = await axios.put(url,data);
      console.log(response, "response my tournaments");
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
      console.log(response, "response my tournaments");
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











