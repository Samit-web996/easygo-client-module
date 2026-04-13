 "use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "./Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div>
      <Navbar/>

      <div style={{ display: "flex" }}>
        {/* Sidebar bhi yaha control karega */}
        {children}
      </div>
      <Footer/>
    </div>
  );
}