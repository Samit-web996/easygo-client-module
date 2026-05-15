"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Location {
  loc_id: number;
  city_name: string;
  state_name: string;
}

const LocationIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
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
  const [availableCities, setAvailableCities] = React.useState<Location[]>([]); // DB se aane wali cities
  const [selectedLocId, setSelectedLocId] = useState<number | null>(null);

  const handleCitySearch = async (value: string) => {
    setCity(value);
    setSelectedLocId(null);

    if (value.length < 1) {
      setResults([]);
      return;
    }
    const filtered = availableCities.filter((item) =>
      item.city_name.toLowerCase().includes(value.toLowerCase()),
    );
    setResults(filtered);
  };

const onSearch = () => {
  if (selectedLocId) {
    router.push(`/city-search?loc_id=${selectedLocId}`); 
  } else {
    toast.error('Please select a city first!')
  }
};

  useEffect (() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get('http://localhost:3006/api/locations');
        setAvailableCities(res.data)
      } catch (err) {
        console.error("Cities load nahi ho payi", err)
      }
    };
    fetchCities();
  }, [])

  return (
   <div className="bg-gray-100 py-5 md:px-10 mt-8 rounded-[20px] md:mx-5 border border-gray-200 shadow-sm ">
      <div className="flex flex-col lg:flex-row items-start justify-between max-w-1400px mx-auto">
        <div className="w-full lg:w-[65%] flex flex-col pt-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-8">
            Book Your Drive, <br />
            <span className="text-orange-600">Start Your Story.</span>
          </h1>

          {/* ICON TABS */}
          <div className="flex gap-3 mb-8 flex-wrap">
            {["Car Rental", "Car + Driver", "Bike Rental", "Bike + Driver"].map((item, i) => (
              <button
              suppressHydrationWarning={true}
                key={i}
                onClick={() => setActiveTab(item)}
                className={`cursor-pointer px-6 py-2.5 rounded-full text-sm font-bold transition-all
                  ${activeTab === item ? "bg-orange-500 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-gray-200"}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex gap-6 mb-6 text-sm text-gray-500 font-semibold">
            <span>Same drop-off ▼</span>
            <span>Driver’s age: 25-65 ▼</span>
          </div>

          {/* SEARCH BOX */}
          <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch w-full border border-gray-100 relative z-20">
            <div className="flex-[1.5] relative border-b md:border-b-0 md:border-r border-gray-100 flex items-center px-4 ">
              <LocationIcon />
              <input
                type="text"
                suppressHydrationWarning={true}
                value={city}
                onChange={(e) => handleCitySearch(e.target.value)}
                placeholder="Enter city (e.g. Bhopal)"
                className="w-full py-5 px-3 outline-none font-semibold text-gray-800 bg-transparent"
              />

              {/* Suggestions Dropdown */}
              {results.length > 0 && (
                <div className="absolute left-0 right-0 top-full bg-white shadow-2xl rounded-b-xl border border-gray-200 mt-2 z-50">
                  {results.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setCity(item.city_name);
                        setSelectedLocId(item.loc_id);
                        setResults([]);
                      }}
                      className="p-4 hover:bg-orange-50 cursor-pointer border-b last:border-0 text-sm text-black font-medium transition-colors"
                    >
                      {item.city_name}, {item.state_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date/Time Inputs */}
            <div className="flex-1 border-r border-gray-100 flex items-center px-2">
              <input type="date" className="w-full px-2 outline-none text-sm text-gray-500" />
            </div>
            <div className="flex-1 border-r border-gray-100 flex items-center">
              <input type="time" className="w-full px-2 outline-none text-sm text-gray-500" />
            </div>
            <div className="flex-1 border-r border-gray-100 flex items-center">
              <input type="date" className="w-full px-2 outline-none text-sm text-gray-500" />
            </div>
            <div className="flex-1 flex items-center">
              <input type="time" className="w-full px-2 outline-none text-sm text-gray-500" />
            </div>

            <button
              onClick={onSearch}
              suppressHydrationWarning={true}
              className="cursor-pointer bg-orange-500 text-white px-10 font-bold hover:bg-orange-600 transition md:rounded-r-2xl"
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 font-medium">
            <input type="checkbox" id="suv" className="w-4 h-4 accent-orange-500" />
            <label htmlFor="suv">SUVs only</label>
          </div>
        </div>

        {/* RIGHT SECTION (Images) */}
        <div className="w-full ml-10 lg:w-[35%] flex justify-end items-start pt-2">
          <div className="grid grid-cols-2 gap-3 w-full">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb" className="rounded-3xl h-40 md:h-56 w-full object-cover shadow-md" />
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" className="rounded-3xl h-40 md:h-56 w-full object-cover shadow-md" />
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" className="rounded-3xl h-40 md:h-56 w-full object-cover shadow-md" />
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" className="rounded-3xl h-40 md:h-56 w-full object-cover shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyBooking;
