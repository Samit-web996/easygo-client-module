"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import KycForm from "@/app/contact-information/page";

interface Car {
  carid: number;
  cancellation: string;
  carName: string;
  brand: string;
  model: string;
  seat: number;
  features: string;
  fuelType: string;
  price_per_km: string | number;
  modelYear: string | number;
  status: "AVAILABLE" | "UNAVAILABLE";
  image: string | null;
  description: string;
  email: string;
  owner_name: string;
}
interface RatingItem {
  rating: number;
}

export default function CarDetails() {
  const params = useParams();
  const carid = params?.carid as string;

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ratingData, setRatingData] = useState<RatingItem[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const getCarInfo = async () => {
      if (!carid) return;
      try {
        const res = await axios.get(`http://localhost:3006/vehicles/${carid}`);
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
      try {
        const res = await axios.get(
          `http://localhost:3006/vehicle-rating/${carid}`,
        );
        setRatingData(res.data);
      } catch (err) {
        console.log("error:", err);
      }
    };
    if (carid) getRating();
  }, [carid]);

  const calculateAvg = () => {
    if (ratingData.length === 0) return "No Ratings";
    const sum = ratingData.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / ratingData.length).toFixed(1);
  };

  if (loading)
    return (
      <div className="p-10 text-center font-sans">Loading car details...</div>
    );
  if (!car)
    return (
      <div className="p-10 text-center text-red-500 font-sans font-bold">
        Car not found!
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans relative">
      <div className="bg-orange-500 text-white p-3 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>✔</span> Your selected car
        </div>
        <span className="text-sm font-bold bg-white text-orange-600 px-3 py-1 rounded-full shadow-sm">
          Status: {car.status}
        </span>
      </div>

      <div className="border-x border-b rounded-b-xl mb-6 p-6 shadow-lg bg-white flex flex-col md:flex-row gap-8">
        {/* Left Side: Image */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border">
            <img
              src={
                car.image
                  ? `http://localhost:3006/uploads/${car.image}`
                  : "https://via.placeholder.com/400x300?text=No+Image"
              }
              alt={car.carName}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-4 p-3 bg-gray-50 border rounded-lg w-full text-center">
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">
              🛡️ {car.cancellation}
            </p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-yellow-500 text-lg">⭐</span>
              <span className="font-bold text-gray-700 text-xl">
                {calculateAvg()}
              </span>
              <span className="text-xs text-gray-400">
                ({ratingData.length} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-[1.5] space-y-5">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              {car.carName}
            </h1>
            <p className="text-gray-500 font-medium italic">
              {car.brand} {car.model} | {car.modelYear}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              ⚙️ <b>Fuel:</b> {car.fuelType}
            </div>
            <div className="flex items-center gap-2">
              👤 <b>Seats:</b> {car.seat}
            </div>
            <div className="flex items-center gap-2">
              ✅ <b>Trusted Owner:</b> {car.owner_name}
            </div>
            <div className="flex items-center gap-2">
             <b>🛡️ EasyGo Assured</b>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Features
            </p>
            <p className="text-gray-700 text-sm font-medium">{car.features}</p>
          </div>

          <div className="border-t pt-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Description
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {car.description}
            </p>
          </div>

          <div className="flex justify-between items-center border-t pt-6">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Price per KM
              </p>
              <h2 className="text-3xl font-black text-blue-600">
                INR {car.price_per_km}
              </h2>
            </div>

            <button
             onClick={() => setOpen(true)}
              disabled={car.status === "UNAVAILABLE"}
              className={`cursor-pointer px-10 py-3 rounded-xl font-bold text-sm tracking-widest transition-all shadow-md uppercase
                ${
                  car.status === "UNAVAILABLE"
                    ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                    : "bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02]"
                }`}
            >
              {car.status === "UNAVAILABLE" ? "Not Available" : "Book Now"}
            </button>
            
           
          </div>
        </div>
      </div>
      <KycForm isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
