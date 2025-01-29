import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';
export function EstudianteScreen() {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    const handleNavigateToAssignments = () => {
      navigation.navigate('Asignaciones'); // Nombre de la pantalla de asignaciones en el Drawer
    };
  
    const handleNavigateToNotes = () => {
      navigation.navigate('Notas'); // Nombre de la pantalla de notas en el Drawer
    };
    
    const handleNavigateToHorario = () => {
      navigation.navigate('Horario'); // Nombre de la pantalla de notas en el Drawer
    };
    
    const fetchUserData = () => {
        return new Promise((resolve, reject) => {
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
              resolve({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || 'Estudiante',
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
                console.log('Usuario autenticado:', userData);
            } else {
                console.log('No hay usuario autenticado');
            }
            } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            }
        };

        getUserData();  
    }, []);
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado */}
        {user ? (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>¡Hola {user.displayName}!</Text>
            <Text style={styles.headerSubtitle}>
            Aquí tienes un resumen de tus actividades
            </Text>
        </View>
        ) : (
        <View style={styles.header}>
            <Text style={styles.headerTitle}></Text>
        </View>
        )}
  
        {/* Sección de Asignaciones */}
        <TouchableOpacity style={styles.card} onPress={handleNavigateToAssignments}>
          <Icon name="assignment" size={40} color="#2563eb" />
          <Text style={styles.cardTitle}>Asignaciones</Text>
          <Text style={styles.cardDescription}>
            Accede rápidamente a las tareas asignadas en tus grupos.
          </Text>
        </TouchableOpacity>
  
        {/* Sección de Notas */}
        <TouchableOpacity style={styles.card} onPress={handleNavigateToNotes}>
          <Icon name="grading" size={40} color="#2563eb" />
          <Text style={styles.cardTitle}>Notas</Text>
          <Text style={styles.cardDescription}>
            Consulta tus calificaciones y el rendimiento en tus materias.
          </Text>
        </TouchableOpacity>

        {/* Sección de Horario */}
        <TouchableOpacity style={styles.card} onPress={handleNavigateToHorario}>
          <Icon name="calendar-month" size={40} color="#2563eb" />
          <Text style={styles.cardTitle}>Horario</Text>
          <Text style={styles.cardDescription}>
            Consulta tu horario y tus clases programadas.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#f8f9fa',
    },
    header: {
      marginBottom: 20,
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
    },
    card: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      elevation: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2563eb',
      marginTop: 10,
    },
    cardDescription: {
      fontSize: 14,
      color: '#555',
      textAlign: 'center',
      marginTop: 5,
    },
  });
  
