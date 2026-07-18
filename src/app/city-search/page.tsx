"use client";

import API from "@/api";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Car } from 'lucide-react';
import Link from "next/link";

type Car = {
  carid: number;
  carName: string;
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
        const res = await API.get(`/api/search?loc_id=${loc_id}`);
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
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f97316]"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full font-sans text-gray-800"
      style={{ 
        backgroundColor: "#f8fafc", 
        padding: "40px 32px", // Safe padding sync matching other full screen nodes
        boxSizing: "border-box" 
      }}
    >
      {/* Replaced max-w-7xl with w-full to leverage true fluid responsive space */}
      <div className="w-full">
        
        {/* Dynamic Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight">
            Available <span className="text-[#f97316]">Rides</span>
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-500">
            Select the best car for your journey in your city.
          </p>
        </div>

        {/* Responsive Flex Grid Fluid Layer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch w-full">
          {vehicles.length > 0 ? (
            vehicles.map((car) => (
              <div 
                key={car.carid} 
                className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-300 border border-gray-200/80 flex flex-col"
              >
                <div className="relative w-full h-48 bg-gray-50 p-4 overflow-hidden flex items-center justify-center border-b border-gray-100">
                  <div className="relative w-full h-full">
                    <Image
                      src={`${car.image}`}
                      alt={car.carName}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized
                    />
                  </div>
                  
                  <div className="absolute top-3 left-3">
                    <span 
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-xs"
                      style={{
                        backgroundColor: car.status === 'AVAILABLE' ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                        color: car.status === 'AVAILABLE' ? "#10b981" : "#ef4444",
                        borderColor: car.status === 'AVAILABLE' ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"
                      }}
                    >
                      {car.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-bold text-[#0f172a] group-hover:text-[#f97316] transition-colors tracking-tight line-clamp-1">
                        {car.carName}
                      </h2>
                      <p className="text-xs text-gray-400 font-semibold mt-1 flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                        </svg>
                        {car.city_name}, {car.state_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 font-medium py-2 border-y border-gray-100">
                    <span className="flex items-center gap-1">⛽ {car.fuelType}</span>
                    <span className="flex items-center gap-1"> <Car size={13} className="text-gray-400" /> {car.modelYear}</span>
                    <span className="flex items-center gap-1">👥 {car.seat} Seats</span>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link href={`/car-details/${car.carid}`} className="block">
                      <button 
                        className="w-full text-white font-bold text-xs tracking-wider uppercase rounded-xl active:scale-[0.97] transition-all duration-150 cursor-pointer text-center shadow-md"
                        style={{
                          padding: "12px 24px",
                          backgroundColor: "#0f172a",
                          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0f172a")}
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State Container Box - Perfectly formatted full layout wide */
            <div 
              className="col-span-full flex flex-col items-center justify-center text-center border border-gray-200/80 rounded-2xl bg-white shadow-xs w-full"
              style={{ padding: "48px 24px" }}
            >
              <div 
                className="relative mb-6 flex items-center justify-center rounded-full"
                style={{ width: "96px", height: "96px", backgroundColor: "rgba(249, 115, 22, 0.06)" }}
              >
                <span className="text-5xl animate-bounce">🚗</span>
              </div>

              <div className="max-w-md">
                <h2 className="text-2xl font-black text-[#0f172a] mb-2">
                  Oops! <span className="text-[#f97316]">No Rides</span> Found
                </h2>
                <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6">
                  Vehicles are not available at the moment. We’re working to expand availability shortly.
                </p>
              </div>

              <button 
                onClick={() => window.history.back()}
                className="group flex items-center gap-2 font-bold text-xs tracking-wider uppercase text-white rounded-xl active:scale-[0.97] transition-all duration-150 cursor-pointer text-center shadow-md"
                style={{
                  padding: "14px 28px",
                  backgroundColor: "#0f172a"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f97316")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0f172a")}
              >
                <svg 
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Try Another City
              </button>
              
              <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                EasyGo • Always here for your journey
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-gray-500">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}