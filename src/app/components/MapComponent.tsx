import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapComponentProps {
  busData: any[];
  pathData: [number, number][];
  onBusClick: (busNumber: string) => void;
  selectedBus: string | null;
}

// Custom Marker Icon for buses
const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

const MapComponent: React.FC<MapComponentProps> = ({ busData, pathData, onBusClick, selectedBus }) => {
  return (
    <MapContainer
      key={selectedBus || "default"}
      center={[8.48325558794408, 124.5866112118501]}
      zoom={13}
      style={{ height: "450px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {pathData.length > 0 && <Polyline positions={pathData} color="blue" weight={4} />}
      {busData.map((bus) => (
        <Marker
          key={bus.number}
          position={[bus.latitude, bus.longitude]}
          icon={busIcon}
          eventHandlers={{
            click: () => onBusClick(bus.number),
          }}
        >
          <Popup>
            <div>
              <strong>Bus {bus.number}</strong>
              <br />
              Status: {bus.status}
              <br />
              Lat: {bus.latitude}, Lon: {bus.longitude}
              <br />
              Time: {bus.time}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
