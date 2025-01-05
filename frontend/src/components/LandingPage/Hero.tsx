import Image from "next/image";
import LandingNavbar from "@/components/LandingPage/LandingNavbar";
import React from "react";

export default function Hero() {
    return (
        <section className="relative pb-20 h-[60vh] md:h-[70vh]">
            <LandingNavbar/>
            <div className="absolute inset-0">
                <Image
                    src="/images/view.jpg"
                    alt="Hero Background"
                    fill

                    className="object-cover z-[-1]"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4 md:px-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore the World Together</h1>
                    <p className="text-base md:text-lg mb-8">Meet, plan, and travel—optimize every step of your journey for a seamless trip experience</p>
                </div>
            </div>
        </section>
    );
};