import Link from "next/link";
import SearchBar from "@/components/Navbar/SearchBar";
import {Bell, Menu, MessageCircleMore, X} from "lucide-react";
import React, {useState} from "react";
import PopupProfile from "@/components/Popups/PopupProfile";
import Chats from "@/components/Chats/Chats";

interface NavbarAppProps {
    onClick: () => void;
}

export default function NavbarApp(props: NavbarAppProps){

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className=" container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <Link href="/dashboard" className="hidden lg:block text-xl font-bold mr-4">
                        Travel Management
                    </Link>
                    <SearchBar/>
                </div>


                <div className="flex items-center space-x-4">
                    <button
                        className="lg:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6"/>
                        ) : (
                            <Menu className="w-6 h-6"/>
                        )}
                    </button>
                    <div className="hidden lg:flex space-x-4 items-center">
                        <Link href="/groups" className="text-white hover:text-gray-300">
                            Groups
                        </Link>
                        <Link href="/trips" className="text-white hover:text-gray-300">
                            Trips
                        </Link>
                        <Link href="/dashboard" className="text-white hover:text-gray-300">
                            Home
                        </Link>
                    </div>
                    <button onClick={props.onClick}>
                        <MessageCircleMore className="w-6 h-6"/>
                    </button>
                    <Chats/>
                    <button className="block lg:inline-block py-2 lg:py-0">
                        <Bell className="w-6 h-6"/>
                    </button>

                    <div>
                        <PopupProfile/>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden mt-4">
                <Link href="/groups" className="block py-2 text-white hover:text-gray-300">
                        Groups
                    </Link>
                    <Link href="/trips" className="block py-2 text-white hover:text-gray-300">
                        Trips
                    </Link>
                    <Link href="/dashboard" className="block py-2 text-white hover:text-gray-300">
                        Home
                    </Link>
                </div>
            )}
        </nav>
    );
};

