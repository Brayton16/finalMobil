import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, StatusBar, ActivityIndicator } from "react-native";
import { KanbanBoard, ColumnModel, CardModel } from "@intechnity/react-native-kanban-board";
import { getGrupoCursoById } from "../../services/grupoCursoService";
import { obtenerAsignacionesByGrupo } from "../../services/asignacionesService";
import { getEntregasByEstudiante } from "../../services/entregasService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect, useRoute, NavigationProp, RouteProp } from "@react-navigation/native";
import { getCursoById } from "../../services/cursosService";

// ✅ Definir los tipos para los parámetros de la navegación
type RootStackParamList = {
  DetalleAsignacion: { asignacion: any; estudianteId: string };
};

type DetalleAsignacionRouteProp = RouteProp<RootStackParamList, "DetalleAsignacion">;
type NavigationProps = NavigationProp<RootStackParamList>;

type Grupo = {
  idGrupoCurso: string;
  idCurso: string;
  idEncargado: string;
  estudiante: string;
};

type Estudiante = {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  idGrupoCurso: string;
};

// ✅ Definir los tipos de datos
type Asignacion = {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  fechaEntrega: string;
  idGrupoCurso: string;
  estudiante: string;
};

type Entrega = {
  idAsignacion: string;
  estado: "pendiente" | "entregada" | "no_entregada";
};

const AsignacionesCursoScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<DetalleAsignacionRouteProp>();
  // 📌 Obtener el ID del grupo desde los parámetros
  const grupoId = route.params.grupo.idGrupoCurso;
  const estudianteId = route.params.estudiante.id;
  const [cards, setCards] = useState<CardModel[]>([]);
  const [loading, setLoading] = useState(true);

  // 📌 Definir columnas del Kanban
  const columns: ColumnModel[] = [
    new ColumnModel("pendiente", "Pendiente", 1),
    new ColumnModel("entregada", "Entregada", 2),
    new ColumnModel("no_entregada", "No Entregada", 3),
  ];

  // 📌 Obtener asignaciones del grupo recibido en `route.params`
  const fetchData = async () => {
    try {
      setLoading(true);

      if (!grupoId) {
        Alert.alert("Error", "No se encontró el ID del grupo.");
        return;
      }

      // Obtener detalles del grupo
      const grupo = await getGrupoCursoById(grupoId);
      const curso = await getCursoById(grupo.idCurso);

      // Obtener asignaciones del grupo
      const asignaciones: Asignacion[] = await obtenerAsignacionesByGrupo(grupoId);

      // Obtener entregas del estudiante en este grupo
      const entregas: Entrega[] = await getEntregasByEstudiante(estudianteId);

      // 📌 Clasificar asignaciones en las columnas correspondientes
      const cardsData: CardModel[] = asignaciones.map((asignacion) => {
        const entrega = entregas.find((ent) => ent.idAsignacion === asignacion.id);
        let estado: "pendiente" | "entregada" | "no_entregada" = "pendiente";

        if (entrega) {
          estado = entrega.estado;
        } else if (new Date(asignacion.fechaEntrega) < new Date()) {
          estado = "no_entregada"; // Si la fecha de entrega ya pasó y no fue entregada
        }

        return new CardModel(
          asignacion.id,
          estado,
          asignacion.titulo,
          curso.nombre,
          asignacion.descripcion,
          [
            { text: asignacion.tipo, backgroundColor: "#FFA500", textColor: "#000000" },
            { text: `Entrega: ${new Date(asignacion.fechaEntrega).toLocaleDateString()}`, backgroundColor: "#2563EB", textColor: "#FFFFFF" },
          ],
          asignacion, // 🔹 Pasamos la asignación correctamente
          1
        );
      });

      setCards(cardsData);
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
    }, [grupoId])
  );

  // 📌 Bloquear movimiento de tarjetas
  const onCardDragEnd = () => {
    Alert.alert("❌ Acción no permitida", "No puedes mover manualmente las tareas.");
  };

  // 📌 Evento cuando se presiona una tarjeta
  const onCardPress = (card: CardModel & { item?: Asignacion }) => {
    if (!card.item) {
      Alert.alert("Error", "No se encontraron detalles de la asignación.");
      return;
    }

    navigation.navigate("DetalleAsignacion", { asignacion: card.item, estudianteId });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <Text style={styles.header}>Asignaciones del Curso</Text>

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

export default AsignacionesCursoScreen;

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
