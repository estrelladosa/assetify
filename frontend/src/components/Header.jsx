import React from "react";
import "../components/Header.css";
import logo from "../assets/logo.png";
import descubrir from "../assets/descubrir.png";
import lista from "../assets/lista.png";
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
      <button className="header-icon"><img src={descubrir} alt="descubrir" style={{ width: '20px', height: '20px' }}/></button>
      <button className="header-icon"><img src={lista} alt="lista" style={{ width: '20px', height: '20px' }}/></button>
      <button className="header-button" onClick={() => navigate("/login")}>Iniciar sesión</button>
    </header>
  );
};

export default Header;
