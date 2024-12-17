"use client";

import React, { useState, useRef } from "react";
import { GoogleMap, Marker, Polyline, InfoWindow } from "@react-google-maps/api";

interface BusData {
  number: string;
  name: string;
  status: string;
  latitude?: number; // Optional latitude
  longitude?: number; // Optional longitude
  time: string;
  speed: number;
  dispatchStatus: string; // 'idle', 'on alley', or 'on road'
}

interface DispatchMapProps {
  busData: BusData[];
  pathData: { lat: number; lng: number }[];
  onBusClick: (busNumber: string) => void;
  selectedBus?: string | null;
}

const staticLocations = [
  { id: 1, title: "Canitoan", coordinate: { lat: 8.4663228, lng: 124.5853069 } },
  { id: 2, title: "Silver Creek", coordinate: { lat: 8.475946, lng: 124.6120194 } },
  { id: 3, title: "Cogon", coordinate: { lat: 8.4759094, lng: 124.6514315 } },
];

const mapContainerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "10px",
};

const defaultMapCenter = { lat: 8.48325558794408, lng: 124.5866112118501 };

const getIconUrl = (status: string) => {
  switch (status) {
    case "on alley":
      return "/bus_on_alley.png";
    case "on road":
      return "/bus_on_road.png";
    default:
      return "/bus_idle.png";
  }
};

const DispatchMap: React.FC<DispatchMapProps> = ({
  busData,
  pathData,
  onBusClick,
  selectedBus,
}) => {
  const [zoomLevel, setZoomLevel] = useState(13);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    map.addListener("zoom_changed", () => {
      const currentZoom = map.getZoom() || 13;
      setZoomLevel(currentZoom);
    });
  };

  return (
    <div className="relative w-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultMapCenter}
        zoom={zoomLevel}
        onLoad={handleMapLoad}
      >
        {/* Polyline for path */}
        {pathData.length > 0 && (
          <Polyline
            path={pathData}
            options={{ strokeColor: "blue", strokeWeight: 4 }}
          />
        )}

        {/* Bus Markers */}
        {busData.map((bus) => {
          // Ensure latitude and longitude exist before rendering
          if (bus.latitude === undefined || bus.longitude === undefined) return null;

          return (
            <Marker
              key={bus.number}
              position={{ lat: bus.latitude, lng: bus.longitude }}
              icon={{
                url: getIconUrl(bus.dispatchStatus),
                scaledSize: new window.google.maps.Size(50, 75),
              }}
              onClick={() => onBusClick(bus.number)}
            >
              {selectedBus === bus.number && (
                <InfoWindow position={{ lat: bus.latitude, lng: bus.longitude }}>
                  <div>
                    <strong>Bus {bus.number}</strong>
                    <br />
                    Status: {bus.status}
                    <br />
                    Latitude: {bus.latitude.toFixed(6)}
                    <br />
                    Longitude: {bus.longitude.toFixed(6)}
                    <br />
                    Time: {bus.time}
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}

        {/* Static Location Markers */}
        {staticLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinate}
            icon={{
              url: `/${location.title.toLowerCase().replace(" ", "_")}.png`,
              scaledSize: new window.google.maps.Size(50, 50),
            }}
            title={location.title}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default DispatchMap;
