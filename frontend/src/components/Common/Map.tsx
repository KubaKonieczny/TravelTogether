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




export default function Map(){


    return (

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={3}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
            </GoogleMap>

    );
}