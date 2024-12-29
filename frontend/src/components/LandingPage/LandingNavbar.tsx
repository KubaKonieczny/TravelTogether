import Link from 'next/link';
import React from "react";
import MainButton from "@/components/LandingPage/MainButton";

export default function LandingNavbar()  {
    return (
        <nav className="relative z-20 bg-transparent p-2">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <Link href="/">Travel Management</Link>
                </div>
                <div className="space-x-4">
                    {/*<Link href="/features" className="text-white hover:text-gray-300">*/}
                    {/*    Features*/}
                    {/*</Link>*/}
                    {/*<Link href="/about" className="text-white hover:text-gray-300">*/}
                    {/*    About*/}
                    {/*</Link>*/}
                    {/*<Link href="/contact" className="text-white hover:text-gray-300">*/}
                    {/*    Contact*/}
                    {/*</Link>*/}
                    <MainButton label={"Login"} href={"/login"}/>
                    <MainButton label={"Register"} href={"/register"}/>
                </div>
            </div>
        </nav>
    );
};