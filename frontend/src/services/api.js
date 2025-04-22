const API_URL = "http://localhost:4000/api";

export const registrarUsuario = async (datos) => {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  return await response.json();
};

export const loginUsuario = async (datos) => {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  return await response.json();
}

export const searchAssets = async (nombre) => {
  console.log(`Buscando assets con el nombre: ${nombre}`); // Log para depuración

  const response = await fetch(`${API_URL}/assets/search?nombre=${nombre}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error("Error en la respuesta del servidor:", errorMessage); // Log para depuración
    throw new Error("Error al buscar assets");
  }

  return await response.json();
};

// En tu archivo api.js
export const obtenerAssets = async () => {
  const response = await fetch(`${API_URL}/assets`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener assets");
  }

  return await response.json();
};