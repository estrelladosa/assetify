export const API_URL = process.env.REACT_APP_BACKEND_URL/api;

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
};

export const searchAssets = async (params) => {
  const query = new URLSearchParams();
  if (params.nombre) query.append("nombre", params.nombre);
  if (params.categoria) query.append("categoria", params.categoria);
  if (params.formato) query.append("formato", params.formato);
  if (params.etiquetas && params.etiquetas.length > 0) {
    params.etiquetas.forEach(tag => query.append("etiquetas", tag));
  }
  
  // Incluso con query vacía, haz la petición
  const response = await fetch(`${API_URL}/assets/search?${query.toString()}`);
  if (!response.ok) throw new Error("Error en la búsqueda");
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

export const publicarComentario = async ({ usuario, asset, comentario }) => {
  const response = await fetch(`${API_URL}/assets/comentarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, asset, comentario }),
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

// Nuevas funciones para la configuración de usuario

// Verificar el token de autenticación
export const verificarToken = async (token) => {
  const response = await fetch(`${API_URL}/auth/verify`, {
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  
  if (!response.ok) {
    throw new Error("Token inválido o expirado");
  }
  
  return await response.json();
};

// Obtener configuración del usuario
export const obtenerConfigUsuario = async (userId) => {
  const response = await fetch(`${API_URL}/config/${userId}`);
  
  if (!response.ok) {
    throw new Error("Error al obtener configuración");
  }
  
  return await response.json();
};

// Guardar configuración del usuario
export const guardarConfigUsuario = async (configData) => {
  const response = await fetch(`${API_URL}/config/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(configData),
  });
  
  if (!response.ok) {
    throw new Error("Error al guardar configuración");
  }
  
  return await response.json();
};

// Cargar fondo personalizado
export const cargarFondoPersonalizado = async (userId, fileData) => {
  const formData = new FormData();
  formData.append('fondo', fileData);
  formData.append('usuarioId', userId);
  
  const response = await fetch(`${API_URL}/config/fondo`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error("Error al cargar imagen de fondo");
  }
  
  return await response.json();
};

// Obtener assets subidos por un usuario
export const obtenerAssetsPorUsuario = async (userId) => {
  const response = await fetch(`${API_URL}/assets/usuario/${userId}`);
  if (!response.ok) throw new Error("Error al obtener assets del usuario");
  return await response.json();
};

// Obtener assets guardados por un usuario
export const obtenerAssetsGuardados = async (userId) => {
  const response = await fetch(`${API_URL}/usuarios/${userId}/guardados`);
  if (!response.ok) throw new Error("Error al obtener assets guardados");
  return await response.json();
};

export const actualizarPerfilUsuario = async (userId, datos) => {
  const response = await fetch(`${API_URL}/api/usuarios/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("Error al actualizar perfil");
  return await response.json();
};

export const obtenerPaises = async () => {
  const res = await fetch(`${API_URL}/paises`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error al obtener países");
  return await res.json();
};

export const eliminarAsset = async (assetId) => {
  const response = await fetch(`${API_URL}/api/assets/${assetId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar asset");
  return await response.json();
};