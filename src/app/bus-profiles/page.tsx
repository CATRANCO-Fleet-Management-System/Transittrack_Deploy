"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import { FaSearch, FaPlus } from "react-icons/fa";
import BusRecord from "../components/BusRecord";
import AddBusRecordModal from "../components/AddBusRecordModal";
import AssignBusPersonnelModal from "../components/AssignBusPersonnelModal";
import EditBusRecordModal from "../components/EditBusRecordModal";
import Pagination from "../components/Pagination"; // Pagination Component
import { getAllVehicles, deleteVehicle } from "../services/vehicleService";
import { getAllVehicleAssignments } from "../services/vehicleAssignService";
import HistoryModalForBus from "../components/HistoryModalForBus";
import EditPersonnel from "../components/EditPersonnelModal";

const BusRecordDisplay = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items per page
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignPersonnelModalOpen, setIsAssignPersonnelModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [busRecords, setBusRecords] = useState([]);
  const [vehicleAssignments, setVehicleAssignments] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [busHistory, setBusHistory] = useState([]);

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const vehicles = await getAllVehicles();
      const assignments = await getAllVehicleAssignments();
      setBusRecords(vehicles);
      setVehicleAssignments(assignments);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const openHistoryModal = () => {
    const history = busRecords.map((record) => {
      const { driver, conductor } = getAssignedProfiles(record.vehicle_id);
      return {
        busNumber: record.vehicle_id,
        plateNumber: record.plate_number,
        OR: record.or_id,
        CR: record.cr_id,
        driverAssigned: driver,
        paoAssigned: conductor,
        datePurchased: record.date_purchased || "N/A",
      };
    });
    setBusHistory(history);
    setIsHistoryModalOpen(true);
  };

  // Handle deleting a vehicle
// Handle deleting a vehicle
const handleDelete = (recordId) => {
  setDeleteRecordId(recordId);
  setIsDeletePopupOpen(true); // Open the confirmation popup
};

