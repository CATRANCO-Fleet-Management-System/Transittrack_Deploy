import React, { useState, useEffect } from "react";
import { FaBus } from "react-icons/fa";
import { updateFuelLog } from "@/app/services/fuellogsService";

const FuelEditModal = ({
  selectedBus,
  selectedFuelLog,
  onClose = () => {},
  onUpdate = () => {},
}) => {
  const [formData, setFormData] = useState({
    date: "",
    distanceTraveled: "",
    fuelType: "",
    fuelPrice: "",
    fuel_liters_quantity: "",
    total_expense: "",
    odometerProof: null,
    fuelReceiptProof: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedFuelLog && selectedBus) {
      setIsLoading(true);

      // Populate form with selected fuel log data
      setFormData({
        date: selectedFuelLog.purchase_date?.split(" ")[0] || "",
        distanceTraveled: selectedFuelLog.odometer_km || "",
        fuelType: selectedFuelLog.fuel_type || "",
        fuelPrice: selectedFuelLog.fuel_price?.replace(/[^0-9.]/g, "") || "",
        fuel_liters_quantity: selectedFuelLog.fuel_liters_quantity || "",
        total_expense:
          selectedFuelLog.total_expense?.replace(/[^0-9.]/g, "") || "",
        odometerProof: null,
        fuelReceiptProof: null,
      });

      setIsLoading(false);
    }
  }, [selectedFuelLog, selectedBus]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Update total expense when fuel price or quantity changes
      if (name === "fuelPrice" || name === "fuel_liters_quantity") {
        const price = parseFloat(updatedData.fuelPrice) || 0;
        const quantity = parseFloat(updatedData.fuel_liters_quantity) || 0;
        updatedData.total_expense = (price * quantity).toFixed(2);
      }

      return updatedData;
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files.length > 0) {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.date ||
      !formData.distanceTraveled ||
      !formData.fuelType ||
      !formData.fuelPrice ||
      !formData.fuel_liters_quantity ||
      !formData.total_expense
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("purchase_date", formData.date);
    formDataToSubmit.append("odometer_km", formData.distanceTraveled);
    formDataToSubmit.append("fuel_liters_quantity", formData.fuel_liters_quantity);
    formDataToSubmit.append("fuel_price", formData.fuelPrice);
    formDataToSubmit.append("fuel_type", formData.fuelType);
    formDataToSubmit.append("vehicle_id", selectedBus);

    if (formData.odometerProof) {
      formDataToSubmit.append("odometer_distance_proof", formData.odometerProof);
    }
    if (formData.fuelReceiptProof) {
      formDataToSubmit.append("fuel_receipt_proof", formData.fuelReceiptProof);
    }

    setIsSubmitting(true);

    try {
      const response = await updateFuelLog(selectedFuelLog.id, formDataToSubmit);
      onUpdate(response.data.fuel_log);
      onClose();
    } catch (error) {
      console.error("Failed to update fuel log:", error);
      alert("An error occurred while updating the fuel log.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-5/6 max-w-4xl">
        <div className="flex items-center mb-6">
          <FaBus size={32} className="mr-3" />
          <span className="text-xl font-bold">BUS {selectedBus}</span>
        </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="flex space-x-6">
            <div className="w-1/2">
              <div className="mb-4">
                <label className="block font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Distance Traveled (KM)</label>
                <input
                  type="number"
                  name="distanceTraveled"
                  value={formData.distanceTraveled}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Fuel Type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Fuel Type</option>
                  <option value="unleaded">Unleaded</option>
                  <option value="premium">Premium</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Fuel Price (PHP)</label>
                <input
                  type="number"
                  name="fuelPrice"
                  value={formData.fuelPrice}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Fuel Quantity (L)</label>
                <input
                  type="number"
                  name="fuel_liters_quantity"
                  value={formData.fuel_liters_quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
            </div>

            <div className="w-1/2">
              <div className="mb-4">
                <label className="block font-medium">Total Expense (PHP)</label>
                <input
                  type="number"
                  name="total_expense"
                  value={formData.total_expense}
                  disabled
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Distance Proof</label>
                <input
                  type="file"
                  name="odometerProof"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  accept="image/*"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Fuel Receipt Proof</label>
                <input
                  type="file"
                  name="fuelReceiptProof"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2 mr-3 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-500 text-white rounded"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelEditModal;
