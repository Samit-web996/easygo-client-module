"use client";

import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import TemporaryDrawer from "./Sidebar";
import Link from "next/link";
import LoginModal from "./LoginSignup";

const Navbar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("userName");
      if (savedName) {
        setUserName(savedName);
      }
    }
  }, []);

  return (
    <>
      <nav className="bg-white text-black shadow-sm border-b border-gray-200 sticky top-0 z-50 shrink-0 w-full font-sans">
        {/* Added fluid padding responsive breakpoints (px-4 for mobile, sm:px-8 for wider viewports) */}
        <div className="w-full h-16 flex items-center justify-between px-4 sm:px-8 box-sizing-border-box">
          
          {/* LEFT INTERFACE SECTION */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              suppressHydrationWarning={true}
              onClick={() => setSidebarOpen(true)}
              className="cursor-pointer p-1.5 sm:p-2 text-gray-600 hover:text-black transition-all duration-300 hover:scale-105 shrink-0"
            >
              <Menu size={22} className="sm:w-6 sm:h-6" />
            </button>
            <TemporaryDrawer open={sidebarOpen} setOpen={setSidebarOpen} />

            <Link href={"/"} className="shrink-0">
              {/* Responsive font scaling text-2xl on mobile, sm:text-3xl on desktop to prevent collisions */}
              <span className="cursor-pointer text-2xl sm:text-3xl font-black text-[#f97316] tracking-tight">
                EasyGo
              </span>
            </Link>
          </div>

          {/* RIGHT AUTH CONTROL SECTION */}
          <div className="flex items-center gap-2 sm:gap-4 max-w-[60%] justify-end">
            {userName ? (
              <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                {/* Hidden on ultra-small mobile displays to save massive space, flex on sm views */}
                <div className="hidden sm:flex flex-col items-end shrink-0">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Welcome,</span>
                  <span className="font-bold text-[#0f172a] text-sm leading-tight line-clamp-1">
                    {userName}
                  </span>
                </div>
                {/* User Avatar - Unified Look with absolute space containment */}
                <div 
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm shrink-0"
                  style={{ backgroundColor: "#f97316" }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <button
                suppressHydrationWarning={true}
                onClick={() => setOpen(true)}
                className="cursor-pointer font-bold text-[10px] sm:text-xs tracking-wider uppercase border-2 border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white transition-all duration-200 rounded-xl whitespace-nowrap"
                style={{ padding: "8px 16px", smPadding: "10px 24px" }}
              >
                Login/Signup
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default Navbar;