const confirmDelete = async () => {
  if (deleteRecordId) {
    try {
      // Optimistically remove the record from the UI
      setBusRecords((prev) =>
        prev.filter((record) => record.vehicle_id !== deleteRecordId)
      );

      // Call the delete API
      const response = await deleteVehicle(deleteRecordId);

      if (!response?.success) {
        // Re-fetch data if the API fails
        await fetchData();
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("An error occurred while deleting the vehicle.");
      // Re-fetch data to restore the UI if necessary
      await fetchData();
    } finally {
      // Close the confirmation popup
      setDeleteRecordId(null);
      setIsDeletePopupOpen(false);
    }
  }
};

const selectedAssignment = vehicleAssignments.find(
  (assignment) => assignment.vehicle_id === selectedVehicleId
);

const cancelDelete = () => {
  setDeleteRecordId(null);
  setIsDeletePopupOpen(false);
};

  // Handle adding a new bus record
  const handleAddNewBus = (newBus) => {
    setBusRecords((prevRecords) => [...prevRecords, newBus]);
    setSelectedVehicleId(newBus.vehicle_id);
    setIsAssignPersonnelModalOpen(true);
  };

  // Handle editing a bus record
  const handleEditBus = (updatedBus) => {
    setBusRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.vehicle_id === updatedBus.vehicle_id ? updatedBus : record
      )
    );
  
    // Handle additional steps like opening personnel modal if needed
    setSelectedVehicleId(updatedBus.vehicle_id);
    setIsAssignPersonnelModalOpen(false); // Optional: Manage modal states
    setIsEditModalOpen(false); // Close the edit modal
  };

  // Callback for updating vehicle assignments
  const handleAddVehicleAssignment = (newAssignment) => {
    setVehicleAssignments((prevAssignments) => [...prevAssignments, newAssignment]);
  };

  // Filter bus records by search term
  const filteredRecords = busRecords.filter((record) =>
    record.plate_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the assigned profiles for a vehicle
  const getAssignedProfiles = (vehicleId) => {
    const assignment = vehicleAssignments.find(
      (assignment) => assignment.vehicle_id === vehicleId
    );

    if (!assignment) {
      return { driver: "N/A", conductor: "N/A" };
    }

    const driver = assignment.user_profiles.find((profile) => profile.position === "driver");
    const conductor = assignment.user_profiles.find(
      (profile) => profile.position === "passenger_assistant_officer"
    );

    return {
      driver: driver ? `${driver.first_name} ${driver.last_name}` : "N/A",
      conductor: conductor ? `${conductor.first_name} ${conductor.last_name}` : "N/A",
    };
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <Layout>
      <Header title="Bus Profiles" />
      <div className="options flex items-center space-x-10 p-4 w-9/12 ml-8">
        <input
          type="text"
          placeholder="Find bus"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="flex items-center px-4 py-2 border-2 rounded-md text-blue-500">
          <FaSearch size={22} className="mr-2" />
          Search
        </button>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
        >
          <FaPlus size={22} className="mr-2" />
          Add New
        </button>

        <button
  onClick={openHistoryModal}
  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
>
  View History
</button>

      </div>
      <div className="records flex flex-col h-full">
        <div className="output flex mt-2 items-center ml-8 flex-wrap gap-4">
          {paginatedRecords.map((record) => {
            const { driver, conductor } = getAssignedProfiles(record.vehicle_id);

            return (
              <BusRecord
  key={record.vehicle_id}
  vehicle_id={record.vehicle_id}
  busNumber={record.vehicle_id}
  ORNumber={record.or_id}
  CRNumber={record.cr_id}
  plateNumber={record.plate_number}
  thirdLBI={record.third_pli}
  ci={record.ci || "N/A"}
  assignedDriver={driver}
  assignedPAO={conductor}
  assignmentId={
    vehicleAssignments.find(
      (assignment) => assignment.vehicle_id === record.vehicle_id
    )?.vehicle_assignment_id || "" // Pass the correct `vehicle_assignment_id`
  }
  route={record.route || "Not Assigned"}
  onDelete={() => handleDelete(record.vehicle_id)}
  onEdit={() => {
    setSelectedVehicleId(record.vehicle_id);
    setIsAssignPersonnelModalOpen(true);
  }}
/>

            );
          })}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
        {isDeletePopupOpen && (
  <Confirmpopup
    isOpen={isDeletePopupOpen}
    onConfirm={confirmDelete} // Call confirmDelete on confirm
    onCancel={cancelDelete} // Call cancelDelete on cancel
    title="Delete Profile"
    message="Are you sure you want to delete this profile?"
  />
)}
      {isAddModalOpen && (
        <AddBusRecordModal
          onClose={() => setIsAddModalOpen(false)}
          refreshData={fetchData}
          onSubmit={(newBus) => {
            handleAddNewBus(newBus);
            fetchData();
          }}
        />
      )}
      {isAssignPersonnelModalOpen && (
  <AssignBusPersonnelModal
    onClose={() => setIsAssignPersonnelModalOpen(false)}
    refreshData={fetchData}
    onAssign={handleAddVehicleAssignment}
    vehicleId={selectedVehicleId} // Pass the selected vehicle_id to the modal
  />
)}
{isEditModalOpen && (
  <EditBusRecordModal
    vehicle_id={selectedVehicleId}
    onClose={() => setIsEditModalOpen(false)}
    refreshData={fetchData} // Refresh parent data after edit
    onSubmit={(updatedBus) => {
      handleEditBus(updatedBus); // Update the current state
    }}
  />
)}

{isAssignPersonnelModalOpen && (
  <EditPersonnel
  assignment_assignment_id={
    vehicleAssignments.find(
      (assignment) => assignment.vehicle_id === selectedVehicleId
    )?.vehicle_assignment_id ?? "" // Pass `vehicle_assignment_id`
  }
  vehicle_id={selectedVehicleId || ""} // Pass the `vehicle_id`
  initialDriver={getAssignedProfiles(selectedVehicleId)?.driver || ""}
  initialPAO={getAssignedProfiles(selectedVehicleId)?.conductor || ""}
  onClose={() => setIsAssignPersonnelModalOpen(false)}
  onUpdate={(updatedDriver, updatedPAO) => {
    console.log("Updated Driver:", updatedDriver, "Updated PAO:", updatedPAO);
    fetchData();
  }}
/>
)}

{isHistoryModalOpen && (
  <HistoryModalForBus
    isOpen={isHistoryModalOpen}
    onClose={() => setIsHistoryModalOpen(false)}
    history={busHistory}
  />
)}

    </Layout>
  );
};

export default BusRecordDisplay;