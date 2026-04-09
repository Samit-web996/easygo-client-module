import React from 'react';
import Link from 'next/link';
import { FaFacebook,FaInstagram , FaYoutube } from "react-icons/fa";
import { FaXTwitter} from "react-icons/fa6";

const footerLinks = {
  Company: ['About', 'Careers', 'Mobile', 'Blog', 'How we work'],
  Contact: ['Help/FAQ', 'Press', 'Affiliates', 'Hotel owners', 'Partners', 'Advertise with us'],
  More: ['Trip plans', 'Luxuries', 'Low fare tips', 'Security'],
};

export default function Footer() {
  return (
    <footer className="w-full bg-white text-gray-700 py-12 px-6 md:px-12 border-t mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Links & App Store Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-black mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:underline text-sm decoration-gray-400">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* App Download Section */}
          <div>
            <h3 className="font-bold text-black mb-4">Get the EasyGo app</h3>
            <div className="flex flex-col gap-3 max-w-40px">
              <Link href="#">
                <img src="—Pngtree—google play app icon vector_12256664.png" alt="Google Play" className="w-30 border-white h-auto border rounded-md" />
              </Link>
              <Link href="#">
                <img src="5a902db97f96951c82922874.png" alt="App Store" className="w-30 h-auto border rounded-md" />
              </Link>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Middle Section: Copyright & Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex flex-wrap gap-4 text-xs">
            <span>©2026 EasyGo</span>
            <Link href="#" className="underline">Privacy</Link>
            <Link href="#" className="underline">Terms & Conditions</Link>
          </div>
          
          <div className="flex gap-5 text-gray-600">
            <FaFacebook size={20} className="cursor-pointer hover:text-black" />
            <FaXTwitter  size={20} className="cursor-pointer hover:text-black" />
            <FaYoutube size={20} className="cursor-pointer hover:text-black" />
            <FaInstagram  size={20} className="cursor-pointer hover:text-black" />
          </div>
        </div>
      </div>
    </footer>
  );
}