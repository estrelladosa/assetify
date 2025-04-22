import React, { useState, useEffect } from "react";
import AssetCard from "../components/AssetCard";
import { obtenerAssets } from "../services/api"; // Asumiendo que tienes esta función en tu API

const Home = () => {
  const [assets, setAssets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarAssets = async () => {
      try {
        setCargando(true);
        const assetsData = await obtenerAssets();
        setAssets(assetsData);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los assets:", err);
        setError("No se pudieron cargar los assets. Por favor, intenta de nuevo más tarde.");
      } finally {
        setCargando(false);
      }
    };

    cargarAssets();
  }, []);

  return (
    <div className="home">
      <h1>Assets Disponibles</h1>
      
      {cargando && <p>Cargando assets...</p>}
      
      {error && <p className="error-message">{error}</p>}
      
      {!cargando && !error && assets.length === 0 && (
        <p>No hay assets disponibles.</p>
      )}
      
      <div className="asset-grid">
        {assets.map((asset) => (
          <AssetCard
            key={asset._id}
            title={asset.nombre}
            author={asset.usuario.nombre || "Usuario desconocido"}
            imageURL={asset.imagenes[0] || "./assets/placeholder.png"}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;