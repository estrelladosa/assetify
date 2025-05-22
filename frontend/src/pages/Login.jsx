import React, { useState, useEffect, useRef } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {API_URL} from "../services/api"; 

const Login = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({
    correo: "",
    contraseña: "",
  });

  const [mensaje, setMensaje] = useState("");
  const correoInputRef = useRef(null);
  const [mensajeTipo, setMensajeTipo] = useState(""); // 'success' o 'error'


  useEffect(() => {
    correoInputRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: form.correo,
          contraseña: form.contraseña,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ " + t("login.success"));
        setMensajeTipo("success");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        navigate("/");
        window.location.reload();
      } else {
        setMensaje(`❌ ${t("login.error")}: ${data.error || t("login.invalidCredentials")}`);
        setMensajeTipo("error");
      }
    } catch (error) {
      setMensaje("❌ " + t("login.connectionError"));
      setMensajeTipo("error");
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          {/* Selector de idioma
          <div style={{ textAlign: "right", marginBottom: 10 }}>
            <select
              value={i18n.language}
              onChange={e => i18n.changeLanguage(e.target.value)}
              style={{ padding: 4, borderRadius: 4 }}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div> */}
          <h2>{t("login.title")}</h2>
          {mensaje && (
              <p className={`mensaje ${mensajeTipo === "success" ? "mensaje-exito" : "mensaje-error"}`}>
                {mensaje}
              </p>
            )}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-container">
              <label className="input-label" htmlFor="correo">{t("login.email")}</label>
              <input
                type="email"
                name="correo"
                id="correo"
                value={form.correo}
                onChange={handleChange}
                required
                ref={correoInputRef}
              />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="contraseña">{t("login.password")}</label>
              <input
                type="password"
                name="contraseña"
                id="contraseña"
                value={form.contraseña}
                onChange={handleChange}
                required
              />
            </div>
            <p className="register-link" onClick={() => navigate("/registro")}>
              {t("login.noAccount")} <span>{t("login.registerHere")}</span>
            </p>
            <button type="submit">{t("login.loginButton")}</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;