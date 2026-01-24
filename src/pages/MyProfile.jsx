import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/actions";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Header from "../components/Header";

export default function PlayerProfile() {
  const playerId = localStorage.getItem("playerId");
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state);

  const profile = data?.profile;
  const isLoading = loading.profile;

  useEffect(() => {
    if (playerId) {
      dispatch(fetchProfile(playerId));
    }
  }, [playerId, dispatch]);

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <Loader text="Loading Profile..." fullScreen="false" />
      </div>
    );
  }
  //   if (apiError) {
  //     return <div className="p-10 text-center text-red-500">{apiError}</div>;
  //   }

  if (apiError) {
    return (
      <Error
        title="Failed to load player profile"
        //   message={apiError}
        onRetry={() => dispatch(fetchProfile(playerId))}
      />
    );
  }
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Cover + Profile */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img
            src={profile.profilePicture}
            className="h-16 w-16 rounded-xl object-cover"
          />

          <div className="flex-1">
            <h1 className="text-lg font-semibold">{profile.name}</h1>
            <p className="text-xs text-slate-500">
              {profile.location} • {profile.age} • {profile.gender}
            </p>

            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(profile.playerRoleBooleans)
                .filter(([, v]) => v)
                .map(([role]) => (
                  <span
                    key={role}
                    className="px-2 py-0.5 text-[10px] rounded-full bg-blue-100 text-blue-700"
                  >
                    {role.replace(/-/g, " ")}
                  </span>
                ))}
            </div>
          </div>

          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg">
            Hire
          </button>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {profile.playerSummary.slice(0, 5).map((item) => (
            <div
              key={item.label}
              className="bg-white border border-slate-200 rounded-lg p-3 text-center"
            >
              <p className="text-[11px] text-slate-500">{item.label}</p>
              <p className="text-lg font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Career Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {profile.playerSummary.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl p-4 border border-slate-200 text-center"
            >
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-xl font-bold text-slate-800 mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Tournaments & Achievements
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {profile.achievements.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200"
            >
              <img
                src={a.tournamentBanner}
                alt={a.tournamentTitle}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-slate-800">
                  {a.tournamentTitle}
                </h3>
                <p className="text-sm text-slate-500">
                  Organiser: {a.organiser}
                </p>
                <p className="text-sm text-slate-500">Prize: ₹{a.prizeMoney}</p>
                <p className="text-sm text-slate-600 mt-2">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Match Gallery
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {profile.matchGallery.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="match"
              className="h-32 w-full object-cover rounded-xl"
            />
          ))}
        </div>
      </section>

      {/* Availability */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Availability
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {profile.availability} • {profile.availableFrom} →{" "}
              {profile.availableTo}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl">
              Hire Player
            </button>
            <button className="px-6 py-2 bg-slate-200 rounded-xl">
              Save Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
