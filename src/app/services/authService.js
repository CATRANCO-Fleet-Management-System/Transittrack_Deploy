import axios from 'axios';

// Define the base API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add interceptors for token handling
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication Services

// Login
export const login = async (credentials) => {
  try {
    const response = await api.post('/user/login', credentials);
    const { token } = response.data;
    if (token) {
      localStorage.setItem('authToken', token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Register
export const register = async (userData) => {
  try {
    const response = await api.post('/user/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Get Logged-in User Profile
export const getProfile = async () => {
  try {
    const response = await api.get('/user/me');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error.response ? error.response.data : error;
  }
};

export const getOwnProfile = async () => {
  try {
    const response = await api.get('/user/profile/view');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Update Logged-in User Account
export const updateAccount = async (accountData) => {
  try {
    const response = await api.patch('/user/update', accountData);
    return response.data;
  } catch (error) {
    console.error('Update account error:', error);
    throw error.response ? error.response.data : error;
  }
};

export const updateOwnAccount = async (accountData) => {
  try {
    let payload;

    if (accountData instanceof FormData) {
      // If accountData is already FormData, use it as-is
      payload = accountData;
    } else {
      // Otherwise, convert accountData to FormData
      payload = new FormData();
      Object.keys(accountData).forEach((key) => {
        payload.append(key, accountData[key]);
      });
    }

    const response = await api.post('/user/admin/updateOwnProfile', payload, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure the correct content type
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update own account error:', error);
    throw error.response ? error.response.data : error;
  }
};



// Logout
export const logout = async () => {
  try {
    await api.post('/user/logout');
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Deactivate User Account
export const deactivateAccount = async (userId) => {
  try {
    const response = await api.patch(`/user/admin/deactivate-account/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Deactivate account error:', error);
    throw error.response ? error.response.data : error;
  }
};

// Activate User Account
export const activateAccount = async (userId) => {
  try {
    const response = await api.patch(`/user/admin/activate-account/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Activate account error:', error);
    throw error.response ? error.response.data : error;
  }
};
