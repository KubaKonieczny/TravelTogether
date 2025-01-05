import {Edit, Paperclip, Trash2} from 'lucide-react'
import MainButton from "@/components/Buttons/MainButton";
import DeleteButton from "@/components/Buttons/DeleteButton";

interface ReusableTripStepCardProps {
    title: string
    description: string
    date: string
    time: string
    location: string | { from: string; to: string }
    price: string
    duration: string
    distance: string
    onAttachmentClick: () => void
    onEdit: () => void;
    onDelete: () => void;
}

export default function  TripStepCard({title, description, date, time, location, price, duration, distance, onAttachmentClick, onEdit, onDelete}:ReusableTripStepCardProps)  {
    return (
        <div className="flex w-full max-w-2xl aspect-[7/3] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="flex flex-col flex-grow p-4 w-2/3">
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <div className="h-px bg-gray-200 mb-2" />
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
                <div className="flex justify-between items-center text-xs mt-4 pt-2">
                    <div>
                        <span className="font-medium">{price}</span>
                    </div>
                    <div>
                        <span className="font-medium">{duration}</span>
                    </div>
                    <div>
                        <span className="font-medium">{distance}</span>
                    </div>
                    <div>
                        <button
                            onClick={onAttachmentClick}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                            aria-label="Attachments"
                        >
                            <Paperclip size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-1/3 border-l border-gray-200 p-4 flex flex-col justify-between items-center bg-gray-50">
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-800">{date}</p>
                    <p className="text-sm text-gray-600">{time}</p>
                    {typeof location === 'string' ? (
                        <p className="text-sm text-gray-600 text-center mt-2">{location}</p>
                    ) : (
                        <div className="text-sm text-gray-600 text-center mt-2">
                            <p>{location.from}</p>
                            <p>↓</p>
                            <p>{location.to}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between w-full mt-4 space-x-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center justify-center px-3 py-1.5 bg-indigo-100 text-indigo-700 font-medium text-sm rounded hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                        aria-label="Edit"
                    >
                        <Edit size={16} className="mr-1"/>
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex items-center justify-center px-3 py-1.5 bg-red-100 text-red-700 font-medium text-sm rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                        aria-label="Delete"
                    >
                        <Trash2 size={16} className="mr-1"/>
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};



