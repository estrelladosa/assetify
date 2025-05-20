import React, { useState, useEffect } from "react";
import "../components/Header.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSearch, FaGlobeEurope } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica si el token está en localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Cambia el estado según la existencia del token
  }, []);

  const handleLogout = () => {
    // Elimina el token y redirige al usuario
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      navigate(`/buscar?nombre=${encodeURIComponent(searchQuery)}`);
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
      <button className="header-button" onClick={() => navigate("/")}>Inicio</button>
      <button className="header-button" onClick={() => navigate("/publicar")}>
        Publicar
      </button>
      <input
        type="text"
        placeholder="Buscar..."
        className="header-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
      <button className="header-icon">
        <FaGlobeEurope size={30} />
      </button>
      <button className="header-icon" onClick={() => navigate("/config")}>
        <FaCog size={30} />
      </button>
      {isLoggedIn ? (
        <button className="header-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      ) : (
        <button className="header-button" onClick={() => navigate("/login")}>
          Iniciar sesión
        </button>
      )}
    </header>
  );
};

export default Header;