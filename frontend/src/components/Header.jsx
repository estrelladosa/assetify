import React, { useState, useEffect } from "react";
import "../components/Header.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSearch, FaUserCircle } from "react-icons/fa";
import { FaArrowUpFromBracket } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import {API_URL} from "../services/api"; 

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const idUsuario = localStorage.getItem("userId");
    setIsLoggedIn(!!token);
    setUserId(idUsuario);

    // Fetch user name and photo if logged in
    if (token && idUsuario) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_URL}/usuarios/${idUsuario}`);
          if (response.ok) {
            const data = await response.json();
            setUserName(data.nombre_usuario);
            setUserPhoto(data.foto);
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
      
      {/* Botón de idioma - Modificado para usar la clase header-button */}
      <div className="header-button language-container">
        <LanguageSwitcher />
      </div>
          
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
              <img
                src="./assets/no-profile.png" // Asegúrate de tener esta imagen en tu carpeta pública
                alt="Default Profile"
                className="profile-photo"
              />
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