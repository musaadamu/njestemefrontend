import axios from 'axios';
import { tokenStorage, userStorage, securityLogger } from '../utils/security';
// import { csrfProtection } from '../utils/security'; // Temporarily disabled

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

// Request interceptor for security
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CSRF token temporarily disabled to resolve CORS issues
    // TODO: Re-enable CSRF protection after CORS is fully configured
    // if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    //   const csrfToken = csrfProtection.getToken();
    //   if (csrfToken) {
    //     config.headers['X-CSRF-Token'] = csrfToken;
    //   }
    // }

    // Log security-relevant requests
    if (config.url?.includes('auth') || config.url?.includes('admin')) {
      securityLogger.log('API_REQUEST', {
        method: config.method,
        url: config.url,
        hasAuth: !!token
      });
    }

    return config;
  },
  (error) => {
    securityLogger.log('API_REQUEST_ERROR', { error: error.message });
    return Promise.reject(error);
  }
);

// Response interceptor for security
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      securityLogger.log('AUTHENTICATION_ERROR', {
        url: error.config?.url,
        status: error.response.status
      });

      // Clear tokens on authentication failure
      tokenStorage.remove();

      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle authorization errors
    if (error.response?.status === 403) {
      securityLogger.log('AUTHORIZATION_ERROR', {
        url: error.config?.url,
        status: error.response.status
      });
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      securityLogger.log('RATE_LIMIT_EXCEEDED', {
        url: error.config?.url,
        retryAfter: error.response.headers['retry-after']
      });
    }

    return Promise.reject(error);
  }
);

// Log configuration for debugging
console.log('API Configuration:', {
  baseURL: `${apiBaseUrl}/api`,
  withCredentials: false
});

// Request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
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
      tokenStorage.remove();

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
  const token = tokenStorage.get();
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
          // Use secure token storage
          tokenStorage.set(response.data.token);
          if (response.data.user) {
            userStorage.set(response.data.user);
          }

          // CSRF token generation temporarily disabled
          // const csrfToken = csrfProtection.generateToken();
          // csrfProtection.setToken(csrfToken);

          securityLogger.log('USER_LOGIN', {
            userId: response.data.user?.id,
            email: response.data.user?.email
          });
        }
        return response;
      });
  },
  register: (userData) => {
    return api.post('/auth/register', userData)
      .then(response => {
        securityLogger.log('USER_REGISTER', {
          email: userData.email
        });
        return response;
      });
  },
  profile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  logout: () => {
    // Clear all stored tokens and user data
    tokenStorage.remove();
    userStorage.remove();
    // csrfProtection.removeToken(); // Temporarily disabled

    securityLogger.log('USER_LOGOUT');

    // Redirect to login page
    window.location.href = '/login';
  },
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
    const token = tokenStorage.get();

    securityLogger.log('FILE_UPLOAD_ATTEMPT', {
      hasAuth: !!token
    });

    return axios({
      method: 'POST',
      url: `${apiBaseUrl}/api/journals`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : ''
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
