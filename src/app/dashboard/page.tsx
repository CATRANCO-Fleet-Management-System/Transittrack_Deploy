"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { FaBus, FaCog, FaUsers } from "react-icons/fa";
import { getAllVehicles } from "@/app/services/vehicleService";
import { getAllActiveMaintenanceScheduling } from "@/app/services/maintenanceService";
import { getAllProfiles } from "@/app/services/userProfile";
import { getAllVehicleAssignments } from "@/app/services/vehicleAssignService";
import { MapProvider } from "@/providers/MapProvider";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import MapComponent from "@/app/components/Map";


interface BusData {
  number: string;
  name: string;
  status: string;
  latitude: number;
  longitude: number;
  time: string;
  speed: number;
  driver: string;
  conductor: string;
  plateNumber: string;
  dispatchStatus: string;
  route: string;
}

const DashboardHeader: React.FC = () => {
  const [busesInOperation, setBusesInOperation] = useState(0);
  const [busesInMaintenance, setBusesInMaintenance] = useState(0);
  const [currentEmployees, setCurrentEmployees] = useState(0);
  const [busData, setBusData] = useState<BusData[]>([]);
  const [pathData, setPathData] = useState<{ lat: number; lng: number }[]>([]);
  const [selectedBusDetails, setSelectedBusDetails] = useState<BusData | null>(null);
  const [assignmentMap, setAssignmentMap] = useState<{ [key: string]: any }>({});

  // Fetch vehicle assignments and build a map
  const fetchAssignments = async () => {
    try {
      const vehicleAssignments = await getAllVehicleAssignments();
      const map = vehicleAssignments.reduce((acc, assignment) => {
        acc[assignment.vehicle.vehicle_id] = {
          driver: assignment.user_profiles.find((profile) => profile.position === "driver")?.name || "Unknown Driver",
          conductor:
            assignment.user_profiles.find((profile) => profile.position === "passenger_assistant_officer")?.name ||
            "Unknown Conductor",
          plateNumber: assignment.vehicle.plate_number || "Unknown Plate",
        };
        return acc;
      }, {});
      setAssignmentMap(map);
    } catch (error) {
      console.error("Error fetching vehicle assignments:", error);
    }
  };

  // Update or Add Bus Data
  const updateOrAddBus = (vehicleId: string, location: any, dispatchLog: any, timestamp: number) => {
    setBusData((prevData) => {
      const existingBus = prevData.find((bus) => bus.number === vehicleId);

      const formattedTime = timestamp ? new Date(timestamp * 1000).toISOString() : "Unknown Time";

      const assignment = dispatchLog?.vehicle_assignment || {};
      const driver = assignment.user_profiles?.find((p: any) => p.position === "driver")?.name || "Unknown Driver";
      const conductor =
        assignment.user_profiles?.find((p: any) => p.position === "passenger_assistant_officer")?.name ||
        "Unknown Conductor";

      if (existingBus) {
        return prevData.map((bus) =>
          bus.number === vehicleId
            ? {
                ...bus,
                latitude: location.latitude,
                longitude: location.longitude,
                speed: location.speed || 0,
                status: `Speed: ${location.speed || 0} km/h`,
                time: formattedTime,
                dispatchStatus: dispatchLog?.status || "idle",
                route: dispatchLog?.route || "No Route Assigned",
                driver: driver,
                conductor: conductor,
              }
            : bus
        );
      } else {
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
            dispatchStatus: dispatchLog?.status || "idle",
            route: dispatchLog?.route || "No Route Assigned",
            driver: driver,
            conductor: conductor,
            plateNumber: assignment.vehicle?.plate_number || "Unknown Plate",
          },
        ];
      }
    });
  };

  const fetchData = async () => {
    try {
      const [vehicles, maintenance, profiles] = await Promise.all([
        getAllVehicles(),
        getAllActiveMaintenanceScheduling(),
        getAllProfiles(),
      ]);

      setBusesInOperation(vehicles.length);
      setBusesInMaintenance(maintenance.data.length);
      setCurrentEmployees(profiles.length);

      await fetchAssignments();

      const mappedVehicles = vehicles.map((vehicle) => ({
        number: vehicle.vehicle_id,
        name: `Bus ${vehicle.vehicle_id}`,
        latitude: vehicle.latitude || 0,
        longitude: vehicle.longitude || 0,
        status: "Stationary",
        time: "N/A",
        speed: 0,
        dispatchStatus: "idle",
        route: "No Route Assigned",
        driver: assignmentMap[vehicle.vehicle_id]?.driver || "Unknown Driver",
        conductor: assignmentMap[vehicle.vehicle_id]?.conductor || "Unknown Conductor",
        plateNumber: assignmentMap[vehicle.vehicle_id]?.plateNumber || "Unknown Plate",
      }));

      setBusData(mappedVehicles);
      if (mappedVehicles.length > 0) {
        setSelectedBusDetails(mappedVehicles[0]);
        setPathData([{ lat: mappedVehicles[0].latitude, lng: mappedVehicles[0].longitude }]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    const echo = new Echo({
      broadcaster: "pusher",
      client: new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
        wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || undefined,
        wsPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT || "443"),
        wssPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT || "443"),
        forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === "https",
        disableStats: true,
      }),
    });

    const channel = echo.channel("flespi-data");

    channel.listen("FlespiDataReceived", (event: any) => {
      const { vehicle_id, location, dispatch_log, timestamp } = event;
      console.log("Real-time Data Received:", event);
      
      updateOrAddBus(vehicle_id, location, dispatch_log, timestamp);

      if (selectedBusDetails?.number === vehicle_id) {
        setPathData((prevPath) => [
          ...prevPath,
          { lat: location.latitude, lng: location.longitude },
        ]);
      }
    });

    return () => {
      echo.leaveChannel("flespi-data");
    };
  }, [selectedBusDetails]);

  return (
    <Layout>
      <Header title="Dashboard" />
      <section className="flex flex-row p-6 bg-slate-200">
        <div className="flex-1">
          <div className="flex space-x-6 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
              <FaBus className="text-blue-500" size={40} />
              <div>
                <h1 className="text-2xl font-bold">{busesInOperation}</h1>
                <p>Buses in Operation</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
              <FaCog className="text-green-500" size={40} />
              <div>
                <h1 className="text-2xl font-bold">{busesInMaintenance}</h1>
                <p>Buses in Maintenance</p>
              </div>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
              <FaUsers className="text-purple-500" size={40} />
              <div>
                <h1 className="text-2xl font-bold">{currentEmployees}</h1>
                <p>Current Employees</p>
              </div>
            </div>
          </div>
          <MapProvider>
            <MapComponent
              busData={busData}
              pathData={pathData}
              onBusClick={(busNumber) => {
                const busDetails = busData.find((bus) => bus.number === busNumber);
                setSelectedBusDetails(busDetails || null);
                if (busDetails) {
                  setPathData([{ lat: busDetails.latitude, lng: busDetails.longitude }]);
                }
              }}
              selectedBus={selectedBusDetails?.number || null}
            />
          </MapProvider>
        </div>
        <div className="w-1/4 bg-white shadow-md rounded-lg p-4 ml-6">
          {selectedBusDetails ? (
            <div>
              <h1 className="text-red-600 text-2xl font-bold">
                Bus {selectedBusDetails.number}
              </h1>
              <ul className="list-disc list-inside space-y-4 text-base mt-4">
                <li>
                  <strong>Driver:</strong> {selectedBusDetails.driver}
                </li>
                <li>
                  <strong>Conductor:</strong> {selectedBusDetails.conductor}
                </li>
                <li>
                  <strong>Plate Number:</strong> {selectedBusDetails.plateNumber}
                </li>
                <li>
                  <strong>Status:</strong> {selectedBusDetails.status}
                </li>
              </ul>
            </div>
          ) : (
            <h1 className="text-red-600 text-2xl font-bold">Select a Bus</h1>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DashboardHeader;
