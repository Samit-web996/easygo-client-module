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

interface LoginModalPorps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess}: LoginModalPorps) {
  const [mobile, setMobile] = useState<string>("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState<string>("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(
    null,
  );

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });
    }
  };
  const sendOTP = async () => {
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const result = await signInWithPhoneNumber(
        auth,
        "+91" + mobile,
        appVerifier,
      );

      setConfirmation(result);
      setStep(2);
      toast.success("OTP send successfully.", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error sending OTP.", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const verifyOTP = async () => {
    try {
      if (!confirmation) {
        toast.error("Please request OTP first.", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      const result = await confirmation.confirm(otp);
      const user = result.user; // Firebase user object

      // 2. LocalStorage mein Unique ID (uid) aur Mobile number save karo
      localStorage.setItem("userId", user.uid); // Ye KYC link karne ke liye kaam aayega
      localStorage.setItem("userMobile", user.phoneNumber || "");

      // await confirmation.confirm(otp);
      toast.success("Login success");
      if (onLoginSuccess) {
      onLoginSuccess();
    }
    
    
    onClose();
    } catch (error) {
      console.error(error);
      toast.error("Invalid OTP !!!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* MODAL BOX */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[850px] h-[550px] bg-white rounded-3xl shadow-2xl flex overflow-hidden"
          >
            {/* LEFT SIDE IMAGE - Full Cover */}
            <div className="hidden md:block w-[40%] relative">
              <Image
                src="/loginSignup.jpg"
                fill
                alt="car"
                className="object-cover"
                priority
              />
            </div>

            {/* RIGHT SIDE FORM - 60% Width */}
            <div className="w-[60%] md:w-[60%] p-10 flex flex-col justify-center relative bg-white">
              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="cursor-pointer absolute top-5 right-6 text-2xl text-gray-400 hover:text-black transition-colors"
              >
                ✕
              </button>

              <h2 className="text-3xl font-extrabold mb-8 text-gray-800">
                Login / Sign Up
              </h2>

              {/* STEP 1: MOBILE NUMBER */}
              {step === 1 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-orange-500 transition-all">
                    <div className="px-4 py-4 bg-gray-50 font-bold text-gray-600 border-r">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 10) setMobile(val);
                      }}
                      className="w-full px-5 py-4 outline-none text-xl font-medium tracking-widest"
                    />
                  </div>

                  <button
                    onClick={sendOTP}
                    disabled={mobile.length !== 10}
                    className={`cursor-pointer w-full py-4 text-lg font-bold rounded-xl transition-all ${
                      mobile.length === 10
                        ? "bg-orange-500 text-white shadow-orange-200 shadow-lg hover:bg-orange-600 active:scale-95"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Get OTP
                  </button>
                </motion.div>
              )}

              {/* STEP 2: OTP INPUT */}
              {step === 2 && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="space-y-6"
                >
                  <p className="text-gray-500">
                    OTP sent to{" "}
                    <span className="font-bold text-black">+91 {mobile}</span>
                  </p>
                  <input
                    type="text"
                    placeholder="0 0 0 0 0 0"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 6) setOtp(val);
                    }}
                    className="w-full px-4 py-4 border-2 border-gray-100 rounded-xl text-center text-3xl font-black tracking-[0.5em] focus:border-green-500 outline-none transition-all"
                  />

                  <button
                    onClick={verifyOTP}
                    disabled={otp.length !== 6}
                    className={`cursor-pointer w-full py-4 text-lg font-bold rounded-xl transition-all ${
                      otp.length === 6
                        ? "bg-green-600 text-white shadow-green-100 shadow-lg hover:bg-green-700 active:scale-95"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Verify & Login
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    className="cursor-pointer w-full text-center text-sm text-orange-600 font-bold hover:text-orange-700"
                  >
                    Change Mobile Number?
                  </button>
                </motion.div>
              )}

              <p className="text-[11px] text-gray-400 mt-10 text-center leading-relaxed">
                By continuing, you agree to our <br />
                <span className="underline cursor-pointer hover:text-gray-600 text-gray-500">
                  Terms of Service
                </span>{" "}
                &{" "}
                <span className="underline cursor-pointer hover:text-gray-600 text-gray-500">
                  Privacy Policy
                </span>
              </p>
            </div>
          </motion.div>

          {/* RECAPTCHA CONTAINER */}
          <div id="recaptcha" className="fixed bottom-0"></div>
          <ToastContainer />
        </div>
      )}
    </AnimatePresence>
  );
}
