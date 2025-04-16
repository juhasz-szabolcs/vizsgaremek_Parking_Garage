import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Card, Button, Input, Overlay } from 'react-native-elements';
import { getUserCars, addCar, updateCar, deleteCar } from '../services/api';
import { Car } from '../types';

const CarsScreen = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [licensePlate, setLicensePlate] = useState('');

    const loadCars = async () => {
        try {
            const userCars = await getUserCars();
            setCars(userCars);
        } catch (error) {
            console.error('Error loading cars:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadCars();
        setRefreshing(false);
    };

    useEffect(() => {
        loadCars();
    }, []);

    const handleAddCar = async () => {
        if (!brand || !model || !year || !licensePlate) {
            Alert.alert('Hiba', 'Kérjük, töltse ki az összes mezőt!');
            return;
        }

        try {
            await addCar({
                brand,
                model,
                year: parseInt(year),
                licensePlate,
                isParked: false,
            });
            setVisible(false);
            resetForm();
            loadCars();
        } catch (error) {
            Alert.alert('Hiba', 'Nem sikerült hozzáadni az autót!');
        }
    };

    const handleEditCar = async () => {
        if (!editingCar || !brand || !model || !year || !licensePlate) {
            Alert.alert('Hiba', 'Kérjük, töltse ki az összes mezőt!');
            return;
        }

        try {
            await updateCar(editingCar.id, {
                brand,
                model,
                year: parseInt(year),
                licensePlate,
            });
            setVisible(false);
            resetForm();
            loadCars();
        } catch (error) {
            Alert.alert('Hiba', 'Nem sikerült módosítani az autót!');
        }
    };

    const handleDeleteCar = async (carId: number) => {
        Alert.alert(
            'Autó törlése',
            'Biztosan törölni szeretné ezt az autót?',
            [
                { text: 'Mégse', style: 'cancel' },
                {
                    text: 'Törlés',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteCar(carId);
                            loadCars();
                        } catch (error) {
                            Alert.alert('Hiba', 'Nem sikerült törölni az autót!');
                        }
                    },
                },
            ]
        );
    };

    const resetForm = () => {
        setBrand('');
        setModel('');
        setYear('');
        setLicensePlate('');
        setEditingCar(null);
    };

    const openAddModal = () => {
        resetForm();
        setVisible(true);
    };

    const openEditModal = (car: Car) => {
        setEditingCar(car);
        setBrand(car.brand);
        setModel(car.model);
        setYear(car.year.toString());
        setLicensePlate(car.licensePlate);
        setVisible(true);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Button
                    title="Új autó hozzáadása"
                    onPress={openAddModal}
                    containerStyle={styles.addButton}
                />
                {cars.map((car) => (
                    <Card key={car.id} containerStyle={styles.card}>
                        <Text style={styles.carTitle}>
                            {car.brand} {car.model}
                        </Text>
                        <Text style={styles.carDetails}>Rendszám: {car.licensePlate}</Text>
                        <Text style={styles.carDetails}>Évjárat: {car.year}</Text>
                        <Text style={styles.carDetails}>
                            Állapot: {car.isParked ? 'Parkolva' : 'Szabad'}
                        </Text>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Szerkesztés"
                                type="outline"
                                onPress={() => openEditModal(car)}
                                containerStyle={styles.button}
                            />
                            <Button
                                title="Törlés"
                                type="outline"
                                buttonStyle={styles.deleteButton}
                                titleStyle={styles.deleteButtonText}
                                onPress={() => handleDeleteCar(car.id)}
                                containerStyle={styles.button}
                            />
                        </View>
                    </Card>
                ))}
            </ScrollView>

            <Overlay isVisible={visible} onBackdropPress={() => setVisible(false)}>
                <View style={styles.modalContainer}>
                    <Text h4 style={styles.modalTitle}>
                        {editingCar ? 'Autó szerkesztése' : 'Új autó hozzáadása'}
                    </Text>
                    <Input
                        placeholder="Márka"
                        value={brand}
                        onChangeText={setBrand}
                    />
                    <Input
                        placeholder="Modell"
                        value={model}
                        onChangeText={setModel}
                    />
                    <Input
                        placeholder="Évjárat"
                        value={year}
                        onChangeText={setYear}
                        keyboardType="numeric"
                    />
                    <Input
                        placeholder="Rendszám"
                        value={licensePlate}
                        onChangeText={setLicensePlate}
                    />
                    <View style={styles.modalButtons}>
                        <Button
                            title="Mégse"
                            type="outline"
                            onPress={() => setVisible(false)}
                            containerStyle={styles.modalButton}
                        />
                        <Button
                            title={editingCar ? 'Mentés' : 'Hozzáadás'}
                            onPress={editingCar ? handleEditCar : handleAddCar}
                            containerStyle={styles.modalButton}
                        />
                    </View>
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
    addButton: {
        margin: 15,
    },
    card: {
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 15,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    deleteButton: {
        borderColor: 'red',
    },
    deleteButtonText: {
        color: 'red',
    },
    modalContainer: {
        width: 300,
        padding: 20,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default CarsScreen; 