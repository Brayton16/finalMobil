import apiClient from "./apiClient";

export const hacerAsignacion = async (asignacionData) => {
    try {
        console.log("Datos de la asignación a enviar:", asignacionData);
        const response = await apiClient.post("/asignaciones", asignacionData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerAsignaciones = async () => {
    try {
        const response = await apiClient.get("/asignaciones");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerAsignacionById = async (id) => {
    try {
        const response = await apiClient.get(`/asignaciones/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerAsignacionesByGrupo = async (idGrupo) => {
    try {
        const response = await apiClient.get(`/asignaciones/grupo/${idGrupo}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const obtenerAsignacionesByProfesor = async (idProfesor) => {
    try {
        const response = await apiClient.get(`/asignaciones/profesor/${idProfesor}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAsignacion = async (id, updatedData) => {
    try {
        const response = await apiClient.put(`/asignaciones/${id}`, updatedData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAsignacion = async (id) => {
    try {
        const response = await apiClient.delete(`/asignaciones/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};