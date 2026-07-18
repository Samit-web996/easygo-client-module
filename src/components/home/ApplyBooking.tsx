"use client";

import React, { useEffect, useState } from "react";
import API from "@/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Location {
  loc_id: number;
  city_name: string;
  state_name: string;
}

const LocationIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400 shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

function ApplyBooking() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("Car Rental");
  const [city, setCity] = React.useState("");
  const [results, setResults] = React.useState<Location[]>([]);
  const [availableCities, setAvailableCities] = React.useState<Location[]>([]); 
  const [selectedLocId, setSelectedLocId] = useState<number | null>(null);

  const handleCitySearch = async (value: string) => {
    setCity(value);
    setSelectedLocId(null);

    if (value.length < 1) {
      setResults([]);
      return;
    }
    
    const filtered = availableCities.filter((item) =>
      item.city_name.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filtered);
  };

  const onSearch = () => {
    if (selectedLocId) {
      router.push(`/city-search?loc_id=${selectedLocId}`);
    } else {
      toast.error("Please select a city first!");
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await API.get("/api/locations");
        setAvailableCities(res.data);
      } catch (err) {
        console.error("Cities not loading", err);
      }
    };
    fetchCities();
  }, []);

  return (
    <div 
      className="w-full font-sans text-gray-800 relative"
      style={{ 
        backgroundColor: "#f8fafc", 
        padding: "40px 32px", 
        boxSizing: "border-box",
        borderRadius: "24px",
        border: "1px solid #e2e8f0"
      }}
    >
      <div className="w-full flex flex-col xl:flex-row items-start justify-between gap-8 flex-wrap xl:flex-nowrap">
        
        <div className="w-full xl:w-[60%] flex flex-col grow shrink-0 min-w-[280px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f172a] leading-[1.1] mb-8 tracking-tight text-center md:text-left">
            Book Your Drive, <br />
            <span className="text-[#f97316]">Start Your Story.</span>
          </h1>

          <div className="flex gap-2.5 mb-6 flex-wrap justify-center md:justify-start">
            {["Car Rental", "Car + Driver", "Bike Rental", "Bike + Driver"].map((item, i) => (
              <button
                suppressHydrationWarning={true}
                key={i}
                onClick={() => setActiveTab(item)}
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer"
                style={{
                  backgroundColor: activeTab === item ? "#f97316" : "#ffffff",
                  color: activeTab === item ? "#ffffff" : "#475569",
                  border: activeTab === item ? "1px solid #f97316" : "1px solid #e2e8f0",
                  boxShadow: activeTab === item ? "0 4px 12px rgba(249, 115, 22, 0.25)" : "none"
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg shadow-slate-100 flex flex-col md:flex-row items-stretch w-full relative z-30">
            
            <div className="flex-[2] relative border-b md:border-b-0 md:border-r border-gray-100 flex items-center px-4 bg-white rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
              <LocationIcon />
              <input
                type="text"
                suppressHydrationWarning={true}
                value={city}
                onChange={(e) => handleCitySearch(e.target.value)}
                placeholder="Enter city (e.g. Bhopal)"
                className="w-full px-3 outline-none font-semibold text-gray-800 bg-transparent text-sm sm:text-base"
                style={{ height: "60px" }}
              />

              {results.length > 0 && (
                <div 
                  className="absolute left-0 right-0 top-full bg-white shadow-2xl border border-gray-200 mt-2 rounded-xl overflow-hidden"
                  style={{ zIndex: 999 }}
                >
                  {results.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setCity(`${item.city_name}, ${item.state_name}`);
                        setSelectedLocId(item.loc_id);
                        setResults([]);
                      }}
                      className="p-4 hover:bg-orange-50 cursor-pointer border-b last:border-0 text-xs sm:text-sm text-[#0f172a] font-bold transition-colors"
                    >
                      📍 {item.city_name}, {item.state_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 flex items-center bg-white px-2">
              <input type="date" className="w-full p-3 outline-none text-xs font-medium text-gray-600 bg-transparent" />
            </div>
            <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 flex items-center bg-white px-2">
              <input type="time" className="w-full p-3 outline-none text-xs font-medium text-gray-600 bg-transparent" />
            </div>
            <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 flex items-center bg-white px-2">
              <input type="date" className="w-full p-3 outline-none text-xs font-medium text-gray-600 bg-transparent" />
            </div>
            <div className="flex-1 border-b md:border-b-0 flex items-center bg-white px-2">
              <input type="time" className="w-full p-3 outline-none text-xs font-medium text-gray-600 bg-transparent" />
            </div>

            <button
              onClick={onSearch}
              suppressHydrationWarning={true}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs tracking-wider uppercase rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl cursor-pointer transition-all w-full md:w-auto text-center shrink-0"
              style={{ padding: "16px 36px" }}
            >
              Search
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
            {[
              { title: "Trusted by 5M drivers", desc: "Excellence is non-negotiable.", icon: "👥" },
              { title: "Zero Deductible, No Worries", desc: "Full coverage, zero hidden cost", icon: "🛡️" },
              { title: "Flexible Cancellation", desc: "Book with confidence, cancel for free anytime.", icon: "📅" }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white border border-gray-200/60 p-4 rounded-xl shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-sm shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] text-sm leading-snug">{feature.title}</h3>
                  <p className="text-gray-400 text-[11px] font-medium mt-0.5 leading-normal">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full xl:w-[36%] flex justify-end items-center shrink-0 min-w-[300px]">
          <div className="grid grid-cols-2 gap-3.5 w-full">
            {[
              "https://res.cloudinary.com/ppdviuw2/image/upload/v1784286308/copy_of_gemini_generated_image_1b37h41b37h41b37_wrnnfb.webp",
              "https://res.cloudinary.com/ppdviuw2/image/upload/v1784286787/copy_of_gemini_generated_image_ayiniayiniayinia_knldhj.webp",
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
              "https://res.cloudinary.com/ppdviuw2/image/upload/v1784286860/Gemini_Generated_Image_1b37h41b37h41b37_1_whgbn9_acdab3.webp"
            ].map((url, index) => (
              <img
                key={index}
                src={url}
                alt="EasyGo Cars Mosaic Panel Collection"
                className="rounded-2xl h-36 sm:h-44 w-full object-cover shadow-xs border border-gray-100 transition-transform duration-300 hover:scale-[1.02]"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ApplyBooking;