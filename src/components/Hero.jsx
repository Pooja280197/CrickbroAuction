import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, TrendingUp, Users, Trophy } from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Professional Cricket Auctions Made Easy",
    subtitle: "Run live bidding, manage budgets, and build balanced squads in minutes with CrickBro's intelligent auction platform.",
    icon: TrendingUp,
  },
  {
    id: 2,
    title: "Real-Time Auction Management",
    subtitle: "Project live bid boards, sync team owners, and manage player drafts seamlessly across devices.",
    icon: Play,
  },
  {
    id: 3,
    title: "From Auction to Live Scorecards",
    subtitle: "Final squads move directly into CrickBro scoring, fixtures and leaderboards with zero manual work.",
    icon: Trophy,
  },
  {
    id: 4,
    title: "Trusted by League Organizers",
    subtitle: "Join 500+ cricket leagues across India using CrickBro for their auction and tournament management.",
    icon: Users,
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Live Auctions", value: "12+", color: "text-[var(--color-accent-2)]" },
    { label: "Players Managed", value: "5K+", color: "text-[var(--color-warm)]" },
    { label: "Squads Built", value: "300+", color: "text-[var(--color-accent)]" },
    { label: "Success Rate", value: "98%", color: "text-white" },
  ];

  return (
    <section className="bg-hero-gradient pt-12 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-2)]/10 border border-[var(--color-accent-2)]/20 px-4 py-2 text-xs font-oswald uppercase tracking-wider text-[var(--color-accent-2)]">
                <Play className="w-4 h-4" />
                Live Intelligent Auctions
              </span> 
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={HERO_SLIDES[currentSlide].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 space-y-4"
                >
                  <h1 className="font-oswald text-4xl md:text-5xl lg:text-6xl leading-tight text-white">
                    {HERO_SLIDES[currentSlide].title}
                  </h1>
                  <p className="text-lg text-[#CFE6E4] font-inter max-w-xl">
                    {HERO_SLIDES[currentSlide].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-8 bg-[var(--color-warm)] shadow-lg"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))} 
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.button whileHover={{ scale: 1.02 }} className="btn-primary w-full sm:w-auto">
                Start Free Trial
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} className="btn-secondary w-full sm:w-auto">
                Watch Demo
              </motion.button>
            </div> 

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className={`text-3xl font-oswald font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#9FBFBB] font-inter mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Content - Live Auction Preview */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl gradient-blob" style={{background: 'linear-gradient(120deg, rgba(139,92,246,0.18), rgba(240,199,94,0.12), rgba(96,165,250,0.08))'}} />
            <motion.div className="relative card-glass accent-border rounded-3xl p-6 shadow-2xl" whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 220 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-warm)] animate-pulse" />
                    <span className="text-[var(--color-warm)] text-sm font-inter">LIVE NOW</span>
                  </div> 
                  <h3 className="font-oswald text-2xl text-white mt-2">
                    IPL Mega Auction • Day 2
                  </h3>
                  <p className="text-[#9FBFBB] text-sm mt-1">150+ players remaining</p>
                </div>
                <div className="text-right">
                  <div className="text-[#9FBFBB] text-xs uppercase tracking-wider">
                    Current Bid
                  </div>
                  <div className="font-oswald text-3xl text-crickbroYellow">
                    ₹ 4.2 Cr
                  </div>
                </div>
              </div>

              {/* Live Bidding Card */}
              <div className="rounded-2xl p-5 border border-white/8 bg-gradient-to-br from-[#071219] to-[#042420]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-oswald text-lg">Player #101</div>
                    <div className="text-[#CFE6E4] text-sm">All-rounder • Right-arm Fast</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#9FBFBB]">Time Left</div>
                    <div className="font-oswald text-xl text-rose-300">00:18</div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs text-[#9FBFBB]">Base Price</div>
                    <div className="text-white font-inter">₹ 50 Lakh</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-[#9FBFBB]">Bidding Teams</div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-[#0F3E3C] bg-gradient-to-tr from-purple-500 to-pink-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <motion.button whileHover={{ scale: 1.02 }} className="btn-secondary w-full py-3 rounded-xl border border-white/10">
                  Join Live Auction →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;