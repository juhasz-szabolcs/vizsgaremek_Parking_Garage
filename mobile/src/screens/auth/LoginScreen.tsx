import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Hiba', 'Kérjük, töltse ki az összes mezőt!');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://172.25.16.1:5025/api/users/login', {
                email,
                password,
            });

            if (response.status === 200 && response.data) {
                await AsyncStorage.setItem('userData', JSON.stringify(response.data));
                await AsyncStorage.setItem('isLoggedIn', 'true');

                Alert.alert('Sikeres bejelentkezés', 'Üdvözöljük!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Dashboard'),
                    },
                ]);
            } else {
                Alert.alert('Hiba', 'Ismeretlen hiba történt a bejelentkezés során.');
            }
        } catch (error: any) {
            let errorMessage = 'A bejelentkezés sikertelen. Kérjük, próbálja újra!';
            if (error.response) {
                console.error("Login Error Response:", error.response.data);
                if (error.response.status === 401) {
                    errorMessage = 'Hibás email cím vagy jelszó.';
                } else {
                    errorMessage = `Szerverhiba: ${error.response.status}`;
                }
            } else if (error.request) {
                console.error("Login Error Request:", error.request);
                errorMessage = 'Nem sikerült kapcsolatot létesíteni a szerverrel.';
            } else {
                console.error('Login Error Message:', error.message);
                errorMessage = `Hiba történt: ${error.message}`;
            }
            Alert.alert('Hiba', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text h3 style={styles.title}>Parkológarázs</Text>
            <Text h4 style={styles.subtitle}>Bejelentkezés</Text>

            <Input
                placeholder="Email cím"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={{ type: 'ionicon', name: 'mail-outline' }}
            />

            <Input
                placeholder="Jelszó"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
            />

            <Button
                title="Bejelentkezés"
                onPress={handleLogin}
                loading={loading}
                containerStyle={styles.buttonContainer}
            />

            <Button
                title="Regisztráció"
                type="clear"
                onPress={() => navigation.navigate('Register')}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#2089dc',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 30,
        color: '#666',
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 10,
    },
});

export default LoginScreen; 