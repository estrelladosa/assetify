import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobeEurope } from 'react-icons/fa';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Función para mostrar/ocultar el dropdown
  const toggleDropdown = (e) => {
    const dropdown = e.currentTarget.querySelector('.language-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  };

  return (
    <div className="language-switcher" onClick={toggleDropdown}>
      <button className="language-icon">
        <FaGlobeEurope size={30} />
      </button>
      <div className="language-dropdown">
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
      </div>
    </div>
  );
};

export default LanguageSwitcher;