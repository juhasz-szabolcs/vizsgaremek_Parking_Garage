import axios from 'axios';
import { user, isAuthenticated } from './store';
import { goto } from '$app/navigation';

// API URL configuration
export const API_URL = import.meta.env.VITE_API_URL;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Create axios instance with interceptors
const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Function to handle session expiration
function handleSessionExpiration() {
    console.log('Session expired, clearing user data and redirecting to home page');
    user.set(null);
    isAuthenticated.set(false);
    localStorage.removeItem('user');
    goto('/', { replaceState: true });
}

// Add request interceptor to ensure authentication
apiClient.interceptors.request.use(
    (config) => {
        // Add any necessary authentication headers here
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle session expiration
apiClient.interceptors.response.use(
    (response) => {
        // Check if the response contains user data with expiresAt
        if (response.data && response.data.expiresAt) {
            const expiresAt = new Date(response.data.expiresAt);
            const now = new Date();
            
            // If the session has expired, handle it
            if (expiresAt < now) {
                handleSessionExpiration();
            }
        }
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        
        // Handle 401 (Unauthorized) and 403 (Forbidden) errors
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Don't redirect if we're on the login page
            const isLoginPage = window.location.pathname === '/login';
            if (!isLoginPage) {
                handleSessionExpiration();
            }
        }
        
        return Promise.reject(error);
    }
);

// Export the configured axios instance
export default apiClient; 