import Link from 'next/link';
import React from "react";
import MainButton from "@/components/Buttons/MainButton";

export default function LandingNavbar()  {
    return (
        <nav className="relative z-20 bg-transparent p-2">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <Link href="/">Travel Management</Link>
                </div>
                <div className="space-x-4">

                    <MainButton label={"Login"} href={"/login"}/>
                    <MainButton label={"Register"} href={"/register"}/>
                </div>
            </div>
        </nav>
    );
};