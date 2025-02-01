import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, StatusBar, ActivityIndicator } from "react-native";
import { KanbanBoard, ColumnModel, CardModel } from "@intechnity/react-native-kanban-board";
import { getGrupoCursoById, getGruposByEstudiante } from "../../services/grupoCursoService";
import { obtenerAsignacionesByGrupo } from "../../services/asignacionesService";
import { getEntregasByEstudiante } from "../../services/entregasService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect, NavigationProp } from "@react-navigation/native";
import { getCursoById } from "../../services/cursosService";

type AsignacionesScreenNavigationProp = {
  DetalleAsignacion: { asignacion: any };
};

type RootStackParamList = {
  DetalleAsignacion: { asignacion: any };
};

const AsignacionesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [cards, setCards] = useState<CardModel[]>([]);
  const [loading, setLoading] = useState(true);

  // 📌 Definir columnas del Kanban
  const columns: ColumnModel[] = [
    new ColumnModel("pendiente", "Pendiente", 1),
    new ColumnModel("entregada", "Entregada", 2),
    new ColumnModel("no_entregada", "No Entregada", 3),
  ];

  // 📌 Obtener asignaciones de los grupos a los que pertenece el estudiante
  const fetchData = async () => {
    try {
      setLoading(true);
      const estudianteId = await AsyncStorage.getItem("userId");

      if (!estudianteId) {
        Alert.alert("Error", "No se encontró el ID del estudiante.");
        return;
      }

      // Obtener los grupos del estudiante
      const grupos = await getGruposByEstudiante(estudianteId);

      let asignacionesTotales = [];
      let entregasTotales = [];

      for (const grupo of grupos) {
        // Obtener asignaciones de cada grupo
        const asignacionesGrupo = await obtenerAsignacionesByGrupo(grupo.idGrupoCurso);
        asignacionesTotales = [...asignacionesTotales, ...asignacionesGrupo];

        // Obtener entregas del estudiante en ese grupo
        const entregasGrupo = await getEntregasByEstudiante(estudianteId);
        entregasTotales = [...entregasTotales, ...entregasGrupo];
      }

      // Clasificar asignaciones en las columnas correspondientes
      const cardsData = await Promise.all(asignacionesTotales.map(async (asignacion) => {
        const entrega = entregasTotales.find((ent) => ent.idAsignacion === asignacion.id);
        let estado = "pendiente"; // Default: Pendiente


        const grupo = await getGrupoCursoById(asignacion.idGrupoCurso);
        const curso  = await getCursoById(grupo.idCurso);
        const grupoNombre = curso ? curso.nombre : "Desconocido";
        if (entrega) {
          estado = entrega.estado === "entregada" ? "entregada" : "no_entregada";
        } else if (new Date(asignacion.fechaEntrega) < new Date()) {
          estado = "no_entregada"; // Si la fecha de entrega ya pasó y no fue entregada
        }

        return new CardModel(
          asignacion.id,
          estado,
          asignacion.titulo,
          grupoNombre,
          asignacion.descripcion,
          [
            { text: asignacion.tipo, backgroundColor: "#FFA500", textColor: "#000000" },
            { text: `Entrega: ${new Date(asignacion.fechaEntrega).toLocaleDateString()}`, backgroundColor: "#2563EB", textColor: "#FFFFFF" },
          ],
          asignacion,
          1
        );
      }));

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
    }, [])
  );

  // 📌 Bloquear movimiento de tarjetas
  const onCardDragEnd = () => {
    Alert.alert("❌ Acción no permitida", "No puedes mover manualmente las tareas.");
  };

  // 📌 Evento cuando se presiona una tarjeta
  const onCardPress = (card: CardModel) => {
    navigation.navigate('DetalleAsignacion', { asignacion: card.item });
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <Text style={styles.header}>Asignaciones generales</Text>

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

export default AsignacionesScreen;

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
