import React, { useState, useEffect } from "react";
import Toast from "../components/Toast";
import AssetCardOwn from "../components/AssetCardOwn";
import AssetCard from "../components/AssetCard";
import "./Profile.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { obtenerAssetsPorUsuario, obtenerAssetsGuardados, actualizarPerfilUsuario } from "../services/api";
// Añade la función para eliminar asset
import { eliminarAsset } from "../services/api";
import { useCurrentUser } from "../hooks/useCurrentUser";

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUser();
    const [tab, setTab] = useState("mis-assets");
    const [configSection, setConfigSection] = useState(null);
    const [misAssets, setMisAssets] = useState([]);
    const [guardados, setGuardados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [paises, setPaises] = useState([]);
    // Estado para el formulario de configuración
    const [configForm, setConfigForm] = useState({
      nombre: currentUser?.nombre_usuario || "",
      correo: currentUser?.correo || ""
    });
    // Estado para el formulario de cambio de contraseña
    const [passwordForm, setPasswordForm] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    const [toast, setToast] = useState({ show: false, type: "success", message: "" });

    const showToast = (type, message) => {
      setToast({ show: true, type, message });
      setTimeout(() => setToast({ show: false, type, message: "" }), 3500);
    };

  useEffect(() => {
    if (!currentUser) return;
    setCargando(true);
    if (tab === "mis-assets") {
      obtenerAssetsPorUsuario(currentUser._id)
        .then(setMisAssets)
        .finally(() => setCargando(false));
    } else if (tab === "guardados") {
      obtenerAssetsGuardados(currentUser._id)
        .then(setGuardados)
        .finally(() => setCargando(false));
    } else if (tab === "configuracion") {
      // Aquí podrías cargar datos del perfil si es necesario
      setCargando(false);
    }
  }, [tab, currentUser]);

  // Elimina este useEffect:
  // useEffect(() => {
  //   fetch("http://localhost:4000/api/paises")
  //     .then(res => res.json())
  //     .then(data => setPaises(data))
  //     .catch(() => setPaises([]));
  // }, []);

  // Handlers de ejemplo para editar y eliminar
  const handleEdit = (asset) => {
    alert(`Editar asset: ${asset.nombre}`);
  };

  const handleDelete = async (asset) => {
    if (window.confirm(`¿Eliminar asset "${asset.nombre}"?`)) {
      try {
        await eliminarAsset(asset._id);
        setMisAssets((prev) => prev.filter((a) => a._id !== asset._id));
        showToast("success", "Asset eliminado correctamente");
      } catch (error) {
        showToast("error", "Error al eliminar el asset");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
    window.location.reload();
  };

  const handleConfigChange = (e) => {
    setConfigForm({
      ...configForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("error", "Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/usuarios/${currentUser._id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al cambiar la contraseña");
      showToast("success", "Contraseña actualizada correctamente");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarPerfilUsuario(currentUser._id, {
        nombre_usuario: configForm.nombre,
        correo: configForm.correo,
        foto: currentUser.avatar // o el nuevo avatar si lo cambiaste
      });
      showToast("success", "Perfil actualizado correctamente");
    } catch (error) {
      showToast("error", "Error al actualizar el perfil");
    }
  };

  // Función para subir avatar y actualizar perfil
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // 1. Subir imagen a drive
      const formData = new FormData();
      formData.append("archivo", file);

      const response = await fetch("http://localhost:4000/api/drive/subir", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al subir avatar");

      // 2. Actualizar usuario con la nueva URL de foto
      await actualizarPerfilUsuario(currentUser._id, {
        nombre_usuario: configForm.nombre,
        correo: configForm.correo,
        foto: data.link, // URL devuelta por el backend
      });

      showToast("Avatar actualizado correctamente");
      // Opcional: recargar datos del usuario
    } catch (error) {
      showToast("Error al subir el avatar: " + error.message);
    }
  };

  // Añade este useEffect para autorrellenar los campos cuando currentUser cambie
  useEffect(() => {
    if (currentUser) {
      setConfigForm({
        nombre: currentUser.nombre_usuario || "",
        correo: currentUser.correo || ""
      });
    }
  }, [currentUser]);

  return (
    <div className="profile-container">
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, show: false })}
      />
      <div className="profile-tabs">
        <button
          className={tab === "mis-assets" ? "active" : ""}
          onClick={() => setTab("mis-assets")}
        >
          Mis Assets
        </button>
        <button
          className={tab === "guardados" ? "active" : ""}
          onClick={() => setTab("guardados")}
        >
          Mis Guardados
        </button>
        <button
          className={tab === "configuracion" ? "active" : ""}
          onClick={() => setTab("configuracion")}
        >
          Configuración
        </button>
      </div>

      {tab === "configuracion" ? (
        <div className="profile-config-container">
          <div className="profile-sidebar">
            <div className="avatar-container">
              <img src={currentUser?.foto || "/default-avatar.jpg"} alt="Avatar" className="profile-avatar" />
            </div>
            <div className="sidebar-menu">
              <div 
                className={`sidebar-item ${tab === "configuracion" && !configSection ? "active" : ""}`}
                onClick={() => setConfigSection(null)}
              >
                Perfil
              </div>
              <div 
                className={`sidebar-item ${configSection === "cambiar-password" ? "active" : ""}`}
                onClick={() => setConfigSection("cambiar-password")}
              >
                Cambiar contraseña
              </div>
              <div className="sidebar-item logout" onClick={handleLogout}>Cerrar sesión</div>
            </div>
          </div>
          <div className="profile-config-content">
            {configSection === "cambiar-password" ? (
              <>
                <h2>Cambiar contraseña</h2>
                <form onSubmit={handlePasswordSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Contraseña actual</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="profile-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">Nueva contraseña</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="profile-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="profile-input"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">Cambiar contraseña</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>Perfil</h2>
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={configForm.nombre}
                      onChange={handleConfigChange}
                      className="profile-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="correo">Dirección email</label>
                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={configForm.correo}
                      onChange={handleConfigChange}
                      className="profile-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="avatar">Avatar</label>
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">Guardar</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="profile-assets-grid">
          {cargando ? (
            <p>Cargando...</p>
          ) : tab === "mis-assets" ? (
            misAssets.length > 0 ? (
              misAssets.map((asset) => (
                <div className="profile-asset-card" key={asset._id}>
                  <Link 
                    key={asset._id} 
                    to={`/asset/${asset._id}`}
                  >     
                  <AssetCardOwn
                    title={asset.nombre}
                    author={asset.usuario?.nombre_usuario || "Usuario desconocido"}
                    imageURL={asset.imagenes?.[0]}
                    archivos={asset.archivos}
                    onEdit={() => handleEdit(asset)}
                    onDelete={() => handleDelete(asset)}
                  />
                  </Link>
                </div>
              ))
            ) : (
              <p>No tienes assets subidos.</p>
            )
          ) : tab === "guardados" ? (
            guardados.length > 0 ? (
              guardados.map((asset) => (
                <div className="profile-asset-card" key={asset._id}>
                  <Link 
                    key={asset._id} 
                    to={`/asset/${asset._id}`}
                  >     
                  <AssetCard
                    title={asset.nombre}
                    author={asset.usuario?.nombre_usuario || "Usuario desconocido"}
                    imageURL={asset.imagenes?.[0]}
                  />
                  </Link>
                </div>
              ))
            ) : (
              <p>No tienes assets guardados.</p>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Profile;