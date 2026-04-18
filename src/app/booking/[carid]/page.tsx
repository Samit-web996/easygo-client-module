// app/booking/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import axios from "axios";

// Mock car data - replace with your actual data fetching logic
const carDetails = {
  // id: 1,
  // name: 'Tesla Model 3',
  // type: 'Electric Sedan',
  // image: '/cars/tesla-model-3.jpg', // Ensure this image exists in your public folder
  // seats: 5,
  // transmission: 'Automatic',
  pricePerDay: 5999,
  // features: ['GPS Navigation', 'Bluetooth Audio', 'Backup Camera', 'Heated Seats'],
  // description: 'Experience the future of driving with the Tesla Model 3. Zero emissions, instant torque, and a minimalist interior with a 15-inch touchscreen.'
};

// Payment options
const paymentOptions = [
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "upi", name: "UPI (Google Pay, PhonePe, etc.)", icon: "📱" },
  { id: "netbanking", name: "Net Banking", icon: "🏦" },
  { id: "cod", name: "Pay at Pickup", icon: "💵" },
];
interface Car {
  carid: number;
  // cancellation: string;
  carName: string;
  brand: string;
  model: string;
  seat: number;
  features: string;
  fuelType: string;
  pricePerDay: string | number;
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

export default function BookingPage() {
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [rentalDays, setRentalDays] = useState(1);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const params = useParams();
  const carid = params?.carid as string;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ratingData, setRatingData] = useState<RatingItem[]>([]);

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

  // Calculate total amount
  const subtotal = carDetails.pricePerDay * rentalDays;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  // Handle date changes and calculate days
  const handlePickupDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setPickupDate(date);
    if (returnDate && date) {
      const days = Math.ceil(
        (new Date(returnDate).getTime() - new Date(date).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      setRentalDays(days > 0 ? days : 1);
    }
  };

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setReturnDate(date);
    if (pickupDate && date) {
      const days = Math.ceil(
        (new Date(date).getTime() - new Date(pickupDate).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      setRentalDays(days > 0 ? days : 1);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Booking confirmed! (Demo)");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">
            Review car details and proceed with payment
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:w-2/3 space-y-6">
            {/* Car Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative h-64 md:h-80 bg-gray-200">
                <img
                  src={
                    car.image
                      ? `http://localhost:3006/uploads/${car.image}`
                      : "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={car.carName}
                  className="w-full h-full object-contain"
                />
                {/* Status Badge - Right Top */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-md ${
                    car.status === "AVAILABLE"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {car.status}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {car.carName}
                    </h2>
                    {/* <p className="text-gray-500">{carDetails.type}</p> */}
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-blue-600 font-semibold">
                      ⭐{calculateAvg()}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({ratingData.length} reviews)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span>{car.seat} Seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Unlimited Miles</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Insurance Included</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Key Features
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {/* {carDetails.features.map((feature, idx) => ( */}
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {car.features}
                    </span>
                    {/* ))} */}
                  </div>
                </div>

                <p className="text-gray-600 text-sm">{car.description}</p>
              </div>
            </div>

            {/* Rental Duration Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Rental Duration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={pickupDate}
                    onChange={handlePickupDateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={returnDate}
                    onChange={handleReturnDateChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>
              {rentalDays > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                  Total rental period:{" "}
                  <span className="font-semibold text-gray-900">
                    {rentalDays} day{rentalDays !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Payment & Summary */}
          <div className="lg:w-1/3 space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Price Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Rental Charges (₹{car.pricePerDay}/day × {rentalDays} days)
                  </span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees (18% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Select Payment Method
                </h4>
                <div className="space-y-2">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPayment === option.id
                          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={selectedPayment === option.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-gray-700">{option.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBooking}
                disabled={
                  isProcessing ||
                  !pickupDate ||
                  !returnDate ||
                  car.status !== "AVAILABLE" ||
                  new Date(returnDate) <= new Date(pickupDate)
                }
                className={`cursor-pointer w-full mt-6 py-4 px-4 rounded-xl font-bold text-white transition-all duration-300 transform active:scale-95 ${
                  isProcessing ||
                  !pickupDate ||
                  !returnDate ||
                  car.status !== "AVAILABLE" ||
                  new Date(returnDate) <= new Date(pickupDate)
                    ? "bg-gray-400 cursor-not-allowed grayscale"
                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/30"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    {car.status !== "AVAILABLE"
                      ? "Car Currently Unavailable"
                      : !pickupDate || !returnDate
                        ? "Select Dates to Continue"
                        : new Date(returnDate) <= new Date(pickupDate)
                          ? "Invalid Return Date ⚠️"
                          : "Confirm & Book Now"}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By proceeding, you agree to our Terms of Service and
                Cancellation Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
