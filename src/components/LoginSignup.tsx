"use client";
import React, { useState } from "react";
import Image from "next/image";
import { auth } from "@/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X } from "lucide-react";
import API from "@/api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null; 
  }
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const [step, setStep] = useState(1); // 1: Mobile, 2: Name/Email, 3: OTP
  const [mobile, setMobile] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

const setupRecaptcha = () => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.log("Verifier clear error:", e);
    }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
    size: "invisible",
    callback: (response: any) => {
      console.log("reCAPTCHA solved successfully");
    },
    "expired-callback": () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  });
};

const handleMobileSubmit = async () => {
  if (mobile.length !== 10) return;
  setLoading(true);
  try {
    const res = await API.post("/api/check-user", {
      mobile: "+91" + mobile,
    });

    if (res.data.exists) {
      const user = res.data.user;

      localStorage.setItem("temp_name", user.name || user.full_name || "");
      localStorage.setItem("temp_email", user.email_id || user.email || "");
      
      console.log("Existing user found, sending OTP...");
      
      await sendOTPRequest(); 
    } else {
      setStep(2);
    }
  } catch (error: unknown) {
    console.error("Check user error:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

const handleDetailsSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!name.trim()) {
    toast.error("Please enter your name");
    return;
  }
  
  localStorage.setItem("temp_name", name);
  localStorage.setItem("temp_email", email);

  await sendOTPRequest();
};

const sendOTPRequest = async () => {
  try {
    setupRecaptcha();
    
    const cleanMobile = mobile.trim();
    const formattedMobile = cleanMobile.startsWith("+91") ? cleanMobile : `+91${cleanMobile}`;
    
    console.log("Sending OTP to:", formattedMobile); 
    
    const result = await signInWithPhoneNumber(
      auth,
      formattedMobile, 
      window.recaptchaVerifier!,
    );
    setConfirmation(result);
    
    setStep(3); 
    toast.success("OTP sent successfully");
  } catch (error: any) {
    console.error("Firebase Auth Error:", error);
    toast.error("Error sending OTP. Try again.");
    
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {}
      window.recaptchaVerifier = null;
    }
    setStep(1);
  }
};

const verifyOTP = async () => {
  try {
    if (!confirmation) return;

    const result = await confirmation.confirm(otp);
    const firebaseUser = result.user;

    const finalName = localStorage.getItem("temp_name") || "User";
    const finalEmail = localStorage.getItem("temp_email") || "";

    const userData = {
      uid: firebaseUser.uid,
      full_name: finalName,
      email_id: finalEmail,
      mobile_no: "+91" + mobile,
    };

    const dbRes = await API.post(
      "/api/auth/login",
      userData,
    );

    if (dbRes.data.success) {
      localStorage.setItem("userId", firebaseUser.uid);
      localStorage.setItem("userName", finalName);
      localStorage.setItem("userMobile", "+91" + mobile);
      localStorage.setItem("userEmail", finalEmail); 

      localStorage.removeItem("temp_name");
      localStorage.removeItem("temp_email");

      toast.success("Login Successful! ");
      if (onLoginSuccess) onLoginSuccess();
      onClose();
      window.location.reload();
    }
  } catch (error) {
    console.error("Verification Error:", error);
    toast.error("Invalid OTP");
  }
};

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-212.5 h-auto md:h-137.5 bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* LEFT SIDE IMAGE */}
          <div className="hidden md:block w-[40%] relative">
            <Image
              src="/loginSignup.jpg"
              fill
              alt="car"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-8">
              <p className="text-white font-medium text-lg">
                Drive your dreams with EasyGo.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="w-full md:w-[60%] p-8 md:p-12 flex flex-col relative bg-white min-h-112.5">
            <button
              onClick={onClose}
              className="absolute top-5 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={24} />
            </button>

            {/* HEADER PATTERN (EatSure Style) */}
            <div className="absolute top-0 left-0 w-full h-24 bg-indigo-50/30 -z-10 flex flex-wrap gap-2 p-2 opacity-20 overflow-hidden pointer-events-none">
              {Array(20)
                .fill("🚗")
                .map((c, i) => (
                  <span key={i} className="text-xl">
                    {c}
                  </span>
                ))}
            </div>

            <div className="mt-4 flex-1">
              {/* STEP 1: MOBILE */}
              {step === 1 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-extrabold text-gray-800">
                    Login / Sign Up
                  </h2>
                  <p className="text-gray-500">
                    Enter your mobile number to get started
                  </p>
                  <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-orange-500 transition-all">
                    <div className="px-4 py-4 bg-gray-50 font-bold text-gray-600 border-r">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      className="w-full px-5 py-4 outline-none text-xl font-medium tracking-widest"
                    />
                  </div>
                  <button
                    onClick={handleMobileSubmit}
                    disabled={mobile.length !== 10 || loading}
                    className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${mobile.length === 10 ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600 shadow-orange-100" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  >
                    {loading ? "Checking..." : "Continue"}
                  </button>
                </motion.div>
              )}

              {/* STEP 2: NAME & EMAIL (EatSure Design) */}
              {step === 2 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-3xl font-extrabold text-gray-800">
                      Sign Up
                    </h2>
                  </div>
                  <p className="text-gray-500">
                    Create an account (with {mobile})
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="What should we call you?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-indigo-600 outline-none font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-gray-700">
                        Email{" "}
                        <span className="text-gray-400 font-normal">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="email"
                        placeholder="No spam, we promise"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 border-2 border-gray-100 rounded-xl focus:border-indigo-600 outline-none font-medium"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleDetailsSubmit}
                    className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-orange-600 transition-all"
                  >
                    Sign Up
                  </button>
                </motion.div>
              )}

              {/* STEP 3: OTP */}
              {step === 3 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStep(name ? 2 : 1)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-3xl font-extrabold text-gray-800">
                      Verify OTP
                    </h2>
                  </div>
                  <p className="text-gray-500">
                    OTP sent to{" "}
                    <span className="font-bold text-black">+91 {mobile}</span>
                  </p>
                  <input
                    type="text"
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl text-center text-3xl font-black tracking-[0.5em] focus:border-green-500 outline-none transition-all"
                  />
                  <button
                    onClick={verifyOTP}
                    disabled={otp.length !== 6}
                    className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${otp.length === 6 ? "bg-green-600 text-white shadow-lg hover:bg-green-700 shadow-green-100" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                  >
                    Verify & Login
                  </button>
                </motion.div>
              )}
            </div>

            <p className="text-[11px] text-gray-400 mt-8 text-center">
              By continuing, you agree to our{" "}
              <span className="underline cursor-pointer">Terms</span> &{" "}
              <span className="underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </motion.div>

        <div id="recaptcha" className="my-4 flex justify-center min-h-78px"></div>
        <ToastContainer theme="colored" />
      </div>
    </AnimatePresence>
  );
}
