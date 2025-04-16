import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser, updateUser, logout } from '../services/api';
import { User } from '../types';

const ProfileScreen = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();

    const loadUserData = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setEmail(userData.email);
            setPhoneNumber(userData.phoneNumber);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    const handleUpdate = async () => {
        if (!user) return;

        try {
            await updateUser(user.id, {
                firstName,
                lastName,
                email,
                phoneNumber,
                newPassword: newPassword || undefined,
            });
            Alert.alert('Sikeres', 'A profil sikeresen frissítve!');
            setIsEditing(false);
            setNewPassword('');
            loadUserData();
        } catch (error) {
            Alert.alert('Hiba', 'Nem sikerült frissíteni a profilt!');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            await AsyncStorage.removeItem('user');
            navigation.navigate('Login' as never);
        } catch (error) {
            Alert.alert('Hiba', 'Nem sikerült kijelentkezni!');
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Betöltés...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card containerStyle={styles.card}>
                <Text h4 style={styles.cardTitle}>
                    Profil adatok
                </Text>
                {isEditing ? (
                    <>
                        <Input
                            placeholder="Keresztnév"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <Input
                            placeholder="Vezetéknév"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <Input
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <Input
                            placeholder="Telefonszám"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />
                        <Input
                            placeholder="Új jelszó (opcionális)"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Mentés"
                                onPress={handleUpdate}
                                containerStyle={styles.button}
                            />
                            <Button
                                title="Mégse"
                                type="outline"
                                onPress={() => {
                                    setIsEditing(false);
                                    setNewPassword('');
                                    loadUserData();
                                }}
                                containerStyle={styles.button}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.label}>Keresztnév:</Text>
                        <Text style={styles.value}>{user.firstName}</Text>
                        <Text style={styles.label}>Vezetéknév:</Text>
                        <Text style={styles.value}>{user.lastName}</Text>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{user.email}</Text>
                        <Text style={styles.label}>Telefonszám:</Text>
                        <Text style={styles.value}>{user.phoneNumber}</Text>
                        <Button
                            title="Szerkesztés"
                            onPress={() => setIsEditing(true)}
                            containerStyle={styles.editButton}
                        />
                    </>
                )}
            </Card>

            <Button
                title="Kijelentkezés"
                onPress={handleLogout}
                buttonStyle={styles.logoutButton}
                containerStyle={styles.logoutContainer}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        borderRadius: 10,
        margin: 15,
    },
    cardTitle: {
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
    },
    editButton: {
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
    },
    logoutContainer: {
        margin: 15,
    },
});

export default ProfileScreen; 