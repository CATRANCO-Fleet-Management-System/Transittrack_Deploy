"use client";
import React, { useState, useEffect } from "react";
import { getAllProfiles } from "@/app/services/userProfile";
import {
  updateVehicleAssignment,
  getVehicleAssignmentById,
} from "@/app/services/vehicleAssignService";

interface Profile {
  profile: {
    user_profile_id: string;
    first_name: string;
    last_name: string;
    position: string;
  };
}

interface EditPersonnelModalProps {
  vehicle_assignment_id: string; // Assignment ID
  vehicle_id: string; // Vehicle ID
  initialDriver: string;
  initialPAO: string;
  onClose: () => void;
  onUpdate: (updatedDriver: string, updatedPAO: string) => void;
}

const EditPersonnel: React.FC<EditPersonnelModalProps> = ({
  vehicle_assignment_id,
  vehicle_id,
  initialDriver,
  initialPAO,
  onClose,
  onUpdate,
}) => {
  const [drivers, setDrivers] = useState<Profile[]>([]);
  const [paos, setPaos] = useState<Profile[]>([]);
  const [selectedDriver, setSelectedDriver] = useState(initialDriver || "");
  const [selectedPAO, setSelectedPAO] = useState(initialPAO || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profiles = await getAllProfiles();
        setDrivers(profiles.filter((p) => p.profile.position === "driver"));
        setPaos(profiles.filter((p) => p.profile.position === "passenger_assistant_officer"));
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load personnel. Please try again.");
      }
    };

    fetchProfiles();
  }, []);

  // Fetch assignment fallback if `vehicle_assignment_id` is missing
  useEffect(() => {
    const fetchAssignmentFallback = async () => {
      if (!vehicle_assignment_id) {
        setLoading(true);
        try {
          const fallbackAssignment = await getVehicleAssignmentById(vehicle_id);
          console.log("Fetched fallback assignment:", fallbackAssignment);

          setSelectedDriver(
            fallbackAssignment.user_profiles.find((p: any) => p.position === "driver")
              ?.user_profile_id || ""
          );
          setSelectedPAO(
            fallbackAssignment.user_profiles.find((p: any) => p.position === "passenger_assistant_officer")
              ?.user_profile_id || ""
          );
        } catch (error) {
          console.error("Error fetching fallback assignment:", error);
          setError("Failed to fetch assignment details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssignmentFallback();
  }, [vehicle_assignment_id, vehicle_id]);

  const handleSubmit = async () => {
    console.log("Submitting with:", {
      vehicle_assignment_id,
      vehicle_id,
      user_profile_ids: [selectedDriver, selectedPAO],
    });

    if (!vehicle_assignment_id || !vehicle_id || !selectedDriver || !selectedPAO) {
      setError("Missing required fields: Assignment ID, Driver, PAO, or Vehicle ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await updateVehicleAssignment(vehicle_assignment_id, {
        user_profile_ids: [selectedDriver, selectedPAO],
        vehicle_id: vehicle_id,
      });

      if (response?.message === "Vehicle Assignment Updated Successfully") {
        onUpdate(selectedDriver, selectedPAO);
        onClose();
      } else {
        throw new Error(response?.message || "Update failed.");
      }
    } catch (err) {
      console.error("Error updating personnel assignment:", err);
      setError("Failed to update personnel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Personnel Assignment</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium">Driver</label>
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="">Select a Driver</option>
            {drivers.map((driver) => (
              <option
                key={driver.profile.user_profile_id}
                value={driver.profile.user_profile_id}
              >
                {`${driver.profile.first_name} ${driver.profile.last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium">PAO</label>
          <select
            value={selectedPAO}
            onChange={(e) => setSelectedPAO(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loading}
          >
            <option value="">Select a PAO</option>
            {paos.map((pao) => (
              <option
                key={pao.profile.user_profile_id}
                value={pao.profile.user_profile_id}
              >
                {`${pao.profile.first_name} ${pao.profile.last_name}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-500 text-white rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPersonnel;
