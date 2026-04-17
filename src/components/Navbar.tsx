"use client";

import React from "react";
import { useState } from "react";
import { Menu } from "lucide-react";
import { FaUser } from "react-icons/fa";
import TemporaryDrawer from "./Sidebar";
import Link from "next/link";
import LoginModal from "./LoginSignup";

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-white text-black shadow-sm border-b border-gray-200 sticky top-0 z-50 shrink-0">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="cursor-pointer p-2 text-gray-600 hover:text-black transition-all duration-300 hover:scale-110"
            >
              <Menu size={24} />
            </button>
            <TemporaryDrawer open={sidebarOpen} setOpen={setSidebarOpen} />

            <Link href={"/"}>
              <span className="cursor-pointer font-serif text-3xl font-extrabold text-orange-500">
                EasyGo
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer border font-semibold rounded-3xl px-3 py-2"
            >
              Login/Signup
            </button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
              <FaUser size={20} />
            </div>
          </div>
        </div>
      </nav>
      {/* <LoginModal isopen={open} onclose={() => setOpen(false)} /> */}
    <LoginModal 
        isOpen={open} 
        onClose={() => setOpen(false)} // Band karne ka function prop mein bhejo
      />
    </>
  );
};

export default Navbar;
