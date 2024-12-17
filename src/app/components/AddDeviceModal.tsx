"use client";
import React, { useState, useEffect } from "react";
import { getAllVehicles } from "../services/vehicleService"; // Service to fetch vehicles
import { createTrackerVehicleMapping } from "../services/trackerService"; // Service to create tracker-vehicle mapping

const AddDeviceModal = ({ isOpen, onClose, onSave }) => {
  const [deviceName, setDeviceName] = useState("");
  const [trackerIdent, setTrackerIdent] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [busOptions, setBusOptions] = useState([]); // Store available vehicles
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available vehicles dynamically
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehicles = await getAllVehicles();
        setBusOptions(vehicles);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load vehicles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleSave = async () => {
    if (!deviceName || !trackerIdent || !vehicleId) {
      setError("All fields are required.");
      return;
    }

    try {
      const mappingData = {
        device_name: deviceName,
        tracker_ident: trackerIdent,
        vehicle_id: vehicleId,
      };
      const newMapping = await createTrackerVehicleMapping(mappingData);
      onSave(newMapping);
      resetForm();
      onClose();
    } catch (err) {
      console.error("Error creating tracker-to-vehicle mapping:", err);
      setError("Failed to create mapping. Please try again.");
    }
  };

  const resetForm = () => {
    setDeviceName("");
    setTrackerIdent("");
    setVehicleId("");
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-1/3 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add Tracker-to-Vehicle Mapping</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Device Name
          </label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter device name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Tracker Identifier
          </label>
          <input
            type="text"
            value={trackerIdent}
            onChange={(e) => setTrackerIdent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tracker identifier"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Vehicle
          </label>
          <select
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              {loading ? "Loading vehicles..." : "Select a vehicle"}
            </option>
            {busOptions.map((bus) => (
              <option key={bus.vehicle_id} value={bus.vehicle_id}>
                {`ID: ${bus.vehicle_id} - Plate: ${bus.plate_number}`}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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

export default AddDeviceModal;
