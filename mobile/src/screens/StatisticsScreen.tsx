import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card } from 'react-native-elements';
import { getParkingHistory, getInvoices } from '../services/api';
import { ParkingHistory, Invoice } from '../types';

const StatisticsScreen = () => {
    const [parkingHistory, setParkingHistory] = useState<ParkingHistory[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [history, invoiceData] = await Promise.all([
                getParkingHistory(),
                getInvoices(),
            ]);
            setParkingHistory(history);
            setInvoices(invoiceData);
        } catch (error) {
            console.error('Error loading statistics:', error);
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

    const calculateTotalParkingTime = () => {
        return parkingHistory.reduce((total, history) => {
            const start = new Date(history.startTime);
            const end = new Date(history.endTime);
            const diff = end.getTime() - start.getTime();
            return total + diff;
        }, 0);
    };

    const calculateTotalSpent = () => {
        return parkingHistory.reduce((total, history) => total + history.fee, 0);
    };

    const formatDuration = (ms: number) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} óra ${minutes} perc`;
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Card containerStyle={styles.card}>
                <Text h4 style={styles.cardTitle}>
                    Összesített statisztikák
                </Text>
                <Text style={styles.statText}>
                    Összes parkolás: {parkingHistory.length}
                </Text>
                <Text style={styles.statText}>
                    Összes parkolási idő: {formatDuration(calculateTotalParkingTime())}
                </Text>
                <Text style={styles.statText}>
                    Összes költség: {calculateTotalSpent()} Ft
                </Text>
            </Card>

            <Text h4 style={styles.sectionTitle}>
                Parkolási előzmények
            </Text>
            {parkingHistory.map((history) => (
                <Card key={history.id} containerStyle={styles.card}>
                    <Text style={styles.historyTitle}>
                        {history.carBrand} {history.carModel}
                    </Text>
                    <Text style={styles.historyDetails}>
                        Rendszám: {history.licensePlate}
                    </Text>
                    <Text style={styles.historyDetails}>
                        Parkolóhely: {history.floorNumber}. emelet - {history.spotNumber}. hely
                    </Text>
                    <Text style={styles.historyDetails}>
                        Kezdés: {new Date(history.startTime).toLocaleString()}
                    </Text>
                    <Text style={styles.historyDetails}>
                        Befejezés: {new Date(history.endTime).toLocaleString()}
                    </Text>
                    <Text style={styles.historyDetails}>
                        Díj: {history.fee} Ft
                    </Text>
                </Card>
            ))}

            <Text h4 style={styles.sectionTitle}>
                Számlák
            </Text>
            {invoices.map((invoice) => (
                <Card key={invoice.id} containerStyle={styles.card}>
                    <Text style={styles.invoiceTitle}>
                        Számla #{invoice.invoiceNumber}
                    </Text>
                    <Text style={styles.invoiceDetails}>
                        Kiállítás dátuma: {new Date(invoice.issueDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.invoiceDetails}>
                        Lejárat dátuma: {new Date(invoice.dueDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.invoiceDetails}>
                        Összeg: {invoice.amount} Ft
                    </Text>
                    <Text style={styles.invoiceDetails}>
                        Státusz: {invoice.status}
                    </Text>
                </Card>
            ))}
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
        marginBottom: 10,
        marginHorizontal: 15,
    },
    cardTitle: {
        textAlign: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        margin: 15,
        color: '#333',
    },
    statText: {
        fontSize: 16,
        marginBottom: 10,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    historyDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    invoiceTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    invoiceDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
});

export default StatisticsScreen; 