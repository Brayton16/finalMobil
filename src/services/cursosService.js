import apiClient from "./apiClient";

export const getCursos = async () => {
  try {
    const response = await apiClient.get("/cursos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los cursos:", error);
    throw error;
  }
};

export const getCursoById = async (id) => {
  try {
    const response = await apiClient.get(`/cursos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    throw error;
  }
};

export const createCurso = async (nombre) => {
  try {
    const response = await apiClient.post(`/cursos?nombre=${nombre}`);
    return response.data;
  } catch (error) {
    console.error("Error al crear el curso:", error);
    throw error;
  }
};

export const updateCurso = async (id, nombre) => {
  try {
    const response = await apiClient.put(`/cursos/${id}?nombre=${nombre}`);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    throw error;
  }
};

export const deleteCurso = async (id) => {
  try {
    const response = await apiClient.delete(`/cursos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    throw error;
  }
};

