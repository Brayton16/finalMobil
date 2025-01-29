import apiClient from "./apiClient";

export const getEstudiantesBySeccion = async (estudianteId) => {
    try {
        const response = await apiClient.get(`/seccion/seccion/${estudianteId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        throw error;
    }
};