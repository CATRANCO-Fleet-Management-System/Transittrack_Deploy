import axios from 'axios';

// Define the base API URL
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
    const token = localStorage.getItem('authToken'); // Use 'auth_token' from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// **Maintenance Scheduling Service Functions**

/**
 * Create maintenance scheduling.
 * @param {Object} data - The scheduling data.
 * @returns {Promise<Object>} - The created maintenance scheduling.
 */
export const createMaintenanceScheduling = async (data) => {
  try {
    const response = await api.post('/user/admin/maintenance-scheduling/create', data);
    return response.data;
  } catch (error) {
    console.error('Create Maintenance Scheduling error:', error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Get all maintenance scheduling records.
 * @returns {Promise<Object[]>} - An array of maintenance schedules.
 */
export const getAllMaintenanceScheduling = async () => {
  try {
    const response = await api.get('/user/admin/maintenance-scheduling/all');
    return response.data;
  } catch (error) {
    console.error('Get All Maintenance Scheduling error:', error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Get maintenance scheduling by ID.
 * @param {number} id - The ID of the maintenance schedule.
 * @returns {Promise<Object>} - The maintenance schedule data.
 */
export const getMaintenanceSchedulingById = async (id) => {
  try {
    const response = await api.get(`/user/admin/maintenance-scheduling/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Get Maintenance Scheduling by ID error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Update maintenance scheduling.
 * @param {number} id - The ID of the maintenance schedule.
 * @param {Object} data - The updated scheduling data.
 * @returns {Promise<Object>} - The updated maintenance schedule.
 */
export const updateMaintenanceScheduling = async (id, data) => {
  try {
    const response = await api.patch(`/user/admin/maintenance-scheduling/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Update Maintenance Scheduling error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Delete maintenance scheduling.
 * @param {number} id - The ID of the maintenance schedule.
 * @returns {Promise<Object>} - The result of the deletion.
 */
export const deleteMaintenanceScheduling = async (id) => {
  try {
    const response = await api.delete(`/user/admin/maintenance-scheduling/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete Maintenance Scheduling error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Toggle the status of maintenance scheduling.
 * @param {number} id - The ID of the maintenance schedule.
 * @returns {Promise<Object>} - The updated status of the schedule.
 */
export const toggleMaintenanceSchedulingStatus = async (id, formData) => {
  try {
    const response = await api.post(`/user/admin/maintenance-scheduling/toggle-status/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Toggle Maintenance Scheduling Status error: ${id}`, error);
    throw error.response ? error.response.data : error;
  }
};



/**
 * Get all active maintenance scheduling records.
 * @returns {Promise<Object[]>} - An array of active maintenance schedules.
 */
export const getAllActiveMaintenanceScheduling = async () => {
  try {
    const response = await api.get('/user/admin/maintenance-scheduling/all/active');
    return response.data;
  } catch (error) {
    console.error('Get All Active Maintenance Scheduling error:', error);
    throw error.response ? error.response.data : error;
  }
};

/**
 * Get all completed maintenance scheduling records.
 * @returns {Promise<Object[]>} - An array of completed maintenance schedules.
 */
export const getAllCompletedMaintenanceScheduling = async () => {
  try {
    const response = await api.get('/user/admin/maintenance-scheduling/all/completed');
    return response.data;
  } catch (error) {
    console.error('Get All Completed Maintenance Scheduling error:', error);
    throw error.response ? error.response.data : error;
  }
};
