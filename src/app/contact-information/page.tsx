"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// 1. Define Interface for Form State
interface KycFormData {
  uid: string;
  full_name: string;
  email_id: string;
  aadhar_no: string;
  address: string;
  license_no: string;
  user_photo: File | null;
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
    full_name: "",
    email_id: "",
    aadhar_no: "",
    license_no: "",
    address: "",
    user_photo: null,
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

    if (!form.aadhar_no || form.aadhar_no.length !== 12) {
      return toast.error("Aadhar must be exactly 12 digits!");
    }

    try {
      const formData = new FormData();
      // TypeScript safety: Append form data correctly
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

     const res = await axios.patch(`http://localhost:3006/user-kyc/:uid/${form.uid}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

      if (res.status === 200) {
        toast.success("KYC submitted successfully!");
        if (onSuccess) onSuccess();
        onClose();
        // Reset Form
        setForm({
          uid: localStorage.getItem("userId") || "",
          full_name: "",
          email_id: "",
          aadhar_no: "",
          license_no: "",
          address: "",
          user_photo: null,
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
    <div className="border-20 fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose} // Piche click karne par modal band ho jaye
      ></div> */}
      
      {/* Modal Container: Screen ke center mein float karega */}
      <div className="border-20 relative w-full max-w-xl max-h-[90vh] rounded-[32px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden text-gray-800 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button: Top Right corner par stylish wala */}
        {/* <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all z-10 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button> */}

        {/* HEADER */}
        <div className="p-6 border-b bg-gray-50/50">
          <h2 className="text-2xl font-extrabold text-indigo-900">Complete Your KYC</h2>
          <p className="text-sm text-gray-500 mt-1">Please provide valid identity documents to proceed with booking.</p>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-5 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Full Name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Sunny Raj" />
            <Input label="Email Address" name="email_id" type="email" value={form.email_id} onChange={handleChange} placeholder="sunny@example.com" />
            <Input label="Aadhar Number" name="aadhar_no" value={form.aadhar_no} onChange={handleChange} maxLength={12} placeholder="XXXX XXXX XXXX" />
            <Input label="License Number " name="license_no" value={form.license_no} onChange={handleChange} maxLength={12} placeholder="XXXX XXXX XXXX" />
            {/* <Input label="Contact Number" name="mobile" value={form.mobile} onChange={handleChange} maxLength={10} placeholder="9876543210" /> */}
            
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
              className="px-6 py-2.5 text-sm font-bold text-gray-400  hover:text-gray-600 uppercase tracking-widest transition-all"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="bg-indigo-600 text-indigo-400 px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all"
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
  placeholder?: string;
}

function Input({ label, name, value, onChange, type = "text", maxLength, placeholder }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-indigo-500 transition-all bg-gray-50/50 text-gray-800 placeholder:text-gray-300"
        required
      />
    </div>
  );
}
