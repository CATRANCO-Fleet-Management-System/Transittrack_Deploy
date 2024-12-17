import axios from 'axios';

// Base API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token interceptors for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Service to handle dispatch-related operations
 */
const DispatchService = {
  /**
   * Fetch all dispatches.
   * @returns {Promise<Object[]>} List of dispatch logs.
   */
  getAllDispatches: async () => {
    try {
      const response = await api.get('/user/admin/dispatch_logs/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching dispatches:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Start a new alley.
   * @param {Object} data - Alley start request data.
   * @returns {Promise<Object>} Created dispatch data.
   */
  startAlley: async (data) => {
    try {
      const response = await api.post('/user/admin/dispatch_logs/alley/start', data);
      return response.data;
    } catch (error) {
      console.error('Error starting alley:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Start a new dispatch.
   * @param {Object} data - Dispatch start request data.
   * @returns {Promise<Object>} Created dispatch data.
   */
  startDispatch: async (data) => {
    try {
      const response = await api.post('/user/admin/dispatch_logs/dispatch/start', data);
      return response.data;
    } catch (error) {
      console.error('Error starting dispatch:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get a specific dispatch by ID.
   * @param {number|string} id - Dispatch ID.
   * @returns {Promise<Object>} Dispatch data.
   */
  getDispatchById: async (id) => {
    try {
      const response = await api.get(`/user/admin/dispatch_logs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dispatch by ID:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * End a specific alley by ID.
   * @param {number|string} id - Dispatch ID.
   * @returns {Promise<Object>} Updated dispatch data.
   */
  endAlley: async (id) => {
    try {
      const response = await api.patch(`/user/admin/dispatch_logs/alley/end/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error ending alley:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * End a specific dispatch by ID.
   * @param {number|string} id - Dispatch ID.
   * @returns {Promise<Object>} Updated dispatch data.
   */
  endDispatch: async (id) => {
    try {
      const response = await api.patch(`/user/admin/dispatch_logs/dispatch/end/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error ending dispatch:', error);
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete specific dispatch records by their IDs.
   * @param {number[]} ids - List of dispatch IDs to delete.
   * @returns {Promise<Object>} Deletion response.
   */
  deleteRecords: async (ids) => {
    try {
      const response = await api.delete('/user/admin/dispatch_logs/delete', {
        data: { ids },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting dispatch records:', error);
      throw error.response?.data || error.message;
    }
  },
};

export default DispatchService;
