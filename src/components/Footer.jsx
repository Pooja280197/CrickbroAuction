import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import logo from '../assets/Images/Logo2.png'


const Footer = () => {
  const footerLinks = {
    Platform: [
      { label: "Home", link: "/" },
      { label: "Auction", link: "/auction" },
      { label: "Players", link: "/" },
      { label: "Blog", link: "/" },
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
    { icon: Facebook, href: "https://www.facebook.com/crickbro.official", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/crickbro.official", label: "Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/@crickbroOfficials2.0", label: "YouTube" },
  ];

  return (
    <footer className="bg-[var(--color-primary-darker)] border-t border-white/6">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#154947] to-[#0F3E3C]  flex items-center justify-center">
                <div className="text-2xl font-bold text-crickbroYellow">
                  <img
                  src={logo}
                  alt="logo"
                  />
                </div>
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
                  target="_blank"
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
                      href={link.link}
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
              <div className="text-white font-inter">info@crickbro.com</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#164A48] flex items-center justify-center">
              <Phone className="w-5 h-5 text-crickbroYellow" />
            </div>
            <div>
              <div className="text-sm text-[#9FBFBB]">Phone</div>
              <div className="text-white font-inter">+91 9993968327</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#164A48] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-crickbroYellow" />
            </div>
            <div>
              <div className="text-sm text-[#9FBFBB]">Office</div>
              <div className="text-white font-inter">Indore, India</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#164A48]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[#9FBFBB] text-sm">
              © 2025 CrickBro. All rights reserved. | Made with ❤️ for cricket lovers in India.
            </div>
            {/* <div className="flex gap-6 text-sm text-[#CFE6E4]">
              <a href="#" className="hover:text-crickbroYellow transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-crickbroYellow transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-crickbroYellow transition-colors">
                Cookie Policy
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;