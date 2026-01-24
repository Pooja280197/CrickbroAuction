import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Clock,
  Trophy,
  ShieldCheck,
} from "lucide-react";
import { fetchAuctionDetails } from "../../redux/actions";

const TournamentDetails = ({ auctionId }) => {
  const dispatch = useDispatch();

  const isLoading = useSelector(
    (state) => state.loading?.auctionDetails || false
  );

  const tournamentData = useSelector(
    (state) => state.data?.auctionDetails?.tournament || null
  );

  useEffect(() => {
    if (auctionId && !tournamentData) {
      dispatch(fetchAuctionDetails(auctionId));
    }
  }, [dispatch, auctionId, tournamentData]);

  if (isLoading || !tournamentData) {
    return (
      <div className="text-center text-white/60 py-20">
        Loading tournament details...
      </div>
    );
  }

  const {
    name,
    cityTown,
    date,
    groundName,
    entryFees,
    tournamentTime,
    bannerLogo,
    logo,
    totalRegisteredTeams,
    numberOfTeams,
    ballType,
    pitchType,
    matchType,
    tournamentStatus,
    awardList,
    organizerName,
    organizerEmail,
  } = tournamentData;

  return (
    <div className="space-y-8">

      {/* ================= HEADER / HERO ================= */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/70 backdrop-blur-md">
        <img
          src={bannerLogo}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        <div className="relative p-8 flex items-center gap-6">
          <img
            src={logo}
            alt="logo"
            className="w-20 h-20 rounded-full bg-white p-2"
          />

          <div>
            <h1 className="text-2xl font-semibold text-white">{name}</h1>
            <p className="text-white/60 text-sm mt-1">
              {cityTown}
            </p>

            <span className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-medium bg-[var(--color-warm)] text-[#02271E]">
              {tournamentStatus?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* ================= STATS STRIP ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Stat icon={Calendar} label="Date" value={date} />
        <Stat icon={MapPin} label="Ground" value={groundName} />
        <Stat icon={MapPin} label="City" value={cityTown} />
        <Stat icon={Users} label="Teams" value={`${totalRegisteredTeams}/${numberOfTeams}`} />
        <Stat icon={IndianRupee} label="Entry Fee" value={`₹ ${entryFees}`} />
        {/* <Stat icon={Clock} label="Time" value={tournamentTime.charAt(0).toUpperCase() + tournamentTime.slice(1).toLowerCase()} /> */}
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* Tournament Info */}
          <div className="rounded-2xl bg-[var(--color-primary)] backdrop-blur-md border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Tournament Information
            </h3>

            <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
              <Info label="Ball Type" value={ballType.charAt(0).toUpperCase() + ballType.slice(1).toLowerCase()} />
              <Info label="Pitch Type" value={pitchType.charAt(0).toUpperCase() + pitchType.slice(1).toLowerCase()} />
              <Info label="Match Type" value={matchType.charAt(0).toUpperCase() + matchType.slice(1).toLowerCase()} />
              <Info label="Match Time" value={tournamentTime.charAt(0).toUpperCase() + tournamentTime.slice(1).toLowerCase()} />
            </div>
          </div>

          {/* Awards */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Awards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {awardList?.map((award, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--color-primary)] backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-warm)]/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[var(--color-warm)]" />
                  </div>

                  <div>
                    <p className="text-sm text-white/80">
                      {award.award}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {award.cashValue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6">

          {/* CTA */}
          {/* <div className="rounded-2xl bg-[#154947] p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-3">
              Get Ready to Compete!
            </h3>

            <button className="w-full bg-[var(--color-warm)] text-[#02271E] font-semibold py-2.5 rounded-xl hover:brightness-110 transition">
              Register / Enroll
            </button>
          </div> */}

          {/* Organizer */}
          <div className="rounded-2xl bg-[var(--color-primary)] backdrop-blur-md border border-white/10 p-6">
            <h3 className="font-semibold text-white mb-4">
              Organizer
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#154947]/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#154947]" />
              </div>

              <div>
                <p className="font-medium text-white">
                  {organizerName}
                </p>
                <p className="text-xs text-white/60">
                  {organizerEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetails;

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-[var(--color-primary)] backdrop-blur-md border border-white/10 rounded-xl p-4">
    <Icon className="w-5 h-5 text-[var(--color-warm)]" />
    <div>
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  </div>
);

const Info = ({ label, value }) => (
  <div className="flex justify-between text-sm ">
    <span className="text-white/60">{label}</span>
    <span className="text-white font-medium">
      {value || "-"}
    </span>
  </div>
);
