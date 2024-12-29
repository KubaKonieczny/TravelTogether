// import React, { useEffect, useState } from 'react';
// import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
//
//
// import MainButton from "@/components/LandingPage/MainButton";
// import {Input} from "postcss";
//
//
// interface Location {
//     lat: number;
//     lng: number;
// }
//
// interface MapProps {
//     apiKey: string;
//     initialCenter?: Location;
// }
//
// export default function MapWithSearch({
//                                           apiKey,
//                                           initialCenter = { lat: 51.5074, lng: -0.1278 }
//                                       }: MapProps) {
//     const [marker, setMarker] = useState<Location | null>(null);
//     const [placeName, setPlaceName] = useState('');
//
//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             const searchInput = document.getElementById('search') as HTMLInputElement;
//             const searchBox = new google.maps.places.SearchBox(searchInput);
//
//             searchBox.addListener('places_changed', () => {
//                 const places = searchBox.getPlaces();
//                 if (!places || places.length === 0) return;
//
//                 const place = places[0];
//                 if (!place.geometry?.location) return;
//
//                 setMarker({
//                     lat: place.geometry.location.lat(),
//                     lng: place.geometry.location.lng()
//                 });
//                 setPlaceName(place.formatted_address || place.name || '');
//             });
//
//             return () => {
//                 google.maps.event.clearInstanceListeners(searchBox);
//             };
//         }
//     }, []);
//
//     return (
//         <div className="p-4 w-full max-w-4xl mx-auto">
//             <input
//                 id="search"
//                 placeholder="Search for a place..."
//                 className="mb-4"
//             />
//
//             <APIProvider apiKey={apiKey} libraries={['places']}>
//                 <div className="h-96 w-full rounded-lg overflow-hidden">
//                     <Map
//                         defaultCenter={initialCenter}
//                         defaultZoom={13}
//                         gestureHandling="cooperative"
//                     >
//                         {marker && <Marker position={marker} />}
//                     </Map>
//                 </div>
//             </APIProvider>
//
//             {marker && (
//                 <MainButton label={'Convert to String'}
//
//                     onclick={() => {
//                         const placeData = {
//                             address: placeName,
//                             location: marker
//                         };
//                         console.log(JSON.stringify(placeData));
//                     }}
//                 />
//
//             )}
//         </div>
//
//     );
// }


