import React, { useState } from 'react';
import "./AssetCard.css";
import { FaDownload, FaEdit, FaTrash } from "react-icons/fa";

const AssetCardOwn = ({
  title,
  author,
  imageURL,
  archivos = [],
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  const getAlternativeUrl = (url) => {
    if (!url) return "/assets/placeholder.png";
    try {
      const parsed = new URL(url);
      if (parsed.hostname === "drive.google.com" && parsed.pathname.includes("/uc")) {
        const id = parsed.searchParams.get("id");
        return `https://lh3.googleusercontent.com/d/${id}`;
      }
    } catch (err) {}
    return url;
  };

  const handleImageError = () => setImageError(true);

  return (
    <div className="asset-card">
      {imageError ? (
        <div className="asset-card-image placeholder">
          <p>Imagen no disponible</p>
        </div>
      ) : (
        <img
          src={getAlternativeUrl(imageURL)}
          alt={title}
          className="asset-card-image"
          onError={handleImageError}
        />
      )}
      <div className="asset-card-content">
        <h3 className="asset-card-title">{title}</h3>
        <p className="asset-card-author">{author}</p>
        <div className="asset-card-actions">
          {archivos && archivos.length > 0 && (
            <a
              href={archivos[0].url || archivos[0]}
              download
              className="profile-download-btn"
              title="Descargar"
            >
              <FaDownload />
            </a>
          )}
          <button className="profile-delete-btn" title="Eliminar" onClick={onDelete}>
            <FaTrash /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetCardOwn;