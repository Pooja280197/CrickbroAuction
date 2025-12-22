import React from "react";
import { Users, ClipboardCheck, Gavel, Trophy, ArrowRight } from "lucide-react";
import { motion as Motion } from "framer-motion";

const Steps = () => {
  const steps = [
    {
      step: "01",
      icon: Users,
      title: "Create Tournament",
      description: "Set up your league with teams, budget caps, and player categories in minutes.",
      color: "bg-gradient-to-br from-[#154947] to-[#0A2A25]",
      iconColor: "text-[#154947]",
    },
    {
      step: "02",
      icon: ClipboardCheck,
      title: "Register Players",
      description: "Upload player database or let teams register players with base prices.",
      color: "bg-gradient-to-br from-[#02271E] to-[#0F3E3C]",
      iconColor: "text-[#02271E]",
    },
    {
      step: "03",
      icon: Gavel,
      title: "Live Auction Day",
      description: "Conduct real-time bidding with our professional auction interface.",
      color: "bg-gradient-to-br from-[#164A48] to-[#0A2E2B]",
      iconColor: "text-[#164A48]",
    },
    {
      step: "04",
      icon: Trophy,
      title: "Squad & Fixtures",
      description: "Automatically generate fixtures and move to scoring platform.",
      color: "bg-gradient-to-br from-[#1A5544] to-[#0F3E3C]",
      iconColor: "text-[#1A5544]",
    },
  ];

  return (
    <section className="py-20 px-4 bg-[var(--color-ivory)] text-[#06292a] min-h-[40vh]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 rounded-full bg-[#02271E] text-crickbroYellow text-sm font-oswald uppercase tracking-wider mb-4">
            Simple Process
          </span>
          <h2 className="font-oswald text-3xl md:text-4xl lg:text-5xl text-[#06292a] ">
            Create Your Auction in 4 Easy Steps
          </h2> 
         
        </div> 

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              transition={{ delay: index * 0.1, type: 'spring', stiffness: 180 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Step Number */}
              <div className="absolute -top-8 -left-4 font-oswald text-6xl font-bold text-[#02271E]/10 group-hover:text-[#02271E]/50 transition-colors z-10">
                {step.step}
              </div>

              {/* Card */}
                <div className="relative bg-white border border-[#e9e6dd] rounded-3xl p-6 h-full group-hover:border-[#cbb97f] transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-[#cbb97f]/20">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl p-1 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] flex items-center justify-center shadow-sm`}>
                    <div className="w-14 h-14 rounded-xl bg-white/95 flex items-center justify-center">
                      <step.icon className={`w-8 h-8 text-[var(--color-primary)]`} />
                    </div>
                  </div> 
                  {/* Step Indicator */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-crickbroYellow flex items-center justify-center text-xs font-bold text-[#02271E]">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-oswald text-xl text-[#02271E] mb-3 group-hover:text-[#154947] transition-colors">
                  {step.title}
                </h3>
                <p className="text-[#164A48] text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Bottom Line */}
                <div className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)]/10 to-transparent group-hover:via-[var(--color-warm)] transition-all" />
              </div>
              

              {/* Connector Line (for desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#02271E]/30 to-transparent group-hover:from-crickbroYellow transition-colors" />
              )}
            </Motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <button className="btn-primary flex items-center gap-3 mx-auto">
            Start Creating Your Auction
            <ArrowRight className="w-5 h-5 -translate-x-0 group-hover:translate-x-2 transition-transform" />
          </button> 
          {/* <p className="text-[#164A48] text-sm mt-4">
            No credit card required • Free 14-day trial
          </p>
           */}
          {/* Additional Info */}
        
        </Motion.div>
      </div>
    </section>
  );
};

export default Steps;