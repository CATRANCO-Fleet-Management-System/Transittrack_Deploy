
"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Confirmpopup from "../components/Confirmpopup";
import AddDeviceModal from "../components/AddDeviceModal";
import Pagination from "../components/Pagination";
import { FaPlus } from "react-icons/fa";
import DeviceRecord from "../components/DeviceRecord";
import {
  getAllTrackerVehicleMappings,
  deleteTrackerVehicleMapping,
} from "@/app/services/trackerService";
import EditDeviceModal from "../components/EditDeviceModal";

const DeviceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Limit to 4 cards per page
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  useEffect(() => {
    const fetchTrackerMappings = async () => {
      try {
        const mappings = await getAllTrackerVehicleMappings();
        setDevices(mappings);
      } catch (error) {
        console.error("Error fetching tracker-to-vehicle mappings:", error);
      }
    };

    fetchTrackerMappings();
  }, []);

  const filteredDevices = devices.filter((device) =>
    device.device_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
  const paginatedDevices = filteredDevices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddNewDevice = (newDevice) => {
    setDevices((prevDevices) => [...prevDevices, newDevice]);
    setIsAddModalOpen(false);
  };

  const handleDelete = (recordId) => {
    setDeleteRecordId(recordId);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRecordId) {
      try {
        await deleteTrackerVehicleMapping(deleteRecordId);
        setDevices((prevDevices) =>
          prevDevices.filter((device) => device.id !== deleteRecordId)
        );
        setDeleteRecordId(null);
        setIsDeletePopupOpen(false);
      } catch (error) {
        console.error("Error deleting tracker-to-vehicle mapping:", error);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteRecordId(null);
    setIsDeletePopupOpen(false);
  };

  const handleEdit = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedDevice) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === updatedDevice.id
          ? { ...device, ...updatedDevice }
          : device
      )
    );
    setIsEditModalOpen(false);
  };

  return (
    <Layout>
      <section className="flex flex-row h-screen bg-white">
        <div className="w-full flex flex-col bg-slate-200">
          <Header title="Device Management" />
          <div className="content flex flex-col flex-1 p-6">
            {/* Search & Add New */}
            <div className="options flex items-center space-x-4 mb-6">
              <input
                type="text"
                placeholder="Search Trackers"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-500 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="flex items-center px-4 py-2 border-2 border-blue-500 rounded-md text-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-50"
                onClick={() => setIsAddModalOpen(true)}
              >
                <FaPlus className="mr-2" /> Add New
              </button>
            </div>

            {/* Devices Grid */}
            <div className="records grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {paginatedDevices.map((device) => (
                <DeviceRecord
                  key={device.id}
                  deviceId={device.id}
                  deviceName={device.device_name}
                  serialNumber={device.tracker_ident}
                  busNumber={device.vehicle_id || "Unassigned"}
                  status={device.status}
                  onDelete={() => handleDelete(device.id)}
                  onEdit={() => handleEdit(device.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddDeviceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddNewDevice}
        />
        <EditDeviceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          deviceId={selectedDeviceId}
          onSave={handleSaveEdit}
        />
        <Confirmpopup
          isOpen={isDeletePopupOpen}
          onConfirm={confirmDelete}
          onClose={cancelDelete}
          title="Delete Device"
          message="Are you sure you want to delete this tracker-to-vehicle mapping?"
        />
      </section>
    </Layout>
  );
};

export default DeviceManagement;
