import React from "react";
import "../components/Header.css";
import logo from "../assets/logo.png"; // Asegúrate de que la ruta sea correcta

const Header = () => {
  return (
    <header className="header">
      <img src={logo} alt="Logo" className="header-logo" />
      <button className="header-button">Descubrir</button>
      <button className="header-button">Publicar</button>
      <input type="text" placeholder="Buscar..." className="header-search" />
      <button className="header-icon">🌍</button>
      <button className="header-icon">📋</button>
      <button className="header-button">Iniciar sesión</button>
    </header>
  );
};

export default Header;
