import axios from 'axios';

// Determine the correct base URL based on environment
const getBaseUrl = () => {
  // For production (Vercel deployment)
  if (import.meta.env.PROD) {
    return 'https://njestemebackend.onrender.com';
  }
  // For local development
  return 'http://localhost:5000';
};

// Log the API base URL for debugging
const apiBaseUrl = getBaseUrl();
console.log('API Base URL:', apiBaseUrl);

// Add a function to check if we're using the production API
export const isProduction = () => apiBaseUrl.includes('njestemebackend.onrender.com');

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Disable cookies for cross-origin requests
});

// Log configuration for debugging
console.log('API Configuration:', {
  baseURL: `${apiBaseUrl}/api`,
  withCredentials: false
});

// Request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear the token if it's invalid
      localStorage.removeItem('authToken');

      // Get the current path
      const currentPath = window.location.pathname;

      // List of protected paths that should redirect to login
      const protectedPaths = [
        '/dashboard',
        '/updateprofile',
        '/journals/uploads',
        '/manage-journals'
      ];

      // Only redirect to login for protected routes
      const shouldRedirect = protectedPaths.some(path => currentPath.startsWith(path));

      if (shouldRedirect) {
        console.log('Unauthorized access to protected route, redirecting to login');
        window.location.href = '/login';
      } else {
        console.log('Unauthorized access to public route, not redirecting');
      }
    }
    return Promise.reject(error);
  }
);

const downloadFile = async (url) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Accept': '*/*',
    'Authorization': token ? `Bearer ${token}` : ''
  };

  const response = await axios({
    method: 'GET',
    url,
    responseType: 'blob',
    headers,
    timeout: 120000, // 120 seconds timeout for downloads
    withCredentials: false, // Disable cookies for cross-origin requests
    maxRedirects: 5 // Allow redirects
  });

  if (!response.data || response.data.size === 0) {
    throw new Error('Received empty file');
  }

  return response;
};

// Helper methods for authentication
api.auth = {
  login: (credentials) => {
    console.log('Attempting login with credentials:', credentials);
    return api.post('/auth/login', credentials)
      .then(response => {
        console.log('Login response:', response.data);
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('authUser', JSON.stringify(response.data.user));
        }
        return response;
      });
  },
  register: (userData) => api.post('/auth/register', userData),
  profile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  checkAdmin: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data?.user?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
};

// Helper methods for journals
api.journals = {
  getAll: (params) => api.get('/journals', { params }),
  getById: (id) => api.get(`/journals/${id}`),
  download: async (id, fileType) => {
    console.log(`Attempting to download ${fileType} file for journal ${id}`);

    const urls = [
      // Try the direct download first (most reliable in production)
      `${apiBaseUrl}/direct-file/journals/${id}.${fileType}`,
      // Then try the API endpoints
      `${apiBaseUrl}/api/journals/${id}/download/${fileType}`,
      `${apiBaseUrl}/api/journals/${id}/direct-download/${fileType}`,
      `${apiBaseUrl}/journals/${id}/download/${fileType}`
    ];

    let lastError = null;
    for (const url of urls) {
      try {
        console.log('Attempting download from:', url);
        const response = await downloadFile(url);
        return response;
      } catch (error) {
        console.error(`Failed to download from ${url}:`, error);
        lastError = error;
      }
    }

    // If we get here, try fallback to Cloudinary URL if it's a PDF
    if (fileType === 'pdf') {
      try {
        const checkResponse = await api.get(`/journals/${id}/check-file/${fileType}`);
        if (checkResponse.data?.cloudinaryUrl) {
          console.log('Attempting download from Cloudinary:', checkResponse.data.cloudinaryUrl);
          const response = await downloadFile(checkResponse.data.cloudinaryUrl);
          return response;
        }
      } catch (error) {
        console.error('Cloudinary fallback failed:', error);
        lastError = error;
      }
    }

    throw lastError || new Error('All download attempts failed');
  },
  upload: async (formData) => {
    return axios({
      method: 'POST',
      url: `${apiBaseUrl}/api/journals`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      timeout: 60000, // 60 seconds timeout for uploads
      withCredentials: false // Disable cookies for cross-origin requests
    });
  }
};

// Helper methods for submissions
api.submissions = {
  getAll: (params) => api.get('/submissions', { params }),
  getById: (id) => api.get(`/submissions/${id}`),
  download: async (id, fileType) => {
    console.log(`Attempting to download submission ${fileType} file for ${id}`);

    const urls = [
      // Try the direct download first (most reliable in production)
      `${apiBaseUrl}/direct-file/submissions/${id}.${fileType}`,
      // Then try the API endpoints
      `${apiBaseUrl}/api/submissions/${id}/download/${fileType}`,
      `${apiBaseUrl}/api/submissions/${id}/direct-download/${fileType}`,
      `${apiBaseUrl}/submissions/${id}/download/${fileType}`
    ];

    let lastError = null;
    for (const url of urls) {
      try {
        console.log('Attempting download from:', url);
        const response = await downloadFile(url);
        return response;
      } catch (error) {
        console.error(`Failed to download from ${url}:`, error);
        lastError = error;
      }
    }

    // If we get here, try fallback to Cloudinary URL if it's a PDF
    if (fileType === 'pdf') {
      try {
        const checkResponse = await api.get(`/submissions/${id}/check-file/${fileType}`);
        if (checkResponse.data?.cloudinaryUrl) {
          console.log('Attempting download from Cloudinary:', checkResponse.data.cloudinaryUrl);
          const response = await downloadFile(checkResponse.data.cloudinaryUrl);
          return response;
        }
      } catch (error) {
        console.error('Cloudinary fallback failed:', error);
        lastError = error;
      }
    }

    throw lastError || new Error('All download attempts failed');
  },
  updateStatus: (id, status) => api.patch(`/submissions/${id}/status`, { status }),
  delete: (id) => api.delete(`/submissions/${id}`)
};

export default api;
export const baseURL = api.defaults.baseURL;
