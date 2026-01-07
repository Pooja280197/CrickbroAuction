import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.jpg";
import cricketImg from "../assets/Images/cricket_bat.png";
import { useLoginPopup } from "../context/LoginPopupContext";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, verifyOtp } from "../redux/actions";


export default function LoginPopup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loginPopupOpen,
    closeLoginPopup,
    afterLoginCallback,
    setAfterLoginCallback,
  } = useLoginPopup();

  const [step, setStep] = useState("mobile");
  const [loginDetails, setLoginDetails] = useState({
    mobile: "",
    countryCode: "+91",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  // const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);
  const hasHandledLogin = useRef(false);

  const loading = useSelector((state) => state.loading.sendOtp);
  const error = useSelector((state) => state.error.sendOtp);
  const verifyData = useSelector((state) => state.data.verify);
// const verifyLoading = useSelector((state) => state.loading.verify);


useEffect(() => {
  if (!verifyData?.token || hasHandledLogin.current) return;

  hasHandledLogin.current = true;

  if (afterLoginCallback) {
    afterLoginCallback();
    setAfterLoginCallback(null);
  } else {
    navigate("/");
  }

  closeLoginPopup();
}, [verifyData, afterLoginCallback, navigate, closeLoginPopup]);


  //   const otpData = useSelector((state) => state.data.sendOtp);

  const handleChange = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.name]: e.target.value });
  };

  /* ---------------- MOBILE SUBMIT ---------------- */
  const handleSendOtp = (e) => {
    e.preventDefault();

    if (loginDetails.mobile.length !== 10) {
      // toast.error("Enter a valid mobile number");
      return;
    }
    dispatch(
      sendOtp({
        key: "sendOtp",
        payload: loginDetails,
      })
    );
    setStep("otp");
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  /* ---------------- OTP HANDLING ---------------- */
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const handleVerifyOtp = () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) return;
     
     const data = {
      mobile: loginDetails.mobile,
      countryCode: loginDetails.countryCode,
      otp: finalOtp,
      fcm_token: "hello"
    }

     dispatch(
      verifyOtp({
        key: "verifyOtp",
        payload: data,
      })
    );
     setOtp(["", "", "", "", "", ""]);
     setLoginDetails({ mobile: "", countryCode: "+91" });
     
    //  setIsLoggedIn(true)
   
    // if (afterLoginCallback) {
    //   afterLoginCallback();
    //   setAfterLoginCallback(null);
    // } else {
    //   navigate("/");
    // }
    //   closeLoginPopup();
  };

  

  if (!loginPopupOpen) return null;



  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl card-glass flex flex-col md:flex-row">

      {/* Close Button */}
      <button
        onClick={closeLoginPopup}
        className="absolute top-4 right-4 z-20 btn-icon text-crickbroYellow"
      >
        <X size={22} />
      </button>

      {/* LEFT BRAND / IMAGE PANEL */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src={cricketImg}
          alt="Cricket Auction"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-transparent p-10 flex flex-col justify-end">
          <h2 className="text-3xl font-oswald uppercase tracking-wide text-white">
            Win The Auction
          </h2>
          <p className="mt-3 text-sm text-white/80 max-w-xs">
            Create teams • Bid live • Manage players seamlessly
          </p>
          <div className="mt-6 h-1 w-24 bg-accent-gradient rounded-full" />
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="CrickBro"
            className="h-14 w-14 rounded-full mx-auto mb-4 shadow-lg"
          />
          <h1 className="text-2xl font-oswald uppercase tracking-wide text-white">
            CrickBro Auction
          </h1>
          <p className="text-sm text-white/70 mt-1">
            India’s smart cricket auction platform
          </p>
        </div>

        {/* MOBILE STEP */}
        {step === "mobile" && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm text-white/80 mb-1">
                Mobile Number
              </label>

              <div className="flex flex-col gap-3">
                <select
                  name="countryCode"
                  value={loginDetails.countryCode}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)]"
                >
                  <option value="+91">🇮🇳 India (+91)</option>
                  <option value="+1">🇺🇸 USA (+1)</option>
                  <option value="+44">🇬🇧 UK (+44)</option>
                </select>

                <input
                  type="tel"
                  name="mobile"
                  maxLength={10}
                  value={loginDetails.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>

            <p className="text-xs text-center text-white/50">
              Secure login for Admins, Owners & Players
            </p>
          </form>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <div className="space-y-7">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-white">
                Verify OTP
              </h2>
              <p className="text-sm text-white/70 mt-1">
                Sent to {loginDetails.countryCode} {loginDetails.mobile}
              </p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="h-12 w-11 text-center text-lg font-semibold rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)]"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="btn-primary w-full justify-center"
            >
              Verify & Continue
            </button>

            <button
              onClick={() => setStep("mobile")}
              className="text-sm text-white/60 hover:text-crickbroYellow text-center"
            >
              Change mobile number
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
