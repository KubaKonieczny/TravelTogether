

import React, {useState, useEffect, useRef, useActionState} from "react";

import { useMap, useMapsLibrary} from "@vis.gl/react-google-maps";

import axios from "axios";
import {createStep} from "@/hooks/createStep";

interface Place {
    name: string;
    geometry: {
        location: google.maps.LatLng;
    };
    formatted_address?: string;
    rating?: number;
    user_ratings_total?: number;
    opening_hours?: {
        weekday_text: string[];
        open_now: boolean;
    };
    website?: string;
    photos?: google.maps.places.PlacePhoto[];
}


export default function CreateStepForm({ onClose, buttonText, trip_id }: {
    onClose: () => void;
    buttonText: string;
    trip_id:string;
}) {

    const [state, formAction] = useActionState(createStep, {
        success: false,
        message: '',
        data: {}
    })

    const map = useMap();
    const placesLib = useMapsLibrary('places');
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

    const handleSearchBox = (searchBox: google.maps.places.SearchBox) => {
        if (!map) return;

        const placesListener = searchBox.addListener('places_changed', () => {
            const results = searchBox.getPlaces();

            if (!results || results.length === 0) return;

            setPlaces(results as Place[]);
            setSelectedPlace(null);
        });

        return () => {
            placesListener?.remove();
        };
    };

    const [regions, setRegion] = useState([]);
    const [newRegion, setNewRegion] = useState("");
    const [creatingRegion, setCreatingStepGroup] = useState(false);
    const [stepType, setStepType] = useState("place");


    console.log(regions)

    useEffect(() => {
        axios.get(process.env.NEXT_PUBLIC_HOST + "trips/"+trip_id+"/step_groups/",
            {
                withCredentials:true
            })

            .then((response) => setRegion(response.data))
            .catch((err) => console.error("Failed to fetch step groups:", err));
    }, []);

    // Handle creation of new step group
    const handleCreateStepGroup = () => {
        if (!newRegion) return;
        setCreatingStepGroup(true);

        axios.post(process.env.NEXT_PUBLIC_HOST +"trips/"+trip_id+"/create_step_groups/",
            {region: newRegion} , {
                withCredentials:true
            }
        )
            .then((response) => {
                setRegion([...regions, response.data]);
                setNewRegion("");
            })
            .catch((err) => console.error("Failed to create step group:", err))
            .finally(() => setCreatingStepGroup(false));
    };


    return (

        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-start md:justify-center items-center p-4 z-50"
        >
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:ml-4 md:self-start md:mt-20"
                style={{left: 0}}
            >
                <h2 className="text-xl font-bold mb-4">{buttonText}</h2>
                <form className="space-y-4" action={formAction}>  {/*{action={formAction} }*/}
                    {/* Step Group Selector */}
                    <div className="space-y-2">
                        <label htmlFor="step_group" className="block text-sm font-medium text-gray-700">
                            Region
                        </label>
                        <select
                            id="step_group"
                            name="step_group"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {regions.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.region}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center mt-2">
                            <input
                                type="text"
                                value={newRegion}
                                onChange={(e)=>null}
                                placeholder="New Region"
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                onFocus={(e) => {
                                    if (!placesLib || !map) return;
                                    const searchBox = new placesLib.SearchBox(e.target);
                                    setNewRegion(e.target.value)
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleCreateStepGroup}
                                disabled={creatingRegion}
                                className="ml-2 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Step Details */}
                    <div className="space-y-2">
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Step Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={stepType}
                            onChange={(e) => setStepType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="place">Place</option>
                            <option value="travel">Travel</option>
                            <option value="accommodation">Accommodation</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                           Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                id="start"
                                name="start"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                id="end"
                                name="end"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>


                    {stepType === "travel" ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="start_location" className="block text-sm font-medium text-gray-700">
                                    Start Location
                                </label>
                                <input
                                    type="text"
                                    id="start_location"
                                    name="start_location"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    onFocus={(e) => {
                                        if (!placesLib || !map) return;
                                        const searchBox = new placesLib.SearchBox(e.target);
                                        handleSearchBox(searchBox);
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="end_location" className="block text-sm font-medium text-gray-700">
                                    End Location
                                </label>
                                <input
                                    type="text"
                                    id="end_location"
                                    name="end_location"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    onFocus={(e) => {
                                        if (!placesLib || !map) return;
                                        const searchBox = new placesLib.SearchBox(e.target);
                                        handleSearchBox(searchBox);
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label
                                htmlFor="start_location"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Location
                            </label>
                            <input
                                type="text"
                                id="start_location"
                                name="start_location"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                onFocus={(e) => {
                                    if (!placesLib || !map) return;
                                    const searchBox = new placesLib.SearchBox(e.target);
                                    handleSearchBox(searchBox);
                                }}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
                                Cost
                            </label>
                            <input
                                type="number"
                                id="cost"
                                name="cost"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                Currency
                            </label>
                            <input
                                type="text"
                                id="currency"
                                name="currency"
                                maxLength={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                            Attachment
                        </label>
                        <input
                            type="file"
                            id="attachment"
                            name="attachment"
                            className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-purple-50 file:text-purple-700
                  hover:file:bg-purple-100"/>
                    </div>
                    {/* Form Actions */}
                    <div className="flex justify-between pt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800"
                        >
                            {buttonText}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>


            </div>

        </div>

    );
}


