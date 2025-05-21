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
  const [userPhoto, setUserPhoto] = useState(null); // Nuevo estado para la foto de perfil

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idUsuario = localStorage.getItem("userId");
    setIsLoggedIn(!!token);
    setUserId(idUsuario);

    // Fetch user name and photo if logged in
    if (token && idUsuario) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/usuarios/${idUsuario}`);
          if (response.ok) {
            const data = await response.json();
            setUserName(data.nombre_usuario);
            setUserPhoto(data.foto); // Asumiendo que el campo se llama 'foto'
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
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
      {/* Botón de busqueda traducido */}
      <button className="header-button" onClick={() => navigate("/buscar")}>
        <span className="header-button-icon"><FaSearch /></span>
        <span className="header-button-text">{t('header.search')}</span>
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
      
      <button className="header-icon">
        <LanguageSwitcher />
      </button>
          
      {/* Botón de configuración */}
      <button className="header-icon" onClick={() => navigate("/config")}>
        <FaCog size={30} />
      </button>

      {isLoggedIn ? (
        <div className="profile-section">
          <button className="header-button" onClick={() => navigate(`/perfil`)}>
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="profile-photo" />
            ) : (
              <FaUserCircle size={30} />
            )}
          </button>
        </div>
      ) : (
        <button className="header-button" onClick={() => navigate(`/login`)}>
          <span className="header-button-icon"><FaUserCircle /></span>
          <span className="header-button-text">{t('header.login')}</span>
        </button>
      )}
    </header>
  );
};

export default Header;