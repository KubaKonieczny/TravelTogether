"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface GoogleMapsAutocompleteProps {
    apiKey: string
}

export default function GoogleMapsAutocomplete({ apiKey }: GoogleMapsAutocompleteProps) {
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

    useEffect(() => {
        const loader = new Loader({
            apiKey,
            version: "weekly",
            libraries: ["places"]
        })

        loader.load().then(() => {
            if (inputRef.current) {
                autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
                    types: ['address'],
                    fields: ['formatted_address', 'geometry']
                })

                autocompleteRef.current.addListener('place_changed', () => {
                    const place = autocompleteRef.current?.getPlace()
                    if (place?.formatted_address) {
                        setInputValue(place.formatted_address)
                    }
                })
            }
        }).catch((error) => {
            console.error("Error loading Google Maps API:", error)
        })
    }, [apiKey])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    return (
        <div className="relative w-full max-w-md">
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter an address"
            />
        </div>
    )
}