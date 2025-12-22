import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Rajesh Sharma",
      role: "Tournament Organizer",
      league: "Mumbai Premier League",
      rating: 5,
      content:
        "CrickBro transformed our auction process. What used to take days now happens in hours with complete transparency.",
      avatarColor: "from-[var(--color-accent)] to-[var(--color-warm)]",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Team Owner",
      league: "Women's Cricket League",
      rating: 5,
      content:
        "The live bidding interface is fantastic! We can bid from anywhere and the budget tracking is super helpful.",
      avatarColor: "from-[var(--color-accent-2)] to-[var(--color-accent)]",
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "League Commissioner",
      league: "Corporate Cricket Championship",
      rating: 4,
      content:
        "Excellent platform for managing multiple teams and players. The automated squad generation saves so much time.",
      avatarColor: "from-[var(--color-accent-2)] to-[var(--color-warm)]",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      role: "Player Manager",
      league: "South Zone Tournament",
      rating: 5,
      content:
        "Player database management is seamless. Our 200+ players were easily categorized and auctioned efficiently.",
      avatarColor: "from-[var(--color-warm)] to-[var(--color-accent)]",
    },
  ];

  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < r
            ? "text-crickbroYellow fill-crickbroYellow"
            : "text-slate-300"
        }`}
      />
    ));
  };



  return (
    <section className="py-20 px-4 bg-[var(--color-ivory)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-[#154947]/10 border border-[#154947]/20 text-[#154947] text-sm font-oswald uppercase tracking-wider mb-4">
            Testimonials
          </span>

          <h2 className="font-oswald text-4xl md:text-5xl text-[#06292a] mb-6">
            Trusted by Cricket Communities
          </h2>

          <p className="text-slate-700 text-lg max-w-2xl mx-auto">
            See what tournament organizers, team owners, and players say about
            CrickBro Auction Platform.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.div className="relative bg-white border border-[#e9e6dd] rounded-3xl p-8 h-full shadow-sm transition-all duration-300 accent-border overflow-hidden" whileHover={{ y: -6 }}>
                {/* Decorative Quote (left) */}
                <div className="absolute -left-6 -top-6 text-[80px] text-[#154947]/6 select-none">“</div>
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#154947]/20 group-hover:text-[#154947]/30 transition-colors" />

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${review.avatarColor} flex items-center justify-center text-white font-oswald text-lg ring-4 ring-white/20`}
                  >
                    {review.name?.charAt(0) ?? "C"}
                  </div>
                  <div>
                    <h4 className="font-oswald text-lg md:text-xl text-[#06292a]">
                      {review.name}
                    </h4>
                    <p className="text-sm text-slate-600">{review.role}</p>
                  </div>
                </div>

                {/* League */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-ivory)] text-xs text-[#06292a] border border-[#e9e6dd]">
                    {review.league}
                  </span>
                </div>

                {/* Stars + Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                  <div className="text-sm text-slate-600">{review.rating}.0</div>
                </div>

                {/* Content */}
                <p className="text-[#425139] text-sm leading-relaxed mb-6">
                  “{review.content}”
                </p>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[var(--color-warm)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            
            </motion.div>
          ))}
        </div>

        {/* Overall Rating */}
        {/* <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-[#FFF6D5] border border-[#154947]/20 rounded-2xl px-8 py-6 shadow-sm">
            <div className="text-right">
              <div className="font-oswald text-5xl text-[#154947]">4.8</div>
              <div className="flex gap-1 mt-2">{renderStars(5)}</div>
            </div>
            <div className="text-left">
              <div className="text-[#154947] font-inter">
                Overall Rating
              </div>
              <div className="text-[#425139] text-sm">
                Based on 500+ reviews
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Reviews;
