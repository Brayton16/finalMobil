import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export function GruposScreen() {
    const navigation = useNavigation();

    const handleNavigateToCursos = () => {
      navigation.navigate('Cursos'); // Navegar a la lista de cursos
    };
  
    const handleNavigateToEstudiantes = () => {
      navigation.navigate('ListaEstudiantes'); // Navegar a la lista de estudiantes
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Grupos</Text>
            <Text style={styles.headerSubtitle}>
            Accede a la información de tus cursos y compañeros de sección.
            </Text>
        </View>
  
        {/* Sección de Cursos */}
        <TouchableOpacity style={styles.card} onPress={handleNavigateToCursos}>
          <Icon name="class" size={40} color="#2563eb" />
          <Text style={styles.cardTitle}>Mis Cursos</Text>
          <Text style={styles.cardDescription}>
            Explora tus cursos y revisa la información de cada uno.
          </Text>
        </TouchableOpacity>
  
        {/* Sección de Lista de Estudiantes */}
        <TouchableOpacity style={styles.card} onPress={handleNavigateToEstudiantes}>
          <Icon name="people" size={40} color="#2563eb" />
          <Text style={styles.cardTitle}>Lista de Estudiantes</Text>
          <Text style={styles.cardDescription}>
            Consulta quiénes están en tu grupo y su información.
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

export default GruposScreen;
