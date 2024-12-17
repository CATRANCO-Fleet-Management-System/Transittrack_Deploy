import axios from 'axios';

// Define the base API URL for vehicle assignments
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an instance of axios with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor to include the token in the headers
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken'); // Fetch token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// **Vehicle Assignment Service Functions**

/**
 * Create a new vehicle assignment.
 * @param {Object} assignmentData - The assignment data to create a new vehicle assignment.
 * @returns {Promise<Object>} - The created vehicle assignment data.
 */
export const createVehicleAssignment = async (assignmentData) => {
  try {
    const response = await api.post('/user/admin/assignments/create', assignmentData);
    return response.data;
  } catch (error) {
    console.error('Create vehicle assignment error:', error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Get all vehicle assignments.
 * @returns {Promise<Object[]>} - An array of vehicle assignments.
 */
export const getAllVehicleAssignments = async () => {
  try {
    const response = await api.get('/user/admin/assignments/all');
    return response.data;
  } catch (error) {
    console.error('Get all vehicle assignments error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

/**
 * Get a vehicle assignment by ID.
 * @param {number} id - The ID of the vehicle assignment.
 * @returns {Promise<Object>} - The vehicle assignment data.
 */
export const getVehicleAssignmentById = async (id) => {
  try {
    const response = await api.get(`/user/admin/assignments/${id}`); // Correct URL format
    return response.data;
  } catch (error) {
    console.error('Get vehicle assignment by ID error:', error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Update a vehicle assignment by ID.
 * @param {number} id - The ID of the vehicle assignment.
 * @param {Object} assignmentData - The updated vehicle assignment data.
 * @returns {Promise<Object>} - The updated vehicle assignment data.
 */
export const updateVehicleAssignment = async (id, assignmentData) => {
  try {
    const response = await api.patch(`/user/admin/assignments/update/${id}`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Update vehicle assignment error:', error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Delete a vehicle assignment by ID.
 * @param {number} id - The ID of the vehicle assignment.
 * @returns {Promise<Object>} - The result of the deletion.
 */
export const deleteVehicleAssignment = async (id) => {
  try {
    const response = await api.delete(`/user/admin/assignments/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete vehicle assignment error:', error);
    throw error.response ? error.response.data : error;
  }
};
