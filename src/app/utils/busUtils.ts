import { getAllVehicles, deleteVehicle } from "../services/vehicleService";
import { getAllVehicleAssignments } from "../services/vehicleAssignService";

// Fetch all vehicles and assignments
export const fetchData = async (setBusRecords, setVehicleAssignments) => {
  try {
    const vehicles = await getAllVehicles();
    const assignments = await getAllVehicleAssignments();
    setBusRecords(vehicles);
    setVehicleAssignments(assignments);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Delete a vehicle by ID
export const deleteBusRecord = async (
  recordId,
  setBusRecords,
  fetchData,
  setDeleteRecordId,
  setIsDeletePopupOpen
) => {
  try {
    setBusRecords((prev) =>
      prev.filter((record) => record.vehicle_id !== recordId)
    );
    const response = await deleteVehicle(recordId);
    if (!response?.success) await fetchData();
  } catch (error) {
    console.error("Error deleting vehicle:", error);
  } finally {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  }
};

// Get assigned profiles for a vehicle
export const getAssignedProfiles = (vehicleId, vehicleAssignments) => {
  const assignment = vehicleAssignments.find(
    (assignment) => assignment.vehicle_id === vehicleId
  );

  if (!assignment) return { driver: "N/A", conductor: "N/A" };

  const driver = assignment.user_profiles.find(
    (profile) => profile.position === "driver"
  );
  const conductor = assignment.user_profiles.find(
    (profile) => profile.position === "passenger_assistant_officer"
  );

  return {
    driver: driver ? `${driver.first_name} ${driver.last_name}` : "N/A",
    conductor: conductor
      ? `${conductor.first_name} ${conductor.last_name}`
      : "N/A",
  };
};
    