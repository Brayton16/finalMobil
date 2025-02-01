import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEstudiantesByEncargado } from '../../services/encargadosService';
import { getGruposByEstudiante } from '../../services/grupoCursoService';
import { obtenerAsignacionesByGrupo } from '../../services/asignacionesService';
import { getEntregasByEstudiante } from '../../services/entregasService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';

export function EncargadoInicioScreen() {
    const [user, setUser] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
    const [pendientes, setPendientes] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
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
                    unsubscribe();
                }, reject);
            });
        };

        const getUserData = async () => {
            try {
                const userData = await fetchUserData();
                if (userData) {
                    setUser(userData);
                    const response = await getEstudiantesByEncargado(userData.uid);
                    setEstudiantes(response);

                    if (!response || response.length === 0) {
                        Alert.alert('No se encontraron estudiantes asignados a este encargado.');
                    } else {
                        await fetchPendientes(response);
                    }
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

    const fetchPendientes = async (estudiantesLista) => {
        try {
            let totalPendientes = 0;
            for (const estudiante of estudiantesLista) {
                // Obtener los grupos de cada estudiante
                const grupos = await getGruposByEstudiante(estudiante.id);

                for (const grupo of grupos) {
                    // Obtener todas las asignaciones del grupo
                    const asignaciones = await obtenerAsignacionesByGrupo(grupo.idGrupoCurso);

                    // Obtener entregas del estudiante en este grupo
                    const entregas = await getEntregasByEstudiante(estudiante.id, grupo.idGrupoCurso);

                    // Contar las asignaciones que no tienen una entrega o tienen estado "no entregada"
                    const pendientesEstudiante = asignaciones.filter((asignacion) => {
                        const entrega = entregas.find((e) => e.idAsignacion === asignacion.id);
                        return !entrega || entrega.estado !== 'entregada';
                    }).length;

                    totalPendientes += pendientesEstudiante;
                }
            }
            setPendientes(totalPendientes);
        } catch (error) {
            console.error("Error obteniendo los pendientes:", error);
        }
    };

    const handleNavigationToAnnouncements = () => {
        navigation.navigate('Anuncios');
    };

    const handleNavigateToEstudiantes = () => {
        navigation.navigate('Mis Estudiantes');
    };

    const handleNavigateToPendientes = () => {
        navigation.navigate('Asignaciones');
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
                    {/* Sección de Anuncios */}
                    <TouchableOpacity style={styles.card} onPress={handleNavigationToAnnouncements}>
                        <Icon name="announcement" size={40} color="green" />
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>Anuncios</Text>
                            <Text style={styles.cardSubtitle}>
                            Accede rápidamente a los anuncios de tus profesores.
                            </Text>
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
