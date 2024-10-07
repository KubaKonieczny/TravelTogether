import {GoogleMap, LoadScript} from "@react-google-maps/api";
import React from "react";

const mapContainerStyle = {
    width: '100%',
    height: '100%'
}

const center = {
    lat: 0,
    lng: 0
}


const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function Map(){
    console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={3}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                }}
            >
            </GoogleMap>
        </LoadScript>
    );
}