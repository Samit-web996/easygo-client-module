import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// 1. Define Interface for Form State
interface KycFormData {
  uid: string;
  ownerName: string;
  email: string;
  aadhar: string;
  mobile: string;
  address: string;
  profile_img: File | null;
}

// 2. Define Props for the Modal
interface KycFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function KycForm({ isOpen, onClose, onSuccess }: KycFormProps) {
  const [form, setForm] = useState<KycFormData>({
    uid: "",
    ownerName: "",
    email: "",
    aadhar: "",
    mobile: "",
    address: "",
    profile_img: null,
  });

  useEffect(() => {
    if (isOpen) {
      const storedUid = localStorage.getItem("userId") || "";
      setForm((prev) => ({ ...prev, uid: storedUid }));
    }
  }, [isOpen]);

  // Handle Text Inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, profile_img: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.aadhar || form.aadhar.length !== 12) {
      return toast.error("Aadhar must be exactly 12 digits!");
    }

    try {
      const formData = new FormData();
      // TypeScript safety ke liye loop mein types define kiye
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const res = await axios.post("http://localhost:3006/kyc-update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("KYC submitted successfully!");
        if (onSuccess) onSuccess();
        onClose();
        // Reset Form
        setForm({
          uid: localStorage.getItem("userId") || "",
          ownerName: "",
          email: "",
          aadhar: "",
          mobile: "",
          address: "",
          profile_img: null,
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error submitting KYC.");
    }
  };

  if (!isOpen) return null;

  return (
    /* Background Overlay: Isko 'fixed' aur 'z-[9999]' hona chahiye */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden">
      
      {/* Modal Container: Screen ke center mein float karega */}
      <div className="relative w-full max-w-xl max-h-[90vh] rounded-3xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden text-gray-800 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button: Top Right corner par stylish wala */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all z-10 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* HEADER */}
        <div className="p-6 border-b bg-gray-50/50">
          <h2 className="text-2xl font-extrabold text-indigo-900">Complete Your KYC</h2>
          <p className="text-sm text-gray-500 mt-1">Please provide valid identity documents to proceed with booking.</p>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Full Name" name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Sunny Raj" />
            <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} placeholder="sunny@example.com" />
            <Input label="Aadhar Number" name="aadhar" value={form.aadhar} onChange={handleChange} maxLength={12} placeholder="XXXX XXXX XXXX" />
            <Input label="Contact Number" name="mobile" value={form.mobile} onChange={handleChange} maxLength={10} placeholder="9876543210" />
            
            <div className="md:col-span-2">
              <label className="text-sm font-bold text-gray-700 mb-1.5 block uppercase tracking-wider">Current Address</label>
              <textarea 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                placeholder="Enter your complete address..."
                className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-indigo-500 transition-all bg-gray-50/50" 
                rows={2}
              />
            </div>

            <div className="md:col-span-2 bg-indigo-50/50 p-5 rounded-2xl border-2 border-dashed border-indigo-200">
              <label className="text-sm font-bold text-indigo-800 block mb-3 uppercase tracking-wider">Profile Picture / Identity Photo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer" 
              />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex justify-end items-center gap-4 pt-4 mt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-all"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all"
            >
              Submit KYC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. Define Props for Input Component
interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  maxLength?: number;
}

function Input({ label, name, value, onChange, type = "text", maxLength }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        required
      />
    </div>
  );
}