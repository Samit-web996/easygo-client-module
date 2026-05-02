"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
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
  city_name: string
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
        const res = await axios.get(`http://localhost:3006/api/search?loc_id=${loc_id}`);
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
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative w-full h-52 bg-gray-100 p-4 overflow-hidden">
                  <Image
                    src={`http://localhost:3006/uploads/${car.image}`}
                    alt={car.carName}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      car.status === 'AVAILABLE' 
                        ? "bg-green-100 text-green-700 shadow-sm" 
                        : "bg-red-100 text-red-700 shadow-sm"
                    }`}>
                      {car.status}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {car.carName}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg>
                        {car.city_name},{car.state_name}
                      </p>
                    </div>
                  </div>

                  {/* Features (Professional Look) */}
                  <div className="flex gap-4 mb-6 text-xs text-gray-400 font-medium">
                    <span className="flex items-center gap-1">⛽ {car.fuelType}</span>
                    <span className="flex items-center gap-1"> <Car /> {car.modelYear}</span>
                    <span className="flex items-center gap-1">👤 {car.seat} Seats</span>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <Link href={`/car-details/${car.carid}`} className="block">
                    <button className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-orange-200">
                      View Details
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
      Vehicles are not available at the moment. We’re working to expand availability shortly.
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
    <Suspense fallback={<div className="p-10 text-center font-bold">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}