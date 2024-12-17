import React from "react";
import { FaBus } from "react-icons/fa";

const FuelViewDetailsModal = ({ selectedBus, viewData = {}, onClose = () => {} }) => {
  const {
    purchase_date = "N/A",
    odometer_km = "N/A",
    fuel_price = "N/A",
    fuel_type = "N/A",
    fuel_liters_quantity = "N/A",
    total_expense,
    odometer_distance_proof = null,
    fuel_receipt_proof = null,
  } = viewData;

  const calculatedTotalExpense =
    total_expense ||
    (!isNaN(fuel_price) && !isNaN(fuel_liters_quantity)
      ? (parseFloat(fuel_price) * parseFloat(fuel_liters_quantity)).toFixed(2)
      : "N/A");

  const BASE_URL =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    "http://192.168.68.147:8000/storage/";

  const formatDate = (date) => {
    if (!date || date === "N/A") return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-5/6 max-w-4xl">
        <div className="flex items-center mb-6">
          <FaBus size={32} className="mr-3" />
          <span className="text-xl font-bold">BUS {selectedBus}</span>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Left Section */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <label className="block font-medium">Date</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {formatDate(purchase_date)}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Odometer (KM)</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {odometer_km}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Type</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {fuel_type}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Price (PHP)</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {fuel_price}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Quantity (L)</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {fuel_liters_quantity}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2">
            <div className="mb-4">
              <label className="block font-medium">Total Expense (PHP)</label>
              <p className="border border-gray-300 p-2 rounded bg-gray-100">
                {calculatedTotalExpense}
              </p>
            </div>
            <div className="mb-4">
              <label className="block font-medium">Odometer Proof</label>
              {odometer_distance_proof ? (
                <img
                  src={`${BASE_URL}${odometer_distance_proof}`}
                  alt={`Odometer proof for Bus ${selectedBus}`}
                  className="max-h-48 w-auto border border-gray-300 p-2 rounded"
                />
              ) : (
                <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
                  No Image Available
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-medium">Fuel Receipt Proof</label>
              {fuel_receipt_proof ? (
                <img
                  src={`${BASE_URL}${fuel_receipt_proof}`}
                  alt={`Fuel receipt proof for Bus ${selectedBus}`}
                  className="max-h-48 w-auto border border-gray-300 p-2 rounded"
                />
              ) : (
                <div className="w-full border border-gray-300 p-2 rounded bg-gray-100 text-center">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelViewDetailsModal;