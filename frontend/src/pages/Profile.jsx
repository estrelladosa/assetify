import React, { useState, useEffect } from "react";
import Toast from "../components/Toast";
import AssetCardOwn from "../components/AssetCardOwn";
import AssetCard from "../components/AssetCard";
import "./Profile.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { obtenerAssetsPorUsuario, obtenerAssetsGuardados, actualizarPerfilUsuario } from "../services/api";
import { eliminarAsset } from "../services/api";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useTranslation } from "react-i18next";
import {API_URL} from "../services/api"; 

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUser();
    const { t, i18n } = useTranslation();
    const [tab, setTab] = useState("mis-assets");
    const [configSection, setConfigSection] = useState(null);
    const [misAssets, setMisAssets] = useState([]);
    const [guardados, setGuardados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [paises, setPaises] = useState([]);
    const [configForm, setConfigForm] = useState({
      nombre: currentUser?.nombre_usuario || "",
      correo: currentUser?.correo || ""
    });
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
      setCargando(false);
    }
  }, [tab, currentUser]);

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
      const response = await fetch(`${API_URL}/usuarios/${currentUser._id}/password`, {
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
        foto: currentUser.avatar
      });
      showToast("success", "Perfil actualizado correctamente");
    } catch (error) {
      showToast("error", "Error al actualizar el perfil");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("archivo", file);

      const response = await fetch(`${API_URL}/drive/subir`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al subir avatar");

      await actualizarPerfilUsuario(currentUser._id, {
        nombre_usuario: configForm.nombre,
        correo: configForm.correo,
        foto: data.link,
      });

      showToast("Avatar actualizado correctamente");
    } catch (error) {
      showToast("Error al subir el avatar: " + error.message);
    }
  };

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
      {/* <div style={{ textAlign: "right", marginBottom: 10 }}>
        <select
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
          style={{ padding: 4, borderRadius: 4 }}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
      </div> */}
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
          {t("profile.myAssets")}
        </button>
        <button
          className={tab === "guardados" ? "active" : ""}
          onClick={() => setTab("guardados")}
        >
          {t("profile.saved")}
        </button>
        <button
          className={tab === "configuracion" ? "active" : ""}
          onClick={() => setTab("configuracion")}
        >
          {t("profile.settings")}
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
                {t("profile.profile")}
              </div>
              <div 
                className={`sidebar-item ${configSection === "cambiar-password" ? "active" : ""}`}
                onClick={() => setConfigSection("cambiar-password")}
              >
                {t("profile.changePassword")}
              </div>
              <div className="sidebar-item logout" onClick={handleLogout}>{t("profile.logout")}</div>
            </div>
          </div>
          <div className="profile-config-content">
            {configSection === "cambiar-password" ? (
              <>
                <h2>{t("profile.changePassword")}</h2>
                <form onSubmit={handlePasswordSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">{t("profile.currentPassword")}</label>
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
                    <label htmlFor="newPassword">{t("profile.newPassword")}</label>
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
                    <label htmlFor="confirmPassword">{t("profile.confirmPassword")}</label>
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
                    <button type="submit" className="save-btn">{t("profile.changePassword")}</button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2>{t("profile.profile")}</h2>
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="nombre">{t("profile.name")}</label>
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
                    <label htmlFor="correo">{t("profile.email")}</label>
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
                    <label htmlFor="avatar">{t("profile.avatar")}</label>
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-btn">{t("profile.save")}</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="profile-assets-grid">
          {cargando ? (
            <p>{t("profile.loading")}</p>
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
                    author={asset.usuario?.nombre_usuario || t("profile.unknownUser")}
                    imageURL={asset.imagenes?.[0]}
                    archivos={asset.archivos}
                    onEdit={() => handleEdit(asset)}
                    onDelete={() => handleDelete(asset)}
                  />
                  </Link>
                </div>
              ))
            ) : (
              <p>{t("profile.noAssets")}</p>
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
                    author={asset.usuario?.nombre_usuario || t("profile.unknownUser")}
                    imageURL={asset.imagenes?.[0]}
                  />
                  </Link>
                </div>
              ))
            ) : (
              <p>{t("profile.noSaved")}</p>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Profile;