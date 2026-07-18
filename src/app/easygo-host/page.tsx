"use client";

import React from "react";

export default function HostHero() {
  const goToOwnerModule = () => {
    window.location.href = "https://vehicle-owner-eg.vercel.app";
  };

  return (
    <section 
      className="w-full font-sans text-gray-800"
      style={{ 
        backgroundColor: "#f8fafc",
        padding: "48px 24px", 
        boxSizing: "border-box" 
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
        
        <div className="text-center md:text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Turn Your Car into <span className="text-[#f97316]">Cash</span>
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f172a] leading-tight mb-4 tracking-tight">
            Rent Your Car with{" "}
            <span 
              className="underline underline-offset-4"
              style={{ color: "#0f172a", textDecorationColor: "#f97316" }}
            >
              EasyGo Host
            </span>{" "}
            Today!
          </h1>

          <p className="text-gray-500 text-base sm:text-lg mb-6 leading-relaxed">
            Join 35,000+ hosts earning car rental income by renting out their
            cars on EasyGo, India&apos;s largest car-sharing marketplace. Easy &
            secure.
          </p>

          <button 
            onClick={goToOwnerModule}
            className="w-full sm:w-auto font-bold text-xs tracking-wider uppercase text-white rounded-xl active:scale-[0.97] transition-all duration-150 cursor-pointer text-center shadow-md"
            style={{ 
              padding: "14px 32px",
              backgroundColor: "#f97316",
              boxShadow: "0 8px 20px -6px rgba(249, 115, 22, 0.4)"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ea580c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
          >
            Register as Host
          </button>
        </div>
      </div>

      <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full"
        style={{ marginTop: "48px" }}
      >
        {[
          { value: "35K+", label: "Live Hosts" },
          { value: "₹100Cr+", label: "Earned by Hosts" },
          { value: "90+", label: "Cities" },
          { value: "70L+", label: "Trips Served" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200/60 rounded-2xl text-center shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-center gap-1"
            style={{ padding: "20px 16px" }}
          >
            <h2 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight">
              {item.value}
            </h2>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}