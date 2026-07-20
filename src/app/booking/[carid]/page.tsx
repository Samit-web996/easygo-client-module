"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import API from "@/api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Car {
  carid: number;
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

interface RatingState {
  avgRating: string | number;
  totalReviews: number;
}

export default function BookingPage() {
  const [rentalDays, setRentalDays] = useState(1);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const params = useParams();
  const carid = params?.carid as string;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const [ratingData, setRatingData] = useState<RatingState>({
    avgRating: "No Ratings",
    totalReviews: 0,
  });

  const calculateAvg = () => {
    return ratingData.avgRating;
  };

  useEffect(() => {
    const getCarInfo = async () => {
      if (!carid) return;
      try {
        const res = await API.get(`/vehicles/${carid}`);
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
      if (!carid) return;
      try {
        const res = await API.get(`/vehicle-rating/${carid}`);
        if (res.data && res.data.avgRating !== undefined) {
          setRatingData({
            avgRating: res.data.avgRating
              ? Number(res.data.avgRating).toFixed(1)
              : "No Ratings",
            totalReviews: res.data.totalReviews || 0,
          });
        }
      } catch (err) {
        console.log("error:", err);
      }
    };
    getRating();
  }, [carid]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-sm">Loading car details...</p>
        </div>
      </div>
    );

  if (!car)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50/50 font-sans p-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-gray-100 max-w-md w-full shadow-xl">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2">Car Not Found</h2>
          <p className="text-gray-500 text-sm">
            The vehicle you are trying to book is currently unavailable.
          </p>
        </div>
      </div>
    );

  const subtotal = Number(car.pricePerDay) * rentalDays;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePickupDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setPickupDate(date);
    if (returnDate && date) {
      const days = Math.ceil(
        (new Date(returnDate).getTime() - new Date(date).getTime()) /
          (1000 * 60 * 60 * 24)
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
          (1000 * 60 * 60 * 24)
      );
      setRentalDays(days > 0 ? days : 1);
    }
  };

const handlePayment = async () => {
    if (total <= 0) {
      alert("Invalid total amount");
      return;
    }

    const userId = localStorage.getItem("userId");
    const carId = carid;

    if (!userId || !carId) return;

    setIsProcessing(true);
    try {
      const res = await API.post("/api/create-order", {
        amount: Math.round(total),
        uid: userId,
        car_id: carId,
        start_date: pickupDate,
        end_date: returnDate,
      });

      const orderId = res.data.order_id;
      const amountInPaise = res.data.amount;

      const options = {
        key: res.data.key_id || "rzp_test_TBIqtPiYqReKC6",
        amount: amountInPaise,
        currency: "INR",
        name: "EasyGo Rentals",
        description: `Booking for ${car.carName}`,
        order_id: orderId,
        handler: function (response: any) {
          setIsProcessing(false);
          toast.success("Booking confirmed successfully.");
          console.log("Payment ID:", response.razorpay_payment_id);
          router.push('/');
        },
        prefill: {
          name: localStorage.getItem("userName") || "User",
          email: "sunnybhasneiya@gmail.com",
          contact: localStorage.getItem("userMobile") || "",
        },
        theme: { color: "#f97316" }, 
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment start nahi ho paya. Backend check karein.");
      setIsProcessing(false);
    }
  };

  const isButtonDisabled =
    isProcessing ||
    !pickupDate ||
    !returnDate ||
    car.status !== "AVAILABLE" ||
    new Date(returnDate) <= new Date(pickupDate);

  return (
    <div 
      className="min-h-screen w-full font-sans text-gray-800"
      style={{ 
        backgroundColor: "#f8fafc",
        padding: "40px 24px", 
        boxSizing: "border-box" 
      }}
    >
      <div className="max-w-6xl mx-auto w-full">
        
        <div style={{ marginBottom: "32px" }}>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a]">
            Complete Your Booking
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Please verify the trip timeline and summary before redirecting to secure payment gate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-6 w-full">
            
            <div className="w-full bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6" style={{ padding: "24px" }}>
                
                <div className="md:col-span-2 relative min-h-40 bg-gray-50 rounded-xl flex items-center justify-center p-4 border border-gray-100">
                  <img
                    src={
                      car.image
                        ? `${car.image}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={car.carName}
                    className="max-h-[145px] w-auto object-contain transition-transform duration-300 hover:scale-103"
                  />
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-xs border"
                    style={{
                      backgroundColor: car.status === "AVAILABLE" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                      color: car.status === "AVAILABLE" ? "#10b981" : "#ef4444",
                      borderColor: car.status === "AVAILABLE" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"
                    }}
                  >
                    {car.status}
                  </span>
                </div>

                <div className="md:col-span-3 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                        {car.carName}
                      </h2>

                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                        <span className="text-amber-500 text-sm">★</span>
                        <span className="text-amber-900 text-xs font-bold">
                          {calculateAvg()}
                        </span>
                        <span className="text-gray-400 text-[11px]">
                          ({ratingData.totalReviews})
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {car.brand} <span className="text-gray-300">•</span> {car.model}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-sm">👥</span>
                      <span>{car.seat} Seater Space</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-sm">⛽</span>
                      <span>{car.fuelType} Engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-sm">⚡</span>
                      <span>Unlimited Mileage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center text-sm">🛡️</span>
                      <span>Insurance Guarded</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Key Highlights
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {car.features.split(",").map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-50 text-gray-600 border border-gray-200/60 px-2.5 py-0.5 rounded-lg text-xs font-medium"
                        >
                          {feature.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="bg-gray-50 text-xs text-gray-500 leading-relaxed border-t border-gray-100"
                style={{ padding: "16px 24px" }}
              >
                <span className="font-semibold text-gray-700">Vehicle Description:</span> {car.description}
              </div>
            </div>

            <div className="w-full bg-white border border-gray-200/80 rounded-2xl shadow-xs flex flex-col gap-4" style={{ padding: "24px" }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">📅</span>
                <h3 className="text-lg font-bold text-[#0f172a] tracking-tight">
                  Configure Trip Schedule
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={pickupDate}
                    onChange={handlePickupDateChange}
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    style={{ padding: "12px 16px" }}
                    required
                  />
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={returnDate}
                    onChange={handleReturnDateChange}
                    className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl outline-none transition-all focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    style={{ padding: "12px 16px" }}
                    required
                  />
                </div>
              </div>

              {rentalDays > 0 && pickupDate && returnDate && (
                <div 
                  className="flex items-center gap-2 rounded-xl text-xs font-medium border"
                  style={{ 
                    padding: "12px", 
                    backgroundColor: "rgba(249, 115, 22, 0.06)", 
                    borderColor: "rgba(249, 115, 22, 0.15)",
                    color: "#ea580c"
                  }}
                >
                  <span>💡</span>
                  <p>
                    Total dynamic rental duration segment is calculated as <span className="font-bold underline">{rentalDays} days</span> period layer.
                  </p>
                </div>
              )}
            </div>

          </div>

          <div className="lg:col-span-1 w-full lg:sticky lg:top-24">
            <div 
              className="w-full bg-white border border-gray-200/80 rounded-2xl shadow-md flex flex-col"
              style={{ padding: "24px", gap: "20px" }}
            >
              <h3 className="text-lg font-bold text-[#0f172a] pb-3 border-b border-gray-100 tracking-tight">
                Fare Invoice Breakup
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "14px" }}>
                <div className="flex justify-between text-gray-500">
                  <span>Base Fleet Rental</span>
                  <span className="font-semibold text-gray-800">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Operational Taxes (18% GST)</span>
                  <span className="font-semibold text-gray-800">
                    ₹{tax.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-dashed border-gray-200" style={{ margin: "4px 0" }}></div>

                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-[#0f172a]">
                    Total Payable
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#0f172a] tracking-tight">
                      ₹{total.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                      Inclusive of processing levies
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isButtonDisabled}
                className="w-full font-bold text-sm tracking-wide rounded-xl active:scale-[0.98] transition-all duration-150 cursor-pointer text-center shadow-md"
                style={{ 
                  padding: "14px 24px",
                  backgroundColor: isButtonDisabled ? "#e2e8f0" : "#f97316",
                  color: isButtonDisabled ? "#94a3b8" : "#ffffff",
                  boxShadow: isButtonDisabled ? "none" : "0 8px 20px -6px rgba(249, 115, 22, 0.4)"
                }}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Initializing Security Gateway...</span>
                  </div>
                ) : !pickupDate || !returnDate ? (
                  "Select Schedule Dates"
                ) : new Date(returnDate) <= new Date(pickupDate) ? (
                  "Fix Invalid Dates Range"
                ) : (
                  "Confirm & Proceed to Pay"
                )}
              </button>

              <div 
                className="flex items-start gap-2 bg-gray-50 rounded-xl text-[11px] text-gray-400 leading-normal border border-gray-100"
                style={{ padding: "12px" }}
              >
                <span className="mt-0.5">🔒</span>
                <p>
                  By executing checkout, you abide by EasyGo terms layer, cancellation legal policies & verification structures.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}