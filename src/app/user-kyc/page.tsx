"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import API from "@/api";

interface KycFormData {
  uid: string;
  mobile_no: string;
  aadhar_no: string;
  current_address: string;
  license_no: string;
  user_photo: File | null;
}

interface KycFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function KycForm({ isOpen, onClose, onSuccess }: KycFormProps) {
  const [form, setForm] = useState<KycFormData>({
    uid: typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "",
    mobile_no: "",
    aadhar_no: "",
    license_no: "",
    current_address: "",
    user_photo: null,
  });

  useEffect(() => {
    if (isOpen) {
      const storedUid = localStorage.getItem("userId") || "";
      const storeMobile = localStorage.getItem("userMobile") || "";
      setTimeout(() => {
        setForm((prev) => ({ 
          ...prev, 
          uid: storedUid, 
          mobile_no: storeMobile 
        }));
      }, 0);
    }
  }, [isOpen]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, user_photo: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.aadhar_no || form.aadhar_no.length !== 12) {
      return toast.error("Aadhar must be exactly 12 digits!");
    }

    try {
      const formData = new FormData();
      formData.append("aadhar_no", form.aadhar_no);
      formData.append("license_no", form.license_no);
      formData.append("current_address", form.current_address);
      formData.append("mobile_no", localStorage.getItem("userMobile") || "");
      if (form.user_photo) {
        formData.append("user_photo", form.user_photo);
      } else {
        return toast.error("Please select a photo first!");
      }

      const res = await API.patch(
        `/user-kyc/${form.uid}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200 || res.data.success) {
        toast.success("KYC submitted successfully!");
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
        }, 500);
        onClose();
        
        setForm({
          uid: localStorage.getItem("userId") || "",
          mobile_no: localStorage.getItem("userMobile") || "",
          aadhar_no: "",
          license_no: "",
          current_address: "",
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md transition-all duration-300">
      
      <div 
        className="w-full bg-white flex flex-col overflow-hidden text-gray-800 animate-in fade-in zoom-in-95 duration-200"
        style={{
          maxWidth: "540px",
          maxHeight: "90vh",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e2e8f0"
        }}
      >
        
        <div 
          className="border-b border-gray-100 bg-gray-50/60"
          style={{ padding: "20px 24px" }}
        >
          <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight">
            Complete Your KYC
          </h2>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Please provide valid identity documents to proceed with booking.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ padding: "24px" }}
        >
          <Input
            label="Mobile Number"
            name="mobile_no"
            type="text"
            value={form.mobile_no}
            disabled={true}
            placeholder="Mobile Number"
          />
          <Input
            label="Aadhar Number"
            name="aadhar_no"
            value={form.aadhar_no}
            onChange={handleChange}
            maxLength={12}
            placeholder="XXXX XXXX XXXX"
          />
          <Input
            label="License Number"
            name="license_no"
            value={form.license_no}
            onChange={handleChange}
            maxLength={15}
            placeholder="Enter license number"
          />

          <div className="sm:col-span-2 flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Current Address
            </label>
            <textarea
              name="current_address"
              value={form.current_address}
              onChange={handleChange}
              placeholder="Enter your complete address..."
              className="w-full bg-gray-50/50 border border-gray-200 text-gray-800 text-sm rounded-xl outline-none transition-all focus:border-[#f97316] focus:ring-4 focus:ring-orange-500/10 resize-none"
              style={{ padding: "12px 16px" }}
              rows={2}
              required
            />
          </div>

          <div 
            className="sm:col-span-2 flex flex-col gap-2 rounded-xl"
            style={{ 
              padding: "16px",
              backgroundColor: "rgba(249, 115, 22, 0.03)", 
              border: "1px dashed rgba(249, 115, 22, 0.25)" 
            }}
          >
            <label className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">
              Profile Picture / Identity Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0f172a] file:text-white hover:file:bg-[#0f172a]/90 file:cursor-pointer transition-all"
            />
          </div>

          <div 
            className="sm:col-span-2 flex justify-between items-center" 
            style={{ marginTop: "12px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors tracking-wider uppercase cursor-pointer"
              style={{ padding: "10px 0" }}
            >
              Discard
            </button>

            <button
              type="submit"
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-xs tracking-wider uppercase rounded-xl active:scale-[0.97] transition-all duration-150 cursor-pointer text-center shadow-md shadow-orange-500/10"
              style={{ padding: "12px 32px" }}
            >
              Submit KYC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  name?: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  maxLength,
  placeholder,
  disabled
}: InputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full text-sm rounded-xl outline-none transition-all"
        style={{
          padding: "12px 16px",
          backgroundColor: disabled ? "#f1f5f9" : "#f8fafc",
          border: "1px solid #e2e8f0",
          color: disabled ? "#94a3b8" : "#0f172a",
          cursor: disabled ? "not-allowed" : "text"
        }}
        required={!disabled}
      />
    </div>
  );
}