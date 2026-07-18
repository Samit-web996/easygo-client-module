"use client";

import API from "@/api";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import KycForm from "@/app/user-kyc/page";
import LoginModal from "@/components/LoginSignup";
import { toast } from "react-toastify";

interface Car {
  carid: number;
  cancellation: string;
  carName: string;
  brand: string;
  model: string;
  seat: number;
  features: string;
  fuelType: string;
  pricePerDay: string | number;
  modelYear: string | number;
  status: "AVAILABLE" | "UNAVAILABLE";
  image: string | null;
  description: string;
  email: string;
  owner_name: string;
}

interface RatingState {
  avgRating: string | number;
  totalReviews: number;
}

export default function CarDetails() {
  const router = useRouter();
  const params = useParams();
  const carid = params?.carid as string;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [ratingData, setRatingData] = useState<RatingState>({
    avgRating: "No Ratings",
    totalReviews: 0,
  });

  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showKyc, setShowKyc] = useState<boolean>(false);

  useEffect(() => {
    const getCarInfo = async () => {
      if (!carid) return;
      try {
        const res = await API.get(`/vehicles/${carid}`);
        const fetchedData = Array.isArray(res.data) ? res.data[0] : res.data;
        setCar(fetchedData);
        setLoading(false);
      } catch (err) {
        console.error("Occur some error:", err);
        setLoading(false);
      }
    };
    getCarInfo();
  }, [carid]);

  useEffect(() => {
    const getRating = async () => {
      if (!carid) return;
      try {
        const res = await API.get(`/vehicle-rating/${carid}`);
        if (res.data && res.data.avgRating !== undefined) {
          setRatingData({
            avgRating: res.data.avgRating
              ? Number(res.data.avgRating).toFixed(1)
              : "No Ratings",
            totalReviews: res.data.totalReviews || 0,
          });
        }
      } catch (err) {
        console.log("error:", err);
      }
    };
    getRating();
  }, [carid]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">Fetching fleet insights...</p>
        </div>
      </div>
    );

  if (!car)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50 font-sans p-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 max-w-sm shadow-xl w-full">
          <span className="text-3xl">🚗</span>
          <h2 className="text-lg font-bold text-[#0f172a] mt-3 mb-1">Fleet Record Missing</h2>
          <p className="text-gray-400 text-xs">The fleet parameter layer is non-existential.</p>
        </div>
      </div>
    );

  const handleBookingLogic = async () => {
    const uid = localStorage.getItem("userId");

    if (!uid) {
      setShowLogin(true);
      return;
    }

    if (car.status === "UNAVAILABLE") {
      toast.error("Sorry, this car is currently unavailable.");
      return;
    }

    try {
      const res = await API.get(`/kyc-status/${uid}`);

      if (!res.data.exist) {
        setShowKyc(true);
        return;
      }

      const currentStatus = res.data.status ? res.data.status.trim() : "";

      if (currentStatus === "pending") {
        toast.info("KYC Under Review: Your verification is in progress. ⏳");
        setShowKyc(false);
      } else if (currentStatus === "verified") {
        toast.success("KYC Approved: Proceeding with your booking.");
        router.push(`/booking/${carid}`);
      } else if (currentStatus === "rejected") {
        toast.error("KYC Rejected: Please re-submit with valid details.", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });
        setShowKyc(true);
      }
    } catch (err) {
      console.error("KYC Fetch Error:", err);
      toast.error("Service Error: Unable to fetch KYC status.");
    }
  };

  return (
    <div 
      className="min-h-screen w-full font-sans text-gray-850"
      style={{ 
        backgroundColor: "#f8fafc", 
        padding: "40px 24px", 
        boxSizing: "border-box" 
      }}
    >
      <div className="max-w-5xl mx-auto w-full">
        
        <div 
          className="px-5 py-4 rounded-t-2xl flex items-center justify-between text-white"
          style={{ 
            backgroundColor: "#f97316",
            borderBottom: "1px solid rgba(255,255,255,0.15)"
          }}
        >
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-sm leading-none">✔</span> 
            Selected Vehicle Configuration
          </div>
          <span
            className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-md shadow-xs border"
            style={{
              backgroundColor: car.status === "AVAILABLE" ? "#ffffff" : "rgba(255, 255, 255, 0.1)",
              color: car.status === "AVAILABLE" ? "#f97316" : "#fed7aa",
              borderColor: car.status === "AVAILABLE" ? "#ffffff" : "rgba(255, 255, 255, 0.2)"
            }}
          >
            {car.status}
          </span>
        </div>

        <div className="bg-white border-x border-b border-gray-200/80 rounded-b-2xl shadow-md flex flex-col md:flex-row gap-8 lg:gap-10" style={{ padding: "32px 24px" }}>
          
          {/* LEFT SIDE BLOCK: Responsive Image Media & Cancellation */}
          <div className="flex-1 flex flex-col items-center gap-4 w-full">
            <div className="w-full aspect-video md:h-64 bg-gray-50 rounded-xl flex items-center justify-center p-6 border border-gray-100 group overflow-hidden">
              <img
                src={
                  car.image
                    ? `${car.image}`
                    : "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={car.carName}
                className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-103"
              />
            </div>

            <div className="bg-slate-50 border border-gray-200/60 rounded-xl w-full text-center flex flex-col gap-2" style={{ padding: "16px" }}>
              <div>
                <p 
                  className="text-[10px] font-bold uppercase tracking-widest inline-block px-2.5 py-1 rounded-md border"
                  style={{
                    backgroundColor: "rgba(249, 115, 22, 0.06)",
                    borderColor: "rgba(249, 115, 22, 0.15)",
                    color: "#ea580c"
                  }}
                >
                  🛡️ {car.cancellation || "Standard Cancellation Cover"}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-1">
                <span className="text-amber-500 text-base">★</span>
                <span className="font-extrabold text-[#0f172a] text-lg tracking-tight">
                  {ratingData.avgRating}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  ({ratingData.totalReviews} genuine reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex-[1.4] flex flex-col justify-between gap-6 w-full">
            <div className="flex flex-col gap-4">
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] uppercase tracking-tight">
                  {car.carName}
                </h1>
                <p className="text-sm text-gray-500 font-semibold tracking-wide mt-0.5">
                  {car.brand} <span className="text-gray-300">•</span> {car.model}{" "}
                  <span className="text-gray-200 px-1">|</span> Edition {car.modelYear}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">⚙️</span>
                  <span><b>Fuel Class:</b> {car.fuelType}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">👥</span>
                  <span><b>Cabin Space:</b> {car.seat} Seats</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">👤</span>
                  <span><b>Owner:</b> {car.owner_name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-sm">🛡️</span>
                  <span className="font-bold text-[#ea580c]">EasyGo Assured</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Key Technical Features
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {car.features.split(",").map((feature, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-50 text-gray-600 border border-gray-200/60 px-2.5 py-1 rounded-md text-xs font-medium"
                    >
                      {feature.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Platform Description
                </p>
                <p className="text-gray-500 text-xs leading-relaxed font-normal">
                  {car.description}
                </p>
              </div>
            </div>

            <div 
              className="flex flex-wrap items-center justify-between gap-4" 
              style={{ paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}
            >
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Base Tariff Fare
                </p>
                <div className="flex items-baseline gap-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                    ₹{Number(car.pricePerDay).toLocaleString()}
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">/ day charges</span>
                </div>
              </div>

              <button
                onClick={handleBookingLogic}
                disabled={car.status === "UNAVAILABLE"}
                className="w-full sm:w-auto font-bold text-xs tracking-wider uppercase rounded-xl active:scale-[0.98] transition-all duration-150 cursor-pointer text-center shadow-md"
                style={{
                  padding: "14px 40px",
                  backgroundColor: car.status === "UNAVAILABLE" ? "#e2e8f0" : "#f97316",
                  color: car.status === "UNAVAILABLE" ? "#94a3b8" : "#ffffff",
                  boxShadow: car.status === "UNAVAILABLE" ? "none" : "0 8px 20px -6px rgba(249, 115, 22, 0.4)"
                }}
              >
                {car.status === "UNAVAILABLE" ? "Fleet Booked Out" : "Confirm Booking"}
              </button>
            </div>

          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => {
          setShowLogin(false);
          window.location.reload();
        }}
      />

      <KycForm
        isOpen={showKyc}
        onClose={() => setShowKyc(false)}
        onSuccess={() => {
          setShowKyc(false);
        }}
      />
    </div>
  );
}