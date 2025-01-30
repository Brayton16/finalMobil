import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

export function DetalleEstudianteScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { estudiante } = route.params || {};

    if (!estudiante) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No se encontró información del estudiante.</Text>
            </View>
        );
    }

    const handleNavigateToCourses = () => {
        navigation.navigate('CursosEstudiante', { estudiante });
    };

    const handleNavigateToHorario = () => {
        navigation.navigate('HorarioEstudiante', { estudiante });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{estudiante.nombre} {estudiante.apellido}</Text>
                <Text style={styles.headerSubtitle}>📧 {estudiante.correo}</Text>
                <Text style={styles.headerSubtitle}>🎓 Grado: {estudiante.grado}</Text>
            </View>

            {/* Sección de Asignaciones */}
            <TouchableOpacity style={styles.card} onPress={handleNavigateToCourses}>
                <Icon name="class" size={40} color="#2563eb" />
                <Text style={styles.cardTitle}>Cursos</Text>
                <Text style={styles.cardDescription}>
                    Accede a los cursos de este estudiante.
                </Text>
            </TouchableOpacity>

            {/* Sección de Asignaciones
            <TouchableOpacity style={styles.card} onPress={handleNavigateToAssignments}>
                <Icon name="assignment" size={40} color="#2563eb" />
                <Text style={styles.cardTitle}>Asignaciones</Text>
                <Text style={styles.cardDescription}>
                    Accede a las tareas y proyectos de este estudiante.
                </Text>
            </TouchableOpacity> */}

            {/* Sección de Notas
            <TouchableOpacity style={styles.card} onPress={handleNavigateToNotes}>
                <Icon name="grading" size={40} color="#2563eb" />
                <Text style={styles.cardTitle}>Notas</Text>
                <Text style={styles.cardDescription}>
                    Consulta el rendimiento académico del estudiante.
                </Text>
            </TouchableOpacity> */}

            {/* Sección de Horario */}
            <TouchableOpacity style={styles.card} onPress={handleNavigateToHorario}>
                <Icon name="calendar-month" size={40} color="#2563eb" />
                <Text style={styles.cardTitle}>Horario</Text>
                <Text style={styles.cardDescription}>
                    Consulta el horario y las clases programadas.
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
        marginTop: 5,
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
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default DetalleEstudianteScreen;
