import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, StatusBar, ActivityIndicator } from "react-native";
import { KanbanBoard, ColumnModel, CardModel } from "@intechnity/react-native-kanban-board";
import { getGruposByEstudiante } from "../../services/grupoCursoService";
import { obtenerAsignacionesByGrupo } from "../../services/asignacionesService";
import { getEntregasByEstudiante } from "../../services/entregasService";
import { getEstudiantesByEncargado } from "../../services/encargadosService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect, useRoute, NavigationProp, RouteProp } from "@react-navigation/native";
import { getCursoById } from "../../services/cursosService";

// ✅ Definir los tipos para los parámetros de la navegación
type RootStackParamList = {
  PendientesGenerales: undefined;
  DetalleAsignacion: { asignacion: any; estudianteId: string };
};

// ✅ Definir los tipos de datos
type Asignacion = {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  fechaEntrega: string;
  idGrupoCurso: string;
  idCurso: string;
};

type Entrega = {
  idAsignacion: string;
  estado: "pendiente" | "entregada" | "no_entregada";
  idEstudiante: string;
};

const PendientesGeneralesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [cards, setCards] = useState<CardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [estudiantes, setEstudiantes] = useState<string[]>([]);

  // 📌 Definir columnas del Kanban
  const columns: ColumnModel[] = [
    new ColumnModel("pendiente", "Pendiente", 1),
    new ColumnModel("entregada", "Entregada", 2),
    new ColumnModel("no_entregada", "No Entregada", 3),
  ];

  // 📌 Obtener todas las asignaciones pendientes de todos los estudiantes a cargo
  const fetchData = async () => {
    try {
      setLoading(true);
      const encargadoId = await AsyncStorage.getItem("userId");

      if (!encargadoId) {
        Alert.alert("Error", "No se encontró el ID del encargado.");
        return;
      }

      // Obtener estudiantes a cargo del encargado
      const estudiantesData = await getEstudiantesByEncargado(encargadoId);
      if (!estudiantesData || estudiantesData.length === 0) {
        Alert.alert("No se encontraron estudiantes", "No tienes estudiantes asignados.");
        return;
      }

      // Obtener todas las asignaciones de los grupos de los estudiantes
      let asignacionesTotales: Asignacion[] = [];
      let entregasTotales: Entrega[] = [];
      for (const estudiante of estudiantesData) {
        
        const grupos = await getGruposByEstudiante(estudiante.id);

        for (const grupo of grupos) {
          const asignacionesGrupo = await obtenerAsignacionesByGrupo(grupo.idGrupoCurso);
          asignacionesTotales = [...asignacionesTotales, ...asignacionesGrupo];

          const entregasGrupo = await getEntregasByEstudiante(estudiante.id);
          entregasTotales = [...entregasTotales, ...entregasGrupo];
        }
      }
      let estudianteId =  ""; // Inicialmente lo sacamos de la entrega
      // 📌 Clasificar asignaciones en las columnas correspondientes
    const cardsData: CardModel[] = await Promise.all(
        asignacionesTotales.map(async (asignacion) => {
            try {
                // 📌 Buscar si hay entrega para esta asignación
                const entrega = entregasTotales.find((ent) => ent.idAsignacion === asignacion.id);
            
                let estado: "pendiente" | "entregada" | "no_entregada" = "pendiente";
                

            
                if (entrega) {
                    estudianteId = entrega.idEstudiante;
                    estado = entrega.estado;
                } else if (new Date(asignacion.fechaEntrega) < new Date()) {
                    estado = "no_entregada"; // Si la fecha de entrega ya pasó y no fue entregada
                }
            
                // 📌 Obtener el nombre del curso
                const curso = await getCursoById(asignacion.idCurso);
                const nombreCurso = curso ? curso.nombre : "Curso desconocido";

                return new CardModel(
                    asignacion.id,
                    estado,
                    asignacion.titulo,
                    nombreCurso, // 🔹 Usamos el nombre del curso en lugar de ID
                    asignacion.descripcion,
                    [
                        { text: asignacion.tipo, backgroundColor: "#FFA500", textColor: "#000000" },
                        { text: `Entrega: ${new Date(asignacion.fechaEntrega).toLocaleDateString()}`, backgroundColor: "#2563EB", textColor: "#FFFFFF" },
                    ],
                    { asignacion, estudianteId }, // ✅ Pasamos asignación y estudiante asociado
                    1
                );
            } catch (error) {
                console.error("Error obteniendo el curso:", error);
                return null;
            }
            
            
        })
    );
      setCards(cardsData.filter((card) => card !== null));    
      setEstudiantes(estudiantesData.map((e) => e.id));
    } catch (error) {
      console.error("Error obteniendo asignaciones:", error);
      Alert.alert("Error", "Hubo un problema al cargar las asignaciones.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Recargar datos al volver a la pantalla
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  // 📌 Bloquear movimiento de tarjetas
  const onCardDragEnd = () => {
    Alert.alert("❌ Acción no permitida", "No puedes mover manualmente las tareas.");
  };

  // 📌 Evento cuando se presiona una tarjeta
  const onCardPress = (card: CardModel & { item?: { asignacion: Asignacion; estudianteId: string } }) => {
    if (!card.item) {
      Alert.alert("Error", "No se encontraron detalles de la asignación.");
      return;
    }
    navigation.navigate("DetalleAsignacion", {
      asignacion: card.item.asignacion,
      estudianteId: card.item.estudianteId,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <Text style={styles.header}>Pendientes Generales</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" />
      ) : (
        <KanbanBoard
          columns={columns}
          cards={cards}
          onDragEnd={onCardDragEnd} // ❌ Bloquear movimiento
          onCardPress={onCardPress} // ℹ️ Mostrar detalles de la tarea
          style={styles.kanbanStyle}
        />
      )}
    </View>
  );
};

export default PendientesGeneralesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  kanbanStyle: {
    marginTop: 10,
    flex: 1,
  },
});
