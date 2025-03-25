import React, { useState } from "react";
import Header from "../components/Header";
import "../pages/login.css";

const Login = () => {
  const [form, setForm] = useState({
    correo: "",
    contraseña: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: form.correo,
          contraseña: form.contraseña,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Inicio de sesión exitoso");
        // Aquí puedes redirigir al usuario o guardar el token en el localStorage
        localStorage.setItem("token", data.token);
      } else {
        setMensaje(`❌ Error: ${data.error || "Credenciales incorrectas"}`);
      }
    } catch (error) {
      setMensaje("❌ Error de conexión con el servidor");
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        {mensaje && <p className="mensaje">{mensaje}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={form.contraseña}
            onChange={handleChange}
            required
          />
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </>
  );
};

export default Login;