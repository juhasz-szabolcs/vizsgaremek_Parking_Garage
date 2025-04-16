import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button } from '@rneui/themed';
import { getMyParkedCars, getAvailableSpots } from '../services/api';
import { Car, ParkingSpot } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardScreen = () => {
    const [parkedCars, setParkedCars] = useState<Car[]>([]);
    const [availableSpots, setAvailableSpots] = useState<ParkingSpot[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [cars, spots] = await Promise.all([
                getMyParkedCars(),
                getAvailableSpots(),
            ]);
            setParkedCars(cars);
            setAvailableSpots(spots);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    useEffect(() => {
        // loadData(); // Ideiglenesen kikommentelve a teszteléshez
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text h4 style={styles.sectionTitle}>
                    Parkolóhelyek
                </Text>
                <Card containerStyle={styles.card}>
                    <Text style={styles.cardTitle}>
                        Szabad parkolóhelyek: {availableSpots.length}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        Összes parkolóhely: {availableSpots.length + parkedCars.length}
                    </Text>
                </Card>

                <Text h4 style={styles.sectionTitle}>
                    Parkolt autók
                </Text>
                {parkedCars.length === 0 ? (
                    <Card containerStyle={styles.card}>
                        <Text style={styles.cardText}>Nincs parkolt autó</Text>
                    </Card>
                ) : (
                    parkedCars.map((car) => (
                        <Card key={car.id} containerStyle={styles.card}>
                            <Text style={styles.carTitle}>
                                {car.brand} {car.model}
                            </Text>
                            <Text style={styles.carDetails}>
                                Rendszám: {car.licensePlate}
                            </Text>
                            <Text style={styles.carDetails}>
                                Évjárat: {car.year}
                            </Text>
                        </Card>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
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
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    cardText: {
        fontSize: 16,
        textAlign: 'center',
    },
    carTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    carDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
});

export default DashboardScreen; 