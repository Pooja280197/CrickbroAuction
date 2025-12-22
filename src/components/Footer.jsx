import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Platform: [
      { label: "Live Auctions", href: "#" },
      { label: "Player Database", href: "#" },
      { label: "Team Management", href: "#" },
      { label: "Tournament Setup", href: "#" },
    ],
    Resources: [
      { label: "Documentation", href: "#" },
      { label: "API Access", href: "#" },
      { label: "Blog & Guides", href: "#" },
      { label: "Support Center", href: "#" },
    ],
    Company: [
      { label: "About Us", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-[var(--color-primary-darker)] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#154947] to-[#0F3E3C] p-2 flex items-center justify-center">
                <div className="text-2xl font-bold text-crickbroYellow">CB</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-oswald">CrickBro</h2>
                <p className="text-sm text-[#9FBFBB]">Professional Auction Platform</p>
              </div>
            </div>
            <p className="text-[#CFE6E4] text-sm max-w-md mb-6">
              Revolutionizing cricket auctions with intelligent technology. 
              Trusted by leagues, teams, and players across India for professional auction management.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="btn-circle hover:scale-105 transition-transform"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-oswald text-lg text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#CFE6E4] hover:text-crickbroYellow text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 py-8 border-t border-[#164A48]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#164A48] flex items-center justify-center">
              <Mail className="w-5 h-5 text-crickbroYellow" />
            </div>
            <div>
              <div className="text-sm text-[#9FBFBB]">Email</div>
              <div className="text-white font-inter">support@crickbro.com</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#164A48] flex items-center justify-center">
              <Phone className="w-5 h-5 text-crickbroYellow" />
            </div>
            <div>
              <div className="text-sm text-[#9FBFBB]">Phone</div>
              <div className="text-white font-inter">+91 98765 43210</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#164A48] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-crickbroYellow" />
            </div>
            <div>
              <div className="text-sm text-[#9FBFBB]">Office</div>
              <div className="text-white font-inter">Mumbai, Maharashtra</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#164A48]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[#9FBFBB] text-sm">
              © 2025 CrickBro Auction Platform. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-[#CFE6E4]">
              <a href="#" className="hover:text-crickbroYellow transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-crickbroYellow transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-crickbroYellow transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;