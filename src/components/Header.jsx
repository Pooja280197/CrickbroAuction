import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/Images/Logo2.png";
import LoginPopup from "./LoginPopup";
import ComingSoonModal from "./ComingSoonModal";
import { useLoginPopup } from "../context/LoginPopupContext";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const verifyData = useSelector((state) => state.data.verify);

  const isLoggedIn = Boolean(
    verifyData?.token || localStorage.getItem("token")
  );

  const navOptions = [
    { label: "Home", path: "/" },
    { label: "Auction", path: "/auction" },
    { label: "Players", path: "#" },
    { label: "Blog", path: "#" },
  ];

  const handleLogOut = () => {
    // Clear Redux state
    dispatch({ type: "LOGOUT" });
    // Clear localStorage
    localStorage.clear();
    navigate("/");
    setIsSettingsOpen(false); // Close dropdown on logout
  };

  const handleComingSoon = (featureName) => {
    setComingSoonFeature(featureName);
    setComingSoonOpen(true);
  };

  const handleNav = (path, label) => {
    if (path === "#") {
      handleComingSoon(label);
    } else {
      navigate(path);
      setMobileMenu(false);
    }
  };

  // close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target.closest(".settings-dropdown")) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use user from auth context instead of localStorage
  // const displayName = user?.name || user?.mobile || user?.batchId || "User";

  const { openLoginPopup } = useLoginPopup();
  const path = window.location.pathname;

  return (
    <>
      <header className="bg-[var(--color-primary-darker)] sticky top-0 z-40 border-b border-white/6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNav("/")}
          >
            <div className="h-10 w-10 rounded-xl overflow-hidden">
              <img
                src={logo}
                alt="CrickBro"
                className="h-full w-full object-cover"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">
              CrickBro Auction
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
            {navOptions.map((item) => (
              <span
                key={item.label}
                className="nav-link"
                onClick={() => handleNav(item.path, item.label)}
              >
                {item.label}
              </span>
            ))}

            {isLoggedIn ? (
              <div className="relative settings-dropdown">
                <button
                  onClick={handleLogOut}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 hover:rounded-lg flex items-center gap-2 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => openLoginPopup(() => navigate(path))}
                className="ml-4 btn-secondary"
                aria-label="Login"
              >
                Login
              </motion.button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden btn-icon"
            aria-label="Toggle menu"
            aria-expanded={mobileMenu}
            aria-controls="mobile-menu"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>

        {/* Accent Strip */}
        <div className="hidden md:block w-full px-4">
          <div className="max-w-7xl mx-auto">
            <div className="header-accent" />
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenu && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden card-glass backdrop-blur-sm border-t border-white/6 shadow-lg animate-slideDown"
          >
            {/* Mobile header inside menu */}
            <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  handleNav("/", "Home");
                  setMobileMenu(false);
                }}
              >
                <div className="h-8 w-8 rounded-lg overflow-hidden">
                  <img
                    src={logo}
                    alt="CrickBro"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-lg font-oswald font-bold text-white">
                  CrickBro
                </div>
              </div>

              <button
                onClick={() => setMobileMenu(false)}
                className="btn-icon"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col px-6 py-4 gap-4 text-white text-sm font-medium">
              {navOptions.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    handleNav(item.path, item.label);
                    setMobileMenu(false);
                  }}
                  className="text-left nav-link w-full py-3 text-base"
                >
                  {item.label}
                </button>
              ))}

              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogOut();
                    setMobileMenu(false);
                  }}
                  className="mt-2 bg-red-500 text-white py-3 rounded-lg font-semibold"
                >
                  Logout
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    openLoginPopup(() => navigate(path));
                    setMobileMenu(false);
                  }}
                  className="mt-2 btn-secondary w-full py-3"
                >
                  Login
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </header>

      {/* Login Popup */}
      <LoginPopup isOpen={showLogin} onClose={() => setShowLogin(false)} />

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonOpen}
        featureName={comingSoonFeature}
        onClose={() => setComingSoonOpen(false)}
      />
    </>
  );
};

export default Header;
