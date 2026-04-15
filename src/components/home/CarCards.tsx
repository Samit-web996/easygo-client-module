"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";

type Car = {
  carid: number;
  carName: string;
  image: string;
  status: string;
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

  const totalPages = useMemo(() => Math.ceil(filteredData.length / cardsPerPage), [filteredData.length]);

  const currentCards = useMemo(() => {
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    return filteredData.slice(indexOfFirstCard, indexOfLastCard);
  }, [filteredData, currentPage]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-white font-sans">
      {/* Header Section - Responsive Flex */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center md:text-left">
        Cheap car rentals in India
      </h1>

      <div className="flex flex-col sm:flex-row items-center justify-between border rounded-xl p-4 mb-8 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">📅</span>
          <p className="text-sm md:text-base text-gray-700 text-center sm:text-left">
            These are the best prices for{" "}
            <span className="font-bold">13–20 Apr.</span>
          </p>
        </div>

        <button className="w-full sm:w-auto bg-[#1a2b3c] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition text-sm">
          Change dates
        </button>
      </div>

      {/* Car Grid - Responsive Columns */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentCards.map((car) => (
            <div
              key={car.carid}
              className="rounded-2xl flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white"
            >
              {/* Responsive Image Area */}
              <div className="relative w-full h-40 sm:h-48 bg-gray-50 flex items-center justify-center p-4">
                <Image
                  src={`http://localhost:3006/uploads/${car.image}`}
                  alt={car.carName}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />
              </div>

              {/* Car Details - Responsive Layout inside card */}
              <div className="p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white mt-auto">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">
                    {car.carName}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    {car.status} for rent
                  </p>
                </div>

                {/* <button className="whitespace-nowrap bg-[#ff5a00] text-white text-[10px] md:text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-orange-600 transition shadow-sm active:scale-95">
                  View Deal
                </button> */}
                <Link href={`/car-details/${car.carid}`}>
                  <button className="bg-[#ff5a00] text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition">
                    View Deal
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION CONTROLS - Mobile Optimized */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 pb-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-30 bg-white text-black hover:bg-gray-50 transition font-medium shadow-sm"
              >
                Previous
              </button>

              <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <span className="font-bold text-sm text-black">
                  {currentPage} / {totalPages}
                </span>
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-30 bg-white text-black hover:bg-gray-50 transition font-medium shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
