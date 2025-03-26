import React from "react";
import "../components/Header.css";
import logo from "../assets/logo.png"; // Asegúrate de que la ruta sea correcta
import { Navigate, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header">
      <img 
        src={logo} 
        alt="Logo" 
        className="header-logo" 
        onClick={() => navigate("/")}
        style={{cursor:"pointer"}}/>
      <button className="header-button">Descubrir</button>
      <button className="header-button">Publicar</button>
      <input type="text" placeholder="Buscar..." className="header-search" />
      <button className="header-icon">🌍</button>
      <button className="header-icon">📋</button>
      <button className="header-button" onClick={() => navigate("/login")}>Iniciar sesión</button>
    </header>
  );
};

export default Header;
