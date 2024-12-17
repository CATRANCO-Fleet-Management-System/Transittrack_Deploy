"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllVehicles } from "@/app/services/vehicleService"; // Import vehicle service
import { createMaintenanceScheduling } from "@/app/services/maintenanceService"; // Import maintenance service

const AddPage = () => {
  const router = useRouter();

  const [vehicles, setVehicles] = useState([]); // State for storing vehicles
  const [maintenanceNumber, setMaintenanceNumber] = useState("");
  const [vehicleId, setVehicleId] = useState(""); // Store selected vehicle ID
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const [maintenanceDate, setMaintenanceDate] = useState(new Date());
  const [maintenanceAddress, setMaintenanceAddress] = useState("");
  const [maintenanceType, setMaintenanceType] = useState(""); // For maintenance type dropdown
  const [attendingMechanic, setAttendingMechanic] = useState("");

  // Maintenance types list
  const maintenanceTypes = [
    "oil_change",
    "tire_rotation",
    "brake_inspection",
    "engine_check",
    "transmission_service",
  ];

  // Fetch all vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicleData = await getAllVehicles(); // Fetch all vehicles
        setVehicles(vehicleData); // Store fetched vehicles
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleSave = async () => {
    const formattedDate = `${maintenanceDate.toLocaleDateString("en-CA")} ${new Date().toLocaleTimeString(
      "en-GB",
      { hour12: false }
    )}`; // e.g., 2024-10-14 17:01:31
    const data = {
      maintenance_number: maintenanceNumber,
      vehicle_id: vehicleId, // Send selected vehicle ID
      maintenance_cost: maintenanceCost,
      maintenance_date: formattedDate,
      maintenance_address: maintenanceAddress,
      maintenance_type: maintenanceType, // Send selected maintenance type
      attending_mechanic: attendingMechanic,
      maintenance_status: "active", // Set the maintenance status to active
    };

    try {
      await createMaintenanceScheduling(data); // POST request to create maintenance
      router.push("/bus-maintenance");
    } catch (error) {
      console.error("Error creating maintenance scheduling:", error);
    }
  };

  return (
    <section className="flex flex-row h-screen bg-white">
      <Sidebar />
      <div className="w-full flex flex-col bg-slate-200">
        <Header title="Add New Maintenance Record" />
        <div className="content flex flex-col flex-1 p-10 items-center">
          <div className="form grid grid-cols-2 gap-6 bg-white p-12 rounded-md shadow-md w-[1000px] mr-14">
            <div className="col-span-1">
              <label htmlFor="maintenanceNumber" className="block text-sm font-medium text-gray-700">
                Maintenance #
              </label>
              <Input
                id="maintenanceNumber"
                placeholder="Maintenance #"
                value={maintenanceNumber}
                onChange={(e) => setMaintenanceNumber(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="attendingMechanic" className="block text-sm font-medium text-gray-700">
                Attending Mechanic
              </label>
              <Input
                id="attendingMechanic"
                placeholder="Attending Mechanic"
                value={attendingMechanic}
                onChange={(e) => setAttendingMechanic(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="maintenanceType" className="block text-sm font-medium text-gray-700">
                Maintenance Type
              </label>
              <select
                id="maintenanceType"
                className="border border-gray-500 p-3 rounded-md w-full mt-1"
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
              >
                <option value="">Select a maintenance type</option>
                {maintenanceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} {/* Format type */}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700">
                Vehicle
              </label>
              <select
                id="vehicleId"
                className="border border-gray-500 p-3 rounded-md w-full mt-1"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                    {vehicle.plate_number} - {vehicle.vehicle_id}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label htmlFor="maintenanceCost" className="block text-sm font-medium text-gray-700">
                Maintenance Cost
              </label>
              <Input
                id="maintenanceCost"
                placeholder="PHP"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="maintenanceDate" className="block text-sm font-medium text-gray-700">
                Maintenance Date
              </label>
              <DatePicker
                id="maintenanceDate"
                selected={maintenanceDate}
                onChange={(date) => setMaintenanceDate(date)}
                className="border border-gray-500 p-3 rounded-md w-full mt-1"
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="maintenanceAddress" className="block text-sm font-medium text-gray-700">
                Maintenance Address
              </label>
              <Input
                id="maintenanceAddress"
                placeholder="Maintenance Address"
                value={maintenanceAddress}
                onChange={(e) => setMaintenanceAddress(e.target.value)}
                className="mt-1 p-3"
              />
            </div>
            <div className="col-span-2 flex justify-end space-x-4 mt-4">
              <button
                className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md bg-transparent"
                onClick={handleSave}
              >
                Add
              </button>
              <button
                className="px-6 py-3 border border-red-500 text-red-500 rounded-md bg-transparent"
                onClick={() => router.push("/bus-maintenance")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddPage;
