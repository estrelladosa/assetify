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

 export const obtenerAssetPorId = async (assetId) => {
  const response = await fetch(`${API_URL}/assets/${assetId}`);
  if (!response.ok) {
    throw new Error("Error al obtener asset");
  }
  return await response.json();
};

export const obtenerUsuarioPorId = async (userId) => {
  const response = await fetch(`${API_URL}/usuarios/${userId}`);
  if (!response.ok) {
    throw new Error("Error al obtener usuario");
  }
  return await response.json();
};

export const obtenerComentariosPorAsset = async (assetId) => {
  const response = await fetch(`${API_URL}/assets/comentarios/${assetId}`);
  if (!response.ok) {
    throw new Error("Error al obtener comentarios");
  }
  return await response.json();
};

export const publicarComentario = async ({ assetId, content }) => {
  const response = await fetch(`${API_URL}/assets/comentarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assetId, content }),
  });

  if (!response.ok) {
    throw new Error("Error al publicar comentario");
  }

  return await response.json();
};

export const toggleLike = async (assetId, userId) => {
  const response = await fetch(`${API_URL}/assets/${assetId}/likes/${userId}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Error al dar like");
  return await response.json();
};

export const toggleSave = async (assetId, userId) => {
  const response = await fetch(`${API_URL}/usuarios/${userId}/guardados/${assetId}`, {
    method: "PUT",
  });
  if (!response.ok) throw new Error("Error al guardar asset");
  return await response.json();
};

export const toggleSeguido = async (currentUserId, targetUserId) => {
  const res = await fetch(`${API_URL}/usuarios/${currentUserId}/seguidos/${targetUserId}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al actualizar seguidos");
  return await res.json();
};

export const toggleSeguidor = async (seguidorId, userId) => {
  const res = await fetch(`${API_URL}/usuarios/${userId}/seguidores/${seguidorId}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error al actualizar seguidores");
  return await res.json();
};

export const obtenerEtiquetasPorAsset = async (assetId) => {
  const response = await fetch(`${API_URL}/assets/${assetId}/tags`);
  if (!response.ok) {
    throw new Error("Error al obtener etiquetas");
  }
  return await response.json();  // Esto te dará solo los nombres de las etiquetas
};
