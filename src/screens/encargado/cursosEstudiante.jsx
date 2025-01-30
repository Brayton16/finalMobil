import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getGruposByEstudiante } from '../../services/grupoCursoService';
import { getProfesorById } from '../../services/profesorService'; // ✅ Obtener datos del profesor

export function CursosEstudianteScreen() {
    const [cursos, setCursos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const { estudiante } = route.params || {};

    useEffect(() => {
        if (!estudiante) {
            console.error('No se recibió información del estudiante.');
            setIsLoading(false);
            return;
        }

        const fetchCursos = async () => {
            try {
                const response = await getGruposByEstudiante(estudiante.id);
                if (!response || response.length === 0) {
                    console.error('No se encontraron cursos para este estudiante.');
                    setIsLoading(false);
                    return;
                }

                // 📌 Obtener el nombre del profesor para cada curso
                const cursosConProfesor = await Promise.all(response.map(async (curso) => {
                    const profesorData = await getProfesorById(curso.idProfesor);
                    return {
                        ...curso,
                        profesorNombre: profesorData ? `${profesorData.nombre} ${profesorData.apellido}` : "No disponible"
                    };
                }));

                setCursos(cursosConProfesor);
            } catch (error) {
                console.error('Error al obtener los cursos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCursos();
    }, [estudiante]);

    const handleNavigateToCurso = (curso) => {
        navigation.navigate('DetalleCurso', { curso, estudiante });
    };
    

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cursos de {estudiante?.nombre} {estudiante?.apellido}</Text>
          <Text style={styles.headerSubtitle}>Aquí están los cursos en los que está inscrito.</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : cursos.length === 0 ? (
          <Text style={styles.noCoursesText}>Este estudiante no está inscrito en ningún curso.</Text>
        ) : (
          cursos.map((curso) => (
            <TouchableOpacity key={curso.idGrupoCurso} style={styles.card} onPress={() => handleNavigateToCurso(curso)}>
              <Icon name="school" size={40} color="#2563eb" />
              <Text style={styles.cardTitle}>{curso.curso.nombre}</Text>
              <Text style={styles.cardSubtitle}>Nivel {curso.seccion.nivel} - Grupo {curso.seccion.grupo}</Text>
              <Text style={styles.cardInfo}>
                🕒 {curso.horaInicio} - {curso.horaFin} | 📅 {curso.dia1} {curso.dia2 ? `y ${curso.dia2}` : ''}
              </Text>
              <Text style={styles.cardProfesor}>👨‍🏫 Profesor: {curso.profesorNombre}</Text> 
            </TouchableOpacity>
          ))
        )}
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
    noCoursesText: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
      marginTop: 20,
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
    cardSubtitle: {
      fontSize: 16,
      color: '#555',
      marginTop: 5,
    },
    cardInfo: {
      fontSize: 14,
      color: '#777',
      marginTop: 5,
      textAlign: 'center',
    },
    cardProfesor: {
      fontSize: 14,
      color: '#333',
      fontWeight: 'bold',
      marginTop: 5,
    },
});

export default CursosEstudianteScreen;
