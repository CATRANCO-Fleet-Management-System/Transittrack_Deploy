"use client";
import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import MaintenanceAddModal from "../components/MaintenanceAddModal";
import MaintenanceEditModal from "../components/MaintenanceEditModal";
import CompletionProofModal from "../components/CompletionProofModal"; // Component for proof submission
import ViewProofModal from "../components/ViewProofModal"; // Component for viewing proof
import Pagination from "../components/Pagination";
import { FaSearch, FaPlus, FaHistory } from "react-icons/fa";
import {
  getAllActiveMaintenanceScheduling,
  getAllCompletedMaintenanceScheduling,
  createMaintenanceScheduling,
  updateMaintenanceScheduling,
  deleteMaintenanceScheduling,
  toggleMaintenanceSchedulingStatus,
} from "@/app/services/maintenanceService";

import MaintenanceHistoryModal from "../components/MaintenanceHistoryModal";

const MaintenanceManagement = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isViewProofModalOpen, setIsViewProofModalOpen] = useState(false); // New state for viewing proof
  const [currentRecord, setCurrentRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [viewType, setViewType] = useState("active"); // "active" or "completed"
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 3;

  const fetchRecords = useCallback(async () => {
    try {
      let response;
      if (viewType === "active") {
        response = await getAllActiveMaintenanceScheduling();
      } else {
        response = await getAllCompletedMaintenanceScheduling();
      }
      setRecords(Array.isArray(response.data) ? response.data : []); // Extract the `data` key
    } catch (error) {
      console.error("Error fetching records:", error);
      setRecords([]); // Fallback to an empty array
    }
  }, [viewType]);

  useEffect(() => {
    fetchRecords(); // Fetch records when viewType changes
  }, [fetchRecords]);

  // Filter records based on search term
  const filteredRecords = Array.isArray(records)
    ? records.filter((record) =>
        Object.values(record)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  const handleReturnToActive = async (id) => {
    try {
      const formData = new FormData();

      // Append proof file if available
      if (currentRecord?.maintenance_complete_proof instanceof File) {
        formData.append(
          "maintenance_complete_proof",
          currentRecord.maintenance_complete_proof
        );
      }

      const updatedRecord = await toggleMaintenanceSchedulingStatus(
        id,
        formData
      );

      setRecords((prev) =>
        prev.map((record) =>
          record.maintenance_scheduling_id === id
            ? {
                ...record,
                maintenance_status: updatedRecord.schedule.maintenance_status,
              }
            : record
        )
      );

      setIsViewProofModalOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error(
        "Error returning to active:",
        error.response?.data || error
      );
    }
  };
  // Function to open the history modal
  const handleOpenHistoryModal = () => {
    console.log("View History button clicked");
    setIsHistoryModalOpen(true); // This will open the history modal
  };

  // Function to close the history modal
  const handleCloseHistoryModal = () => {
    console.log("Closing the history modal");
    setIsHistoryModalOpen(false); // This will close the modal
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleRemove = async (id) => {
    try {
      await deleteMaintenanceScheduling(id);
      fetchRecords();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleSave = async (id, data) => {
    try {
      if (id) {
        await updateMaintenanceScheduling(id, data);
      } else {
        await createMaintenanceScheduling(data);
      }
      fetchRecords(); // Refetch records after save
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error saving record:", error);
    }
  };

  const handleProofSubmit = async (id, proofData) => {
    try {
      const updatedRecord = await toggleMaintenanceSchedulingStatus(
        id,
        proofData
      );
      setRecords((prev) =>
        prev.map((record) =>
          record.maintenance_scheduling_id === id
            ? {
                ...record,
                maintenance_status: updatedRecord.schedule.maintenance_status,
                maintenance_complete_proof:
                  updatedRecord.schedule.maintenance_complete_proof,
              }
            : record
        )
      );
      setIsProofModalOpen(false);
    } catch (error) {
      console.error("Error submitting proof:", error);
    }
  };

  const handleViewProof = (record) => {
    setCurrentRecord(record);
    setIsViewProofModalOpen(true); // Open proof modal
  };

  return (
    <Layout>
      <Header title="Bus Maintenance Management" />
      <div className="options flex items-center space-x-10 p-4 w-11/12 ml-8">
        {/* Active/Completed Toggle Buttons */}
        <button
          className={`px-4 py-2 rounded-md ${
            viewType === "active"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setViewType("active")}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            viewType === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setViewType("completed")}
        >
          Completed
        </button>

        {/* Search and Add Buttons */}
        <input
          type="text"
          placeholder="Find maintenance records"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50">
          <FaSearch size={20} className="mr-2" />
          Search
        </button>
        <button
          className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus size={20} className="mr-2" />
          Add New
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
          onClick={handleOpenHistoryModal}
        >
          <FaHistory className="mr-2" />
          View History
        </button>
        {/* Render the modal if isHistoryModalOpen is true */}
        {isHistoryModalOpen && (
          <MaintenanceHistoryModal
            isOpen={isHistoryModalOpen} // Correct prop for modal visibility
            onClose={handleCloseHistoryModal} // Correct function to close the modal
            history={historyData}
          />
        )}
      </div>

      {/* Display Records */}
      <div className="records flex flex-wrap gap-4 px-8 mt-4">
        {currentRecords.map((record) => (
          <div
            key={record.maintenance_scheduling_id}
            className="record-card bg-white p-2 rounded shadow w-full md:w-1/3 lg:w-1/4"
          >
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border p-2 font-bold">Bus:</td>
                  <td className="border p-2">{record.vehicle_id || "N/A"}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Status:</td>
                  <td className="border p-2">
                    <button
                      className={`px-2 py-1 rounded text-black ${
                        record.maintenance_status === "active"
                          ? "bg-yellow-400"
                          : "bg-green-400"
                      }`}
                      onClick={() => {
                        if (record.maintenance_status === "active") {
                          setCurrentRecord(record);
                          setIsProofModalOpen(true);
                        }
                      }}
                    >
                      {record.maintenance_status || "N/A"}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Type:</td>
                  <td className="border p-2">
                    {record.maintenance_type || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Cost:</td>
                  <td className="border p-2">
                    PHP{" "}
                    {record.maintenance_cost
                      ? parseFloat(record.maintenance_cost).toFixed(2)
                      : "0.00"}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Date:</td>
                  <td className="border p-2">
                    {record.maintenance_date || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Company:</td>
                  <td className="border p-2">
                    {record.mechanic_company || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-bold">Address:</td>
                  <td className="border p-2">
                    {record.mechanic_company_address || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex space-x-2 mt-3">
              {record.maintenance_status === "completed" ? (
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleViewProof(record)}
                >
                  View Completion Proof
                </button>
              ) : (
                <>
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      setCurrentRecord(record);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() =>
                      handleRemove(record.maintenance_scheduling_id)
                    }
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Modals */}
      <MaintenanceAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
      />
      <MaintenanceEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        record={currentRecord}
        onSave={handleSave}
      />
      <CompletionProofModal
        isOpen={isProofModalOpen}
        onClose={() => setIsProofModalOpen(false)}
        record={currentRecord}
        onSubmit={handleProofSubmit}
      />
      <ViewProofModal
        isOpen={isViewProofModalOpen}
        onClose={() => setIsViewProofModalOpen(false)}
        proof={currentRecord?.maintenance_complete_proof}
        onReturnToActive={() =>
          handleReturnToActive(currentRecord?.maintenance_scheduling_id)
        }
      />
      <MaintenanceHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={filteredRecords} // Pass the records to the modal
      />
    </Layout>
  );
};

export default MaintenanceManagement;
