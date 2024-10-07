

import Image from "next/image";
import Navbar from "@/components/LandingPage/Navbar";
import React from "react";

export default function Hero() {
    return (
        <section className="relative pb-20 h-[60vh] md:h-[70vh]">
            <Navbar/>
            <div className="absolute inset-0">
                <Image
                    src="/view.jpg"
                    alt="Hero Background"
                    fill
                    className="object-cover z-[-1]"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4 md:px-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Website</h1>
                    <p className="text-base md:text-lg mb-8">We are glad to have you here. Explore our services and
                        offerings.</p>
                </div>
            </div>
        </section>
    );
};