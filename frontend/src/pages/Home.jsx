import React, { useState, useEffect } from "react";
import AssetCard from "../components/AssetCard";
import "../pages/Home.css"; // Asegúrate de que el archivo existe para los estilos
import { obtenerAssets } from "../services/api"; // Función para cargar datos reales

const Home = () => {
  const [allAssets, setAllAssets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [visibleRecientes, setVisibleRecientes] = useState(4);
  const [visibleTendencias, setVisibleTendencias] = useState(4);

  useEffect(() => {
    const cargarAssets = async () => {
      try {
        setCargando(true);
        const assetsData = await obtenerAssets();
        setAllAssets(assetsData);
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

  // Filtrar destacados (por ejemplo, los 3 primeros)
  const destacados = allAssets.length > 0 
    ? allAssets.filter((asset, index) => index < 3) 
    : [];

  // Ordenar por fecha de creación para recientes
  const recientes = allAssets.length > 0 
    ? [...allAssets].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    : [];

  // Ordenar por popularidad para tendencias (suponiendo que tienes un campo likes o vistas)
  const tendencias = allAssets.length > 0 
    ? [...allAssets].sort((a, b) => (b.likes || 0) - (a.likes || 0))
    : [];

  const mostrarMas = (setVisible, total) => {
    setVisible((prev) => Math.min(prev + 8, total));
  };

  const mostrarMenos = (setVisible) => {
    setVisible(4);
  };

  if (cargando) {
    return <div className="home loading">Cargando assets...</div>;
  }

  if (error) {
    return <div className="home error">{error}</div>;
  }

  return (
    <div className="home">
      <h2>Destacados del día</h2>
      {destacados.length > 0 ? (
        <div className="destacados-box">
          <div className="destacados">
            {destacados.map((asset) => (
              <AssetCard 
                key={asset._id} 
                title={asset.nombre || asset.title} 
                author={asset.usuario?.nombre || asset.author || "Usuario desconocido"} 
                imageURL={asset.imagenes?.[0] || asset.imageURL || "./assets/placeholder.png"} 
              />
            ))}
          </div>
        </div>
      ) : (
        <p>No hay assets destacados disponibles.</p>
      )}

      <h2>Subidos recientemente</h2>
      {recientes.length > 0 ? (
        <>
          <div className="recientes">
            {recientes.slice(0, visibleRecientes).map((asset, index) => (
              <AssetCard 
                key={asset._id} 
                title={asset.nombre || asset.title} 
                author={asset.usuario?.nombre || asset.author || "Usuario desconocido"} 
                imageURL={asset.imagenes?.[0] || asset.imageURL || "./assets/placeholder.png"} 
                className={`asset-${index % 4}`} 
              />
            ))}
          </div>
          <div className="botones">
            {recientes.length > visibleRecientes && (
              <p className="mostrar-mas" onClick={() => mostrarMas(setVisibleRecientes, recientes.length)}>Mostrar más</p>
            )}
            {visibleRecientes > 4 && (
              <p className="mostrar-menos" onClick={() => mostrarMenos(setVisibleRecientes)}>Mostrar menos</p>
            )}
          </div>
        </>
      ) : (
        <p>No hay assets recientes disponibles.</p>
      )}

      <h2>Tendencias</h2>
      {tendencias.length > 0 ? (
        <>
          <div className="tendencias">
            {tendencias.slice(0, visibleTendencias).map((asset, index) => (
              <AssetCard 
                key={asset._id} 
                title={asset.nombre || asset.title} 
                author={asset.usuario?.nombre || asset.author || "Usuario desconocido"} 
                imageURL={asset.imagenes?.[0] || asset.imageURL || "./assets/placeholder.png"}
                className={`asset-${index % 4}`} 
              />
            ))}
          </div>
          <div className="botones">
            {tendencias.length > visibleTendencias && (
              <p className="mostrar-mas" onClick={() => mostrarMas(setVisibleTendencias, tendencias.length)}>Mostrar más</p>
            )}
            {visibleTendencias > 4 && (
              <p className="mostrar-menos" onClick={() => mostrarMenos(setVisibleTendencias)}>Mostrar menos</p>
            )}
          </div>
        </>
      ) : (
        <p>No hay tendencias disponibles.</p>
      )}
    </div>
  );
};

export default Home;