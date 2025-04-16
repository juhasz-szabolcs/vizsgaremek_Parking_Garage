import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Car, ParkingSpot, ParkingHistory, Invoice, LoginResponse } from '../types';

const API_URL = 'http://localhost:5025/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/users/login', { email, password });
    return response.data;
};

export const logout = async (): Promise<void> => {
    await api.post('/users/logout');
};

export const register = async (userData: Partial<User>): Promise<void> => {
    await api.post('/users/register', userData);
};

// Users
export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
};

export const updateUser = async (userId: number, userData: Partial<User>): Promise<void> => {
    await api.put(`/users/${userId}`, userData);
};

// Cars
export const getUserCars = async (): Promise<Car[]> => {
    const response = await api.get<Car[]>('/cars');
    return response.data;
};

export const addCar = async (carData: Partial<Car>): Promise<Car> => {
    const response = await api.post<Car>('/cars', carData);
    return response.data;
};

export const updateCar = async (carId: number, carData: Partial<Car>): Promise<void> => {
    await api.put(`/cars/${carId}`, carData);
};

export const deleteCar = async (carId: number): Promise<void> => {
    await api.delete(`/cars/${carId}`);
};

// Parking
export const getAvailableSpots = async (): Promise<ParkingSpot[]> => {
    const response = await api.get<ParkingSpot[]>('/parking/spots/available');
    return response.data;
};

export const getAllSpots = async (): Promise<ParkingSpot[]> => {
    const response = await api.get<ParkingSpot[]>('/parking/spots');
    return response.data;
};

export const startParking = async (carId: number, parkingSpotId: number): Promise<void> => {
    await api.post('/parking/start', { carId, parkingSpotId });
};

export const endParking = async (carId: number): Promise<void> => {
    await api.post('/parking/end', { carId });
};

export const getMyParkedCars = async (): Promise<Car[]> => {
    const response = await api.get<Car[]>('/parking/my');
    return response.data;
};

export const getParkingStatus = async (carId: number): Promise<ParkingSpot> => {
    const response = await api.get<ParkingSpot>(`/parking/status/${carId}`);
    return response.data;
};

// History
export const getParkingHistory = async (): Promise<ParkingHistory[]> => {
    const response = await api.get<ParkingHistory[]>('/parking/history');
    return response.data;
};

// Invoices
export const getInvoices = async (): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>('/invoices');
    return response.data;
};

export const getInvoice = async (invoiceId: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${invoiceId}`);
    return response.data;
};

// Error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            await AsyncStorage.removeItem('user');
            // You might want to redirect to login screen here
        }
        return Promise.reject(error);
    }
); 