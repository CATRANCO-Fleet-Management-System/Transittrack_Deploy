'use client';

// Import necessary components from @react-google-maps/api
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";

interface MapComponentProps {
  busData: {
    number: string;
    latitude: number;
    longitude: number;
    name: string;
    status: string;
    time: string;
    dispatchStatus: string; // 'idle', 'on alley', 'on road'
  }[];
  pathData: { lat: number; lng: number }[];
  onBusClick: (busNumber: string) => void;
  selectedBus: string | null;
  staticLocations?: {
    id: number;
    title: string;
    coordinate: { lat: number; lng: number };
  }[];
}

// Styling for the map container
const defaultMapContainerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "15px",
};

// Default map center coordinates
const defaultMapCenter = {
  lat: 8.48325558794408,
  lng: 124.5866112118501,
};

// Default zoom level
const defaultMapZoom = 13;

// Map options
const defaultMapOptions = {
  zoomControl: true,
  tilt: 0,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};

// Dynamic icon URLs based on dispatch status
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

const MapComponent: React.FC<MapComponentProps> = ({
  busData,
  pathData,
  onBusClick,
  selectedBus,
  staticLocations = [],
}) => {
  return (
    <div className="w-full">
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={defaultMapCenter}
        zoom={defaultMapZoom}
        options={defaultMapOptions}
      >
        {/* Render polyline for the selected bus's path */}
        {pathData.length > 0 && (
          <Polyline
            path={pathData}
            options={{
              strokeColor: "blue",
              strokeWeight: 4,
            }}
          />
        )}

        {/* Render markers for all buses */}
        {busData.map((bus) => (
          <Marker
            key={bus.number}
            position={{
              lat: bus.latitude,
              lng: bus.longitude,
            }}
            icon={{
              url: getIconUrl(bus.dispatchStatus),
              scaledSize: new window.google.maps.Size(30, 40),
            }}
            onClick={() => onBusClick(bus.number)}
            title={`Bus ${bus.name} - ${bus.status}`}
          />
        ))}

        {/* Render static location markers */}
        {staticLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.coordinate}
            icon={{
              url: `/${location.title.toLowerCase().replace(" ", "_")}.png`,
              scaledSize: new window.google.maps.Size(30, 40),
            }}
            title={location.title}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
