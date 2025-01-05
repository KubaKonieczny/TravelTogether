'use client';

import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, useMapsLibrary, Pin, useMap, InfoWindow} from '@vis.gl/react-google-maps';
import {random} from "nanoid";


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

const SearchBox: React.FC = () => {
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

            const bounds = new google.maps.LatLngBounds();
            results.forEach(place => {
                if (place.geometry?.location) {
                    bounds.extend(place.geometry.location);
                }
            });
            map.fitBounds(bounds);
        });

        return () => {
            placesListener?.remove();
        };
    };

    const handleAddToTrip = (place: Place) => {

    };

    const getPhotoUrl = (place: Place) => {
        if (place.photos && place.photos.length > 0) {
            return place.photos[0].getUrl({ maxWidth: 300, maxHeight: 200 });
        }
        return null;
    };

    return (
        <>
            <div className="absolute top-4 left-4 z-10">
                <input
                    type="text"
                    placeholder="Search for places..."
                    className="w-64 px-4 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onFocus={(e) => {
                        if (!placesLib || !map) return;
                        const searchBox = new placesLib.SearchBox(e.target);
                        searchBox.bindTo('bounds', map);
                        handleSearchBox(searchBox);
                    }}
                />
            </div>

            {places.map((place, index) => (
                <AdvancedMarker
                    key={`${place.name}-${index}`}
                    position={place.geometry.location}
                    onClick={() => setSelectedPlace(place)}
                />
            ))}

            {selectedPlace && (
                <InfoWindow
                    position={selectedPlace.geometry.location}
                    onCloseClick={() => setSelectedPlace(null)}
                >
                    <div className="max-w-sm bg-white rounded-lg overflow-hidden shadow-lg">
                        {getPhotoUrl(selectedPlace) && (
                            <img
                                src={getPhotoUrl(selectedPlace)!}
                                alt={selectedPlace.name}
                                className="w-full h-40 object-cover"
                            />
                        )}
                        <div className="px-6 py-4">
                            <h3 className="font-bold text-xl mb-2">{selectedPlace.name}</h3>
                            {selectedPlace.rating && (
                                <p className="text-gray-700 text-base mb-2">
                                    {selectedPlace.rating.toFixed(1)} ⭐ ({selectedPlace.user_ratings_total} reviews)
                                </p>
                            )}
                            {selectedPlace.formatted_address && (
                                <p className="text-gray-700 text-sm mb-2">{selectedPlace.formatted_address}</p>
                            )}
                            {selectedPlace.opening_hours && (
                                <p className="text-gray-700 text-sm mb-2">
                                    {selectedPlace.opening_hours.weekday_text}
                                </p>
                            )}
                            {selectedPlace.website && (
                                <a
                                    href={selectedPlace.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-sm"
                                >
                                    Visit website
                                </a>
                            )}
                        </div>
                        <div className="px-6 pt-4 pb-2">
                            <button
                                onClick={() => handleAddToTrip(selectedPlace)}
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add to Trip
                            </button>
                        </div>
                    </div>
                </InfoWindow>
            )}
        </>
    );
};

interface Step {
    type: 'travel' | 'accommodation' | 'place';
    name: string;
    start: string;
    end: string;
    start_location: string;
    end_location: string;
    cost?: number;
    currency?: string;
    distance?: number;
    notes?: string;
    attachment?: string | null;
}

interface StepGroup {
    name: string;
    steps: Step[];
}

interface Itinerary {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    destination: string;
    step_groups: StepGroup[];
}

interface ItineraryMapProps {
    itinerary: Itinerary;
}

interface Coordinates {
    lat: number;
    lng: number;
}

const ItineraryMap: React.FC<ItineraryMapProps> = ({ itinerary }) => {
    const map = useMap();
    const colors = ['#FF5733', '#33A1FF', '#28B463', '#FFC300', '#C70039']; // Predefined colors for step groups
    const [coordinates, setCoordinates] = useState<Record<string, Coordinates>>({});

    const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
        const geocoder = new google.maps.Geocoder();
        try {
            const response = await geocoder.geocode({ address });
            if (response.results && response.results.length > 0) {
                const location = response.results[0].geometry.location;
                return { lat: location.lat(), lng: location.lng() };
            }
            console.warn(`Geocoding failed for address: ${address}`);
            return null;
        } catch (error) {
            console.error(`Error during geocoding: ${error}`);
            return null;
        }
    };

    useEffect(() => {
        const fetchCoordinates = async () => {
            const coordMap: Record<string, Coordinates> = {};
            for (const group of itinerary.step_groups) {
                for (const step of group.steps) {
                    if (!coordMap[step.start_location]) {

                        const startCoords = await geocodeAddress(step.start_location);
                        if (startCoords) coordMap[step.start_location] = startCoords;
                    }

                }
            }
            setCoordinates(coordMap);
        };

        fetchCoordinates();
    }, [itinerary]);

    return (
        <div key={99999}>
            {itinerary?.step_groups?.map((group, groupIndex) => {
                const groupColor = colors[groupIndex % colors.length];

                return (
                    <React.Fragment key={group.name+random(100)}>
                        {group.steps.map((step, stepIndex) => {
                            console.log(step)
                            const startCoords = coordinates[step.start_location];


                            if (!startCoords) return null;

                            if (step.type === 'place') {

                                return (
                                    <AdvancedMarker
                                        key={`${step.name}-${stepIndex}`}
                                        position={startCoords}

                                    >
                                        <Pin background = {groupColor}
                                             borderColor= {groupColor}
                                             glyph = {(groupIndex + 1).toString()}
                                             glyphColor={'white'}
                                             />
                                    </AdvancedMarker>
                                );
                            }
                             else if (step.type === 'accommodation') {
                                return (
                                    <AdvancedMarker
                                        key={`${step.name}-${stepIndex}`}
                                        position={startCoords}

                                    >
                                       <Pin background = {groupColor}
                                            borderColor= {groupColor}
                                             />
                                    </AdvancedMarker>
                                );
                            }
                            return null;
                        })}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

interface MapItineraryDataProps{
    itineraryData:Object;
}

export default function MapWithSearch({itineraryData} : MapItineraryDataProps) {

    return (


            <Map
                defaultZoom={3}
                defaultCenter={{lat: 22.54992, lng: 0}}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId = {process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
            >
                <SearchBox />
                <ItineraryMap itinerary={itineraryData} />
            </Map>

    )
}
