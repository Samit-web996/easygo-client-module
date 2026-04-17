"use client";

import React, { useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function OTPLogin(): JSX.Element {
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

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
        "+91" + phone,
        appVerifier
      );

      setConfirmation(result);
      alert("OTP sent ✅");
    } catch (error) {
      console.error(error);
      alert("Error sending OTP ❌");
    }
  };

  const verifyOTP = async () => {
    try {
      if (!confirmation) {
        alert("Please request OTP first");
        return;
      }

      await confirmation.confirm(otp);
      alert("Login success 🎉");
    } catch (error) {
      console.error(error);
      alert("Invalid OTP ❌");
    }
  };

  return (
    <div>
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value)
        }
      />
      <button onClick={sendOTP}>Send OTP</button>

      <input
        placeholder="OTP"
        value={otp}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setOtp(e.target.value)
        }
      />
      <button onClick={verifyOTP}>Verify</button>

      <div id="recaptcha"></div>
    </div>
  );
}