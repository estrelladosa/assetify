import React, { useState, useEffect } from "react";
import subirArchivoIcon from "../assets/subirarchivo.png";
import subirImagenIcon from "../assets/subirimagen.png";
import { useNavigate } from "react-router-dom";
import "./Publicar.css";

const Publicar = () => {
  const navigate = useNavigate();
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

  const handleAgregarEtiqueta = async () => {
    if (!nuevaEtiqueta.trim()) return;

    const etiquetaExistente = etiquetasDisponibles.find(
      (etiqueta) => etiqueta.nombre.toLowerCase() === nuevaEtiqueta.toLowerCase()
    );

    if (etiquetaExistente) {
      if (!etiquetas.some((etiqueta) => etiqueta._id === etiquetaExistente._id)) {
        setEtiquetas([...etiquetas, etiquetaExistente]);
      }
    } else {
      const nuevaEtiquetaObj = { nombre: nuevaEtiqueta };

      try {
        const response = await fetch("http://localhost:4000/api/etiquetas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaEtiquetaObj),
        });

        const data = await response.json();
        if (response.ok) {
          setEtiquetas([...etiquetas, data]);
          setEtiquetasDisponibles([...etiquetasDisponibles, data]);
        } else {
          console.error("Error al agregar etiqueta:", data.message);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      }
    }

    setNuevaEtiqueta("");
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

  const subirImagenADrive = async (imagen) => {
    const formData = new FormData();
    formData.append("archivo", imagen);
  
    const response = await fetch("http://localhost:4000/api/drive/subir", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Error desconocido al subir imagen a Drive");
    }
  
    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.descripcion || categoriasSeleccionadas.length === 0) {
      setMensaje("❌ Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      // 1. Subir imágenes a Drive
      const imagenesSubidas = await Promise.all(imagenes.map((img) => subirImagenADrive(img)));
      const urlsImagenes = imagenesSubidas.map((res) => res.link);

      // 2. Preparar y enviar el asset
      const usuarioId = "680f55d62a63adb9232b058c";
      const fechaActual = new Date().toISOString();

      const formData = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        usuario: usuarioId,
        imagenes: urlsImagenes,
        archivos: archivos.map((archivo) => archivo.name), // aún no se suben a Drive
        formato: form.formato,
        etiquetas: etiquetas.map((etiqueta) => etiqueta._id),
        categorias: categoriasSeleccionadas,
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
      setMensaje("❌ Error al subir las imágenes: " + error.message);
    }
  };

  const handleCancelar = () => {
    if (window.confirm("¿Estás seguro de que deseas cancelar?")) {
      navigate("/");
    }
  };

  return (
    <div className="publicar-container">
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="publicar-columnas">
        <div>
          <h3>Nombre</h3>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <h3>Descripción</h3>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            required
          ></textarea>
          <h3>Sube los archivos aquí</h3>
          <label className="upload-button">
            <img src={subirArchivoIcon} alt="Subir archivo" />
            <input type="file" multiple onChange={handleArchivoSubido} />
          </label>
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

        <div>
          <h3>Elige tus tags</h3>
          <div className="translucent-background">
            <input
              list="etiquetas-disponibles"
              type="text"
              placeholder="Añadir nueva etiqueta"
              value={nuevaEtiqueta}
              onChange={(e) => setNuevaEtiqueta(e.target.value)}
            />
            <datalist id="etiquetas-disponibles">
              {etiquetasDisponibles.map((etiqueta) => (
                <option key={etiqueta._id} value={etiqueta.nombre} />
              ))}
            </datalist>
            <button type="button" onClick={handleAgregarEtiqueta}>
              Añadir
            </button>
            <ul>
              {etiquetas.map((etiqueta, index) => (
                <li key={index}>
                  {etiqueta.nombre}{" "}
                  <button type="button" onClick={() => handleEliminarEtiqueta(index)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <h3>Subir fotos de vista previa</h3>
          <label className="upload-button">
            <img src={subirImagenIcon} alt="Subir imagen" />
            <input type="file" multiple onChange={handleImagenSubida} />
          </label>
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

        <div>
          <h3>Selecciona categoría</h3>
          <div className="translucent-background">
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
          </div>
          <div className="botones">
            <button type="reset" onClick={handleCancelar}>
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
