import React, { useEffect, useState, useCallback } from 'react';
import { 
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
    FlatList, RefreshControl 
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { obtenerAsignacionesByGrupo } from '../../services/asignacionesService';
import { getEntregasByEstudiante } from '../../services/entregasService';
import { getCursoById } from '../../services/cursosService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getGrupoCursoById } from '../../services/grupoCursoService';

export default function CursoNotasScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { grupo, estudiante } = route.params || {}; // 📌 Obtener ID del grupo desde route.params

    const [curso, setCurso] = useState(null);
    const [notas, setNotas] = useState([]);
    const [notaFinal, setNotaFinal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expandedTipos, setExpandedTipos] = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            setRefreshing(true);

            const estudianteId = estudiante.id

            const grupoCurso = await getGrupoCursoById(grupo.idGrupoCurso);

            // Obtener información del curso
            const cursoData = await getCursoById(grupoCurso.idCurso);
            setCurso(cursoData);

            // Obtener asignaciones y entregas del estudiante
            const asignaciones = await obtenerAsignacionesByGrupo(grupo.idGrupoCurso);
            const entregas = await getEntregasByEstudiante(estudianteId, grupo.idGrupoCurso);

            // Calcular notas
            const notasCalculadas = calcularNotas(asignaciones, entregas, cursoData);
            const notaFinalCalculada = calcularNotaFinal(notasCalculadas);

            setNotas(notasCalculadas);
            setNotaFinal(notaFinalCalculada);
        } catch (error) {
            console.error("Error obteniendo datos del curso:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Actualizar datos al entrar a la pantalla
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const toggleTipoExpansion = (tipo) => {
        setExpandedTipos((prev) => ({
            ...prev,
            [tipo]: !prev[tipo],
        }));
    };

    const calcularNotas = (asignaciones, entregas, curso) => {
        if (!curso) return [];

        const tiposAsignacion = [
            { key: "tareas", nombre: "Tarea" },
            { key: "proyecto", nombre: "Proyecto" },
            { key: "examen", nombre: "Examen" },
            { key: "asistencia", nombre: "Asistencia" }
        ];

        return tiposAsignacion.map(({ key, nombre }) => {
            const porcentaje = curso[key] || 0;
            const asignacionesTipo = asignaciones.filter((a) => a.tipo === nombre);
            const entregasTipo = entregas.filter((e) => asignacionesTipo.some((a) => a.id === e.idAsignacion));

            let obtenido = 0;
            if (asignacionesTipo.length > 0) {
                const calificaciones = asignacionesTipo.map((asignacion) => {
                    const entrega = entregasTipo.find((e) => e.idAsignacion === asignacion.id);
                    return entrega ? entrega.calificacion : 0;
                });

                const promedio = calificaciones.length > 0
                    ? calificaciones.reduce((sum, val) => sum + val, 0) / asignacionesTipo.length
                    : 0;

                obtenido = (promedio * porcentaje) / 100;
            }

            return { 
                tipo: nombre, 
                obtenido, 
                total: porcentaje, 
                asignaciones: asignacionesTipo, 
                entregas: entregasTipo 
            };
        });
    };

    const calcularNotaFinal = (notas) => {
        return notas.reduce((total, item) => total + item.obtenido, 0).toFixed(1);
    };

    const getBarColor = (notaObtenida, notaTotal) => {
        if (notaTotal === 0) return '#F44336';
        const porcentajeReal = (notaObtenida / notaTotal) * 100;
        if (porcentajeReal >= 80) return '#4CAF50';
        if (porcentajeReal >= 60) return '#FFEB3B';
        return '#F44336';
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#2563eb" style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.courseTitle}>{curso?.nombre}</Text>
                <Text style={styles.notaFinal}>Nota Final: {notaFinal} / 100</Text>
            </View>

            <FlatList
                data={notas}
                keyExtractor={(item) => item.tipo}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
                }
                renderItem={({ item }) => (
                    <View style={styles.notaItemContainer}>
                        <TouchableOpacity style={styles.notaItem} onPress={() => toggleTipoExpansion(item.tipo)}>
                            <Text style={styles.notaTipo}>{item.tipo}</Text>
                            <View style={[styles.progressBar, { borderBottomColor: getBarColor(item.obtenido, item.total) }]} />
                            <Text style={styles.notaTotal}>{item.obtenido.toFixed(1)} / {item.total}</Text>
                        </TouchableOpacity>

                        {expandedTipos[item.tipo] && (
                            <FlatList
                                data={item.asignaciones}
                                keyExtractor={(asignacion) => asignacion.id}
                                renderItem={({ item: asignacion }) => {
                                    const entrega = item.entregas.find(e => e.idAsignacion === asignacion.id);
                                    const fechaEntrega = new Date(asignacion.fechaEntrega);
                                    const ahora = new Date();
                                    const puedeEntregar = ahora <= fechaEntrega; // Verifica si aún se puede entregar

                                    return (
                                        <TouchableOpacity 
                                            style={styles.asignacionItem}
                                            onPress={() => navigation.navigate("DetalleAsignacion", { asignacion, estudianteId: estudiante.id })}
                                        >
                                            <Text>{asignacion.titulo}</Text>
                                            <Text>
                                                {entrega 
                                                    ? `${entrega.calificacion}/100` 
                                                    : puedeEntregar 
                                                        ? "Pendiente" 
                                                        : "No entregado"}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}
                    </View>
                )}
            />
        </View>
    );
}

// 🎨 **Estilos**
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    courseTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    notaFinal: {
        fontSize: 20,
        color: '#007bff',
        fontWeight: 'bold',
    },
    notaItemContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    notaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    notaTipo: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    progressBar: {
        flex: 2,
        borderBottomWidth: 3,
    },
    notaTotal: {
        flex: 1,
        fontSize: 14,
        color: '#555',
        textAlign: 'right',
    },
    asignacionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginVertical: 2,
    },
});
