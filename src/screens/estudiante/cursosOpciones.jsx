import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { getCursoById } from '../../services/cursosService';
import { getGrupoCursoById } from '../../services/grupoCursoService';
export default function CursosOpciones() {
    const [user, setUser] = useState(null);
    const [curso, setCurso] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const { cursoId } = route.params || {};
    const handleNavigationToAnnouncements = () => {
      navigation.navigate('CursosAnuncios', { grupo: cursoId }); // Nombre de la pantalla de anuncios en el Drawer
    };

    const handleNavigateToAssignments = () => {
      navigation.navigate('CursosAsignaciones', { grupo: cursoId }); // Nombre de la pantalla de asignaciones en el Drawer
    };
  
    const handleNavigateToNotes = () => {
      navigation.navigate('CursosNotas', { grupo: cursoId }); // Nombre de la pantalla de notas en el Drawer
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
            const grupoData = await getGrupoCursoById(cursoId);
            const cursoData = await getCursoById(grupoData.idCurso);
            if (userData) {
                setUser(userData);
            } else {
                Alert.alert('No hay usuario autenticado');
            }
            if (cursoData) {
                setCurso(cursoData);
            } else {
                Alert.alert('No se encontró el curso');
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
            <Text style={styles.headerTitle}>Curso: {curso.nombre}</Text>
            <Text style={styles.headerSubtitle}>
                Accede a tus asignaciones, notas y anuncios del curso.
            </Text>
        </View>
        ) : (
        <View style={styles.header}>
            <Text style={styles.headerTitle}></Text>
        </View>
        )}
  
        {/* Sección de Anuncios */}
        <TouchableOpacity style={styles.card} onPress={handleNavigationToAnnouncements}>
          <Icon name="announcement" size={40} color="#2563eb" />
          <Text style={styles.cardTitle}>Anuncios</Text>
          <Text style={styles.cardDescription}>
            Accede rápidamente a los anuncios de tus profesores.
          </Text>
        </TouchableOpacity>

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
  
