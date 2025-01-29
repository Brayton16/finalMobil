import apiClient from "./apiClient";

export const getGruposByEstudiante = async (idEstudiante) => {
  try {
    const response = await apiClient.get(`/grupo-curso/grupos/estudiante/${idEstudiante}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los grupos del estudiante:", error);
    throw error;
  }
};