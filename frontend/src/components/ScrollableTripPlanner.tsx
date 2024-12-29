import React, { useState, useRef } from 'react';

import { Home, Car, Bed, Calendar, DollarSign, Users } from 'lucide-react';
import ReusableTripStepCard from "@/components/utils/ReusableTripStepCard";
import MainButton from "@/components/LandingPage/MainButton";

const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const sections = [
    { id: 'home', icon: Home, title: 'Home' },
    { id: 'transport', icon: Car, title: 'Transport' },
    { id: 'accommodation', icon: Bed, title: 'Accommodation' },
    { id: 'calendar', icon: Calendar, title: 'Calendar' },
    { id: 'costs', icon: DollarSign, title: 'Costs' },
    { id: 'people', icon: Users, title: 'People' },
];

const ScrollableTripPlanner: React.FC = () => {
    const [activeSection, setActiveSection] = useState('home');
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAttachmentClick = () => {
        console.log('Attachment clicked');
    };

    const NavButtons = () => (
        <>
            {sections.map(({ id, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`p-2 rounded-full ${
                        activeSection === id ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label={`Navigate to ${id} section`}
                >
                    <Icon size={24} />
                </button>
            ))}
        </>
    );

    return (
        <>
            <style>{scrollbarHideStyles}</style>
            <div className="flex flex-col h-screen">
                {/* Top navbar for phone view */}
                <nav className="md:hidden flex justify-between items-center bg-gray-100 p-2 overflow-x-auto scrollbar-hide">
                    <NavButtons />
                </nav>

                <div className="flex flex-1 overflow-hidden">

                    <nav className="hidden md:flex flex-col items-center py-4 bg-gray-100 w-16">
                        <NavButtons />
                    </nav>


                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {sections.map(({ id, title }, index) => (
                            <React.Fragment key={id}>
                                <div
                                    ref={(el) => (sectionRefs.current[id] = el)}
                                    className="mb-8"
                                >
                                    <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>
                                    <div className="space-y-4 px-4">
                                        {[1, 2, 3].map((stepIndex) => (
                                            <ReusableTripStepCard
                                                key={`${id}-${stepIndex}`}
                                                title={`${title} Step ${stepIndex}`}
                                                description={`This is a sample description for ${title.toLowerCase()} step ${stepIndex}.`}
                                                date="2023-06-15"
                                                time="14:00"
                                                location="Sample Location"
                                                price="$100"
                                                duration="2 hours"
                                                distance="10 km"
                                                onAttachmentClick={handleAttachmentClick}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {id == 'calendar' ? <MainButton label="Add step"/> : ""}
                                {index < sections.length - 1 && (
                                    <div className="h-px bg-gray-200 mx-4 my-8" aria-hidden="true" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScrollableTripPlanner;