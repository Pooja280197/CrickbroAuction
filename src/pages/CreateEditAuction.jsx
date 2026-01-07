import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  createAuction,
  editAuction,
  fetchAuctionDetails,
  getMyTournaments,
} from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { a } from "framer-motion/client";
import { ArrowLeft } from "lucide-react";

/* ---------- UI HELPERS ---------- */

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
      {title}
    </h3>
    <div className="bg-slate-50 rounded-xl p-4 space-y-4 border border-slate-200">
      {children}
    </div>
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  inputMode,
  placeholder = "",
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input
      type={type}
      inputMode={inputMode}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm
                 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600
                 outline-none bg-white"
    />
  </div>
);

const NumberInput = ({ label, value, onChange, placeholder = "" }) => (
  <Input
    type="text"
    inputMode="numeric"
    label={label}
    placeholder={placeholder}
    value={value}
    onChange={(v) => {
      // allow only digits
      const sanitized = String(v || "").replace(/\D/g, "");
      onChange?.(sanitized);
    }}
  />
);

const Select = ({ label, value, onChange, options = [] }) => {
  const getOptionValue = (opt) =>
    opt?._id ?? opt?.id ?? opt?.tournamentId ?? opt?.value ?? "";
  const getOptionLabel = (opt) =>
    opt?.name ?? opt?.tournamentName ?? opt?.title ?? String(opt || "");

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white
               focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none"
      >
        <option value="">Select</option>
        {options.map((opt) => {
          const val = getOptionValue(opt);
          const labelText = getOptionLabel(opt);
          return (
            <option key={val || labelText} value={val}>
              {labelText}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition ${
        checked ? "bg-indigo-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`block h-4 w-4 bg-white rounded-full transform transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const RadioGroup = ({ value, onChange, options }) => (
  <div className="flex gap-4">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`px-4 py-2 rounded-lg border text-sm transition ${
          value === opt.value
            ? "bg-indigo-600 text-white border-indigo-600"
            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const formatDateForInput = (dateString, includeTime = false) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  if (!includeTime) {
    return `${yyyy}-${mm}-${dd}`;
  }

  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};


export default function CreateEditAuction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auctionId } = useParams();

  //   const isLoading = useSelector(
  //     (state) => state.loading?.auctionDetails || false
  //   );

  const auctionData = useSelector(
    (state) => state.data?.auctionDetails || null
  );

  useEffect(() => {
    if (auctionId) {
      dispatch(fetchAuctionDetails(auctionId));
    }
  }, []);

  const initialForm = {
    tournamentId: "",
    auctionName: "",
    auctionDate: "",
    auctionType: "manual",
    trailTypeAuction: false,
    trailStart: "",
    trailEnd: "",

    streamKey: "",
    streamUrl: "",

    auctionRules: {
      budgetCap: "",
      maxPlayersPerTeam: "",
      minPlayersPerTeam: "",
      maxForeignPlayers: "",
      maxWicketKeepers: "",
      minWicketKeepers: "",
      biddingIncrement: "",
      highPriceIncrement: "",
      minimumBid: "",
      rtmEnabled: false,
      maxRTMCardsPerTeam: "",
      unsoldPlayerReEntry: false,
      acceleratedRoundAfter: "",
      maxReturnPlayersPerTeam: "",
      maxPurchasePlayersPerTeam: "",
      minPurchasePlayersPerTeam: "",
    },

    autoSettings: {
      playerDisplayDuration: "",
      bidIncrementInterval: "",
      autoBidIncrementAmount: "",
      countdownWarningAt: "",
      extendTimeOnBid: "",
    },

    createdBy: localStorage.getItem("playerId"),
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (auctionId && auctionData) {
      setForm({
        tournamentId: auctionData?.tournament?.id || "",
        auctionName: auctionData?.auctionName || "",
        auctionDate: formatDateForInput(auctionData?.auctionDate, true),
        auctionType: auctionData?.auctionType || "manual",
        trailTypeAuction: auctionData?.trailTypeAuction || false,
        trailStart: formatDateForInput(auctionData?.trailStart),
        trailEnd: formatDateForInput(auctionData?.trailEnd),

        streamKey: auctionData?.stream?.streamKey || "",
        streamUrl: auctionData?.stream?.streamUrl || "",

        auctionRules: {
          budgetCap: auctionData?.auctionRules?.budgetCap || "",
          maxPlayersPerTeam: auctionData?.auctionRules?.maxPlayersPerTeam || "",
          minPlayersPerTeam: auctionData?.auctionRules?.minPlayersPerTeam || "",
          maxForeignPlayers: auctionData?.auctionRules?.maxForeignPlayers || "",
          maxWicketKeepers: auctionData?.auctionRules?.maxWicketKeepers || "",
          minWicketKeepers: auctionData?.auctionRules?.minWicketKeepers || "",
          biddingIncrement: auctionData?.auctionRules?.biddingIncrement || "",
          highPriceIncrement:
            auctionData?.auctionRules?.highPriceIncrement || "",
          minimumBid: auctionData?.auctionRules?.minimumBid || "",
          rtmEnabled: auctionData?.auctionRules?.rtmEnabled || false,
          maxRTMCardsPerTeam:
            auctionData?.auctionRules?.maxRTMCardsPerTeam || "",
          unsoldPlayerReEntry:
            auctionData?.auctionRules?.unsoldPlayerReEntry || false,
          acceleratedRoundAfter:
            auctionData?.auctionRules?.acceleratedRoundAfter || "",
          maxReturnPlayersPerTeam:
            auctionData?.auctionRules?.maxReturnPlayersPerTeam || "",
          maxPurchasePlayersPerTeam:
            auctionData?.auctionRules?.maxPurchasePlayersPerTeam || "",
          minPurchasePlayersPerTeam:
            auctionData?.auctionRules?.minPurchasePlayersPerTeam || "",
        },

        autoSettings: {
          playerDisplayDuration:
            auctionData?.autoSettings?.playerDisplayDuration || "",
          bidIncrementInterval:
            auctionData?.autoSettings?.bidIncrementInterval || "",
          autoBidIncrementAmount:
            auctionData?.autoSettings?.autoBidIncrementAmount || "",
          countdownWarningAt:
            auctionData?.autoSettings?.countdownWarningAt || "",
          extendTimeOnBid: auctionData?.autoSettings?.extendTimeOnBid || "",
        },

        createdBy: localStorage.getItem("playerId"),
      });
    }
    else{
      setForm(initialForm)
    }
  }, [auctionData]);

  useEffect(() => {
    if (form?.trailTypeAuction === false) {
      setForm((p) => ({ ...p, trailStart: "", trailEnd: "" }));
    }
  }, [form?.trailTypeAuction]);

  const myTournaments = useSelector((state) => state?.data?.myTournaments);

  useEffect(() => {
    dispatch(getMyTournaments());
  }, []);

  const handleCreateAuction = async () => {
    try {
      await dispatch(createAuction(form));
      toast.success("Auction created successfully!");
      setForm(initialForm);
      navigate("/auction");
    } catch (error) {
      console.error("Error creating Auction:", error);
      toast.error("Error creating Auction");
    }
  };

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleEditAuction = async () => {
  
    try {
        let payload = { ...form };

    if (payload?.auctionType === "manual") {
      payload.autoSettings = {
        playerDisplayDuration: "",
        bidIncrementInterval: "",
        autoBidIncrementAmount: "",
        countdownWarningAt: "",
        extendTimeOnBid: "",
      }}
      console.log(payload,"payload")
      await dispatch(editAuction(auctionId, payload));
      toast.success("Auction edited successfully!");
      navigate("/auction");
      setForm(initialForm);
    } catch (error) {
      console.error("Error editing Auction:", error);
      toast.error("Error editing Auction");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021b17] via-[#073b36] to-[#071a1d]">
      <Header />
      <div className="  flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8 space-y-8 border border-slate-200">
          {/* HEADER */}
          <div>
            <h2 className="text-2xl font-bold">
              {auctionId ? "Edit Auction" : "Create Auction"}
            </h2>
            <p className="text-sm text-gray-500">
              Configure auction details and rules
            </p>
          </div>

          {/* BASIC INFO */}
          <Section title="Basic Information">
            <Grid>
              <Select
                label="Tournament"
                value={form?.tournamentId}
                onChange={(v) => update("tournamentId", v)}
                options={myTournaments}
              />

              <Input
                label="Auction Name"
                value={form?.auctionName}
                placeholder="Enter auction name"
                onChange={(v) => update("auctionName", v)}
              />

              <Input
                type="datetime-local"
                label="Auction Date & Time"
                value={form?.auctionDate}
                onChange={(v) => update("auctionDate", v)}
              />
            </Grid>
          </Section>

          {/* STREAM */}
          <Section title="Streaming (Optional)">
            <Grid>
              <Input
                label="Stream Key"
                placeholder="Enter RTMP/stream key"
                value={form?.streamKey}
                onChange={(v) => update("streamKey", v)}
              />
              <Input
                label="Stream URL"
                placeholder="https://example.com/stream"
                value={form?.streamUrl}
                onChange={(v) => update("streamUrl", v)}
              />
            </Grid>
          </Section>

          {/* TRIAL SETTINGS */}
          <Section title="Trial Auction">
            <Toggle
              label="Enable Trial Auction"
              checked={form?.trailTypeAuction}
              onChange={(v) => update("trailTypeAuction", v)}
            />

            {form?.trailTypeAuction && (
              <Grid>
                <Input
                  type="date"
                  label="Trial Start"
                  placeholder="Select trial start"
                  value={form?.trailStart}
                  onChange={(v) => update("trailStart", v)}
                />
                <Input
                  type="date"
                  label="Trial End"
                  placeholder="Select trial end"
                  value={form?.trailEnd}
                  onChange={(v) => update("trailEnd", v)}
                />
              </Grid>
            )}
          </Section>

          {/* AUCTION RULES */}
          {!auctionId && (
            <Section title="Auction Rules">
              <Grid>
                <NumberInput
                  label="Budget Cap"
                  placeholder="e.g., 100000"
                  value={String(form?.auctionRules?.budgetCap || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      budgetCap: v,
                    })
                  }
                />

                <NumberInput
                  label="Max Players / Team"
                  placeholder="e.g., 25"
                  value={String(form?.auctionRules?.maxPlayersPerTeam || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      maxPlayersPerTeam: v,
                    })
                  }
                />

                <NumberInput
                  label="Min Players / Team"
                  placeholder="e.g., 18"
                  value={String(form?.auctionRules?.minPlayersPerTeam || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      minPlayersPerTeam: v,
                    })
                  }
                />

                <NumberInput
                  label="Max Foreign Players"
                  placeholder="e.g., 8"
                  value={String(form?.auctionRules?.maxForeignPlayers || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      maxForeignPlayers: v,
                    })
                  }
                />

                <NumberInput
                  label="Max Wicket Keepers"
                  placeholder="e.g., 2"
                  value={String(form?.auctionRules?.maxWicketKeepers || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      maxWicketKeepers: v,
                    })
                  }
                />

                <NumberInput
                  label="Min Wicket Keepers"
                  placeholder="e.g., 1"
                  value={String(form?.auctionRules?.minWicketKeepers || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      minWicketKeepers: v,
                    })
                  }
                />

                <NumberInput
                  label="Bidding Increment"
                  placeholder="e.g., 1000"
                  value={String(form?.auctionRules?.biddingIncrement || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      biddingIncrement: v,
                    })
                  }
                />

                <NumberInput
                  label="High Price Increment"
                  placeholder="e.g., 5000"
                  value={String(form?.auctionRules?.highPriceIncrement || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      highPriceIncrement: v,
                    })
                  }
                />

                <NumberInput
                  label="Minimum Bid"
                  placeholder="e.g., 100"
                  value={String(form?.auctionRules?.minimumBid || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      minimumBid: v,
                    })
                  }
                />

                <NumberInput
                  label="Max RTM Cards / Team"
                  placeholder="e.g., 1"
                  value={String(form?.auctionRules?.maxRTMCardsPerTeam || "")}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      maxRTMCardsPerTeam: v,
                    })
                  }
                />

                <Toggle
                  label="RTM Enabled"
                  checked={form?.auctionRules?.rtmEnabled}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      rtmEnabled: v,
                    })
                  }
                />

                <Toggle
                  label="Unsold Player Re-Entry"
                  checked={form?.auctionRules?.unsoldPlayerReEntry}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      unsoldPlayerReEntry: v,
                    })
                  }
                />

                <NumberInput
                  label="Accelerated Round After (sec)"
                  placeholder="e.g., 60"
                  value={String(
                    form?.auctionRules?.acceleratedRoundAfter || ""
                  )}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      acceleratedRoundAfter: v,
                    })
                  }
                />

                <NumberInput
                  label="Max Return Players / Team"
                  placeholder="e.g., 0"
                  value={String(
                    form?.auctionRules?.maxReturnPlayersPerTeam || ""
                  )}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      maxReturnPlayersPerTeam: v,
                    })
                  }
                />

                <NumberInput
                  label="Max Purchase Players / Team"
                  placeholder="e.g., 0"
                  value={String(
                    form?.auctionRules?.maxPurchasePlayersPerTeam || ""
                  )}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      maxPurchasePlayersPerTeam: v,
                    })
                  }
                />

                <NumberInput
                  label="Min Purchase Players / Team"
                  placeholder="e.g., 0"
                  value={String(
                    form?.auctionRules?.minPurchasePlayersPerTeam || ""
                  )}
                  onChange={(v) =>
                    update("auctionRules", {
                      ...form.auctionRules,
                      minPurchasePlayersPerTeam: v,
                    })
                  }
                />
              </Grid>
            </Section>
          )}

          {/* AUCTION TYPE */}
          <Section title="Auction Type">
            <RadioGroup
              value={form?.auctionType}
              onChange={(v) => update("auctionType", v)}
              options={[
                { label: "Manual", value: "manual" },
                { label: "Auto", value: "auto" },
              ]}
            />
          </Section>

          {/* AUTO SETTINGS */}
          {form?.auctionType === "auto" && (
            <Section title="Auto Auction Settings">
              <Grid>
                <NumberInput
                  label="Player Display Duration (sec)"
                  placeholder="e.g., 30"
                  value={String(
                    form?.autoSettings?.playerDisplayDuration || ""
                  )}
                  onChange={(v) =>
                    update("autoSettings", {
                      ...form.autoSettings,
                      playerDisplayDuration: v,
                    })
                  }
                />
                <NumberInput
                  label="Bid Increment Interval (sec)"
                  placeholder="e.g., 2"
                  value={String(form?.autoSettings?.bidIncrementInterval || "")}
                  onChange={(v) =>
                    update("autoSettings", {
                      ...form.autoSettings,
                      bidIncrementInterval: v,
                    })
                  }
                />
                <NumberInput
                  label="Auto Bid Increment Amount"
                  placeholder="e.g., 10000"
                  value={String(
                    form?.autoSettings?.autoBidIncrementAmount || ""
                  )}
                  onChange={(v) =>
                    update("autoSettings", {
                      ...form.autoSettings,
                      autoBidIncrementAmount: v,
                    })
                  }
                />
                <NumberInput
                  label="Countdown Warning At (sec)"
                  placeholder="e.g., 10"
                  value={String(form?.autoSettings?.countdownWarningAt || "")}
                  onChange={(v) =>
                    update("autoSettings", {
                      ...form.autoSettings,
                      countdownWarningAt: v,
                    })
                  }
                />
                <NumberInput
                  label="Extend Time On Bid (sec)"
                  placeholder="e.g., 10"
                  value={String(form?.autoSettings?.extendTimeOnBid || "")}
                  onChange={(v) =>
                    update("autoSettings", {
                      ...form.autoSettings,
                      extendTimeOnBid: v,
                    })
                  }
                />
              </Grid>
            </Section>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 flex flex-row items-center"
            onClick={()=>{navigate('/auction')}}>
              <ArrowLeft className="h-6 w-6"/><span>Back To Auctions</span>
            </button>

            <button
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow"
              onClick={auctionId ? handleEditAuction : handleCreateAuction}
            >
              {auctionId ? " Edit Auction" : " Create Auction"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
