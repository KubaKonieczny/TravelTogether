import React, {useState, useRef, useEffect, useCallback} from 'react';

import { Home, Car, Bed, Calendar, DollarSign, Users } from 'lucide-react';
import MainButton from "@/components/Buttons/MainButton";
import Card from "@/components/Cards/Card";

import CreateTripStepForm from "@/components/Forms/TripStepCreate";
import OptimizeForm from "@/components/Forms/OptimizeForm";

import TripStepCard from "@/components/Cards/TripStepCard";

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
    { id: 'travel', icon: Car, title: 'Transport' },
    { id: 'accommodation', icon: Bed, title: 'Accommodation' },
    { id: 'itinerary', icon: Calendar, title: 'Itinerary' },
    { id: 'costs', icon: DollarSign, title: 'Costs' },
    { id: 'people', icon: Users, title: 'People' },
];



interface TripPlannerProps {
    data: object;
}

export default function TripPlanner({data}:  TripPlannerProps    ) {


    const [activeSection, setActiveSection] = useState('home');
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [isItinerary, setIsItinerary] = useState(true);
    const [showCreateStep, setShowCreateStep] = useState(false);
    const [showOptimize, setShowOptimize] = useState(false);

    const scrollToSection = (sectionId: string) => {
        setActiveSection(sectionId);
        sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
    };



    const handleAttachmentClick = () => {

    };

    const filterStepsByType = (type) => {
        return data.step_groups
            .flatMap((group) => group.steps)
            .filter((step) => step.type === type);
    };

    const renderItinerary = () => {
        if (isItinerary) {

            const stepsByDay = data.step_groups.flatMap((group) => group.steps).reduce((acc, step) => {
                const day = new Date(step.start).toISOString().split('T')[0];
                if (!acc[day]) acc[day] = [];
                acc[day].push(step);
                return acc;
            }, {});

            return (

                <div className="space-y-4 px-4">

                    {Object.entries(stepsByDay).map(([day, steps]) => (

                        <div key={day} className="space-y-4 px-4">
                            <h3 className="text-lg font-bold">{day}</h3>
                            {steps.map((step, index) => (
                                <TripStepCard
                                    key={index}
                                    title={step.name}
                                    description={step.notes}
                                    date={day}
                                    time={new Date(step.start).toLocaleTimeString()}
                                    location={step.end_location == null ? step.start_location : {"from": step.start_location, "to": step.end_location  }}
                                    price={`${step.cost} ${step.currency}`}
                                    duration={`${Math.round((new Date(step.end) - new Date(step.start)) / 3600000)} hours`}
                                    distance={`${Math.round(step.distance / 1000)} km`}
                                    onAttachmentClick={() => console.log(`Attachment clicked for ${step.name}`)}
                                />
                            ))}

                        </div>
                    ))
                    }
                    <MainButton label="Add step" onclick={()=>setShowCreateStep(true)}/>
                    <MainButton label="Optimize" onclick={()=>setShowOptimize(true)} />
                    {showCreateStep && (

                        <CreateTripStepForm onClose={() =>setShowCreateStep(false)} buttonText={"Add step"} trip_id={data.id}/>
                    )}
                    {showOptimize && (<OptimizeForm onClose={() => setShowOptimize(false)}  />)}

                </div>
            )
        } else {

            return (
                <div className="space-y-4 px-4">
                    {data.step_groups.map((group, index) => (
                        <div key={index} className="space-y-2 px-2">
                            <h3 className="text-lg font-bold mt-4 px-4">{group.region}</h3>
                            {group.steps.map((step, stepIndex) => (
                                <TripStepCard
                                    key={stepIndex}
                                    title={step.name}
                                    description={step.notes}
                                    date={new Date(step.start).toLocaleDateString()}
                                    time={new Date(step.start).toLocaleTimeString()}
                                    location={step.end_location == null ? step.start_location : {"from": step.start_location, "to": step.end_location  }}
                                    price={`${step.cost} ${step.currency}`}
                                    duration={`${Math.round((new Date(step.end) - new Date(step.start)) / 3600000)} hours`}
                                    distance={`${step.distance / 1000} km`}
                                    onAttachmentClick={() => console.log(`Attachment clicked for ${step.name}`)}
                                />
                            ))}

                        </div>
                    ))
                    }

                    <MainButton label="Add step" onclick={()=>setShowCreateStep(true)}/>
                    <MainButton label="Optimize" onclick={()=>setShowOptimize(true)} />
                    {showCreateStep && (

                        <CreateTripStepForm onClose={() =>setShowCreateStep(false)} buttonText={"Add step"} trip_id={data.id}/>
                    )}
                    {showOptimize && (<OptimizeForm onClose={() => setShowOptimize(false)}  />)}
                </div>
            )
        }
    };

    const NavButtons = useCallback(() => (
        <>
            {sections.map(({ id, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`p-2 rounded-full transition-colors duration-300 ${
                        activeSection === id
                            ? 'bg-indigo-700 text-white shadow-lg'
                            : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label={`Navigate to ${id} section`}
                >
                    <Icon size={24} />
                </button>
            ))}
        </>
    ), [activeSection, scrollToSection]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0,
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        Object.entries(sectionRefs.current).forEach(([id, ref]) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            Object.values(sectionRefs.current).forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);


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
                        <NavButtons/>
                    </nav>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">

                        {sections.map(({id, title}, index) => (
                            <React.Fragment key={id}>

                                <div ref={(el: HTMLDivElement | null) => {
                                    sectionRefs.current[id] = el;
                                }} className="mb-8 " id={id}>
                                    {id != 'home' && (<h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>)}

                                    {id === 'home' && (
                                        <Card
                                            title={data.name}
                                            id={data.id}
                                            type="trip"
                                            description={data.description}
                                            picture={data.trip_picture}
                                            start_date={data.start_date}
                                            end_date={data.end_date}
                                        />
                                    )}

                                    {id === 'travel' && (
                                        <div className="space-y-4 px-4">
                                            {filterStepsByType('travel').map((step, stepIndex) => (
                                                <TripStepCard
                                                    key={stepIndex}
                                                    title={step.name}
                                                    description={step.notes}
                                                    date={new Date(step.start).toLocaleDateString()}
                                                    time={new Date(step.start).toLocaleTimeString()}
                                                    location={step.start_location}
                                                    price={`${step.cost} ${step.currency}`}
                                                    duration={`${Math.round((new Date(step.end) - new Date(step.start)) / 3600000)} hours`}
                                                    distance={`${step.distance / 1000} km`}
                                                    onAttachmentClick={() => console.log(`Attachment clicked for ${step.name}`)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {id === 'accommodation' && (
                                        <div className="space-y-4 px-4">
                                            {filterStepsByType('accommodation').map((step, stepIndex) => (
                                                <TripStepCard
                                                    key={stepIndex}
                                                    title={step.name}
                                                    description={step.notes}
                                                    date={new Date(step.start).toLocaleDateString()}
                                                    time={new Date(step.start).toLocaleTimeString()}
                                                    location={step.start_location}
                                                    price={`${step.cost} ${step.currency}`}
                                                    duration={`${Math.round((new Date(step.end) - new Date(step.start)) / 3600000)} hours`}
                                                    distance={`${step.distance / 1000} km`}
                                                    onAttachmentClick={() => console.log(`Attachment clicked for ${step.name}`)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {id === 'itinerary' && (
                                        <div className="flex justify-center space-x-2 mb-4 px-4">
                                            <button
                                                className={`flex-1 px-4 py-2 rounded-md transition-colors duration-200 ${
                                                    !isItinerary ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                                onClick={() => setIsItinerary(false)}
                                            >
                                                Region View
                                            </button>
                                            <button
                                                className={`flex-1 px-4 py-2 rounded-md transition-colors duration-200 ${
                                                    isItinerary ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                                onClick={() => setIsItinerary(true)}
                                            >
                                                Day View
                                            </button>
                                        </div>
                                    )}

                                    {id === 'itinerary' && renderItinerary()}

                                    {id === 'costs' && (
                                        <div className="space-y-4 px-4">
                                            <p>Total
                                                Cost: {data.step_groups.flatMap((group) => group.steps).reduce((acc, step) => acc + step.cost, 0)} USD</p>
                                        </div>
                                    )}
                                    {id === 'people' && (
                                        <div className="space-y-4 px-4">
                                            <MainButton label={"Invite"}/>
                                        </div>
                                    )}
                                </div>

                                {index < sections.length - 1 &&
                                    <div className="h-px bg-gray-200 mx-4 my-8" aria-hidden="true"/>}
                            </React.Fragment>
                        ))}
                    </div>

                </div>

            </div>
        </>
    );
};

