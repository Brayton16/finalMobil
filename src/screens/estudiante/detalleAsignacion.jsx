import React, { useEffect, useState } from 'react';
import { 
    View, Text, StyleSheet, ScrollView, TouchableOpacity, 
    TextInput, Alert, ActivityIndicator 
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { obtenerAsignacionById } from '../../services/asignacionesService';
import { getEntregasByEstudiante, createEntrega } from '../../services/entregasService';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function DetalleAsignacionScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { asignacion } = route.params || {};
    
    const [loading, setLoading] = useState(true);
    const [detalleAsignacion, setDetalleAsignacion] = useState(null);
    const [entrega, setEntrega] = useState(null);
    const [linkEntrega, setLinkEntrega] = useState('');

    // Función para obtener datos de la asignación y la entrega
const fetchData = async () => {
    try {
        setLoading(true);
        const estudianteId = await AsyncStorage.getItem('userId');

        // Obtener la asignación con detalles completos
        const nuevaAsignacion = await obtenerAsignacionById(asignacion.id);
        setDetalleAsignacion(nuevaAsignacion);

        // Obtener todas las entregas del estudiante
        const todasLasEntregas = await getEntregasByEstudiante(estudianteId, nuevaAsignacion.idGrupoCurso);
        // Filtrar la entrega correspondiente a esta asignación
        
        const entregaRelacionada = todasLasEntregas.find(ent => ent.idAsignacion === asignacion.id) || null;

        setEntrega(entregaRelacionada);

    } catch (error) {
        console.error("Error obteniendo la asignación y entrega:", error);
    } finally {
        setLoading(false);
    }
};


    // Se ejecuta al montar la pantalla y cada vez que la vista se enfoque
    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const handleEntregarTarea = async () => {
        if (!linkEntrega.trim()) {
            Alert.alert("Error", "Debes ingresar un link para entregar la tarea.");
            return;
        }

        try {
            const estudianteId = await AsyncStorage.getItem('userId');
            const entregaData = {
                idAsignacion: asignacion.id,
                idEstudiante: estudianteId,
                fechaEntrega: new Date().toISOString(), // Convierte la fecha a formato ISO
                estado: "entregada",
                calificacion: "0", // Se deja nulo porque aún no está calificada
                observaciones: "", // Se deja nulo porque aún no hay comentarios
                archivo: linkEntrega // Aquí van los links de la entrega
            };

            await createEntrega(entregaData);

            Alert.alert("Entrega registrada", "Tu entrega ha sido enviada correctamente.");
            fetchData(); // Recargar los datos para reflejar el cambio
        } catch (error) {
            console.error("Error al entregar la tarea:", error);
            Alert.alert("Error", "No se pudo registrar la entrega.");
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#2563eb" style={styles.loading} />;
    }

    if (!detalleAsignacion) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No se encontró la asignación.</Text>
            </View>
        );
    }

    const fechaEntrega = new Date(detalleAsignacion.fechaEntrega);
    const ahora = new Date();
    const puedeEntregar = ahora <= fechaEntrega

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 📄 Información de la Asignación */}
            <View style={styles.card}>
                <Text style={styles.title}>{detalleAsignacion.titulo}</Text>
                <Text style={styles.description}>{detalleAsignacion.descripcion}</Text>
                <Text style={styles.info}>📅 Fecha de Entrega: {fechaEntrega.toLocaleDateString()}</Text>
            </View>

            {/* 📎 Recursos */}
            {detalleAsignacion.recursos.length > 0 && (
                <View style={styles.card}>
                    <Text style={styles.subTitle}>Recursos</Text>
                    {detalleAsignacion.recursos.map((recurso, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.recursoContainer} 
                            onPress={() => navigation.navigate("WebViewScreen", { url: recurso })}
                        >
                            {recurso.includes("youtube.com") ? (
                                <WebView source={{ uri: recurso }} style={styles.video} />
                            ) : (
                                <Text style={styles.recursoLink}>🔗 {recurso}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* 📌 Estado de la Entrega */}
            <View style={styles.card}>
                <Text style={styles.subTitle}>Entrega</Text>
                {puedeEntregar ? (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Pega el link de tu entrega aquí..."
                            value={linkEntrega}
                            onChangeText={setLinkEntrega}
                        />
                        <TouchableOpacity style={styles.button} onPress={handleEntregarTarea}>
                            <Text style={styles.buttonText}>📤 Entregar</Text>
                        </TouchableOpacity>
                    </>
                ): (
                    <></>
                )}
            </View>
            <View style={styles.card}>
                <Text style={styles.subTitle}>Estado de la entrega</Text>
                {entrega ? (
                    <View>
                        <Text style={styles.info}>📜 Estado: {entrega.estado}</Text>
                        <Text style={styles.info}>📊 Calificación: {entrega.calificacion ?? "Pendiente"}</Text>
                        <Text style={styles.info}>📝 Retroalimentación: {entrega.retroalimentacion || "Sin comentarios"}</Text>
                    </View>
                ): (
                    <Text style={styles.errorText}>❌ No entregada.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    info: {
        fontSize: 14,
        color: '#777',
        marginBottom: 5,
    },
    recursoContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#e3f2fd",
        borderRadius: 8,
    },
    recursoLink: {
        fontSize: 16,
        color: '#2563eb',
        textDecorationLine: 'underline',
    },
    video: {
        height: 200,
        borderRadius: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default DetalleAsignacionScreen;
