import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobeEurope } from 'react-icons/fa';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const dropdownRef = useRef(null);
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Cerrar el dropdown después de seleccionar un idioma
    if (dropdownRef.current) {
      dropdownRef.current.classList.remove('show');
    }
  };

  // Función para mostrar/ocultar el dropdown
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Evitar que el click se propague
    if (dropdownRef.current) {
      dropdownRef.current.classList.toggle('show');
    }
  };

  // Cerrar el dropdown cuando se hace click fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !event.target.closest('.language-switcher')) {
        dropdownRef.current.classList.remove('show');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-switcher">
      <button className="language-icon" onClick={toggleDropdown}>
        <FaGlobeEurope size={30} />
      </button>
      <div className="language-dropdown" ref={dropdownRef}>
        <button 
          className={`language-option ${i18n.language === 'es' ? 'active' : ''}`}
          onClick={() => changeLanguage('es')}
        >
          ES
        </button>
        <button 
          className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}
          onClick={() => changeLanguage('en')}
        >
          EN
        </button>
        <button 
          className={`language-option ${i18n.language === 'fr' ? 'active' : ''}`}
          onClick={() => changeLanguage('fr')}
        >
          FR
        </button>
        <button 
          className={`language-option ${i18n.language === 'it' ? 'active' : ''}`}
          onClick={() => changeLanguage('it')}
        >
          IT
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;