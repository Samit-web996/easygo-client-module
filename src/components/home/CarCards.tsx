"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
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
        const res = await axios.get("http://localhost:3006/vehicles");
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
    [filteredData.length],
  );

  const currentCards = useMemo(() => {
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    return filteredData.slice(indexOfFirstCard, indexOfLastCard);
  }, [filteredData, currentPage]);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 lg:p-16 bg-white font-sans selection:bg-orange-100">
  {/* Header Section - Luxury Typography */}
  <header className="mb-12 relative">
    <div className="absolute -left-4 top-0 w-1 h-12 bg-[#ff5a00] rounded-full hidden md:block"></div>
    <h1 className="text-4xl md:text-6xl font-900 text-[#1a2b3c] tracking-tight leading-none">
      Premium <span className="text-[#ff5a00] drop-shadow-sm">Car Rentals</span> 
      <br className="hidden md:block" /> in India
    </h1>
    <p className="text-gray-400 mt-4 text-sm md:text-lg font-medium tracking-wide uppercase">
      Experience the road like never before.
    </p>
  </header>

  {/* Dates Highlight Section - Glassy Design */}
  <div className="flex flex-col md:flex-row items-center justify-between border border-gray-100 rounded-[2rem] p-2 mb-16 bg-gradient-to-r from-orange-50/50 to-white shadow-[0_20px_50px_rgba(255,90,0,0.05)] gap-4">
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
    className="w-full md:w-auto bg-[#1a2b3c] hover:bg-[#ff5a00] text-white px-10 py-5 rounded-[1.5rem] font-black transition-all duration-500 shadow-xl shadow-gray-200 hover:shadow-orange-300 active:scale-95 text-xs uppercase tracking-[0.2em]">
      Change dates
    </button>
  </div>

  {/* Car Grid - Sleek & Spaced */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
    {currentCards.map((car) => (
      <div
        key={car.carid}
        className="group relative rounded-[3rem] flex flex-col transition-all duration-500 bg-white border border-gray-50 h-full hover:-translate-y-3"
      >
        {/* Floating Price Tag (If needed) or Just Shadow */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[3rem]"></div>

        {/* Image Area - Minimalist */}
        <div className="relative w-full h-56 sm:h-64 flex items-center justify-center p-8 z-10">
          <Image
            src={`http://localhost:3006/uploads/${car.image}`}
            alt={car.carName}
            fill
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
          />

          {/* Minimalist Status Badge */}
          <div className="absolute top-6 right-6">
            <div className={`h-3 w-3 rounded-full shadow-[0_0_10px] ${
              car.status === "AVAILABLE" ? "bg-green-500 shadow-green-200" : "bg-red-500 shadow-red-200"
            }`}></div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-2 flex flex-col grow z-10">
          <div className="mb-6">
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">{car.brand || 'Premium'}</p>
            <h3 className="font-900 text-2xl text-[#1a2b3c] leading-tight group-hover:text-[#ff5a00] transition-colors duration-300">
              {car.carName}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-400 mt-3">
               <span className="text-[11px] font-bold uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full text-gray-500">
                📍 {car.city_name}
              </span>
            </div>
          </div>

          {/* Feature Icons - Horizontal List */}
          <div className="flex items-center gap-5 mb-10 border-y border-gray-50 py-4">
             <div className="text-center">
                <p className="text-[9px] font-black text-gray-300 uppercase">Fuel</p>
                <p className="text-xs font-bold text-gray-700">{car.fuelType}</p>
             </div>
             <div className="w-px h-6 bg-gray-100"></div>
             <div className="text-center">
                <p className="text-[9px] font-black text-gray-300 uppercase">Seats</p>
                <p className="text-xs font-bold text-gray-700">{car.seat}</p>
             </div>
             <div className="w-px h-6 bg-gray-100"></div>
             <div className="text-center">
                <p className="text-[9px] font-black text-gray-300 uppercase">Year</p>
                <p className="text-xs font-bold text-gray-700">{car.modelYear}</p>
             </div>
          </div>

          {/* View Deal Button */}
          <div className="mt-auto">
            <Link href={`/car-details/${car.carid}`} className="block">
              <button className="cursor-pointer w-full bg-white border-2 border-[#1a2b3c] group-hover:bg-[#ff5a00] group-hover:border-[#ff5a00] text-[#1a2b3c] group-hover:text-white text-[11px] font-black py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-[0.15em] shadow-sm hover:shadow-orange-200">
                Check Availability
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Pagination - Minimal & Clean */}
  {totalPages > 1 && (
    <div className="flex justify-center items-center gap-8 mt-24">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:text-[#ff5a00] transition-colors"
      >
        <span className="p-3 border rounded-full group-hover:border-[#ff5a00]">←</span> Prev
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 transition-all duration-500 rounded-full ${currentPage === i + 1 ? "w-8 bg-[#ff5a00]" : "w-2 bg-gray-200"}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:text-[#ff5a00] transition-colors"
      >
        Next <span className="p-3 border rounded-full group-full:border-[#ff5a00]">→</span>
      </button>
    </div>
  )}
</div>
  );
}
