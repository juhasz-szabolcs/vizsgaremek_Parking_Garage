export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isAdmin: boolean;
    cars: Car[];
}

export interface Car {
    id: number;
    brand: string;
    model: string;
    year: number;
    licensePlate: string;
    isParked: boolean;
}

export interface ParkingSpot {
    id: number;
    floorNumber: number;
    spotNumber: number;
    isOccupied: boolean;
    carId: number | null;
    startTime: string | null;
    endTime: string | null;
}

export interface ParkingHistory {
    id: number;
    startTime: string;
    endTime: string;
    floorNumber: number;
    spotNumber: number;
    fee: number;
    carId: number;
    carBrand: string;
    carModel: string;
    licensePlate: string;
    userId: number;
    userName: string;
    userEmail: string;
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    userId: number;
    parkingHistoryId: number;
    amount: number;
    issueDate: string;
    dueDate: string;
    status: string;
}

export interface LoginResponse {
    message: string;
    user: string;
    userId: number;
    isAdmin: boolean;
    loginTime: string;
    expiresAt: string;
} 