"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Car } from "lucide-react";
import Link from "next/link";

type Car = {
  carid: number;
  carName: string;
  brand: string;
  image: string;
  status: string;
  fuelType: string;
  seat: number;
  modelYear: number;
  state_name: string;
  city_name: string;
};

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const loc_id = searchParams?.get("loc_id");
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loc_id) return;
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3006/api/search?loc_id=${loc_id}`,
        );
        const fetchedData = res.data.success ? res.data.data : res.data;
        setVehicles(fetchedData || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [loc_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Available <span className="text-orange-600">Rides</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Select the best car for your journey in your city.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {vehicles.length > 0 ? (
            vehicles.map((car) => (
              <div
                key={car.carid}
                className="group relative rounded-[3rem] flex flex-col transition-all duration-500 bg-white border border-gray-50 h-full hover:-translate-y-3 shadow-sm hover:shadow-2xl overflow-hidden"
              >
                {/* Floating Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem]"></div>

                {/* Image Container - Minimalist & Animated */}
                <div className="relative w-full h-56 sm:h-64 flex items-center justify-center p-8 z-10">
                  <Image
                    src={`http://localhost:3006/uploads/${car.image}`}
                    alt={car.carName}
                    fill
                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                  />

                  {/* Minimalist Glowing Status Dot */}
                  <div className="absolute top-8 right-8">
                    <div
                      className={`h-3 w-3 rounded-full shadow-[0_0_10px] ${
                        car.status === "AVAILABLE"
                          ? "bg-green-500 shadow-green-200"
                          : "bg-red-500 shadow-red-200"
                      }`}
                    ></div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 pt-2 flex flex-col grow z-10">
                  <div className="mb-6">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">
                      {car.brand || "Premium Selection"}
                    </p>
                    <h2 className="font-extrabold text-2xl text-[#1a2b3c] leading-tight group-hover:text-[#ff5a00] transition-colors duration-300">
                      {car.carName}
                    </h2>
                    <div className="flex items-center gap-1.5 text-gray-400 mt-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full text-gray-500 flex items-center gap-1">
                        📍 {car.city_name}, {car.state_name}
                      </span>
                    </div>
                  </div>

                  {/* Features - Professional Horizontal Divider Style */}
                  <div className="flex items-center gap-5 mb-10 border-y border-gray-50 py-4">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-300 uppercase">
                        Fuel
                      </p>
                      <p className="text-xs font-bold text-gray-700">
                        {car.fuelType}
                      </p>
                    </div>
                    <div className="w-px h-6 bg-gray-100"></div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-300 uppercase">
                        Seats
                      </p>
                      <p className="text-xs font-bold text-gray-700">
                        {car.seat} Seats
                      </p>
                    </div>
                    <div className="w-px h-6 bg-gray-100"></div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-gray-300 uppercase">
                        Year
                      </p>
                      <p className="text-xs font-bold text-gray-700">
                        {car.modelYear}
                      </p>
                    </div>
                  </div>

                  {/* Action Button - Outline to Solid Animation */}
                  <div className="mt-auto">
                    <Link href={`/car-details/${car.carid}`} className="block">
                      <button className="cursor-pointer w-full bg-white border-2 border-[#1a2b3c] group-hover:bg-[#ff5a00] group-hover:border-[#ff5a00] text-[#1a2b3c] group-hover:text-white text-[11px] font-black py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-[0.15em] shadow-sm hover:shadow-orange-200 active:scale-95">
                        Check Availability
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 px-6 bg-white rounded-[32px] border-2 border-dashed border-gray-100 shadow-sm transition-all duration-300">
              {/* Professional Animated-style Icon Container */}
              <div className="relative mb-8 flex items-center justify-center w-28 h-28 bg-orange-50 rounded-full">
                <span className="text-6xl animate-bounce">🚗</span>
                <div className="absolute -bottom-2 w-16 h-2 bg-gray-200/50 rounded-full blur-sm"></div>
              </div>

              {/* Professional Message Section */}
              <div className="text-center max-w-md">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                  Oops! <span className="text-orange-600">No Rides</span> Found
                </h2>
                <p className="text-base md:text-lg font-medium text-gray-500 leading-relaxed mb-8">
                  Vehicles are not available at the moment. We’re working to
                  expand availability shortly.
                </p>
              </div>

              {/* Action Button - Responsive & Professional */}
              <button
                onClick={() => window.history.back()}
                className="group flex items-center gap-2 bg-[#1a2b3c] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg active:scale-95"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Try Another City
              </button>

              {/* Extra Professional Tip */}
              <p className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                EasyGo • Always here for your journey
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component with Suspense
export default function SearchResults() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center font-bold">Loading...</div>}
    >
      <SearchResultsContent />
    </Suspense>
  );
}
