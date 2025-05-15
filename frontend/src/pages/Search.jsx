import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { searchAssets } from "../services/api";
import AssetCard from "../components/AssetCard";
import { Link } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [filtros, setFiltros] = useState({
    tags: "",
    estilo: "",
    autor: "",
    fechaPublicacion: "",
    formato: "",
    likes: "" // NUEVO
  });
  const [todosLosAssets, setTodosLosAssets] = useState([]);
  const [autores, setAutores] = useState([]); // NUEVO
  const [etiquetas, setEtiquetas] = useState([]); // NUEVO

  useEffect(() => {
    // Cargar categorías
    fetch("http://localhost:4000/api/categorias")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() => setCategorias([]));

    // Cargar autores
    fetch("http://localhost:4000/api/usuarios")
      .then(res => res.json())
      .then(data => setAutores(data))
      .catch(() => setAutores([]));

    // Cargar etiquetas
    fetch("http://localhost:4000/api/etiquetas")
      .then(res => res.json())
      .then(data => setEtiquetas(data))
      .catch(() => setEtiquetas([]));
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

  // Efecto para aplicar filtros
  useEffect(() => {
    if (todosLosAssets.length > 0) {
      aplicarFiltros();
    }
    // eslint-disable-next-line
  }, [categoriaSeleccionada, filtros]);

  const realizarBusqueda = async (nombre) => {
    try {
      const assets = await searchAssets(nombre);
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

    // Filtrar por categoría si está seleccionada
    if (categoriaSeleccionada) {
      assetsFiltrados = assetsFiltrados.filter(asset =>
        asset.categorias?.some(cat =>
          typeof cat === "string"
            ? cat === categoriaSeleccionada
            : cat._id === categoriaSeleccionada || cat.nombre === categoriaSeleccionada
        )
      );
    }

    // Filtrar por fecha de publicación
    if (filtros.fechaPublicacion) {
      const hoy = new Date();
      const fechaLimite = new Date();
      
      switch (filtros.fechaPublicacion) {
        case "hoy":
          // Filtrar por assets publicados hoy
          assetsFiltrados = assetsFiltrados.filter(asset => {
            const fechaPublicacion = new Date(asset.fecha);
            return fechaPublicacion.toDateString() === hoy.toDateString();
          });
          break;
        case "esta_semana":
          // Filtrar por assets publicados esta semana (últimos 7 días)
          fechaLimite.setDate(hoy.getDate() - 7);
          assetsFiltrados = assetsFiltrados.filter(asset => {
            const fechaPublicacion = new Date(asset.fecha);
            return fechaPublicacion >= fechaLimite;
          });
          break;
        case "este_mes":
          // Filtrar por assets publicados este mes (últimos 30 días)
          fechaLimite.setDate(hoy.getDate() - 30);
          assetsFiltrados = assetsFiltrados.filter(asset => {
            const fechaPublicacion = new Date(asset.fecha);
            return fechaPublicacion >= fechaLimite;
          });
          break;
        case "este_anio":
          // Filtrar por assets publicados este año
          fechaLimite.setFullYear(hoy.getFullYear(), 0, 1); // 1 de enero del año actual
          assetsFiltrados = assetsFiltrados.filter(asset => {
            const fechaPublicacion = new Date(asset.fecha);
            return fechaPublicacion >= fechaLimite;
          });
          break;
        default:
          // No filtrar si no hay un valor válido
          break;
      }
    }

    // Filtrar por autor
    if (filtros.autor) {
      assetsFiltrados = assetsFiltrados.filter(asset => {
        if (!asset.usuario) return false;
        // asset.usuario puede ser un string (id) o un objeto con _id
        const autorId = typeof asset.usuario === 'string'
          ? asset.usuario
          : asset.usuario._id;
        return autorId === filtros.autor;
      });
    }


  // Filtrar por tags
  if (filtros.tags) {
    assetsFiltrados = assetsFiltrados.filter(asset => {
      if (!asset.etiquetas || !Array.isArray(asset.etiquetas)) return false;
      // Compara el ObjectId del tag seleccionado con los del asset
      return asset.etiquetas.some(tagId => tagId === filtros.tags);
    });
  }

    // Filtrar por estilo
    if (filtros.estilo) {
      assetsFiltrados = assetsFiltrados.filter(asset => {
        if (!asset.estilo) return false;
        return asset.estilo.toLowerCase().includes(filtros.estilo.toLowerCase());
      });
    }

    // Filtrar por formato
    if (filtros.formato) {
      assetsFiltrados = assetsFiltrados.filter(asset => {
        if (!asset.formato) return false;
        return asset.formato.toLowerCase() === filtros.formato.toLowerCase();
      });
    }

    // Ordenar por likes
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

  const handleFiltroChange = (filtro, valor) => {
    setFiltros({
      ...filtros,
      [filtro]: valor
    });
  };

  // Añade esta función dentro del componente Search:
  const contarAssetsPorCategoria = (categoriaId) => {
    return todosLosAssets.filter(asset =>
      asset.categorias?.some(cat =>
        typeof cat === "string"
          ? cat === categoriaId
          : cat._id === categoriaId
      )
    ).length;
  };

  return (
    <div className="search-container">
      <div className="sidebar">
        <h2>TIPOS DE PRODUCTO</h2>
        <ul className="categoria-list">
          <li 
            className={categoriaSeleccionada === "" ? "active" : ""}
            onClick={() => handleCategoriaClick("")}
          >
            <i className="fas fa-th-list"></i> Todos los productos
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
      
      <div className="main-content">
        <h1>Resultados de búsqueda para: "{query}"</h1>
        
        <div className="filter-bar">
          <div className="filter-dropdown">
          <select 
            value={filtros.tags} 
            onChange={(e) => handleFiltroChange("tags", e.target.value)}
          >
            <option value="">Tags</option>
            {etiquetas.map((tag) => (
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
              <option value="">Ordenar por Likes</option>
              <option value="asc">Likes (ascendente)</option>
              <option value="desc">Likes (descendente)</option>
            </select>
          </div>  
          
          <div className="filter-dropdown">
            <select 
              value={filtros.autor} 
              onChange={(e) => handleFiltroChange("autor", e.target.value)}
            >
              <option value="">Autor</option>
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
              <option value="">Fecha publicación</option>
              <option value="hoy">Hoy</option>
              <option value="esta_semana">Esta semana</option>
              <option value="este_mes">Este mes</option>
              <option value="este_anio">Este año</option>
            </select>
          </div>
          
          <div className="filter-dropdown">
            <select 
              value={filtros.formato} 
              onChange={(e) => handleFiltroChange("formato", e.target.value)}
            >
              <option value="">Formato</option>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="svg">SVG</option>
              <option value="obj">OBJ</option>
              <option value="fbx">FBX</option>
              <option value="mp3">MP3</option>
              <option value="wav">WAV</option>
            </select>
          </div>
        </div>
        
        <div className="asset-grid">
          {results.length > 0 ? (
            results.map((asset) => (
            <Link 
              key={asset._id} 
              to={`/asset/${asset._id}`}  // <-- Pasa el ID en la URL
            >    
              <AssetCard
                key={asset._id}
                title={asset.nombre}
                author={asset.usuario?.nombre || "Usuario desconocido"}
                imageURL={asset.imagenes && asset.imagenes.length > 0 ? asset.imagenes[0] : "./assets/placeholder.png"}
                id={asset._id}
              />
            </Link>
            ))
          ) : (
            <p className="no-results">No se encontraron resultados.</p>
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
  
  return iconMap[nombre] || "fa-tag"; // Icono predeterminado si no hay coincidencia
};

export default Search;