 "use client";
import { useState } from "react"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";;
import Navbar from "@/components/Navbar";
import Footer from "./Footer";
import Script from "next/script";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
      strategy="lazyOnload"
      />
      <Navbar/>

      <div style={{ display: "flex" }}>
        {children}
        <ToastContainer position="top-center" autoClose={2000} />
      </div>
      <Footer/>
    </div>
  );
}