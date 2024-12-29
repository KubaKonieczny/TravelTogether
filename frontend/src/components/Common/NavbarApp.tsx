import Link from "next/link";
import SearchBar from "@/components/Common/SearchBar";
import {Bell, Menu, MessageCircleMore, X} from "lucide-react";
import React, {useState} from "react";
import PopupProfile from "@/components/Common/PopupProfile";
import Chats from "@/components/Common/Chats";
import { Search } from 'lucide-react';

interface NavbarAppProps {
    onClick: () => void;

}

const NavbarApp: React.FC<NavbarAppProps> = (props: NavbarAppProps) => {
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
//
//
// const NavbarApp: React.FC<NavbarAppProps> = (props: NavbarAppProps) => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//
//     return (
//         <nav className="bg-gray-800 text-white p-4">
//             <div className="container mx-auto flex flex-wrap justify-between items-center">
//                 <div className="flex items-center w-full lg:w-auto justify-between">
//                     <Link href="/dashboard" className="text-xl font-bold">
//                         Travel Management
//                     </Link>
//                     <button
//                         className="lg:hidden"
//                         onClick={() => setIsMenuOpen(!isMenuOpen)}
//                     >
//                         {isMenuOpen ? (
//                             <X className="w-6 h-6" />
//                         ) : (
//                             <Menu className="w-6 h-6" />
//                         )}
//                     </button>
//                 </div>
//
//                 <div className="w-full lg:w-auto mt-4 lg:mt-0 order-3 lg:order-2">
//                     <SearchBar />
//                 </div>
//
//                 <div className={`w-full lg:w-auto lg:flex items-center space-x-4 order-2 lg:order-3 ${isMenuOpen ? 'block' : 'hidden'}`}>
//                     <div className="lg:flex space-x-4 items-center">
//                         <Link href="/groups" className="block lg:inline-block py-2 lg:py-0 text-white hover:text-gray-300">
//                             Groups
//                         </Link>
//                         <Link href="/trips" className="block lg:inline-block py-2 lg:py-0 text-white hover:text-gray-300">
//                             Trips
//                         </Link>
//                         <Link href="/dashboard" className="block lg:inline-block py-2 lg:py-0 text-white hover:text-gray-300">
//                             Home
//                         </Link>
//                     </div>
//                     <button onClick={props.onClick} className="block lg:inline-block py-2 lg:py-0">
//                         <MessageCircleMore className="w-6 h-6" />
//                     </button>
//                     <div className="block lg:inline-block py-2 lg:py-0">
//                         <Chats />
//                     </div>
//                     <button className="block lg:inline-block py-2 lg:py-0">
//                         <Bell className="w-6 h-6" />
//                     </button>
//                     <div className="block lg:inline-block py-2 lg:py-0">
//                         <PopupProfile />
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

export default NavbarApp;