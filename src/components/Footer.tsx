"use client";

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const footerLinks = {
  Company: ['About', 'Careers', 'Mobile', 'Blog', 'How we work'],
  Contact: ['Help/FAQ', 'Press', 'Affiliates', 'Hotel owners', 'Partners', 'Advertise with us'],
  More: ['Trip plans', 'Luxuries', 'Low fare tips', 'Security'],
};

export default function Footer() {
  return (
    <footer className="w-full bg-white text-gray-700 py-12 border-t mt-16 font-sans">
      {/* Replaced max-w-7xl with w-full and mapped exact 32px standard fluid padding */}
      <div className="w-full" style={{ padding: "0 32px", boxSizing: "border-box" }}>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 w-full">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col">
              <h3 className="font-bold text-[#0f172a] mb-4 text-base tracking-tight">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-[#f97316] text-sm transition-colors duration-150 font-medium text-gray-500">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col">
            <h3 className="font-bold text-[#0f172a] mb-4 text-base tracking-tight">Get the EasyGo app</h3>
            <div className="flex flex-col gap-3 max-w-[160px]">
              <Link href="#" className="block transition-transform hover:scale-[1.02]">
                <img src="—Pngtree—google play app icon vector_12256664.png" alt="Google Play" className="w-32 h-auto border border-gray-200 rounded-xl" />
              </Link>
              <Link href="#" className="block transition-transform hover:scale-[1.02]">
                <img src="5a902db97f96951c82922874.png" alt="App Store" className="w-32 h-auto border border-gray-200 rounded-xl" />
              </Link>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-4 w-full">
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider justify-center sm:justify-start">
            <span>©2026 EasyGo</span>
            <Link href="#" className="hover:text-[#f97316] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#f97316] transition-colors">Terms & Conditions</Link>
          </div>
          
          <div className="flex gap-5 text-gray-400 shrink-0">
            <FaFacebook size={20} className="cursor-pointer hover:text-[#f97316] transition-colors duration-200" />
            <FaXTwitter size={20} className="cursor-pointer hover:text-[#f97316] transition-colors duration-200" />
            <FaYoutube size={20} className="cursor-pointer hover:text-[#f97316] transition-colors duration-200" />
            <FaInstagram size={20} className="cursor-pointer hover:text-[#f97316] transition-colors duration-200" />
          </div>
        </div>
      </div>
    </footer>
  );
}