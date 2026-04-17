 "use client";
import { useState } from "react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";;
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
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
      <Footer/>
    </div>
  );
}