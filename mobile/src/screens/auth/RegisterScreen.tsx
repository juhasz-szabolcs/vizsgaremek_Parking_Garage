import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Hiba', 'Kérjük, töltse ki az összes mezőt!');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Hiba', 'A jelszavak nem egyeznek!');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://172.25.16.1:5025/api/users/register', {
                name,
                email,
                password,
            });

            Alert.alert('Sikeres regisztráció', 'Most már bejelentkezhet!', [
                {
                    text: 'OK',
                    onPress: () => navigation.navigate('Login'),
                },
            ]);
        } catch (error) {
            Alert.alert('Hiba', 'A regisztráció sikertelen. Kérjük, próbálja újra!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text h3 style={styles.title}>Parkológarázs</Text>
            <Text h4 style={styles.subtitle}>Regisztráció</Text>

            <Input
                placeholder="Teljes név"
                value={name}
                onChangeText={setName}
                leftIcon={{ type: 'ionicon', name: 'person-outline' }}
            />

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

            <Input
                placeholder="Jelszó megerősítése"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
            />

            <Button
                title="Regisztráció"
                onPress={handleRegister}
                loading={loading}
                containerStyle={styles.buttonContainer}
            />

            <Button
                title="Vissza a bejelentkezéshez"
                type="clear"
                onPress={() => navigation.navigate('Login')}
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

export default RegisterScreen; 