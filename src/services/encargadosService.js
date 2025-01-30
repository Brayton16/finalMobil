import apiClient from "./apiClient";

export const getEstudiantesByEncargado = async (encargadoId) => {
  try {
    const response = await apiClient.get(`/estudiantes/encargado/${encargadoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    throw error;
  }
};

export const getEncargadoById = async (encargadoId) => {
  try {
    const response = await apiClient.get(`/encargados/${encargadoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener encargado:", error);
    throw error;
  }
};