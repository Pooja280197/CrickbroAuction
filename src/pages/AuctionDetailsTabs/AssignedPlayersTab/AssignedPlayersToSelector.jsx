import React, { useEffect, useState } from "react";
import { useDebounce } from "../../../components/useDebounce";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getSelectorPlayers } from "../../../redux/actions";

function AssignedPlayersToSelector({ auctionId }) {
  const dispatch = useDispatch();
  const [searchAssignedPlayer, setSearchAssignedPlayer] = useState("");
  const debouncedAssignPlayer = useDebounce(searchAssignedPlayer, 200);

  const isLoading = useSelector(
    (state) => state.loading?.selectorPlayers || false
  );

  const playersData = useSelector(
    (state) => state.data?.selectorPlayers || null
  );

  const selectorPlayers = playersData?.data;
  const selectorPlayersPage = playersData?.page;
  const selectorPlayersTotalPages = playersData?.pages;
  const selectorPlayersTotal = playersData?.total;

  const fetchSelectorPlayers = async (page = 1) => {
    try {
      const searchQuery = debouncedAssignPlayer?.trim() || "";
      await dispatch(getSelectorPlayers(auctionId, page, searchQuery));
    } catch (error) {
      console.log("Error fetching auction players:", error);
    }
  };

  useEffect(() => {
    fetchSelectorPlayers();
  }, [auctionId]);

  useEffect(() => {
    // setSelectorPlayersPage(1);
    fetchSelectorPlayers(1);
  }, [debouncedAssignPlayer]);

  const handleRatePlayer = () => {
    fetchSelectorPlayers(); // 🔥 YEH LINE RATING KE BAAD UI UPDATE KAR DEGI
  };


  return (
    <>
      <div className="flex flex-col gap-y-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Player"
            value={searchAssignedPlayer}
            onChange={(e) => setSearchAssignedPlayer(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {selectorPlayers.length === 0 ? (
          <div className="text-center text-gray-500 py-6 text-sm">
            No players found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectorPlayers.map((item) => (
                <></>

                // <SelectorPlayerCard
                //     key={item._id}
                //     player={item}
                //     selector={isSelector}
                //     onViewDetails={handleViewPlayerDetails}
                //     onRate={handleRatePlayer}
                //     fetchSelectorPlayers={fetchSelectorPlayers}
                // />
              ))}
            </div>

            {/* Pagination Controls */}
            {selectorPlayersTotalPages > 1 && (
              <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-600">
                  Page{" "}
                  <span className="font-semibold text-purple-600">
                    {selectorPlayersPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {selectorPlayersTotalPages}
                  </span>{" "}
                  ({selectorPlayersTotal} total)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      fetchSelectorPlayers(selectorPlayersPage - 1)
                    }
                    disabled={selectorPlayersPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      selectorPlayersPage === 1
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() =>
                      fetchSelectorPlayers(selectorPlayersPage + 1)
                    }
                    disabled={selectorPlayersPage === selectorPlayersTotalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      selectorPlayersPage === selectorPlayersTotalPages
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default AssignedPlayersToSelector;
