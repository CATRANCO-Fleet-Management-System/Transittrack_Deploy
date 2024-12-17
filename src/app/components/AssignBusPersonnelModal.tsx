import React, { useState, useEffect } from "react";
import { getAllProfiles } from "@/app/services/userProfile";
import { getAllVehicles } from "@/app/services/vehicleService";
import { createVehicleAssignment } from "@/app/services/vehicleAssignService";

const AssignBusPersonnelModal = ({
  onClose,
  refreshData,
  onAssign,
  preSelectedVehicle,
}) => {
  const [drivers, setDrivers] = useState([]);
  const [paos, setPaos] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedPAO, setSelectedPAO] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(
    preSelectedVehicle || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch profiles and vehicles on component mount
  useEffect(() => {
    const fetchProfilesAndVehicles = async () => {
      setLoading(true);
      try {
        const profiles = await getAllProfiles();
        const driverProfiles = profiles.filter(
          (profile) => profile.profile.position === "driver"
        );
        const paoProfiles = profiles.filter(
          (profile) =>
            profile.profile.position === "passenger_assistant_officer"
        );
        const vehicleData = await getAllVehicles();

        setDrivers(driverProfiles);
        setPaos(paoProfiles);
        setVehicles(vehicleData);
      } catch (fetchError) {
        console.error("Error fetching profiles or vehicles:", fetchError);
        setError("Error fetching profiles or vehicles.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfilesAndVehicles();
  }, []);

  const handleDoneClick = async () => {
    if (!selectedDriver || !selectedPAO || !selectedVehicle) {
      setError("Please select a driver, PAO, and vehicle.");
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const assignmentData = {
        vehicle_id: selectedVehicle,
        user_profile_ids: [selectedDriver, selectedPAO],
      };

      console.log("Submitting assignment data:", assignmentData);

      const response = await createVehicleAssignment(assignmentData);

      // Assuming a successful response contains the `assignment` object
      if (response.assignment) {
        console.log("Assignment created successfully:", response.assignment);

        // Trigger onAssign callback to update parent state
        if (onAssign) {
          onAssign(response.assignment);
        }

        // Refresh parent data
        if (refreshData) {
          refreshData();
        }

        // Close the modal immediately after a successful assignment
        onClose();
      }
    } catch (catchError) {
      console.error("Error creating vehicle assignment:", catchError);

      // If an error is received, log it and show a generic error message
      // Do not show the error message if it is just closing after success
      setError(
        "An error occurred while creating the assignment. Please try again."
      );
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-2xl font-semibold">Assign Bus Personnel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <form className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <h1 className="text-xl mt-4">Driver Assignment</h1>
            {loading ? (
              <p>Loading drivers...</p>
            ) : (
              <select
                value={selectedDriver}
                onChange={(e) => {
                  setSelectedDriver(e.target.value);
                  setError(""); // Reset error on change
                }}
                className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full"
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
            )}
          </div>
          <div>
            <h1 className="text-xl mt-4">
              Passenger Assistant Officer Assignment
            </h1>
            {loading ? (
              <p>Loading PAOs...</p>
            ) : (
              <select
                value={selectedPAO}
                onChange={(e) => {
                  setSelectedPAO(e.target.value);
                  setError(""); // Reset error on change
                }}
                className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full"
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
            )}
          </div>
          <div>
            <h1 className="text-xl mt-4">Select Vehicle</h1>
            {loading ? (
              <p>Loading vehicles...</p>
            ) : (
              <select
                value={selectedVehicle}
                onChange={(e) => {
                  setSelectedVehicle(e.target.value);
                  setError(""); // Reset error on change
                }}
                className="h-10 text-lg border border-gray-300 rounded-md p-2 w-full"
                disabled={!!preSelectedVehicle} // Disable if pre-selected
              >
                {preSelectedVehicle ? (
                  <option value={preSelectedVehicle}>
                    {preSelectedVehicle}
                  </option>
                ) : (
                  <>
                    <option value="">Select a Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option
                        key={vehicle.vehicle_id}
                        value={vehicle.vehicle_id}
                      >
                        {vehicle.vehicle_id}
                      </option>
                    ))}
                  </>
                )}
              </select>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleDoneClick}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loading}
            >
              Done
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-500 text-gray-500 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignBusPersonnelModal;
