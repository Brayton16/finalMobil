import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { getGruposByEstudiante } from '../../services/grupoCursoService';
import { obtenerAsignacionesByGrupo } from '../../services/asignacionesService';
import { getEntregasByEstudiante } from '../../services/entregasService';
import { getCursoById } from '../../services/cursosService';
import { getEstudianteById } from '../../services/estudiantesService';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function NotasScreen() {
    const navigation = useNavigation();

    const [grupos, setGrupos] = useState([]);
    const [notasPorGrupo, setNotasPorGrupo] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [expandedTipos, setExpandedTipos] = useState({});
    const [estudiante, setEstudiante] = useState(null);
    const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh
    const [loadingGrupo, setLoadingGrupo] = useState(false);
    // 🔄 **Cargar los datos al montar la pantalla**
    const fetchData = async () => {
        try {
            setRefreshing(true);
            setLoading(true);

            const estudianteId = await AsyncStorage.getItem('userId');
            const estudiante = await getEstudianteById(estudianteId);
            const response = await getGruposByEstudiante(estudianteId);
            setLoadingGrupo(true);

            setEstudiante(estudiante);
            setGrupos(response);

            // Cargar las notas para cada grupo
            const notasData = {};
            for (let grupo of response) {
                const asignaciones = await obtenerAsignacionesByGrupo(grupo.idGrupoCurso);
                const entregas = await getEntregasByEstudiante(estudianteId, grupo.idGrupoCurso);
                const curso = await getCursoById(grupo.idCurso);

                notasData[grupo.idGrupoCurso] = {
                    notas: calcularNotas(asignaciones, entregas, curso),
                    notaFinal: calcularNotaFinal(asignaciones, entregas, curso),
                };
            }

            setNotasPorGrupo(notasData);
        } catch (error) {
            console.error("Error obteniendo los grupos y notas:", error);
        } finally {
            setLoadingGrupo(false);
            setLoading(false);
            setRefreshing(false);
        }
    };

    // 🔄 **Actualizar al enfocar la pantalla**
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const toggleGroupExpansion = (grupoId) => {
        setExpandedGroups((prev) =>
            prev.includes(grupoId) ? prev.filter((id) => id !== grupoId) : [...prev, grupoId]
        );
    };

    const toggleTipoExpansion = (grupoId, tipo) => {
        setExpandedTipos((prev) => ({
            ...prev,
            [`${grupoId}-${tipo}`]: !prev[`${grupoId}-${tipo}`],
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

                const sumaCalificaciones = calificaciones.reduce((sum, val) => sum + val, 0);
                const promedio = sumaCalificaciones / asignacionesTipo.length;

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

    const calcularNotaFinal = (asignaciones, entregas, curso) => {
        const notas = calcularNotas(asignaciones, entregas, curso);
        return notas.reduce((total, item) => total + item.obtenido, 0).toFixed(1);
    };

    const getBarColor = (notaObtenida, notaTotal) => {
        if (notaTotal === 0) return '#F44336';
        const porcentajeReal = (notaObtenida / notaTotal) * 100;
        if (porcentajeReal >= 80) return '#4CAF50';
        if (porcentajeReal >= 60) return '#FFEB3B';
        return '#F44336';
    };

    if(loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loading}/>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={grupos}
                keyExtractor={(item) => item.idGrupoCurso}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchData}
                    />
                }
                renderItem={({ item: grupo }) => (
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.groupHeader} onPress={() => toggleGroupExpansion(grupo.idGrupoCurso)}>
                            <Text style={styles.groupTitle}>{grupo.curso.nombre} - {grupo.seccion.nivel}° Grado</Text>
                            {notasPorGrupo[grupo.idGrupoCurso] && (
                                <Text style={styles.notaFinal}>{notasPorGrupo[grupo.idGrupoCurso].notaFinal} / 100</Text>
                            )}
                            <Icon name={expandedGroups.includes(grupo.idGrupoCurso) ? "minus-circle" : "plus-circle"} size={20} color="#2563eb" />
                        </TouchableOpacity>

                        {loadingGrupo === grupo.idGrupoCurso ? (
                            <ActivityIndicator size="small" color="#2563eb" />
                        ) : (
                            expandedGroups.includes(grupo.idGrupoCurso) &&
                            notasPorGrupo[grupo.idGrupoCurso] && (
                                <FlatList
                                    data={notasPorGrupo[grupo.idGrupoCurso].notas}
                                    keyExtractor={(item) => item.tipo}
                                    renderItem={({ item }) => (
                                        <View style={styles.notaItemContainer}>
                                            <TouchableOpacity style={styles.notaItem} onPress={() => toggleTipoExpansion(grupo.idGrupoCurso, item.tipo)}>
                                                <Text style={styles.notaTipo}>{item.tipo}</Text>
                                                <View style={[styles.progressBar, { borderBottomColor: getBarColor(item.obtenido, item.total) }]} />
                                                <Text style={styles.notaTotal}>{item.obtenido.toFixed(1)} / {item.total}</Text>
                                            </TouchableOpacity>

                                            {expandedTipos[`${grupo.idGrupoCurso}-${item.tipo}`] && (
                                                <FlatList
                                                    data={item.asignaciones}
                                                    keyExtractor={(asignacion) => asignacion.id}
                                                    renderItem={({ item: asignacion }) => {
                                                        const entrega = item.entregas.find(e => e.idAsignacion === asignacion.id);
                                                        return (
                                                            <TouchableOpacity 
                                                              style={styles.asignacionItem}
                                                              onPress={() => navigation.navigate("DetalleAsignacion", { asignacion })}
                                                            >
                                                                <Text>{asignacion.titulo}</Text>
                                                                <Text>{entrega ? `${entrega.calificacion}/100` : "No entregado"}</Text>
                                                            </TouchableOpacity>
                                                        );
                                                    }}
                                                />
                                            )}
                                        </View>
                                    )}
                                />
                            )
                        )}
                    </View>
                )}
            />
        </View>
    );
}


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
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    notaFinal: {
        fontSize: 16,
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


export default NotasScreen;
