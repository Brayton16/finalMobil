import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGruposByEstudiante } from '../../services/grupoCursoService';
import { obtenerAnunciosByGrupo } from '../../services/anunciosService';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function AnunciosScreen() {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Función para cargar los anuncios
    const fetchAnuncios = async () => {
        try {
            setLoading(true);
            setRefreshing(true);
            setAnuncios([]);

            const userId = await AsyncStorage.getItem('userId');
            const grupos = await getGruposByEstudiante(userId);

            let anunciosTemp = [];
            for (const grupo of grupos) {
                const anunciosGrupo = await obtenerAnunciosByGrupo(grupo.idGrupoCurso);
                anunciosTemp = [...anunciosTemp, ...anunciosGrupo];
            }

            // Ordenar por fecha de publicación (más recientes primero)
            anunciosTemp.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
            setAnuncios(anunciosTemp);
        } catch (error) {
            console.error("Error obteniendo los anuncios:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Cargar anuncios cuando se abre la pantalla
    useFocusEffect(
        useCallback(() => {
            fetchAnuncios();
        }, [])
    );

    // Obtener color de importancia
    const getImportanceColor = (importance) => {
        switch (importance) {
            case 'alta': return '#F44336';
            case 'media': return '#FFEB3B';
            case 'baja': return '#4CAF50';
            default: return '#9E9E9E';
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#2563eb" />
            ) : (
                <FlatList
                    data={anuncios}
                    keyExtractor={(item) => item.idGrupoCurso + item.fechaPublicacion}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchAnuncios} />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.importanceContainer}>
                                <View style={[styles.importanceIndicator, { backgroundColor: getImportanceColor(item.importancia) }]}></View>
                                <Text>{item.importancia.toUpperCase()}</Text>
                            </View>
                            <View style={styles.header}>
                                <Text style={styles.author}>{item.auto}</Text>
                                <Text style={styles.date}>{new Date(item.fechaPublicacion).toLocaleDateString()}</Text>
                            </View>
                            <Text style={styles.title}>{item.titulo}</Text>
                            <Text style={styles.message}>{item.mensaje}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    importanceIndicator: {
        width: 20,
        height: 20,
        borderRadius: 50,
        marginRight: 8,
    },
    author: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2563eb',
        flex: 1,
    },
    date: {
        fontSize: 12,
        color: '#777',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    message: {
        fontSize: 16,
        color: '#555',
    },
    importanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    }
});

