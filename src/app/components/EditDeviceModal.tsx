"use client";
import React, { useState, useEffect } from "react";
import { getTrackerVehicleMappingById, updateTrackerVehicleMapping } from "@/app/services/trackerService"; // Import services
import { getAllVehicles } from "@/app/services/vehicleService"; // Fetch available buses dynamically

const EditDeviceModal = ({ isOpen, onClose, deviceId, onSave }) => {
  const [deviceName, setDeviceName] = useState("");
  const [trackerIdent, setTrackerIdent] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [status, setStatus] = useState("");
  const [busOptions, setBusOptions] = useState([]); // Fetch bus options dynamically
  const [error, setError] = useState("");

  // Fetch bus options and device details dynamically
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (isOpen && deviceId) {
          // Fetch device details
          const deviceData = await getTrackerVehicleMappingById(deviceId);
          setDeviceName(deviceData.device_name);
          setTrackerIdent(deviceData.tracker_ident);
          setBusNumber(deviceData.vehicle?.vehicle_id || "");
          setStatus(deviceData.status);

          // Fetch available buses
          const vehicles = await getAllVehicles();
          setBusOptions(vehicles);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load device details. Please try again.");
      }
    };

    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, deviceId]);

  const handleSave = async () => {
    if (!deviceName || !trackerIdent || !busNumber || !status) {
      setError("All fields are required.");
      return;
    }
  
    try {
      const updatedDevice = {
        id: deviceId, // Ensure `id` is included
        device_name: deviceName,
        tracker_ident: trackerIdent,
        vehicle_id: busNumber,
        status,
      };
  
      await updateTrackerVehicleMapping(deviceId, updatedDevice);
      onSave(updatedDevice); // Pass updated device to parent
      onClose(); // Close modal
    } catch (err) {
      console.error("Error updating tracker-to-vehicle mapping:", err);
      setError("Failed to save changes. Please try again.");
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Tracker-to-Vehicle Mapping</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Device Name</label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Tracker Identifier</label>
          <input
            type="text"
            value={trackerIdent}
            onChange={(e) => setTrackerIdent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Bus Number</label>
          <select
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="" disabled>
              Select Bus Number
            </option>
            {busOptions.map((bus) => (
              <option key={bus.vehicle_id} value={bus.vehicle_id}>
                {`ID: ${bus.vehicle_id} - Plate: ${bus.plate_number}`}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeviceModal;
