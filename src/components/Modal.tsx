"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
   const [form, setForm] = useState<FormState>({
      mobile_no: ""
    });
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
           
        } catch (err) {
          console.error("Submission Error:", err);
          toast.error("Failed to send request. Check your server.");
        }
      };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="p-8 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Mobile Number" 
              name="mobile_no" 
            //   value={form.mobile_no} 
            //   onChange={handleChange} 
              placeholder="9876543210"
            />
            <Input 
              label="OTP" 
              name="email" 
            //   value={form.email} 
            //   onChange={handleChange} 
              placeholder="Enter OTP"
            />
          </div>
        </div>
        </Box>
      </Modal>
    </div>
  );
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
