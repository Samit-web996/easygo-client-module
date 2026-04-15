"use client";

import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";

// 1. Interface for Props
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// 2. Interface for Form State
interface FormState {
  mobile_no: string;
  email: string;
  [key: string]: string; // Index signature to fix form[key] error
}

export default function VehicleModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<FormState>({
    mobile_no: "",
    email: "",
  });

  // 3. Fixed Change Event Type
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Fixed Submit Event Type
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.mobile_no || !form.email) {
      return toast.error("Mobile and Email are required!");
    }

    try {
      // 1. Check owner exist
      const checkRes = await axios.get(`http://localhost:3006/check-owner/${form.email}`);

      if (checkRes.data.exist) {
        // 2. FormData preparation
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
          formData.append(key, form[key]);
        });

        await axios.post("http://localhost:3006/vehicle-request", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Vehicle request sent successfully!");
        if (onSuccess) onSuccess();
        onClose();
        setForm({ mobile_no: "", email: "" });
      } else {
        toast.error("Please complete your KYC before sending a request.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      toast.error("Failed to send request. Check your server.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Modal Box */}
      <div className="w-full max-w-xl max-h-[90vh] 
            rounded-2xl bg-white dark:bg-[#0b0f19]
            text-gray-800 dark:text-gray-200 
            shadow-2xl border border-gray-200 dark:border-gray-800
            flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-start p-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">New Vehicle</h2>
            <p className="text-sm text-slate-500 font-medium">Add a vehicle to your system.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Email Address" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="example@mail.com"
            />
            <Input 
              label="Mobile Number" 
              name="mobile_no" 
              value={form.mobile_no} 
              onChange={handleChange} 
              placeholder="9876543210"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors tracking-widest uppercase px-4"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all hover:-translate-y-1 active:scale-95 tracking-widest uppercase"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Input Component Props Interface
interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

function Input({ label, name, type = "text", value, onChange, placeholder }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
        {label}
      </label>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-semibold"
      />
    </div>
  );
}