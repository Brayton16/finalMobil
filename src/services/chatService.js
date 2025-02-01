import apiClient from "../services/apiClient" // Asumiendo que apiClient es un cliente que hace las peticiones

// Cargar todas las conversaciones
export const getConversaciones = async (userId) => {
  try {
    const response = await apiClient.get(`/conversaciones?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las conversaciones:", error);
    throw error;
  }
};

// Ver una conversación específica
export const getConversacionById = async (id) => {
  try {
    const response = await apiClient.get(`/conversaciones/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la conversación:", error);
    throw error;
  }
};

// Enviar un mensaje dentro de un chat existente
export const sendMessage = async (id, texto, enviadoPor) => {
  try {
    console.log("Enviando mensaje:", texto);
const response = await apiClient.post(`/conversaciones/${id}`, { id, texto, enviadoPor });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    throw error;
  }
};

// Crear un nuevo chat
export const createConversacion = async (idEmisor, idReceptor) => {
  try {
    const data = { idEmisor, idReceptor };
    const response = await apiClient.post(`/conversaciones/`, { idEmisor, idReceptor });
    return response.data;
  } catch (error) {
    console.error("Error al crear la conversación:", error);
    throw error;
  }
};
