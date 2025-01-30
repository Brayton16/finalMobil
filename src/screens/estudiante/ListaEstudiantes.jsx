import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEstudiantesBySeccion } from '../../services/estudiantesService';
import { getEncargadoById } from '../../services/encargadosService';
export function ListaEstudiantesScreen() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEstudiantes = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (!userId) {
                    console.error('No se encontró el ID del usuario.');
                    setIsLoading(false);
                    return;
                }

                const response = await getEstudiantesBySeccion(userId);
                if (!response || !response.estudiantes || response.estudiantes.length === 0) {
                    console.error('No se encontraron estudiantes en esta sección.');
                    setIsLoading(false);
                    return;
                }

                console.log("Estudiantes obtenidos:", response);


                setEstudiantes(response.estudiantes);
            } catch (error) {
                console.error('Error al obtener los estudiantes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEstudiantes();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Icon name="person" size={40} color="#2563eb" />
            <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.nombre} {item.apellido}</Text>
                <Text style={styles.cardSubtitle}>📧 {item.correo}</Text>
                <Text style={styles.cardEncargado}>👨‍👩‍👦 Encargado: {item.encargado || 'No asignado'}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Lista de Estudiantes</Text>
            {isLoading ? (
                <ActivityIndicator size="large" color="#2563eb" />
            ) : estudiantes.length === 0 ? (
                <Text style={styles.noStudentsText}>No hay estudiantes en esta sección.</Text>
            ) : (
                <FlatList
                    data={estudiantes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    noStudentsText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 3,
    },
    cardInfo: {
        marginLeft: 10,
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#555',
        marginTop: 3,
    },
    cardEncargado: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
});

export default ListaEstudiantesScreen;
