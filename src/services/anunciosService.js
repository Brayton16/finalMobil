import apiClient from "./apiClient";

export const obtenerAnuncios = async () => {
  try {
    const response = await apiClient.get("/anuncios");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerAnunciosByProfesor = async (profesorId) => {
  try {
    const response = await apiClient.get(`/anuncios/profesor/${profesorId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const obtenerAnunciosByGrupo = async (idGrupo) => {
  try {
    const response = await apiClient.get(`/anuncios/grupo/${idGrupo}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerAnuncioById = async (id) => {
  try {
    const response = await apiClient.get(`/anuncios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crearAnuncio = async (anuncioData) => {
  try {
    const response = await apiClient.post("/anuncios", anuncioData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

