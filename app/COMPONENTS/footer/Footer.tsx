"use client";

import React from "react";
import Link from "next/link";
import ScrollToTopButton from "@/app/COMPONENTS/ScrollToTop/ScrollToTopButton";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white px-6 md:px-12 lg:px-[55px] py-16 font-custom1 mt-10">
      
      {/* "Let's talk art." Heading Section */}
      <div className="mt-8 mb-24 relative border-t border-white/10 pt-10 flex justify-between items-center">
        <Link 
          href="/contact" 
          className="group relative inline-block"
        >
          <h2 className="text-6xl md:text-8xl font-roboto tracking-tight transition-colors duration-300">
            Let's talk art.
          </h2>
          {/* Animated Underline on Hover */}
          <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
        </Link>

        {/* Scroll to Top Button aligned to the right */}
        <div className="relative">
           <ScrollToTopButton />
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col gap-6">
          <h4 className="font-roboto text-base">Trekuartista</h4>
          <address className="not-italic text-gray-500 text-sm leading-relaxed font-roboto">
            <p>Rruga Ahmet Krasniqi</p>
            <p>Arbëri, 10000 Prishtinë</p>
            <p>Republic of Kosovo</p>
          </address>
        </div>

        {/* Column 2 & 3: Navigation (Split into two sub-columns) */}
        <div className="md:col-span-2 grid grid-cols-2">
          <div className="flex flex-col gap-6">
            <h4 className="font-roboto text-base">Navigation</h4>
            <div className="flex flex-col gap-1">
              <Link href="/" className="text-gray-500 hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">Home</Link>
              <Link href="/our-works" className="text-gray-500 hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">All Work</Link>
            </div>
          </div>
          <div className="flex flex-col gap-1 pt-11"> 
            <Link href="/about-trekuartista" className="text-gray-500 hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">About Us</Link>
            <Link href="/contact" className="text-gray-500 hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">Contact</Link>
          </div>
        </div>

        {/* Column 4: Follow Links */}
        <div className="flex flex-col gap-6 font-roboto">
          <h4 className="font-roboto text-base">Follow</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <a href="https://facebook.com/Trekuartista.LLC" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">Facebook</a>
            <a href="https://linkedin.com/company/trekuartista-advertising-agency/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">Linkedin</a>
            <a href="https://instagram.com/trekuartista/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">Instagram</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Boxed style with thin border */}
      <div className="border border-white/20 rounded-[8px] px-4 py-3 flex flex-col md:flex-row justify-between items-center text-[10px] font-roboto">
        <p className="uppercase lg:text-sm pt-[4px]">©2026 Trekuartista</p>
        <div className="flex gap-2 items-center mt-4 md:mt-0 pt-[4px]">
          <Link href="/legal" className="hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">Legal</Link>
          <span className="opacity-30">-</span>
          <Link href="/privacy" className="hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">Privacy</Link>
          <span className="opacity-30">-</span>
          <Link href="/cookies" className="hover:text-white transition-colors uppercase text-[10px] lg:text-sm font-roboto">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;