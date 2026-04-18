"use client";

import React from "react";
import { useState } from "react";
import { Menu } from "lucide-react";
import TemporaryDrawer from "./Sidebar";
import Link from "next/link";
import LoginModal from "./LoginSignup";
import { useEffect } from "react";

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    const savedName = localStorage.getItem("userName");
    if (savedName && savedName !== userName) {
      setUserName(savedName);
    }
  }
}, [userName]);
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
            {userName ? (
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end mr-2">
                  <span className="text-xs text-gray-500">Welcome,</span>
                  <span className="font-bold text-gray-800 leading-none">
                    {userName}
                  </span>
                </div>
                {/* User Avatar - Professional Look */}
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              // ❌ Jab user login na ho (Button dikhega)
              <button
                onClick={() => setOpen(true)}
                className="cursor-pointer border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all font-semibold rounded-3xl px-6 py-2"
              >
                Login/Signup
              </button>
            )}
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
