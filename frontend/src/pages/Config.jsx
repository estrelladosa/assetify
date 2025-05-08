import React, { useState, useEffect } from "react";
import "./Config.css";

const Config = () => {
  // Estados para las diferentes configuraciones
  const [theme, setTheme] = useState("dark"); // dark, light, superDark
  const [headerFooterColor, setHeaderFooterColor] = useState("#1a1a1a");
  const [fontSize, setFontSize] = useState("mediano"); // pequeño, mediano, grande, muy-grande
  const [fontFamily, setFontFamily] = useState("'Roboto', sans-serif");
  const [customBackground, setCustomBackground] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [highContrast, setHighContrast] = useState(false);

  // Cargar configuraciones del localStorage al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedHeaderFooterColor = localStorage.getItem("headerFooterColor");
    const savedFontSize = localStorage.getItem("fontSize");
    const savedFontFamily = localStorage.getItem("fontFamily");
    const savedTags = localStorage.getItem("preferredTags");
    const savedBackground = localStorage.getItem("customBackground");
    const savedHighContrast = localStorage.getItem("highContrast");

    if (savedTheme) setTheme(savedTheme);
    if (savedHeaderFooterColor) setHeaderFooterColor(savedHeaderFooterColor);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedTags) setTags(JSON.parse(savedTags));
    if (savedBackground) setCustomBackground(savedBackground);
    if (savedHighContrast) setHighContrast(savedHighContrast === "true");

    // Aplicar los estilos iniciales
    applyStyles(
      savedTheme || theme,
      savedHeaderFooterColor || headerFooterColor,
      savedFontSize || fontSize,
      savedFontFamily || fontFamily,
      savedBackground || customBackground,
      savedHighContrast === "true" || false
    );
  }, []);

  // Función para aplicar los estilos globalmente - ENFOQUE COMPLETAMENTE NUEVO
  const applyStyles = (theme, headerColor, fontSizeOption, fontFamily, bgImage, highContrast) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Limpiar todas las clases de tema anteriores
    body.classList.remove('theme-light', 'theme-dark', 'theme-super-dark', 'high-contrast', 'has-custom-bg');
    
    // Configurar tamaño de fuente
    root.setAttribute('data-font-size', fontSizeOption);
    
    // Si está activado el contraste alto, aplicar configuración específica y salir
    if (highContrast) {
      body.classList.add('high-contrast');
      
      // Configuración específica para alto contraste
      root.style.setProperty("--bg-color", "#000000");
      root.style.setProperty("--text-color", "#ffffff");
      root.style.setProperty("--card-bg", "#000000");
      root.style.setProperty("--header-footer-bg", "#000000");
      root.style.setProperty("--header-footer-text", "#ffffff");
      root.style.setProperty("--header-footer-hover", "#333333");
      root.style.setProperty("--font-family", "'Roboto', sans-serif");
      root.setAttribute('data-font-size', "mediano");
      return;
    }
    
    // Aplicar tema a través de clases
    if (theme === "light") {
      body.classList.add('theme-light');
    } else if (theme === "dark") {
      body.classList.add('theme-dark');
    } else if (theme === "superDark") {
      body.classList.add('theme-super-dark');
    }
    
    // Establecer color de fondo, texto y tarjetas según el tema
    if (theme === "light") {
      root.style.setProperty("--bg-color", "#f5f5f5");
      root.style.setProperty("--text-color", "#333333");
      root.style.setProperty("--card-bg", "#ffffff");
    } else if (theme === "dark") {
      root.style.setProperty("--bg-color", "#121212");
      root.style.setProperty("--text-color", "#ffffff");
      root.style.setProperty("--card-bg", "#1e1e1e");
    } else if (theme === "superDark") {
      root.style.setProperty("--bg-color", "#000000");
      root.style.setProperty("--text-color", "#ffffff");
      root.style.setProperty("--card-bg", "#0a0a0a");
    }
    
    // Manejar el fondo personalizado
    if (bgImage) {
      body.classList.add('has-custom-bg');
      // Establecer la imagen como fondo en línea para mayor prioridad
      body.style.backgroundImage = `url(${bgImage})`;
    } else {
      // Eliminar cualquier fondo personalizado en línea
      body.style.backgroundImage = '';
    }
  
    // Header y Footer color
    root.style.setProperty("--header-footer-bg", headerColor);
    
    // Colores de texto para header y footer (contraste automático)
    const isDark = getLuminance(headerColor) < 0.5;
    const textColor = isDark ? "#ffffff" : "#000000";
    root.style.setProperty("--header-footer-text", textColor);
    
    // Colores de hover para botones de header y footer
    const hoverColor = adjustBrightness(headerColor, isDark ? 0.2 : -0.2);
    root.style.setProperty("--header-footer-hover", hoverColor);
  
    // Familia de fuente
    root.style.setProperty("--font-family", fontFamily);
  };
  
  // Función para calcular la luminancia de un color (para determinar si usar texto claro u oscuro)
  const getLuminance = (hexColor) => {
    // Convertir hex a RGB
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;
    
    // Calcular luminancia
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Función para ajustar el brillo de un color para hover
  const adjustBrightness = (hexColor, factor) => {
    // Convertir hex a RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
    
    // Ajustar brillo
    r = Math.min(255, Math.max(0, Math.round(r + (factor * 255))));
    g = Math.min(255, Math.max(0, Math.round(g + (factor * 255))));
    b = Math.min(255, Math.max(0, Math.round(b + (factor * 255))));
    
    // Convertir de nuevo a hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Guardar cambios
  const saveChanges = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("headerFooterColor", headerFooterColor);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontFamily", fontFamily);
    localStorage.setItem("preferredTags", JSON.stringify(tags));
    localStorage.setItem("customBackground", customBackground);
    localStorage.setItem("highContrast", highContrast.toString());

    // Aplicar los cambios
    applyStyles(theme, headerFooterColor, fontSize, fontFamily, customBackground, highContrast);

    // Mostrar mensaje de confirmación
    alert("Configuración guardada correctamente");
  };

  // Restablecer configuración predeterminada
  const resetToDefault = () => {
    const defaultTheme = "dark";
    const defaultHeaderFooterColor = "#1a1a1a";
    const defaultFontSize = "mediano";
    const defaultFontFamily = "'Roboto', sans-serif";
    const defaultHighContrast = false;

    // Actualizar estados
    setTheme(defaultTheme);
    setHeaderFooterColor(defaultHeaderFooterColor);
    setFontSize(defaultFontSize);
    setFontFamily(defaultFontFamily);
    setCustomBackground("");
    setTags([]);
    setHighContrast(defaultHighContrast);

    // Eliminar la imagen de fondo personalizada del body
    document.body.style.backgroundImage = '';

    // Guardar en localStorage
    localStorage.setItem("theme", defaultTheme);
    localStorage.setItem("headerFooterColor", defaultHeaderFooterColor);
    localStorage.setItem("fontSize", defaultFontSize);
    localStorage.setItem("fontFamily", defaultFontFamily);
    localStorage.setItem("preferredTags", JSON.stringify([]));
    localStorage.removeItem("customBackground");
    localStorage.setItem("highContrast", defaultHighContrast.toString());

    // Aplicar los cambios
    applyStyles(defaultTheme, defaultHeaderFooterColor, defaultFontSize, defaultFontFamily, "", defaultHighContrast);

    // Mostrar mensaje de confirmación
    alert("Configuración restablecida a valores predeterminados");
  };

  // Manejar cambios en el fondo personalizado
  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomBackground(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Vista previa del tema actual (para mostrar al usuario) DESACTIVADO
  const getThemePreview = () => {
    if (customBackground) {
      return (
        <div className="theme-preview">
          <small>Usando fondo personalizado</small>
        </div>
      );
    } else {
      let themeName = "";
      switch(theme) {
        case "light": themeName = "Claro con fondo light"; break;
        case "dark": themeName = "Oscuro con fondo dark"; break;
        case "superDark": themeName = "Super Oscuro con fondo dark"; break;
        default: themeName = "Oscuro con fondo dark";
      }
      // return (
      //   // <div className="theme-preview">
      //   //   <small>Tema: {themeName}</small>
      //   // </div>
      // );
    }
  };
  
  // Precargar las imágenes de fondo para asegurar que estén disponibles cuando se apliquen
  useEffect(() => {
    // Precargar imágenes de fondo
    const lightBg = new Image();
    lightBg.src = '/assets/background-light.png';
    
    const darkBg = new Image();
    darkBg.src = '/assets/background-dark.png';
  }, []);

  // Agregar tag
  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  // Eliminar tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Obtener texto descriptivo del tamaño de fuente
  const getFontSizeLabel = (size) => {
    switch(size) {
      case "pequeño": return "Pequeño";
      case "mediano": return "Mediano (predeterminado)";
      case "grande": return "Grande";
      case "muy-grande": return "Muy grande";
      default: return "Mediano";
    }
  };

  // Limpiar imagen personalizada
  const clearCustomBackground = () => {
    setCustomBackground("");
    // Eliminar la imagen de fondo personalizada del body
    document.body.style.backgroundImage = '';
    // Aplicar inmediatamente el cambio para mejorar UX
    applyStyles(theme, headerFooterColor, fontSize, fontFamily, "", highContrast);
  };

  return (
    <div className="config-container">
      <h1 className="config-title">Configuración</h1>
      
      <div className="config-section">
        <button className="reset-button" onClick={resetToDefault}>
          Restablecer configuración predeterminada
        </button>
      </div>

      <div className="config-section">
        <h2>Estética</h2>
        
        <div className="config-option">
          <label>Tema</label>
          <div className="theme-options">
            <button 
              className={`theme-button ${theme === "light" ? "active" : ""}`}
              onClick={() => {
                setTheme("light");
                // Aplicar inmediatamente para mostrar el cambio
                applyStyles("light", headerFooterColor, fontSize, fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              Claro
            </button>
            <button 
              className={`theme-button ${theme === "dark" ? "active" : ""}`}
              onClick={() => {
                setTheme("dark");
                // Aplicar inmediatamente para mostrar el cambio
                applyStyles("dark", headerFooterColor, fontSize, fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              Oscuro
            </button>
            <button 
              className={`theme-button ${theme === "superDark" ? "active" : ""}`}
              onClick={() => {
                setTheme("superDark");
                // Aplicar inmediatamente para mostrar el cambio
                applyStyles("superDark", headerFooterColor, fontSize, fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              Super Oscuro
            </button>
          </div>
          {!highContrast && getThemePreview()}
        </div>
        
        <div className="config-option">
          <label>Fondo personalizado</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
            className="file-input"
            disabled={highContrast}
          />
          {customBackground && !highContrast && (
            <div className="background-preview">
              <img src={customBackground} alt="Fondo personalizado" />
              <button onClick={clearCustomBackground}>Eliminar</button>
            </div>
          )}
        </div>
        
        <div className="config-option">
          <label>Color de header y footer</label>
          <input
            type="color"
            value={headerFooterColor}
            onChange={(e) => {
              setHeaderFooterColor(e.target.value);
              // Opcional: aplicar inmediatamente para mejor UX
              applyStyles(theme, e.target.value, fontSize, fontFamily, customBackground, highContrast);
            }}
            className="color-picker"
            disabled={highContrast}
          />
          <div className="color-preview" style={{ backgroundColor: highContrast ? "#000000" : headerFooterColor }}>
            <span style={{ color: highContrast ? "#ffffff" : (getLuminance(headerFooterColor) < 0.5 ? "#fff" : "#000") }}>
              Vista previa
            </span>
          </div>
        </div>
        
        <div className="config-option">
          <label>Tamaño de fuente: {getFontSizeLabel(highContrast ? "mediano" : fontSize)}</label>
          <div className="font-size-options">
            <button 
              className={`font-size-button ${fontSize === "pequeño" && !highContrast ? "active" : ""}`}
              onClick={() => {
                setFontSize("pequeño");
                // Aplicar inmediatamente para mejor UX
                applyStyles(theme, headerFooterColor, "pequeño", fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              Pequeño
            </button>
            <button 
              className={`font-size-button ${(fontSize === "mediano" || highContrast) ? "active" : ""}`}
              onClick={() => {
                setFontSize("mediano");
                // Aplicar inmediatamente para mejor UX
                applyStyles(theme, headerFooterColor, "mediano", fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              Mediano
            </button>
            <button 
              className={`font-size-button ${fontSize === "grande" && !highContrast ? "active" : ""}`}
              onClick={() => {
                setFontSize("grande");
                // Aplicar inmediatamente para mejor UX
                applyStyles(theme, headerFooterColor, "grande", fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              Grande
            </button>
            <button 
              className={`font-size-button ${fontSize === "muy-grande" && !highContrast ? "active" : ""}`}
              onClick={() => {
                setFontSize("muy-grande");
                // Aplicar inmediatamente para mejor UX
                applyStyles(theme, headerFooterColor, "muy-grande", fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              Muy grande
            </button>
          </div>
        </div>
        
        <div className="config-option">
          <label>Fuente</label>
          <select 
            value={highContrast ? "'Roboto', sans-serif" : fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
              // Aplicar inmediatamente para mejor UX
              applyStyles(theme, headerFooterColor, fontSize, e.target.value, customBackground, highContrast);
            }}
            className="select"
            disabled={highContrast}
          >
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Montserrat', sans-serif">Montserrat</option>
            <option value="'Lato', sans-serif">Lato</option>
            <option value="'Poppins', sans-serif">Poppins</option>
          </select>
        </div>
      </div>

      <div className="config-section">
        <h2>Recomendación</h2>
        <div className="config-option">
          <label>Tags de preferencia</label>
          <div className="tag-input-container">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Añadir tag"
              className="tag-input"
            />
            <button onClick={addTag} className="tag-button">Añadir</button>
          </div>
          <div className="tags-container">
            {tags.map((tag, index) => (
              <div key={index} className="tag">
                {tag}
                <span onClick={() => removeTag(tag)} className="remove-tag">&times;</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="config-section">
        <h2>Accesibilidad</h2>
        <div className="config-option">
          <label>Contraste alto "desactiva otras funciones estéticas"</label>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="contrast-toggle" 
              className="toggle-input" 
              checked={highContrast}
              onChange={(e) => {
                setHighContrast(e.target.checked);
                // Aplicar inmediatamente para mejorar la experiencia del usuario
                applyStyles(theme, headerFooterColor, fontSize, fontFamily, customBackground, e.target.checked);
              }}
            />
            <label htmlFor="contrast-toggle" className="toggle-label"></label>
          </div>
        </div>
      </div>

      <button className="save-button" onClick={saveChanges}>
        Guardar cambios
      </button>
    </div>
  );
};

export default Config;