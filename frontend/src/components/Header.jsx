import React, { useState } from "react";
import "../components/Header.css";
import logo from "../assets/logo.png";
import descubrir from "../assets/descubrir.png";
import lista from "../assets/lista.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/buscar?nombre=${encodeURIComponent(searchQuery)}`); // Redirige a la página de búsqueda con el término
    }
  };

  return (
    <header className="header">
      <img
        src={logo}
        alt="Logo"
        className="header-logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      />
      <button className="header-button">Descubrir</button>
      <button className="header-button">Publicar</button>
      <input
        type="text"
        placeholder="Buscar..."
        className="header-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch} // Detecta la tecla Enter
      />
      <button className="header-icon">
        <img src={descubrir} alt="descubrir" style={{ width: "20px", height: "20px" }} />
      </button>
      <button className="header-icon">
        <img src={lista} alt="lista" style={{ width: "20px", height: "20px" }} />
      </button>
      <button className="header-button" onClick={() => navigate("/login")}>
        Iniciar sesión
      </button>
    </header>
  );
};

export default Header;
