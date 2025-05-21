import React from "react";
import "../components/Footer.css";
import logo from "../assets/logo.png"; 
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importamos useTranslation

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Hook para traducción

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
          <h3>{t('footer.aboutUs')}</h3>
          <ul>
            <li><a href="/Configuracion">{t('footer.info')}</a></li>
            <li><a href="/Configuracion">{t('footer.students')}</a></li>
            <li><a href="/Configuracion">{t('footer.uxResearch')}</a></li>
            <li><a href="/Configuracion">{t('footer.accessibility')}</a></li>
          </ul>
        </div>
        {/* Segunda columna */}
        <div className="footer-column">
          <h3>{t('footer.help')}</h3>
          <ul>
            <li><a href="/index">{t('footer.faq')}</a></li>
            <li><a href="/index">{t('footer.customerService')}</a></li>
          </ul>
        </div>
        {/* Tercera columna */}
        <div className="footer-column">
          <h3>{t('footer.categories')}</h3>
          <ul>
            <li><a href="/buscar">{t('footer.essentials')}</a></li>
            <li><a href="/buscar">{t('footer.addons')}</a></li>
            <li><a href="/buscar">{t('footer.audio')}</a></li>
            <li><a href="/buscar">{t('footer.tools')}</a></li>
            <li><a href="/buscar">{t('footer.effects')}</a></li>
            <li><a href="/buscar">{t('footer.templates')}</a></li>
          </ul>
        </div>
        {/* Cuarta columna */}
        <div className="footer-column">
          <h3>{t('footer.discover')}</h3>
          <ul>
            <li><a href="/buscar">{t('footer.deals')}</a></li>
            <li><a href="/buscar">{t('footer.trends')}</a></li>
            <li><a href="/buscar">{t('footer.featured')}</a></li>
            <li><a href="/buscar">{t('footer.mostDownloaded')}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;