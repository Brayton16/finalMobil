import apiClient from "./apiClient";

export const getEntregas = async () => {
    const response = await apiClient.get("/entregas");
    return response.data;
};

export const getEntregasById = async (id) => {
    const response = await apiClient.get(`/entregas/${id}`);
    return response.data;
};

export const getEntregasByAsignacion = async (idAsignacion) => {
    const response = await apiClient.get(`/entregas/asignacion/${idAsignacion}`);
    return response.data;
};

export const getEntregasByEstudiante = async (idEstudiante) => {
    const response = await apiClient.get(`/entregas/estudiante/${idEstudiante}`);
    return response.data;
};

export const createEntrega = async (entrega) => {
    const response = await apiClient.post("/entregas", entrega);
    return response.data;
};
export const updateEntrega = async (id, entrega) => {
    const response = await apiClient.put(`/entregas/${id}`, entrega);
    return response.data;
};

export const calificarEntrega = async (id, calificacion) => {
    console.log("Calificando entrega con ID:", id);
    console.log("Calificación:", calificacion);
    const response = await apiClient.put(`/entregas/calificar/${id}`, calificacion);
    return response.data;
};