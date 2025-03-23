const API_URL = "http://localhost:4000/api";

export const registrarUsuario = async (datos) => {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  return await response.json();
};
