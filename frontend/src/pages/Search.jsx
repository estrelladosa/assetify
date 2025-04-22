import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchAssets } from "../services/api";
import AssetCard from "../components/AssetCard";

const Search = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nombre = params.get("nombre"); // Obtiene el término de búsqueda de la URL
    if (nombre) {
      setQuery(nombre);
      realizarBusqueda(nombre);
    }
  }, [location.search]);

  const realizarBusqueda = async (nombre) => {
    try {
      const assets = await searchAssets(nombre);
      setResults(assets);
    } catch (error) {
      console.error("Error al buscar assets:", error);
    }
  };

  return (
    <div className="busqueda">
      <h1>Resultados de búsqueda para: "{query}"</h1>
      <div className="asset-grid">
        {results.length > 0 ? (
          results.map((asset) => (
          <AssetCard
            key={asset._id}
            title={asset.nombre}
            author={asset.usuario.nombre || "Usuario desconocido"}
            imageURL={asset.imagenes[0] || "./assets/placeholder.png"}
          />
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};

export default Search;