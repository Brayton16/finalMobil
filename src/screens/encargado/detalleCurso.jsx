import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

export function DetalleCursoScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { curso, estudiante } = route.params || {}; // 📌 Recibimos la información del curso y el estudiante

    if (!curso || !estudiante) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No se encontró información del curso o estudiante.</Text>
            </View>
        );
    }

    const handleNavigateToAssignments = () => {
        navigation.navigate('AsignacionesEstudiante', { grupo:curso, estudiante });
    };

    const handleNavigateToNotes = () => {
        navigation.navigate('NotasEstudianteCurso', { grupo: curso, estudiante });
    };

    const handleNavigateToChatProfesor = () => {
        navigation.navigate('ChatProfesor', { profesorId: curso.idProfesor });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{curso.curso.nombre}</Text>
                <Text style={styles.headerSubtitle}>👨‍🎓 {estudiante.nombre} {estudiante.apellido}</Text>
                <Text style={styles.headerSubtitle}>📅 {curso.dia1} {curso.dia2 ? `y ${curso.dia2}` : ''}</Text>
                <Text style={styles.headerSubtitle}>🕒 {curso.horaInicio} - {curso.horaFin}</Text>
            </View>

            {/* Sección de Asignaciones */}
            <TouchableOpacity style={styles.card} onPress={handleNavigateToAssignments}>
                <Icon name="assignment" size={40} color="#2563eb" />
                <Text style={styles.cardTitle}>Asignaciones</Text>
                <Text style={styles.cardDescription}>
                    Accede a las tareas y proyectos de este estudiante.
                </Text>
            </TouchableOpacity>

            {/* Sección de Notas */}
            <TouchableOpacity style={styles.card} onPress={handleNavigateToNotes}>
                <Icon name="grading" size={40} color="#2563eb" />
                <Text style={styles.cardTitle}>Notas</Text>
                <Text style={styles.cardDescription}>
                    Consulta el rendimiento académico del estudiante.
                </Text>
            </TouchableOpacity>

            {/* Sección de Chat con el Profesor */}
            <TouchableOpacity style={styles.card} onPress={handleNavigateToChatProfesor}>
                <Icon name="chat" size={40} color="#2563eb" />
                <Text style={styles.cardTitle}>Hablar con el Profesor</Text>
                <Text style={styles.cardDescription}>
                    Comunícate con el profesor para cualquier consulta.
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

export default DetalleCursoScreen;
