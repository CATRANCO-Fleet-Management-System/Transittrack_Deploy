import axios from 'axios';

const API_BASE_URL = "https://your-api-url.com/api/devices"; // Replace with your actual API base URL

// Fetch all devices
export const getAllDevices = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

// Delete a device by ID
export const deleteDevice = async (deviceId) => {
  try {
    await axios.delete(`${API_BASE_URL}/${deviceId}`);
  } catch (error) {
    console.error("Error deleting device:", error);
    throw error;
  }
};

// Add a new device with bus number
export const addDevice = async (deviceData) => {
  try {
    // Include bus number in the data when adding a new device
    const { name, serial_number, bus_number, status } = deviceData; // Ensure bus_number is passed
    const response = await axios.post(API_BASE_URL, { name, serial_number, bus_number, status });
    return response.data;
  } catch (error) {
    console.error("Error adding device:", error);
    throw error;
  }
};

// Update an existing device with bus number
export const updateDevice = async (deviceId, updatedData) => {
  try {
    // Include bus number in the updated data when updating the device
    const { name, serial_number, bus_number, status } = updatedData; // Ensure bus_number is passed
    const response = await axios.put(`${API_BASE_URL}/${deviceId}`, { name, serial_number, bus_number, status });
    return response.data;
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
};
