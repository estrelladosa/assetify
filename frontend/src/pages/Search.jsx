import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchAssets } from "../services/api";
import AssetCard from "../components/AssetCard";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importamos useTranslation
import "./Search.css";
import {API_URL} from "../services/api"; 

const Search = () => {
  const location = useLocation();
  const { t } = useTranslation(); // Hook para traducción
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [filtros, setFiltros] = useState({
    tags: [],
    autor: "",
    fechaPublicacion: "",
    formato: "",
    likes: ""
  });
  const [todosLosAssets, setTodosLosAssets] = useState([]);
  const [autores, setAutores] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/categorias`)
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]));

    fetch(`${API_URL}/usuarios`)
      .then(res => res.json())
      .then(data => setAutores(data))
      .catch(() => setAutores([]));

    fetch(`${API_URL}/etiquetas`)
      .then(res => res.json())
      .then(data => setEtiquetas(data))
      .catch(() => setEtiquetas([]));
    
    // Cargar todos los assets al inicio
    realizarBusqueda("");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nombre = params.get("nombre");
    if (nombre) {
      setQuery(nombre);
      realizarBusqueda(nombre);
    }
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    if (todosLosAssets.length > 0) {
      aplicarFiltros();
    }
    // eslint-disable-next-line
  }, [categoriaSeleccionada, filtros]);

const realizarBusqueda = async (nombre) => {
  try {
    // Si nombre es vacío, obtener todos los assets (sin filtrar por nombre)
    const params = {
      nombre: nombre,
      categoria: categoriaSeleccionada,
      etiquetas: filtros.tags,
      autor: filtros.autor,
      formato: filtros.formato
    };
    
    // Usar la función searchAssets para todos los casos
    const assets = await searchAssets(params);
    setTodosLosAssets(assets);
    aplicarFiltros(assets);
  } catch (error) {
    console.error("Error al buscar assets:", error);
    setTodosLosAssets([]);
    setResults([]);
  }
};

  const aplicarFiltros = (assetsIniciales = todosLosAssets) => {
    let assetsFiltrados = [...assetsIniciales];

    if (categoriaSeleccionada) {
      assetsFiltrados = assetsFiltrados.filter(asset =>
        asset.categorias?.some(cat =>
          typeof cat === "string"
            ? cat === categoriaSeleccionada
            : cat._id === categoriaSeleccionada || cat.nombre === categoriaSeleccionada
        )
      );
    }

    if (filtros.fechaPublicacion) {
      const hoy = new Date();
      const fechaLimite = new Date();
      switch (filtros.fechaPublicacion) {
        case "hoy":
          assetsFiltrados = assetsFiltrados.filter(asset => {
            const fechaPublicacion = new Date(asset.fecha);
            return fechaPublicacion.toDateString() === hoy.toDateString();
          });
          break;
        case "esta_semana":
          fechaLimite.setDate(hoy.getDate() - 7);
          assetsFiltrados = assetsFiltrados.filter(asset => {
            const fechaPublicacion = new Date(asset.fecha);
            return fechaPublicacion >= fechaLimite;
          });
          break;
        case "este_mes":
          fechaLimite.setDate(hoy.getDate() - 30);
          assetsFiltrados = assetsFiltrados.filter(asset => {
            const fechaPublicacion = new Date(asset.fecha);
            return fechaPublicacion >= fechaLimite;
          });
          break;
        case "este_anio":
          fechaLimite.setFullYear(hoy.getFullYear(), 0, 1);
          assetsFiltrados = assetsFiltrados.filter(asset => {
            const fechaPublicacion = new Date(asset.fecha);
            return fechaPublicacion >= fechaLimite;
          });
          break;
        default:
          break;
      }
    }

    if (filtros.autor) {
      assetsFiltrados = assetsFiltrados.filter(asset => {
        if (!asset.usuario) return false;
        const autorId = typeof asset.usuario === 'string'
          ? asset.usuario
          : asset.usuario._id;
        return autorId === filtros.autor;
      });
    }

    // Filtrar por tags (varios)
    if (filtros.tags.length > 0) {
      assetsFiltrados = assetsFiltrados.filter(asset => {
        if (!asset.etiquetas || !Array.isArray(asset.etiquetas)) return false;
        
        // Comprobar si alguna de las etiquetas del filtro coincide con alguna del asset
        return filtros.tags.some(tagId => 
          asset.etiquetas.some(etiqueta => {
            // Si etiqueta es string (ID), comparar directamente
            if (typeof etiqueta === 'string') {
              return etiqueta === tagId;
            }
            // Si etiqueta es un objeto, comparar con el _id
            return etiqueta._id === tagId;
          })
        );
      });
    }

    if (filtros.formato) {
      assetsFiltrados = assetsFiltrados.filter(asset => {
        if (!asset.formato) return false;
        return asset.formato.toLowerCase() === filtros.formato.toLowerCase();
      });
    }

    if (filtros.likes === "asc") {
      assetsFiltrados.sort((a, b) => (a.likes?.length || 0) - (b.likes?.length || 0));
    }
    if (filtros.likes === "desc") {
      assetsFiltrados.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    }

    setResults(assetsFiltrados);
  };

  const handleCategoriaClick = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId === categoriaSeleccionada ? "" : categoriaId);
  };

  // Cambia el filtro de tags para permitir múltiples selecciones
  const handleTagChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    setFiltros((prev) => ({
      ...prev,
      tags: prev.tags.includes(value) ? prev.tags : [...prev.tags, value]
    }));
  };

  // Eliminar un tag del filtro
  const handleRemoveTag = (tagId) => {
    setFiltros((prev) => ({
      ...prev,
      tags: prev.tags.filter((id) => id !== tagId)
    }));
  };

  const handleFiltroChange = (filtro, valor) => {
    setFiltros({
      ...filtros,
      [filtro]: valor
    });
  };

  const contarAssetsPorCategoria = (categoriaId) => {
    return todosLosAssets.filter(asset =>
      asset.categorias?.some(cat =>
        typeof cat === "string"
          ? cat === categoriaId
          : cat._id === categoriaId
      )
    ).length;
  };

  const extensionesPorCategoria = {
    "2D": [".jpg", ".jpeg", ".png", ".svg", ".gif", ".bmp", ".tiff", ".webp"],
    "3D": [".fbx", ".obj", ".stl", ".blend", ".wrl", ".gltf", ".glb", ".dae"],
    "Audio": [".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a"],
    "Video": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    "Código": [".js", ".ts", ".py", ".cpp", ".c", ".java", ".cs", ".html", ".css", ".json", ".xml", ".txt", ".md"]
  };

  return (
    <div className="search-container">
      <div className="sidebar">
        <h2>{t('search.productTypes')}</h2>
        <ul className="categoria-list">
          <li 
            className={categoriaSeleccionada === "" ? "active" : ""}
            onClick={() => handleCategoriaClick("")}
          >
            <i className="fas fa-th-list"></i> {t('search.allProducts')}
            <span className="categoria-count">{todosLosAssets.length}</span>
          </li>
          {categorias.map((cat) => (
            <li 
              key={cat._id} 
              className={categoriaSeleccionada === cat._id ? "active" : ""}
              onClick={() => handleCategoriaClick(cat._id)}
            >
              <i className={`fas ${getCategoriaIcon(cat.nombre)}`}></i> {cat.nombre}
              <span className="categoria-count">{contarAssetsPorCategoria(cat._id)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Select de categorías solo visible en móvil */}
      <select
        className="mobile-categorias-dropdown"
        value={categoriaSeleccionada}
        onChange={e => setCategoriaSeleccionada(e.target.value)}
      >
        <option value="">{t('search.allProducts')}</option>
        {categorias.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.nombre}
          </option>
        ))}
      </select>

      <div className="main-content">
        <h1>{query ? `Resultados de búsqueda para: "${query}"` : "Todos los assets"}</h1>
        
        <div className="filter-bar">
          <div className="filter-dropdown">
            <select 
              value=""
              onChange={handleTagChange}
            >
              <option value="">{t('search.tags')}</option>
              {etiquetas
                .filter(tag => !filtros.tags.includes(tag._id))
                .map((tag) => (
                  <option key={tag._id} value={tag._id}>{tag.nombre}</option>
                ))}
            </select>
          </div>
          
          {/* Ordenar por likes */}
          <div className="filter-dropdown">
            <select
              value={filtros.likes || ""}
              onChange={(e) => handleFiltroChange("likes", e.target.value)}
            >
              <option value="">{t('search.sortByLikes')}</option>
              <option value="asc">{t('search.likesAscending')}</option>
              <option value="desc">{t('search.likesDescending')}</option>
            </select>
          </div>  
          
          <div className="filter-dropdown">
            <select 
              value={filtros.autor} 
              onChange={(e) => handleFiltroChange("autor", e.target.value)}
            >
              <option value="">{t('search.author')}</option>
              {autores.map((autor) => (
                <option key={autor._id} value={autor._id}>{autor.nombre_usuario}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-dropdown">
            <select 
              value={filtros.fechaPublicacion} 
              onChange={(e) => handleFiltroChange("fechaPublicacion", e.target.value)}
            >
              <option value="">{t('search.publicationDate')}</option>
              <option value="hoy">{t('search.today')}</option>
              <option value="esta_semana">{t('search.thisWeek')}</option>
              <option value="este_mes">{t('search.thisMonth')}</option>
              <option value="este_anio">{t('search.thisYear')}</option>
            </select>
          </div>
          
          <div className="filter-dropdown">
            <select 
              value={filtros.formato} 
              onChange={(e) => handleFiltroChange("formato", e.target.value)}
            >
              <option value="">Formato</option>
              {Object.entries(extensionesPorCategoria).map(([categoria, extensiones]) => (
                <optgroup key={categoria} label={categoria}>
                  {extensiones.map((ext) => (
                    <option key={ext} value={ext.replace('.', '.').toLowerCase()}>
                      {ext.toUpperCase()}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Mostrar tags seleccionados */}
        {filtros.tags.length > 0 && (
          <div style={{ margin: "10px 0", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {filtros.tags.map(tagId => {
              const tag = etiquetas.find(t => t._id === tagId);
              return (
                <span
                  key={tagId}
                  style={{
                    background: "#1a2942",
                    color: "#fff",
                    borderRadius: "16px",
                    padding: "4px 12px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px"
                  }}
                >
                  {tag ? tag.nombre : tagId}
                  <button
                    onClick={() => handleRemoveTag(tagId)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      marginLeft: "8px",
                      cursor: "pointer",
                      fontSize: "16px",
                      lineHeight: "1"
                    }}
                    title={t('search.removeTag')}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
        
        <div className="asset-grid">
          {results.length > 0 ? (
            results.map((asset) => (
            <Link 
              key={asset._id} 
              to={`/asset/${asset._id}`}  
            >    
              <AssetCard
                key={asset._id}
                title={asset.nombre}
                author={asset.usuario?.nombre_usuario || t('search.unknownUser')}
                imageURL={asset.imagenes && asset.imagenes.length > 0 ? asset.imagenes[0] : "./assets/placeholder.png"}
                id={asset._id}
              />
            </Link>
            ))
          ) : (
            <p className="no-results">{t('search.noResults')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Función para asignar iconos según el nombre de la categoría
const getCategoriaIcon = (nombre) => {
  const iconMap = {
    "3D": "fa-cube",
    "2D": "fa-square",
    "Audio": "fa-volume-up",
    "Herramientas": "fa-tools",
    "Efectos": "fa-magic",
    "Plantillas": "fa-file-alt",
    "IA": "fa-brain",
    "Complementos": "fa-puzzle-piece",
    "Esenciales": "fa-star",
    "Web3": "fa-globe"
  };
  
  return iconMap[nombre] || "fa-tag";
};

export default Search;