// 'use client'
//
// import {useState, useCallback, useEffect} from 'react'
// import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
// import { Input } from '@/components/ui/input'
// import { Card } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
//
// // Define the Place type
// interface Place {
//     lat: number
//     lng: number
//     formatted_address: string
// }
//
// export default function MapWithSearch() {
//     const [place, setPlace] = useState<Place | null>(null)
//     const [searchInput, setSearchInput] = useState('')
//
//     // // Initialize the autocomplete service
//     // const initAutocomplete = useCallback((input: HTMLInputElement) => {
//     //     if (!input || !window.google) return
//     //
//     //     const autocomplete = new google.maps.places.Autocomplete(input, {
//     //         fields: ['geometry', 'formatted_address'],
//     //     })
//     //
//     //     autocomplete.addListener('place_changed', () => {
//     //         const result = autocomplete.getPlace()
//     //         if (result.geometry && result.geometry.location) {
//     //             setPlace({
//     //                 lat: result.geometry.location.lat(),
//     //                 lng: result.geometry.location.lng(),
//     //                 formatted_address: result.formatted_address || '',
//     //             })
//     //         }
//     //     })
//     // }, [])
//
//     const initAutocomplete = useCallback(() => {
//         if (!inputRef.current || !window.google) return;
//
//         const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
//             fields: ['geometry', 'formatted_address'],
//         });
//
//         autocomplete.addListener('place_changed', () => {
//             const result = autocomplete.getPlace();
//             if (!result.geometry || !result.formatted_address) {
//                 console.error('Invalid place selected:', result);
//                 return;
//             }
//
//             setPlace({
//                 lat: result.geometry.location.lat(),
//                 lng: result.geometry.location.lng(),
//                 formatted_address: result.formatted_address,
//             });
//         });
//     }, []);
//
//
//
//     useEffect(() => {
//         initAutocomplete();
//     }, [initAutocomplete]);
//
//     const handleGetPlaceString = () => {
//         if (place) {
//             const placeString = JSON.stringify(place)
//             console.log('Place as string:', placeString)
//             alert(`Place data: ${placeString}`)
//         }
//     }
//
//     const handleInputRef = (input: HTMLInputElement | null) => {
//         if (input && window.google && !input.dataset.autocompleteInitialized) {
//             initAutocomplete(input);
//             input.dataset.autocompleteInitialized = "true";
//         }
//         inputRef.current = input;
//     };
//
//     return (
//         <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
//             <div className="p-4">
//                 <div className="mb-4">
//                     <input
//                         type="text"
//                         placeholder="Search for a place..."
//                         value={searchInput}
//                         onChange={(e) => setSearchInput(e.target.value)}
//                         ref={handleInputRef}
//                     />
//                 </div>
//                 <div className="w-full h-[500px] rounded-lg overflow-hidden">
//                     <Map
//                         zoom={place ? 15 : 2}
//                         center={place ? { lat: place.lat, lng: place.lng } : { lat: 0, lng: 0 }}
//                         gestureHandling="greedy"
//                         mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
//                     >
//                         {place && (
//                             <AdvancedMarker position={{ lat: place.lat, lng: place.lng }}>
//                                 <div className="bg-white p-3 rounded-lg shadow-lg min-w-[200px]">
//                                     <p className="text-sm font-medium mb-2">{place.formatted_address}</p>
//                                     <p className="text-xs text-gray-500 mb-2">
//                                         Lat: {place.lat.toFixed(6)}, Lng: {place.lng.toFixed(6)}
//                                     </p>
//                                     <button
//                                         // size="sm"
//                                         className="w-full"
//                                         onClick={handleGetPlaceString}
//                                     >
//                                         Get Place String
//                                     </button>
//                                 </div>
//                             </AdvancedMarker>
//                         )}
//                     </Map>
//                 </div>
//             </div>
//         </APIProvider>
//     )
// }

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {APIProvider, Map, AdvancedMarker, useMapsLibrary, Marker, useMap, InfoWindow} from '@vis.gl/react-google-maps';

//
// // Define the Place type
// interface Place {
//     lat: number;
//     lng: number;
//     formatted_address: string;
// }
//
// interface Props {
//     onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
// }
//
// const [place, setPlace] = useState<Place | null>(null);
// const [searchInput, setSearchInput] = useState('');
// const inputRef = useRef<HTMLInputElement | null>(null);
//
// const [placeAutocomplete, setPlaceAutocomplete] = useState<Node | null>(null);
// const containerRef = useRef<HTMLDivElement>(null);
// const places = useMapsLibrary('places');
//
// // Initialize the autocomplete service
// useEffect(() => {
//     if (!places) return;
//     // @ts-expect-error Using an alpha feature here. The types are not up to date yet
//     setPlaceAutocomplete(new places.PlaceAutocompleteElement());
// }, [places]);
//
// // useEffect(() => {
// //     if (!placeAutocomplete) return;
// //
// //     placeAutocomplete.addEventListener(
// //         'gmp-placeselect',
// //         // @ts-expect-error This new event has no types yet
// //         async ({place}: {place: google.maps.places.Place}) => {
// //             await place.fetchFields({
// //                 fields: ['displayName', 'formattedAddress', 'location', 'viewport']
// //             });
// //
// //             onPlaceSelect(place.toJSON());
// //         }
// //     );
// //
// //     containerRef.current?.appendChild(placeAutocomplete);
// // }, [onPlaceSelect, placeAutocomplete]);
//
// // useEffect(() => {
// //     initAutocomplete();
// // }, [initAutocomplete]);
//
// const handleGetPlaceString = () => {
//     if (place) {
//         const placeString = JSON.stringify(place);
//         console.log('Place as string:', placeString);
//         alert(`Place data: ${placeString}`);
//     }
// };
// const [selectedAutocompleteMode, setSelectedAutocompleteMode] =
//     useState<AutocompleteMode>(autocompleteModes[0]);
//
// const [selectedPlace, setSelectedPlace] =
//     useState<google.maps.places.PlaceResult | null>(null);


