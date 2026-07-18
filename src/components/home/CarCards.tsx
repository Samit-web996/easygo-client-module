"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import API from "@/api";
import { Car } from 'lucide-react';
import Link from "next/link";

type Car = {
  carid: number;
  carName: string;
  brand: string;
  image: string;
  status: string;
  state_name: string;
  city_name: string;
  fuelType: string;
  seat: number;
  modelYear: number;
};

export default function CarRental() {
  const [data, setData] = useState<Car[]>([]);

  useEffect(() => {
    const getCarCategories = async () => {
      try {
        const res = await API.get("/vehicles");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getCarCategories();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  const filteredData = useMemo(() => data.filter((car) => car.image), [data]);

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / cardsPerPage),
    [filteredData.length]
  );

  const currentCards = useMemo(() => {
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    return filteredData.slice(indexOfFirstCard, indexOfLastCard);
  }, [filteredData, currentPage]);

  return (
    /* Max-w-7xl removed and padding calibrated to match the full-screen flow */
    <div className="w-full bg-white font-sans selection:bg-orange-100" style={{ padding: "40px 32px", boxSizing: "border-box" }}>
      
      {/* Header Section - Luxury Typography */}
      <header className="mb-12 relative w-full">
        <div className="absolute -left-4 top-0 w-1 h-12 bg-[#ff5a00] rounded-full hidden md:block"></div>
        <h1 className="text-4xl md:text-6xl font-900 text-[#1a2b3c] tracking-tight leading-none">
          Premium <span className="text-[#ff5a00] drop-shadow-sm">Car Rentals</span> 
          <br className="hidden md:block" /> in India
        </h1>
        <p className="text-gray-400 mt-4 text-sm md:text-lg font-medium tracking-wide uppercase">
          Experience the road like never before.
        </p>
      </header>

      {/* Dates Highlight Section - Full Width Glassy Design */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between border border-gray-100 rounded-[2rem] p-2 mb-16 bg-gradient-to-r from-orange-50/50 to-white shadow-[0_20px_50px_rgba(255,90,0,0.05)] gap-4">
        <div className="flex items-center gap-4 px-6 py-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100">
            <span className="text-2xl animate-pulse">✨</span>
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-orange-400 tracking-widest">Limited Time Offers</p>
            <p className="text-sm md:text-base text-gray-700 font-bold">
              Best prices locked for <span className="text-[#1a2b3c]">13–20 Apr.</span>
            </p>
          </div>
        </div>

        <button
          suppressHydrationWarning={true}
          className="w-full md:w-auto bg-[#1a2b3c] hover:bg-[#ff5a00] text-white px-10 py-5 rounded-[1.5rem] font-black transition-all duration-500 shadow-xl shadow-gray-200 hover:shadow-orange-300 active:scale-95 text-xs uppercase tracking-[0.2em] cursor-pointer"
        >
          Change dates
        </button>
      </div>

      {/* Car Grid - Perfectly spaced and optimized for full browser stretch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full items-stretch">
        {currentCards.map((car) => (
          <div
            key={car.carid}
            className="group relative rounded-[2.5rem] flex flex-col transition-all duration-500 bg-white border border-gray-200/80 h-full hover:-translate-y-2 shadow-xs hover:shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"></div>

            {/* Image Area */}
            <div className="relative w-full h-52 sm:h-56 flex items-center justify-center p-6 z-10 border-b border-gray-50 bg-gray-50/30">
              <div className="relative w-full h-full">
                <Image
                  src={car.image}
                  alt={car.carName}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />
              </div>

              {/* Status Indicator Pin */}
              <div className="absolute top-5 right-5">
                <div className={`h-3 w-3 rounded-full shadow-md ${
                  car.status === "AVAILABLE" ? "bg-green-500 shadow-green-200" : "bg-red-500 shadow-red-200"
                }`}></div>
              </div>
            </div>

            {/* Content Section with explicit structural controls */}
            <div className="p-6 flex flex-col grow z-10 gap-4">
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">{car.brand || 'Premium'}</p>
                <h3 className="font-bold text-xl text-[#1a2b3c] leading-tight group-hover:text-[#ff5a00] transition-colors duration-300 line-clamp-1">
                  {car.carName}
                </h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                    📍 {car.city_name}
                  </span>
                </div>
              </div>

              {/* Feature Parameters Matrix */}
              <div className="flex items-center justify-between gap-2 border-y border-gray-100 py-3 text-center">
                <div className="flex-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase">Fuel</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">{car.fuelType}</p>
                </div>
                <div className="w-px h-6 bg-gray-100"></div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase">Seats</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">{car.seat} Seater</p>
                </div>
                <div className="w-px h-6 bg-gray-100"></div>
                <div className="flex-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase">Year</p>
                  <p className="text-xs font-bold text-gray-700 mt-0.5">{car.modelYear}</p>
                </div>
              </div>

              {/* Action Button Segment */}
              <div className="mt-auto w-full">
                <Link href={`/car-details/${car.carid}`} className="block w-full">
                  <button className="w-full bg-white border-2 border-[#1a2b3c] hover:bg-[#ff5a00] hover:border-[#ff5a00] text-[#1a2b3c] hover:text-white text-[11px] font-black py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-[0.15em] shadow-xs cursor-pointer">
                    Check Availability
                    <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Container Layout */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-8 mt-20 w-full">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:text-[#ff5a00] transition-colors cursor-pointer"
          >
            <span className="p-2.5 border border-gray-200 rounded-full group-hover:border-[#ff5a00] flex items-center justify-center w-8 h-8">←</span> Prev
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 transition-all duration-300 rounded-full ${currentPage === i + 1 ? "w-6 bg-[#ff5a00]" : "w-1.5 bg-gray-200"}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:text-[#ff5a00] transition-colors cursor-pointer"
          >
            Next <span className="p-2.5 border border-gray-200 rounded-full group-hover:border-[#ff5a00] flex items-center justify-center w-8 h-8">→</span>
          </button>
        </div>
      )}
    </div>
  );
}