import apiClient from "./apiClient";

export const getProfesorById = async (id) => {
    try {
        const response = await apiClient.get(`/profesores/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el profesor:', error);
        throw error;
    }
};