import React, { useState, useEffect } from "react";
import "./Publicar.css";

const Publicar = () => {
  const [archivos, setArchivos] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [etiquetas, setEtiquetas] = useState([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    formato: "",
  });

  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);

  // Cargar categorías y etiquetas desde el backend
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const categoriasResponse = await fetch("http://localhost:4000/api/categorias");
        const etiquetasResponse = await fetch("http://localhost:4000/api/etiquetas");

        const categoriasData = await categoriasResponse.json();
        const etiquetasData = await etiquetasResponse.json();

        setCategoriasDisponibles(categoriasData);
        setEtiquetasDisponibles(etiquetasData);
      } catch (error) {
        console.error("Error al cargar categorías o etiquetas:", error);
      }
    };

    fetchDatos();
  }, []);

  const handleArchivoSubido = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    setArchivos([...archivos, ...nuevosArchivos]);
  };

  const handleEliminarArchivo = (index) => {
    setArchivos(archivos.filter((_, i) => i !== index));
  };

  const handleImagenSubida = (e) => {
    const nuevasImagenes = Array.from(e.target.files);
    setImagenes([...imagenes, ...nuevasImagenes]);
  };

  const handleEliminarImagen = (index) => {
    setImagenes(imagenes.filter((_, i) => i !== index));
  };

  const handleAgregarEtiqueta = () => {
    if (nuevaEtiqueta.trim() && !etiquetas.includes(nuevaEtiqueta)) {
      setEtiquetas([...etiquetas, nuevaEtiqueta]);
      setNuevaEtiqueta("");
    }
  };

  const handleEliminarEtiqueta = (index) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== index));
  };

  const handleCategoriaSeleccionada = (categoriaId) => {
    if (categoriasSeleccionadas.includes(categoriaId)) {
      setCategoriasSeleccionadas(categoriasSeleccionadas.filter((id) => id !== categoriaId));
    } else {
      setCategoriasSeleccionadas([...categoriasSeleccionadas, categoriaId]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion || categoriasSeleccionadas.length === 0) {
      setMensaje("❌ Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      const usuarioId = "67dd5dbc5b23483b4fcb67ad"; // Reemplaza con el ID del usuario logueado
      const fechaActual = new Date().toISOString();

      const formData = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        usuario: usuarioId,
        imagenes: imagenes.map((imagen) => imagen.name), // Solo los nombres de las imágenes
        archivos: archivos.map((archivo) => archivo.name), // Solo los nombres de los archivos
        formato: form.formato,
        etiquetas, // Array de ObjectId
        categorias: categoriasSeleccionadas, // Array de ObjectId
        likes: [],
        fecha: fechaActual,
        descargas: 0,
      };

      const response = await fetch("http://localhost:4000/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Asset publicado con éxito.");
        setForm({ nombre: "", descripcion: "", formato: "" });
        setArchivos([]);
        setImagenes([]);
        setEtiquetas([]);
        setCategoriasSeleccionadas([]);
      } else {
        setMensaje(`❌ Error: ${data.message || "No se pudo publicar el asset."}`);
      }
    } catch (error) {
      setMensaje("❌ Error de conexión con el servidor.");
    }
  };

  return (
    <div className="publicar-container">
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="publicar-columnas">
        {/* Primera columna */}
        <div className="publicar-columna">
          <h3>Información del Asset</h3>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="text"
            name="formato"
            placeholder="Formato (ej. SVG)"
            value={form.formato}
            onChange={handleChange}
          />
          <input type="file" multiple onChange={handleArchivoSubido} />
          <ul>
            {archivos.map((archivo, index) => (
              <li key={index}>
                {archivo.name}{" "}
                <button type="button" onClick={() => handleEliminarArchivo(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Segunda columna */}
        <div className="publicar-columna">
          <h3>Etiquetas e Imágenes</h3>
          <select
            onChange={(e) => {
              const etiquetaId = e.target.value;
              if (!etiquetas.includes(etiquetaId)) {
                setEtiquetas([...etiquetas, etiquetaId]);
              }
            }}
          >
            <option value="">Seleccionar etiqueta</option>
            {etiquetasDisponibles.map((etiqueta) => (
              <option key={etiqueta._id} value={etiqueta._id}>
                {etiqueta.nombre}
              </option>
            ))}
          </select>
          <ul>
            {etiquetas.map((etiqueta, index) => (
              <li key={index}>
                {etiqueta}{" "}
                <button type="button" onClick={() => handleEliminarEtiqueta(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <input type="file" multiple onChange={handleImagenSubida} />
          <ul>
            {imagenes.map((imagen, index) => (
              <li key={index}>
                {imagen.name}{" "}
                <button type="button" onClick={() => handleEliminarImagen(index)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tercera columna */}
        <div className="publicar-columna">
          <h3>Categorías</h3>
          <ul>
            {categoriasDisponibles.map((categoria) => (
              <li key={categoria._id}>
                <label>
                  <input
                    type="checkbox"
                    name="categoria"
                    value={categoria._id}
                    checked={categoriasSeleccionadas.includes(categoria._id)}
                    onChange={() => handleCategoriaSeleccionada(categoria._id)}
                  />
                  {categoria.nombre}
                </label>
              </li>
            ))}
          </ul>
          <div className="botones">
            <button type="button" onClick={() => alert("Operación cancelada")}>
              Cancelar
            </button>
            <button type="submit">Publicar</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Publicar;