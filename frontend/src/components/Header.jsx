import React, { useState, useEffect } from "react";
import "../components/Header.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSearch, FaUserCircle } from "react-icons/fa";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { useTranslation } from "react-i18next"; // Importamos useTranslation
import LanguageSwitcher from "./LanguageSwitcher"; // Importamos el componente LanguageSwitcher

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook para traducción
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idUsuario = localStorage.getItem("userId");
    setIsLoggedIn(!!token);
    setUserId(idUsuario);

    // Fetch user name if logged in
    if (token && idUsuario) {
      const fetchUserName = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/usuarios/${idUsuario}`);
          if (response.ok) {
            const data = await response.json();
            setUserName(data.nombre_usuario);
          } else {
            console.error("Failed to fetch user name");
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      };
      fetchUserName();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserId(null);
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
      {/* Botón de inicio traducido */}
      <button className="header-button" onClick={() => navigate("/")}>
        {t('header.home')}
      </button>
      
      {/* Botón de publicar traducido */}
      <button className="header-button" onClick={() => navigate("/publicar")}>
        <span className="header-button-icon"><FaArrowUpFromBracket /></span>
        <span className="header-button-text">{t('header.publish')}</span>
      </button>

      {/* Input de búsqueda con placeholder traducido */}
      <input
        type="text"
        placeholder={t('header.search')}
        className="header-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
      
      {/* Reemplazamos el botón de globo por nuestro LanguageSwitcher */}
      <LanguageSwitcher />
      
      {/* Botón de configuración */}
      <button className="header-icon" onClick={() => navigate("/config")}>
        <FaCog size={30} />
      </button>

      {isLoggedIn ? (
        <div className="profile-section">
          <button className="header-button" onClick={() => navigate(`/perfil`)}>
            <span className="header-button-icon"><FaUserCircle /></span>
            <span className="header-button-text">{userName}</span>
          </button>
        </div>
      ) : (
        <button className="header-button" onClick={() => navigate("/login")}>
          {t('header.login')}
          <span className="header-button-icon"><FaUserCircle /></span>
          <span className="header-button-text">Login</span>
        </button>
      )}
    </header>
  );
};

export default Header;