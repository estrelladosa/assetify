import React, { useState , useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Registro.css";

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre_usuario: "",
    correo: "",
    contraseña: "",
    repetirContraseña: "",
  });

  const [mensaje, setMensaje] = useState("");
  const nombreImputRef = useRef(null);
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const imagenInputRef = useRef(null);



  useEffect(() => {
    nombreImputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.contraseña !== form.repetirContraseña) {
      setMensaje("❌ Las contraseñas no coinciden");
      return;
    }
    

    try {
      let urlImagenPerfil = "";

        if (imagenPerfil) {
          const formData = new FormData();
          formData.append("archivo", imagenPerfil);

          const responseImagen = await fetch("http://localhost:4000/api/drive/subir", {
            method: "POST",
            body: formData,
          });

          const dataImagen = await responseImagen.json();

          if (!responseImagen.ok) {
            throw new Error(dataImagen.message || "Error al subir imagen de perfil");
          }

          urlImagenPerfil = dataImagen.link;
        }

      const response = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_usuario: form.nombre_usuario,
          correo: form.correo,
          contraseña: form.contraseña,
          foto: urlImagenPerfil,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Usuario registrado con éxito");
        setForm({ nombre_usuario: "", correo: "", contraseña: "", repetirContraseña: "" });
        setImagenPerfil(null); // limpia el estado
        if (imagenInputRef.current) imagenInputRef.current.value = ""; // limpia el input visible

      } else {
        setMensaje(`❌ Error: ${data.error || "No se pudo registrar el usuario"}`);
      }
    } catch (error) {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  return (
    <>
      <div className="registro-wrapper">
        <div className="registro-container">
          <h2>REGÍSTRATE</h2>
          {mensaje && <p className="mensaje">{mensaje}</p>}
          <form onSubmit={handleSubmit} className="registro-form">
            <div className="input-container-name">
              <label className="input-label-name" htmlFor="nombre_usuario">Nombre de usuario</label>
              <input ref={nombreImputRef} type="text" name="nombre_usuario" id="nombre_usuario" value={form.nombre_usuario} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="correo">Correo electrónico</label>
              <input type="email" name="correo" id="correo" value={form.correo} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="contraseña">Contraseña</label>
              <input type="password" name="contraseña" id="contraseña" value={form.contraseña} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="repetirContraseña">Repetir contraseña</label>
              <input type="password" name="repetirContraseña" id="repetirContraseña" value={form.repetirContraseña} onChange={handleChange} required />
            </div>
             <div className="input-container">
              <label className="input-label" htmlFor="fotoPerfil">Foto de perfil</label>
              <input type="file" accept="image/*" ref={imagenInputRef} id="fotoPerfil" onChange={(e) => setImagenPerfil(e.target.files[0])} />
            </div>
            <p className="register-link" onClick={() => navigate("/login")}>
              ¿Ya tienes cuenta? <span>Inicia sesión aquí</span>
            </p>
            <button type="submit">Registrarme</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registro;
