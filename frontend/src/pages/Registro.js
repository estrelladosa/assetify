import React, { useState } from "react";
import "../pages/Registro.css";

const Registro = () => {
  const [form, setForm] = useState({
    nombre_usuario: "",
    correo: "",
    contraseña: "",
    repetirContraseña: "",
  });

  const [mensaje, setMensaje] = useState("");

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
      const response = await fetch("http://localhost:4000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_usuario: form.nombre_usuario,
          correo: form.correo,
          contraseña: form.contraseña,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Usuario registrado con éxito");
        setForm({ nombre_usuario: "", correo: "", contraseña: "", repetirContraseña: "" });
      } else {
        setMensaje(`❌ Error: ${data.error || "No se pudo registrar el usuario"}`);
      }
    } catch (error) {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  return (
    <>
      <div className="registro-container">
        <h2>Registro</h2>
        {mensaje && <p className="mensaje">{mensaje}</p>}
        <form onSubmit={handleSubmit} className="registro-form">
          <input type="text" name="nombre_usuario" placeholder="Nombre de usuario" value={form.nombre_usuario} onChange={handleChange} required />
          <input type="email" name="correo" placeholder="Correo electrónico" value={form.correo} onChange={handleChange} required />
          <input type="password" name="contraseña" placeholder="Contraseña" value={form.contraseña} onChange={handleChange} required />
          <input type="password" name="repetirContraseña" placeholder="Repetir contraseña" value={form.repetirContraseña} onChange={handleChange} required />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </>
  );
};

export default Registro;
