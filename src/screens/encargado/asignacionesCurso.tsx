import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, StatusBar } from "react-native";
import { KanbanBoard, ColumnModel, CardModel } from "@intechnity/react-native-kanban-board";

const AsignacionesScreen: React.FC = () => {
  // 📌 Definir columnas
  const columns: ColumnModel[] = [
    new ColumnModel("pendiente", "Pendiente", 1),
    new ColumnModel("entregada", "Entregada", 2),
    new ColumnModel("no_entregada", "No Entregada", 3),
  ];

  // 📌 Datos simulados de asignaciones
  const [cards, setCards] = useState<CardModel[]>([
    new CardModel(
      "XfY7a8v9K0L",
      "pendiente",
      "Ensayo sobre la Revolución Francesa",
      "Historia",
      "Escribir un ensayo de 2 páginas sobre las causas y consecuencias.",
      [
        { text: "Tarea", backgroundColor: "#FFA500", textColor: "#000000" },
        { text: "Fecha: 10 Feb", backgroundColor: "#2563EB", textColor: "#FFFFFF" },
      ],
      null,
      1
    ),
    new CardModel(
      "YtZ8b9W0K1M",
      "pendiente",
      "Problemas de Álgebra",
      "Matemáticas",
      "Resolver 10 problemas de ecuaciones cuadráticas.",
      [
        { text: "Matemáticas", backgroundColor: "#00FF00", textColor: "#000000" },
        { text: "Fecha: 12 Feb", backgroundColor: "#2563EB", textColor: "#FFFFFF" },
      ],
      null,
      2
    ),
    new CardModel(
      "ZkX9c1Y2L3N",
      "entregada",
      "Resumen de Literatura",
      "Español",
      "Hacer un resumen del libro 'Don Quijote de la Mancha'.",
      [
        { text: "Español", backgroundColor: "#2563EB", textColor: "#FFFFFF" },
        { text: "Fecha: 08 Feb", backgroundColor: "#2563EB", textColor: "#FFFFFF" },
      ],
      null,
      3
    ),
  ]);

  // 📌 Bloquear movimiento de tarjetas
  const onCardDragEnd = () => {
    Alert.alert("❌ Acción no permitida", "No puedes mover manualmente las tareas.");
  };

  // 📌 Evento cuando se presiona una tarjeta
  const onCardPress = (card: CardModel) => {
    Alert.alert(
      `📌 Detalles`,
      `Tarea: ${card.title}\nCurso: ${card.subtitle}\nEstado: ${card.columnId}\n${card.tags[1].text}`,
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <Text style={styles.header}>📌 Asignaciones</Text>
      <KanbanBoard
        columns={columns}
        cards={cards}
        onDragEnd={onCardDragEnd} // ❌ Bloquear movimiento
        onCardPress={onCardPress} // ℹ️ Mostrar detalles de la tarea
        style={styles.kanbanStyle}
        
      />
    </View>
  );
};

export default AsignacionesScreen;

// 📌 Estilos
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
