import Link from "next/link";
import SearchBar from "@/components/Dashboard/SearchBar";
import {MessageCircleMore} from "lucide-react";
import React from "react";
import PopupProfile from "@/components/Dashboard/PopupProfile";


interface NavbarAppProps {
    onClick: () => void;

}

const NavbarApp: React.FC<NavbarAppProps> = (props: NavbarAppProps) => {

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4 items-center">
                    <Link href="/public" className="text-xl font-bold">
                        Map Application
                    </Link>
                    <SearchBar/>
                </div>


                <div className="flex space-x-4 items-center">
                    <Link href={"/groups"} className="text-white hover:text-gray-300">
                        Groups
                    </Link>
                    <Link href={"/Trips"} className="text-white hover:text-gray-300">
                        Trips
                    </Link>
                    <Link href={"/dashboard"} className="text-white hover:text-gray-300">
                        Home
                    </Link>
                    <button onClick={props.onClick} >
                        <MessageCircleMore className="w-8 h-8"/>
                    </button>
                    <div >
                        <PopupProfile/>
                    </div>
                </div>
            </div>
        </nav>


    )

}

export default NavbarApp;