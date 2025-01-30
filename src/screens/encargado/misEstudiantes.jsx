import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { getEstudiantesByEncargado } from '../../services/encargadosService'; // 📌 Importar servicio
import { auth } from '../../services/firebase';

export function MisEstudiantesScreen() {
    const [user, setUser] = useState(null);
    const [estudiantes, setEstudiantes] = useState([]);
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

    const renderItem = ({ item }) => (
      <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('DetalleEstudiante', { estudiante: item })} // 📌 Nombre corregido
      >
          <Icon name="person" size={40} color="#2563eb" />
          <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.nombre} {item.apellido}</Text>
              <Text style={styles.cardSubtitle}>📧 {item.correo}</Text>
              <Text style={styles.cardEncargado}>🎓 Grado: {item.grado}</Text>
          </View>
      </TouchableOpacity>
  );  

    const renderHeader = () => (
        <View style={styles.header}>
            {user && (
                <>
                    <Text style={styles.headerTitle}>¡Hola {user.displayName}!</Text>
                    <Text style={styles.headerSubtitle}>Aquí tienes los estudiantes a tu cargo.</Text>
                </>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#2563eb" />
            ) : estudiantes.length === 0 ? (
                <Text style={styles.noStudentsText}>No tienes estudiantes a cargo.</Text>
            ) : (
                <FlatList
                    data={estudiantes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader} 
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
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#555',
        marginTop: 10,
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
        paddingVertical: 20,
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
        marginVertical: 5,
    },
    cardEncargado: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
        marginVertical: 5,
    },
});

export default MisEstudiantesScreen;
