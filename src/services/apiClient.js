import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://final-q4be.onrender.com/api", // Cambia la URL según tu entorno
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
