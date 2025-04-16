import apiClient, { API_URL } from './apiClient';
import { getCarLogo } from './utils/carLogos';

// Configure axios defaults
apiClient.defaults.withCredentials = true;
apiClient.defaults.headers.common['Content-Type'] = 'application/json';

// Helper function for API calls
export async function apiCall(endpoint, options = {}) {
    try {
        // console.log('Making API call to:', `${API_URL}${endpoint}`);
        // console.log('API URL from env:', API_URL);
        // console.log('Full request config:', {
        //     method: options.method || 'GET',
        //     url: `${API_URL}${endpoint}`,
        //     data: options.data,
        //     withCredentials: true,
        //     headers: {
        //         'Content-Type': 'application/json',
        //         ...options.headers
        //     }
        // });
        
        const response = await apiClient({
            method: options.method || 'GET',
            url: endpoint,
            data: options.data,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        return response.data;
    } catch (error) {
        console.error('API call error:', error);
        console.error('Request URL:', `${API_URL}${endpoint}`);
        console.error('Request method:', options.method || 'GET');
        console.error('Request data:', options.data);
        console.error('Request headers:', options.headers);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
}

export async function register(user) {
    try {
        const response = await apiCall('/api/users/register', {
            method: 'POST',
            data: user
        });
        console.log('Registration response:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Registration error:', error.response?.data || error);
        return { success: false, error: error.response?.data || 'Registration failed' };
    }
}

export async function login(email, password) {
    try {
        // console.log('Login attempt with email:', email);
        // console.log('API URL:', API_URL);
        
        const response = await apiCall('/api/users/login', {
            method: 'POST',
            data: { email, password }
        });
        
        // console.log('Login response:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Login error:', error.response?.data || error);
        console.error('Login error details:', {
            message: error.message,
            code: error.code,
            response: error.response?.data,
            status: error.response?.status
        });
        return { success: false, error: error.response?.data || 'Login failed' };
    }
}

export async function logout() {
    try {
        const response = await apiCall('/api/users/logout', {
            method: 'POST'
        });
        console.log('Logout response:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Logout error:', error.response?.data || error);
        return { success: false, error: error.response?.data || 'Logout failed' };
    }
}

export async function getUserData(userId) {
    try {
        let userResponse = null;
        
        // Get user details if userId is provided
        if (userId) {
            try {
                userResponse = await apiCall(`/api/users/${userId}`);
                // console.log('User details response:', userResponse);
            } catch (error) {
                console.error('Error getting user details:', error);
                // If we can't get user details, return error
                return { success: false, error: 'Failed to get user details' };
            }
        }
        
        // Get cars data
        try {
            const carsResponse = await apiCall('/api/cars');
            // console.log('Cars response:', carsResponse);
            
            // Transform the car data to match our frontend structure
            const cars = carsResponse.map(car => ({
                id: car.id,
                brand: car.brand,
                model: car.model,
                year: car.year,
                licensePlate: car.licensePlate,
                isOwn: true,
                color: "N/A",
                isParking: car.isParked,
                logo: getCarLogo(car.brand),
                parkingSpot: null
            }));
            
            // console.log('Transformed cars:', cars);
            
            return { 
                success: true, 
                data: {
                    ...(userResponse || {}),
                    cars: cars,
                    activeParkings: [] // We'll handle this separately if needed
                }
            };
        } catch (error) {
            console.error('Error getting cars data:', error);
            // If we can't get cars data, return error
            return { success: false, error: 'Failed to get cars data' };
        }
    } catch (error) {
        console.error('Error in getUserData:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}

export async function createCar(car) {
    try {
        const response = await apiCall('/api/cars', {
            method: 'POST',
            data: car
        });
        // console.log('Create car response:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Create car error:', error.response?.data || error);
        return { success: false, error: error.response?.data || 'Failed to create car' };
    }
}

// Parkolás indítása
export async function startParking(carId, parkingSpotId) {
    try {
        // console.log('Starting parking with raw data:', { carId, parkingSpotId });
        
        // Ensure both values are valid numbers
        const parsedCarId = parseInt(carId);
        const parsedSpotId = parseInt(parkingSpotId);
        
        if (isNaN(parsedCarId) || parsedCarId <= 0) {
            console.error('Invalid carId:', carId);
            return {
                success: false,
                error: 'Érvénytelen autó azonosító'
            };
        }
        
        if (isNaN(parsedSpotId) || parsedSpotId <= 0) {
            console.error('Invalid parkingSpotId:', parkingSpotId);
            return {
                success: false,
                error: 'Érvénytelen parkolóhely azonosító'
            };
        }
        
        const data = {
            carId: parsedCarId,
            parkingSpotId: parsedSpotId
        };
        
        // console.log('Sending data to server:', data);
        const response = await apiCall('/api/parking/start', {
            method: 'POST',
            data: data
        });
        
        // console.log('Server response:', response);
        return {
            success: true,
            data: response
        };
    } catch (error) {
        console.error('Error starting parking:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        return {
            success: false,
            error: error.response?.data || 'Hiba történt a parkolás indítása során.'
        };
    }
}

// Parkolás leállítása
export async function stopParking(carId) {
    try {
        // console.log('Stopping parking for car:', carId);
        const response = await apiCall('/api/parking/end', {
            method: 'POST',
            data: { carId: parseInt(carId) }
        });
        // console.log('Stop parking response:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error stopping parking:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        return { 
            success: false, 
            error: error.response?.data || 'Hiba történt a parkolás leállítása során.' 
        };
    }
}

// Autó törlése
export async function deleteCar(carId) {
    try {
        // console.log('Deleting car:', carId);
        const response = await apiCall(`/api/cars/${carId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            }
        });
        // console.log('Delete car response:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error deleting car:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        // Handle specific error cases
        if (error.response?.status === 401 || error.response?.status === 403) {
            return { 
                success: false, 
                error: 'Nincs jogosultsága az autó törléséhez. Kérjük, jelentkezzen be újra.' 
            };
        }
        
        return { 
            success: false, 
            error: error.response?.data || 'Hiba történt az autó törlése során.' 
        };
    }
}

export async function getMonthlyRevenue(year) {
    try {
        // console.log('Getting monthly revenue for year:', year);
        const response = await apiCall(`/api/admin/statistics/monthly-revenue?year=${year}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        // console.log('Monthly revenue response:', response);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error getting monthly revenue:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        return { 
            success: false, 
            error: error.response?.data || 'Hiba történt az adatok betöltése során.' 
        };
    }
}

// Statisztika adatok lekérdezése
export async function getStatistics() {
    try {
        const [historyResponse, summaryResponse, carStatsResponse] = await Promise.all([
            apiCall('/api/statistics/history'),
            apiCall('/api/statistics/summary'),
            apiCall('/api/statistics/by-car')
        ]);

        return {
            success: true,
            data: {
                history: historyResponse,
                summary: summaryResponse,
                carStats: carStatsResponse
            }
        };
    } catch (error) {
        console.error('Error getting statistics:', error);
        return {
            success: false,
            error: error.response?.data || 'Hiba történt a statisztika adatok betöltése során.'
        };
    }
}

// Havi statisztika lekérdezése
export async function getMonthlyStatistics(year, month) {
    try {
        const response = await apiCall(`/api/statistics/monthly?year=${year}&month=${month}`);
        return {
            success: true,
            data: response
        };
    } catch (error) {
        console.error('Error getting monthly statistics:', error);
        return {
            success: false,
            error: error.response?.data || 'Hiba történt a havi statisztika adatok betöltése során.'
        };
    }
}