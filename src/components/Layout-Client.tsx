 "use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "./Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />

      <div style={{ display: "flex" }}>
        {/* Sidebar bhi yaha control karega */}
        {children}
      </div>
      <Footer/>
    </div>
  );
}