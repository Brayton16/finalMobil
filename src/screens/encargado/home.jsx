import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEstudiantesByEncargado } from '../../services/encargadosService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';

export function EncargadoInicioScreen() {
    const [user, setUser] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
    const [pendientes, setPendientes] = useState(0); // Simulación de pendientes
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    const fetchUserData = () => {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || 'Encargado',
                    });
                } else {
                    resolve(null);
                }
                unsubscribe(); // Evita que el listener siga activo
            }, reject);
        });
    };

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await fetchUserData();
                if (userData) {
                    setUser(userData);

                    // Obtener estudiantes a cargo
                    const response = await getEstudiantesByEncargado(userData.uid);
                    if (!response || response.length === 0) {
                        Alert.alert('No se encontraron estudiantes asignados a este encargado.');
                    } else {
                        setEstudiantes(response);
                    }

                    // Simulación de carga de pendientes
                    setPendientes(Math.floor(Math.random() * 10) + 1); // Valor aleatorio de pruebas
                } else {
                    Alert.alert('No se pudo obtener los datos del usuario.');
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            } finally {
                setIsLoading(false);
            }
        };

        getUserData();
    }, []);

    const handleNavigateToEstudiantes = () => {
        navigation.navigate('Mis Estudiantes');
    };

    const handleNavigateToPendientes = () => {
        navigation.navigate('Asignaciones');
    };

    const handleNavigateToHorario = () => {
        navigation.navigate('Horario');
    };
    const handleNavigateToNotas = () => {
        navigation.navigate('Notas');
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#2563eb" />
            ) : (
                <>
                    <View style={styles.header}>
                        {user && (
                            <>
                                <Text style={styles.headerTitle}>¡Hola {user.displayName}!</Text>
                            </>
                        )}
                    </View>
                    <TouchableOpacity style={styles.card} onPress={handleNavigateToEstudiantes}>
                        <Icon name="group" size={40} color="#2563eb" />
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Lista de Estudiantes</Text>
                            <Text style={styles.cardSubtitle}>{estudiantes.length} estudiantes a cargo</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={handleNavigateToPendientes}>
                        <Icon name="notifications" size={40} color="#ff9800" />
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Pendientes Generales</Text>
                            <Text style={styles.cardSubtitle}>{pendientes} tareas o eventos por atender</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={handleNavigateToNotas}>
                        <Icon name="assignment" size={40} color="#f44336" />
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Notas Generales</Text>
                            <Text style={styles.cardSubtitle}>Consulta las notas de tus estudiantes a cargo</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.card} onPress={handleNavigateToHorario}>
                        <Icon name="schedule" size={40} color="#4caf50" />
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Horarios</Text>
                            <Text style={styles.cardSubtitle}>Consulta horarios de clases</Text>
                        </View>
                    </TouchableOpacity>
                </>
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2563eb',
        marginVertical: 5,
    },
    cardSubtitle: {
        fontSize: 16,
        color: '#555',
        marginTop: 3,
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default EncargadoInicioScreen;
