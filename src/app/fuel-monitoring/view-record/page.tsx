"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaBus, FaHistory } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "react-datepicker/dist/react-datepicker.css";
import FuelAddModal from "@/app/components/FuelAddModal";
import FuelEditModal from "@/app/components/FuelEditModal";
import FuelViewDetailsModal from "@/app/components/FuelViewDetailsModal";
import {
  fetchAllFuelLogs,
  deleteFuelLog,
} from "@/app/services/fuellogsService";
import { groupByTimeInterval } from "@/app/helper/fuel-helper";
import FuelHistoryModal from "@/app/components/FuelHistoryModal";
const ViewRecord = () => {
  const searchParams = useSearchParams();
  const busNumber = searchParams.get("bus") || "001";
  const busStatus = searchParams.get("status") || "On Operation";

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFuelLog, setSelectedFuelLog] = useState(null);

  const [selectedBus, setSelectedBus] = useState(busNumber);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeInterval, setTimeInterval] = useState("daily");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await fetchAllFuelLogs();
        // Check if logs contain fuel_logs_id
        console.log(logs); // Logs should have fuel_logs_id
        const filteredLogs = logs.filter(
          (log) => log.vehicle_id === selectedBus
        );
        setFuelLogs(filteredLogs);
      } catch (error) {
        console.error("Failed to fetch fuel logs:", error);
      }
    };
    fetchLogs();
  }, [selectedBus]);

  // Generate chart data based on time interval and selected bus
  const chartData = {
    daily: groupByTimeInterval(
      fuelLogs.filter((log) => log.vehicle_id === selectedBus),
      "daily"
    ),

    weekly: groupByTimeInterval(
      fuelLogs.filter((log) => log.vehicle_id === selectedBus),
      "weekly"
    ),
    monthly: groupByTimeInterval(
      fuelLogs.filter((log) => log.vehicle_id === selectedBus),
      "monthly"
    ),
    yearly: groupByTimeInterval(
      fuelLogs.filter((log) => log.vehicle_id === selectedBus),
      "yearly"
    ),
  };
  const currentData = chartData[timeInterval] || chartData.daily;

  const data = {
    labels: currentData.map((entry) => entry.label), // Labels based on time interval
    datasets: [
      {
        label: "Distance (KM)",
        data: currentData.map((entry) => entry.distance), // Distance data
        borderColor: "red", // Red color for distance
        backgroundColor: "rgba(255, 99, 132, 0.2)", // Light red background for distance
      },
      {
        label: "Liters Used (L)",
        data: currentData.map((entry) => entry.liters), // Liters data
        borderColor: "blue", // Blue color for liters
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Light blue background for liters
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest", // Ensures nearest point is selected when hovering
        intersect: true, // Tooltip only appears when hovering over a point
        callbacks: {
          title: (tooltipItem) => {
            // Return the label (usually the date) for the hovered point
            return tooltipItem[0].label;
          },
          label: (tooltipItem) => {
            const datasetIndex = tooltipItem.datasetIndex;
            const data = tooltipItem.raw;
            const distance =
              tooltipItem.chart.data.datasets[0].data[tooltipItem.dataIndex];
            const liters =
              tooltipItem.chart.data.datasets[1].data[tooltipItem.dataIndex];

            let tooltipText = "";
            if (datasetIndex === 0) {
              tooltipText = `Distance: ${distance} KM`;
            }
            if (datasetIndex === 1) {
              tooltipText = `Liters: ${liters} L`;
            }

            if (
              datasetIndex === 0 &&
              tooltipItem.chart.data.datasets[1].data[tooltipItem.dataIndex] !==
                undefined
            ) {
              tooltipText = `Distance: ${distance} KM\nLiters: ${liters} L`;
            }
            return tooltipText;
          },
        },
      },
    },
  };
  // Handle deletion of a fuel log
  const handleDeleteFuelLog = async (fuelLogId) => {
    try {
      await deleteFuelLog(fuelLogId); // API call to delete fuel log
      setFuelLogs((prevLogs) =>
        prevLogs.filter((log) => log.fuel_logs_id !== fuelLogId)
      );
      alert("Fuel log deleted successfully");
    } catch (error) {
      console.error(`Error deleting fuel log with ID ${fuelLogId}:`, error);
      alert("Failed to delete fuel log. Please try again.");
    }
  };

  const handleEdit = (record) => {
    // First, set the selected bus and edit data
    setSelectedBus(record.vehicle_id);
    setEditData(record);

    // Log the selected bus and edit data to check if they're being set correctly

    // Open the modal only after the state has been updated
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (record) => {
    setViewData(record);
    setIsViewDetailsOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  // Handle new record addition or update
  const handleAdd = (updatedRecord) => {
    setFuelLogs((prevLogs) => {
      const index = prevLogs.findIndex(
        (log) => log.fuel_logs_id === updatedRecord.fuel_logs_id
      );
      return [...prevLogs, updatedRecord];
    });
    setSelectedBus(updatedRecord.vehicle_id);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeViewDetailsModal = () => {
    setIsViewDetailsOpen(false);
    setViewData(null);
  };

  // Function to open the history modal
  const handleOpenHistoryModal = () => {
    const filteredHistory = fuelLogs.filter(
      (log) => log.vehicle_id === selectedBus
    );
    setHistoryData(filteredHistory);
    setIsHistoryModalOpen(true);
  };

  // Function to close the history modal
  const handleCloseHistoryModal = () => {
    console.log("Closing the history modal"); // Log when closing the modal
    setIsHistoryModalOpen(false); // Close the modal
    console.log("isHistoryModalOpen state set to false");
  };
  const itemsPerPage = 5;
  const totalPages = Math.ceil(fuelLogs.length / itemsPerPage);

  const displayedRecords = fuelLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handlePrint = async () => {
    const chartElement = document.querySelector(".chart-container");

    if (!chartElement) return;

    try {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`view-record-bus-${selectedBus}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-slate-200 pb-10">
        <Header title="Fuel Monitoring" />
        <section className="p-4 flex flex-col items-center">
          <div className="flex items-center w-5/6 mb-4">
            <FaBus size={24} className="mr-2" />
            <span className="text-lg font-bold">BUS {selectedBus}</span>
            <span
              className={`ml-2 ${
                busStatus === "Maintenance" ? "text-red-500" : "text-green-500"
              }`}
            >
              {busStatus}
            </span>
          </div>
          <div className="top-btns flex flex-col">
            {/* Time Interval Buttons */}
            <div className="time-intervals flex space-x-3 mb-4">
              {["daily", "weekly", "monthly", "yearly"].map((interval) => (
                <button
                  key={interval}
                  className={`px-4 py-2 rounded ${
                    timeInterval === interval
                      ? "bg-blue-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                  onClick={() => setTimeInterval(interval)}
                >
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex absolute right-[8%]">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Print Chart as PDF
              </button>
            </div>
          </div>

          <div className="relative chart-container w-5/6 h-[500px] bg-white p-4 rounded-lg shadow-lg">
            <div className="absolute inset-0 flex justify-center items-center opacity-10 z-0">
              <span className="text-6xl font-bold text-gray-500">
                {selectedBus ? `Bus ${selectedBus}` : "Loading..."}
              </span>
            </div>
            <Line data={data} options={options} className="relative z-10" />
          </div>

          <div className="table-container w-5/6 mt-4 bg-white p-4 rounded-lg shadow-lg">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4">Date</th>
                  <th className="py-2 px-4">Distance</th>
                  <th className="py-2 px-4">Fuel Type</th>
                  <th className="py-2 px-4">Fuel Price</th>
                  <th className="py-2 px-4">Fuel Quantity</th>
                  <th className="py-2 px-4">Total Amount (PHP)</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords
                  .sort(
                    (a, b) =>
                      new Date(a.purchase_date) - new Date(b.purchase_date)
                  ) // Sort by date ascending
                  .map((entry) => (
                    <tr key={entry.fuel_logs_id} className="border-t">
                      <td className="py-2 px-4">{entry.purchase_date}</td>
                      <td className="py-2 px-4">{entry.odometer_km} KM</td>
                      <td className="py-2 px-4">{entry.fuel_type}</td>
                      <td className="py-2 px-4">{entry.fuel_price}</td>
                      <td className="py-2 px-4">
                        {entry.fuel_liters_quantity} L
                      </td>
                      <td className="py-2 px-4">{entry.total_expense} PHP</td>
                      <td className="py-2 text-right flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(entry)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="px-3 py-1 bg-blue-500 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteFuelLog(entry.fuel_logs_id)
                          }
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between w-5/6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-300 text-gray-500 rounded disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-300 text-gray-500 rounded disabled:cursor-not-allowed ml-40"
            >
              Next
            </button>
            <div className="right-btn flex flex-row space-x-3">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center"
                onClick={handleOpenHistoryModal}
              >
                <FaHistory className="mr-2" />
                View History
              </button>
              {isHistoryModalOpen && (
                <FuelHistoryModal
                  isOpen={isHistoryModalOpen} // Correct prop for modal visibility
                  onClose={handleCloseHistoryModal} // Correct function to close the modal
                  history={historyData}
                />
              )}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add New Record
              </button>
            </div>
          </div>
        </section>
      </div>

      {isHistoryModalOpen &&
        (console.log("Rendering FuelHistoryModal..."), // Log when rendering the modal
        (
          <FuelHistoryModal
            onClose={handleCloseHistoryModal}
            historyData={fuelLogs}
            selectedBus={selectedBus}
          />
        ))}
      {isAddModalOpen && (
        <FuelAddModal
          selectedBus={selectedBus}
          onClose={closeAddModal}
          onAdd={handleAdd}
        />
      )}

      {isEditModalOpen && (
        <FuelEditModal
          selectedBus={selectedBus}
          selectedFuelLog={editData}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleEdit}
        />
      )}

      {isViewDetailsOpen && (
        <FuelViewDetailsModal
          selectedBus={selectedBus}
          viewData={viewData}
          onClose={closeViewDetailsModal}
        />
      )}
    </div>
  );
};

export default ViewRecord;