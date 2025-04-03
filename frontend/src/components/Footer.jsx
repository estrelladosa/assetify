import React from "react";
import "../components/Footer.css";
import logo from "../assets/logo.png"; 
import { Navigate, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <h2 className="footer-title">
        <img 
            src={logo} 
            alt="Logo" 
            className="footer-logo" 
            onClick={() => navigate("/")}
        />
        Assetify
      </h2>
      <div className="footer-columns">
        {/* Primera columna */}
        <div className="footer-column">
          <h3>Sobre Nosotros</h3>
          <ul>
            <li><a href="/Configuracion">Info</a></li>
            <li><a href="/Configuracion">Estudiantes</a></li>
            <li><a href="/Configuracion">Investigación UX</a></li>
            <li><a href="/Configuracion">Accesibilidad</a></li>
          </ul>
        </div>
        {/* Segunda columna */}
        <div className="footer-column">
          <h3>Ayuda</h3>
          <ul>
            <li><a href="/index">FAQ</a></li>
            <li><a href="/index">Servicio al cliente</a></li>
          </ul>
        </div>
        {/* Tercera columna */}
        <div className="footer-column">
          <h3>Categorías</h3>
          <ul>
            <li><a href="/buscar">Esenciales</a></li>
            <li><a href="/buscar">Complementos</a></li>
            <li><a href="/buscar">Audio</a></li>
            <li><a href="/buscar">Herramientas</a></li>
            <li><a href="/buscar">Efectos</a></li>
            <li><a href="/buscar">Plantillas</a></li>
          </ul>
        </div>
        {/* Cuarta columna */}
        <div className="footer-column">
          <h3>Descubrir</h3>
          <ul>
            <li><a href="/buscar">Ofertas</a></li>
            <li><a href="/buscar">Tendencias</a></li>
            <li><a href="/buscar">Destacados</a></li>
            <li><a href="/buscar">Más descargados</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
