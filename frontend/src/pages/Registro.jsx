import React, { useState , useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Registro.css";
import { useTranslation } from "react-i18next";

const Registro = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
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
      setMensaje("❌ " + t("register.passwordsDontMatch"));
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
          throw new Error(dataImagen.message || t("register.avatarUploadError"));
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
        setMensaje("✅ " + t("register.success"));
        setForm({ nombre_usuario: "", correo: "", contraseña: "", repetirContraseña: "" });
        setImagenPerfil(null);
        if (imagenInputRef.current) imagenInputRef.current.value = "";
      } else {
        setMensaje(`❌ ${t("register.error")}: ${data.error || t("register.couldNotRegister")}`);
      }
    } catch (error) {
      setMensaje("❌ " + t("register.connectionError"));
    }
  };

  return (
    <>
      <div className="registro-wrapper">
        <div className="registro-container">
          <h2>{t("register.title")}</h2>
          {mensaje && <p className="mensaje">{mensaje}</p>}
          <form onSubmit={handleSubmit} className="registro-form">
            <div className="input-container-name">
              <label className="input-label-name" htmlFor="nombre_usuario">{t("register.username")}</label>
              <input ref={nombreImputRef} type="text" name="nombre_usuario" id="nombre_usuario" value={form.nombre_usuario} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="correo">{t("register.email")}</label>
              <input type="email" name="correo" id="correo" value={form.correo} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="contraseña">{t("register.password")}</label>
              <input type="password" name="contraseña" id="contraseña" value={form.contraseña} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="repetirContraseña">{t("register.repeatPassword")}</label>
              <input type="password" name="repetirContraseña" id="repetirContraseña" value={form.repetirContraseña} onChange={handleChange} required />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="fotoPerfil">{t("register.avatar")}</label>
              <input type="file" accept="image/*" ref={imagenInputRef} id="fotoPerfil" onChange={(e) => setImagenPerfil(e.target.files[0])} />
            </div>
            <p className="register-link" onClick={() => navigate("/login")}>
              {t("register.haveAccount")} <span>{t("register.loginHere")}</span>
            </p>
            <button type="submit">{t("register.registerButton")}</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registro;
