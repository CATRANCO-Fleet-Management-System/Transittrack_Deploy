"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import DispatchMap from "../components/DispatchMap";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import { FaBus } from "react-icons/fa";
import { getAllVehicleAssignments } from "@/app/services/vehicleAssignService";
import DispatchService from "@/app/services/dispatchService";
import { MapProvider } from "@/providers/MapProvider";

interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string;
  speed: number;
  dispatchStatus: string; // 'idle', 'on alley', or 'on road'
  route: string | null;
}

const DispatchMonitoring: React.FC = () => {
  const [busData, setBusData] = useState<BusData[]>([]);
  const [pathData, setPathData] = useState<{ lat: number; lng: number }[]>([]);
  const [trackerToVehicleMap, setTrackerToVehicleMap] = useState<{
    [trackerId: string]: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  // Create or Update Bus Data
  const updateOrAddBus = (
    vehicle_id: string,
    location: any,
    dispatch_log: any,
    timestamp: number
  ) => {
    const vehicleId = trackerToVehicleMap[vehicle_id] || vehicle_id; // Map tracker to vehicle
  
    setBusData((prevData) => {
      const formattedTime =
        timestamp && !isNaN(timestamp) // Check if timestamp is valid
          ? new Date(timestamp * 1000).toISOString()
          : "Invalid Time";
  
      const existingBus = prevData.find((bus) => bus.number === vehicleId);
  
      if (existingBus) {
        // Update existing bus data
        return prevData.map((bus) =>
          bus.number === vehicleId
            ? {
                ...bus,
                latitude: location.latitude,
                longitude: location.longitude,
                speed: location.speed || 0,
                status: `Speed: ${location.speed || 0} km/h`, // Update speed as status
                time: formattedTime,
                dispatchStatus: dispatch_log?.status || bus.dispatchStatus, // Update status
                route: dispatch_log?.route || bus.route, // Update route
              }
            : bus
        );
      } else {
        // Add new bus data
        return [
          ...prevData,
          {
            number: vehicleId,
            name: `Bus ${vehicleId}`,
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed || 0,
            status: `Speed: ${location.speed || 0} km/h`,
            time: formattedTime,
            dispatchStatus: dispatch_log?.status || "idle", // Set dispatch status
            route: dispatch_log?.route || null, // Set route
          },
        ];
      }
    });
  };

  // Fetch Vehicle Assignments and Dispatch Data
  const fetchAssignmentsAndDispatches = async () => {
    try {
      setLoading(true);

      const [vehicleAssignments, dispatches] = await Promise.all([
        getAllVehicleAssignments(),
        DispatchService.getAllDispatches(),
      ]);

      // Map tracker_id to vehicle_id
      const trackerMap: { [trackerId: string]: string } = {};
      vehicleAssignments.forEach((assignment) => {
        if (assignment.vehicle.tracker_ident) {
          trackerMap[assignment.vehicle.tracker_ident] = assignment.vehicle.vehicle_id;
        }
      });
      setTrackerToVehicleMap(trackerMap);

      // Merge data for display
      const mergedData = vehicleAssignments.map((assignment) => {
        const dispatch = dispatches.find(
          (d) => d.vehicle_assignment_id === assignment.vehicle_assignment_id
        );

        return {
          number: assignment.vehicle.vehicle_id,
          name: `Bus ${assignment.vehicle.vehicle_id}`,
          latitude: dispatch?.latitude || assignment.vehicle.latitude,
          longitude: dispatch?.longitude || assignment.vehicle.longitude,
          speed: dispatch?.speed || 0,
          status: `Speed: ${dispatch?.speed || 0} km/h`,
          time: formattedTime,
          dispatchStatus: dispatch?.status || "idle",
          route: dispatch?.route || null,
        };
      });

      setBusData(mergedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Real-Time Updates via Pusher
  useEffect(() => {
    fetchAssignmentsAndDispatches();

    const echo = new Echo({
      broadcaster: "pusher",
      client: new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || undefined,
        wsPort: process.env.NEXT_PUBLIC_PUSHER_PORT
          ? parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT, 10)
          : undefined,
        wssPort: process.env.NEXT_PUBLIC_PUSHER_PORT
          ? parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT, 10)
          : 443,
        forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
        disableStats: true,
      }),
    });


    const channel = echo.channel("flespi-data");

    channel.listen("FlespiDataReceived", (event: any) => {
      const {vehicle_id, location, dispatch_log, timestamp } = event;
      console.log("Real-time Data Received:", event);


      const vehicleId = trackerToVehicleMap[vehicle_id] || vehicle_id;

      // Update or add bus data
      updateOrAddBus(vehicle_id, location, dispatch_log, timestamp);

      // Update path for the selected bus
      if (selectedBus === vehicleId) {
        setPathData((prev) => {
          // Avoid duplicating the last coordinate
          const lastCoordinate = prev[prev.length - 1];
          if (
            lastCoordinate &&
            lastCoordinate.lat === location.latitude &&
            lastCoordinate.lng === location.longitude
          ) {
            return prev; // Skip if location hasn't changed
          }
          return [...prev, { lat: location.latitude, lng: location.longitude }];
        });
      }
    });

    return () => {
      echo.leaveChannel("flespi-data");
    };
  }, [selectedBus]);

  // Button color based on dispatch status
  const getButtonColor = (dispatchStatus: string) => {
    switch (dispatchStatus) {
      case "on road":
        return "bg-green-500 text-white";
      case "on alley":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-300 text-black";
    }
  };

  return (
    <Layout>
      <Header title="Dispatch Monitoring" />
      <section className="p-4 flex flex-col items-center">
        <div className="w-5/6 flex flex-col h-full space-y-6">
          {/* Map Display */}
          <MapProvider>
            {loading ? (
              <div className="text-center mt-8">Loading map...</div>
            ) : (
              <DispatchMap
                busData={busData}
                pathData={pathData}
                onBusClick={(busNumber) => {
                  setSelectedBus(busNumber);
                  const clickedBus = busData.find((bus) => bus.number === busNumber);
                  if (clickedBus) {
                    setPathData([{ lat: clickedBus.latitude, lng: clickedBus.longitude }]);
                  }
                }}
                selectedBus={selectedBus}
              />
            )}
          </MapProvider>

          {/* Vehicle Buttons */}
          <div className="bus-info flex flex-wrap gap-4 justify-center">
            {busData.map((bus) => (
              <button
                key={bus.number}
                onClick={() => setSelectedBus(bus.number)}
                className={`w-64 p-4 rounded-lg flex items-center space-x-4 shadow-md ${getButtonColor(
                  bus.dispatchStatus
                )}`}
              >
                <FaBus size={30} />
                <div className="flex flex-col">
                  <span className="font-bold">Bus {bus.number}</span>
                  <span>Status: {bus.dispatchStatus}</span>
                  {bus.route && <span>Route: {bus.route}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DispatchMonitoring;
