import React, { useState, useEffect } from "react";
import AssetCardOwn from "../components/AssetCardOwn";
import AssetCard from "../components/AssetCard";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { obtenerAssetsPorUsuario, obtenerAssetsGuardados } from "../services/api";
import { useCurrentUser } from "../hooks/useCurrentUser";

const Profile = () => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUser();
    const [tab, setTab] = useState("mis-assets");
    const [misAssets, setMisAssets] = useState([]);
    const [guardados, setGuardados] = useState([]);
    const [cargando, setCargando] = useState(true);

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
    }
  }, [tab, currentUser]);

  // Handlers de ejemplo para editar y eliminar
  const handleEdit = (asset) => {
    alert(`Editar asset: ${asset.nombre}`);
  };

  const handleDelete = (asset) => {
    if (window.confirm(`¿Eliminar asset "${asset.nombre}"?`)) {
      setMisAssets((prev) => prev.filter((a) => a._id !== asset._id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="profile-container">
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
          className="cerrar-sesion-btn"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="profile-assets-grid">
        {cargando ? (
          <p>Cargando...</p>
        ) : tab === "mis-assets" ? (
          misAssets.length > 0 ? (
            misAssets.map((asset) => (
              <div className="profile-asset-card" key={asset._id}>
                <AssetCardOwn
                  title={asset.nombre}
                  author={asset.usuario?.nombre_usuario || "Usuario desconocido"}
                  imageURL={asset.imagenes?.[0]}
                  archivos={asset.archivos}
                  onEdit={() => handleEdit(asset)}
                  onDelete={() => handleDelete(asset)}
                />
              </div>
            ))
          ) : (
            <p>No tienes assets subidos.</p>
          )
        ) : tab === "guardados" ? (
          guardados.length > 0 ? (
            guardados.map((asset) => (
              <div className="profile-asset-card" key={asset._id}>
                <AssetCard
                  title={asset.nombre}
                  author={asset.usuario?.nombre_usuario || "Usuario desconocido"}
                  imageURL={asset.imagenes?.[0]}
                />
              </div>
            ))
          ) : (
            <p>No tienes assets guardados.</p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Profile;