// const MyComponent: React.FC = () => {
//     const map = useMap();
//     const placesLib = useMapsLibrary('places');
//     const inputRef = useRef<HTMLInputElement | null>(null);
//
//     useEffect(() => {
//         if (!placesLib || !map || !inputRef.current) return;
//
//         // Create the SearchBox
//         const searchBox = new placesLib.SearchBox(inputRef.current);
//
//         // Bias the SearchBox results towards the map's viewport
//         const boundsListener = map.addListener('bounds_changed', () => {
//             const bounds = map.getBounds();
//             if (bounds) searchBox.setBounds(bounds);
//         });
//
//         // Listen for places changed event
//         const placesListener = searchBox.addListener('places_changed', () => {
//             const places = searchBox.getPlaces();
//
//             if (!places || places.length === 0) return;
//
//             // Clear existing markers
//             const markers: google.maps.Marker[] = [];
//             for (const place of places) {
//                 if (!place.geometry || !place.geometry.location) continue;
//
//                 // Create a marker for each place
//                 const marker = new google.maps.Marker({
//                     map,
//                     position: place.geometry.location,
//                     title: place.name,
//                 });
//                 markers.push(marker);
//             }
//
//             // Adjust the map bounds to include the new markers
//             const bounds = new google.maps.LatLngBounds();
//             for (const place of places) {
//                 if (place.geometry?.location) {
//                     bounds.extend(place.geometry.location);
//                 }
//             }
//             map.fitBounds(bounds);
//         });
//
//         // Cleanup listeners when the component unmounts
//         return () => {
//             boundsListener?.remove();
//             placesListener?.remove();
//         };
//     }, [placesLib, map]);
//
//     return (
//         <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
//             <input
//                 ref={inputRef}
//                 type="text"
//                 placeholder="Search for places..."
//                 style={{
//                     width: '300px',
//                     padding: '10px',
//                     fontSize: '14px',
//                     borderRadius: '4px',
//                     border: '1px solid #ccc',
//                 }}
//             />
//         </div>
//     );
// };



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

const MyComponent: React.FC = () => {
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
        console.log('Adding to trip:', place.name);
        // Implement your add to trip logic here
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

export default function MapWithSearch() {


    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>

            <Map
                defaultZoom={3}
                defaultCenter={{lat: 22.54992, lng: 0}}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId = {process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
            >
                <MyComponent />
            </Map>
        </APIProvider>
//         <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
//             <div className="p-4">
//                 <div className="mb-4">
//                     <input
//                         type="text"
//                         placeholder="Search for a place..."
//                         value={searchInput}
//                         onChange={(e) => setSearchInput(e.target.value)}
//                         // ref={(input) => {
//                         //     if (input && window.google) initAutocomplete(input)
//                         // }}
//                     />
//                 </div>
//                 <div className="w-full h-[500px] mb-4 rounded-lg overflow-hidden">
//                     <Map
//                         zoom={place ? 15 : 2}
//                         center={place ? { lat: place.lat, lng: place.lng } : { lat: 0, lng: 0 }}
//                         gestureHandling="greedy"
//                     >
//                         {place && (
//                             <Marker
//                                 position={{ lat: place.lat, lng: place.lng }}
//                             />
//                         )}
//                     </Map>
//                 </div>
//                 <button
//                     onClick={handleGetPlaceString}
//                     disabled={!place}
//                     className="w-full"
//                 >
//                     Get Place as String
//                 </button>
//             </div>
//
// </APIProvider>
    )
}
