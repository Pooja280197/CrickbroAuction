import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Steps from "../components/Steps";
import AuctionCards from "./AuctionCards";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021b17] via-[#073b36] to-[#071a1d] text-slate-100">
      <Header />

      <main className="relative overflow-hidden">
        {/* Decorative gradient accents */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-tr from-crickbroPurple/30 via-crickbroYellow/20 to-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/20 via-crickbroPurple/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Hero />
          <Steps />
          <AuctionCards />
          <Reviews />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
