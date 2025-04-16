import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Card, Button, Overlay } from 'react-native-elements';
import {
    getAvailableSpots,
    getUserCars,
    startParking,
    endParking,
    getParkingStatus,
} from '../services/api';
import { Car, ParkingSpot } from '../types';

const ParkingScreen = () => {
    const [availableSpots, setAvailableSpots] = useState<ParkingSpot[]>([]);
    const [userCars, setUserCars] = useState<Car[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
    const [showCarModal, setShowCarModal] = useState(false);
    const [showSpotModal, setShowSpotModal] = useState(false);

    const loadData = async () => {
        try {
            const [spots, cars] = await Promise.all([
                getAvailableSpots(),
                getUserCars(),
            ]);
            setAvailableSpots(spots);
            setUserCars(cars);
        } catch (error) {
            console.error('Error loading parking data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleStartParking = async () => {
        if (!selectedCar || !selectedSpot) {
            Alert.alert('Hiba', 'Kérjük, válasszon autót és parkolóhelyet!');
            return;
        }

        try {
            await startParking(selectedCar.id, selectedSpot.id);
            Alert.alert('Sikeres', 'Az autó sikeresen le lett parkolva!');
            setShowCarModal(false);
            setShowSpotModal(false);
            loadData();
        } catch (error) {
            Alert.alert('Hiba', 'Nem sikerült leparkolni az autót!');
        }
    };

    const handleEndParking = async (car: Car) => {
        try {
            await endParking(car.id);
            Alert.alert('Sikeres', 'A parkolás sikeresen befejeződött!');
            loadData();
        } catch (error) {
            Alert.alert('Hiba', 'Nem sikerült befejezni a parkolást!');
        }
    };

    const openCarSelection = (spot: ParkingSpot) => {
        setSelectedSpot(spot);
        setShowCarModal(true);
    };

    const openSpotSelection = (car: Car) => {
        setSelectedCar(car);
        setShowSpotModal(true);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text h4 style={styles.sectionTitle}>
                    Parkolóhelyek
                </Text>
                {availableSpots.map((spot) => (
                    <Card key={spot.id} containerStyle={styles.card}>
                        <Text style={styles.spotTitle}>
                            {spot.floorNumber}. emelet - {spot.spotNumber}. hely
                        </Text>
                        <Button
                            title="Parkolás kezdése"
                            onPress={() => openCarSelection(spot)}
                            containerStyle={styles.buttonContainer}
                        />
                    </Card>
                ))}

                <Text h4 style={styles.sectionTitle}>
                    Parkolt autók
                </Text>
                {userCars
                    .filter((car) => car.isParked)
                    .map((car) => (
                        <Card key={car.id} containerStyle={styles.card}>
                            <Text style={styles.carTitle}>
                                {car.brand} {car.model}
                            </Text>
                            <Text style={styles.carDetails}>
                                Rendszám: {car.licensePlate}
                            </Text>
                            <Button
                                title="Parkolás befejezése"
                                onPress={() => handleEndParking(car)}
                                buttonStyle={styles.endButton}
                                containerStyle={styles.buttonContainer}
                            />
                        </Card>
                    ))}
            </ScrollView>

            <Overlay
                isVisible={showCarModal}
                onBackdropPress={() => setShowCarModal(false)}
            >
                <View style={styles.modalContainer}>
                    <Text h4 style={styles.modalTitle}>
                        Válassz autót
                    </Text>
                    {userCars
                        .filter((car) => !car.isParked)
                        .map((car) => (
                            <Button
                                key={car.id}
                                title={`${car.brand} ${car.model} - ${car.licensePlate}`}
                                onPress={() => {
                                    setSelectedCar(car);
                                    setShowCarModal(false);
                                    setShowSpotModal(true);
                                }}
                                containerStyle={styles.modalButton}
                            />
                        ))}
                    <Button
                        title="Mégse"
                        type="outline"
                        onPress={() => setShowCarModal(false)}
                        containerStyle={styles.modalButton}
                    />
                </View>
            </Overlay>

            <Overlay
                isVisible={showSpotModal}
                onBackdropPress={() => setShowSpotModal(false)}
            >
                <View style={styles.modalContainer}>
                    <Text h4 style={styles.modalTitle}>
                        Válassz parkolóhelyet
                    </Text>
                    {availableSpots.map((spot) => (
                        <Button
                            key={spot.id}
                            title={`${spot.floorNumber}. emelet - ${spot.spotNumber}. hely`}
                            onPress={() => {
                                setSelectedSpot(spot);
                                handleStartParking();
                            }}
                            containerStyle={styles.modalButton}
                        />
                    ))}
                    <Button
                        title="Mégse"
                        type="outline"
                        onPress={() => setShowSpotModal(false)}
                        containerStyle={styles.modalButton}
                    />
                </View>
            </Overlay>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    sectionTitle: {
        margin: 15,
        color: '#333',
    },
    card: {
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 15,
    },
    spotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    carTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    carDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 10,
    },
    endButton: {
        backgroundColor: '#dc3545',
    },
    modalContainer: {
        width: 300,
        padding: 20,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        marginBottom: 10,
    },
});

export default ParkingScreen; 