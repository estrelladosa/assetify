import React, { useState, useEffect } from "react";
import axios from "axios"; // Necesitarás instalar axios si aún no lo tienes
import "./Config.css";
import { useTranslation } from "react-i18next";
import {API_URL} from "../services/api"; 


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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation(); // Hook para traducción
  

  // Verificar el estado de inicio de sesión al cargar el componente
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Función para verificar el estado de inicio de sesión
  const checkLoginStatus = async () => {
    try {
      // Verificar si hay un token en localStorage o en una cookie
      const token = localStorage.getItem('token') || getCookie('authToken');
      
      if (token) {
        // Verificar validez del token con el backend
        const response = await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.isValid) {
          setIsLoggedIn(true);
          setUserId(response.data.userId);
          
          // Cargar configuración desde la base de datos
          loadConfigFromDB(response.data.userId);
        } else {
          // Token inválido, cargar desde localStorage
          loadConfigFromLocalStorage();
        }
      } else {
        // No hay token, cargar desde localStorage
        loadConfigFromLocalStorage();
      }
    } catch (error) {
      console.error("Error al verificar inicio de sesión:", error);
      // En caso de error, cargar desde localStorage
      loadConfigFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  // Función auxiliar para obtener cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Cargar configuraciones del localStorage
  const loadConfigFromLocalStorage = () => {
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
  };

  // Cargar configuraciones de la base de datos
  const loadConfigFromDB = async (userId) => {
    try {
      const response = await axios.get(`/api/config/${userId}`);
      const dbConfig = response.data;

      // Mapear valores numéricos/textuales de DB a los valores que usa la interfaz
      // Mapeo de tema (1 = light, 2 = dark, 3 = superDark)
      const temaMap = { 1: "light", 2: "dark", 3: "superDark" };
      const tema = temaMap[dbConfig.tema] || "dark";
      
      // Mapeo de fuente (1 = Roboto, 2 = Open Sans, etc.)
      const fuenteMap = { 
        1: "'Roboto', sans-serif",
        2: "'Open Sans', sans-serif",
        3: "'Montserrat', sans-serif",
        4: "'Lato', sans-serif",
        5: "'Poppins', sans-serif"
      };
      const fuente = fuenteMap[dbConfig.fuente] || "'Roboto', sans-serif";
      
      // Mapeo de tamaño de fuente
      let tamFuenteValor;
      if (dbConfig.tamFuente <= 16) tamFuenteValor = "pequeño";
      else if (dbConfig.tamFuente <= 18) tamFuenteValor = "mediano";
      else if (dbConfig.tamFuente <= 22) tamFuenteValor = "grande";
      else tamFuenteValor = "muy-grande";
      
      // Mapeo de color de header/footer (asumiendo que colorhf puede ser un índice o un valor hexadecimal)
      let colorHF;
      if (typeof dbConfig.colorhf === 'number') {
        const colorMap = {
          1: "#1a1a1a", // Negro
          2: "#2c3e50", // Azul oscuro
          3: "#8e44ad", // Púrpura
          4: "#c0392b", // Rojo
          5: "#27ae60"  // Verde
        };
        colorHF = colorMap[dbConfig.colorhf] || "#1a1a1a";
      } else {
        colorHF = dbConfig.colorhf || "#1a1a1a";
      }

      // Actualizar estados con los valores de la base de datos
      setTheme(tema);
      setHeaderFooterColor(colorHF);
      setFontSize(tamFuenteValor);
      setFontFamily(fuente);
      setHighContrast(dbConfig.altoContraste || false);
      setTags(dbConfig.recomendacion || []);
      
      // Para el fondo personalizado, podría ser una URL o un base64
      if (dbConfig.fondo && dbConfig.fondo !== "fondo1.jpg") {
        // Si es una URL de imagen almacenada en el servidor
        if (dbConfig.fondo.startsWith('http') || dbConfig.fondo.startsWith('/')) {
          setCustomBackground(dbConfig.fondo);
        } else {
          // Asumir que es el nombre de un archivo predeterminado
          setCustomBackground(`/assets/${dbConfig.fondo}`);
        }
      }

      // Guardar en localStorage como respaldo
      saveToLocalStorage(tema, colorHF, tamFuenteValor, fuente, dbConfig.fondo, dbConfig.altoContraste, dbConfig.recomendacion);

      // Aplicar los estilos
      applyStyles(
        tema,
        colorHF,
        tamFuenteValor,
        fuente,
        customBackground,
        dbConfig.altoContraste
      );
    } catch (error) {
      console.error("Error al cargar configuración de la base de datos:", error);
      // Si falla la carga desde DB, usar localStorage como respaldo
      loadConfigFromLocalStorage();
    }
  };

  // Función para aplicar los estilos globalmente
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

  // Guardar en localStorage
  const saveToLocalStorage = (theme, headerFooterColor, fontSize, fontFamily, background, highContrast, tags) => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("headerFooterColor", headerFooterColor);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontFamily", fontFamily);
    localStorage.setItem("preferredTags", JSON.stringify(tags || []));
    localStorage.setItem("customBackground", background || "");
    localStorage.setItem("highContrast", highContrast.toString());
  };

  // Guardar en la base de datos
  const saveToDatabase = async () => {
    try {
      if (!isLoggedIn || !userId) return false;

      // Convertir los valores de la interfaz a formato de base de datos
      // Mapeo inverso para tema
      const temaMap = { "light": 1, "dark": 2, "superDark": 3 };
      const temaId = temaMap[theme] || 2;

      // Mapeo inverso para fuente
      const fuenteMap = { 
        "'Roboto', sans-serif": 1,
        "'Open Sans', sans-serif": 2,
        "'Montserrat', sans-serif": 3,
        "'Lato', sans-serif": 4,
        "'Poppins', sans-serif": 5
      };
      const fuenteId = fuenteMap[fontFamily] || 1;

      // Mapeo para tamaño de fuente (convertir a píxeles)
      let tamFuentePx;
      switch(fontSize) {
        case "pequeño": tamFuentePx = 14; break;
        case "mediano": tamFuentePx = 18; break;
        case "grande": tamFuentePx = 22; break;
        case "muy-grande": tamFuentePx = 26; break;
        default: tamFuentePx = 18;
      }

      // Determinar valor para colorhf (convertir hexadecimal a índice si es posible)
      // Aquí asumimos que usamos el valor hexadecimal directamente
      const colorhf = headerFooterColor;

      // Determinar el valor para fondo
      let fondoValue = "fondo1.jpg"; // Valor predeterminado
      if (customBackground) {
        // Si es una URL completa, extraer solo el nombre del archivo
        const fileName = customBackground.split('/').pop();
        fondoValue = fileName || customBackground;
      }

      // Crear objeto de configuración para enviar a la API
      const configData = {
        usuarioId: userId,
        tema: temaId,
        fondo: fondoValue,
        colorhf: colorhf,
        tamFuente: tamFuentePx,
        fuente: fuenteId,
        altoContraste: highContrast,
        recomendacion: tags
      };

      // Enviar a la API
      await axios.post('/api/config/save', configData);
      return true;
    } catch (error) {
      console.error("Error al guardar en la base de datos:", error);
      return false;
    }
  };

  // Guardar cambios (en localStorage y DB si está logueado)
  const saveChanges = async () => {
    // Siempre guardar en localStorage como respaldo
    saveToLocalStorage(theme, headerFooterColor, fontSize, fontFamily, customBackground, highContrast, tags);

    // Si está logueado, guardar también en la base de datos
    let dbSaveSuccess = true;
    if (isLoggedIn) {
      dbSaveSuccess = await saveToDatabase();
    }

    // Aplicar los cambios visualmente
    applyStyles(theme, headerFooterColor, fontSize, fontFamily, customBackground, highContrast);

    // Mostrar mensaje de confirmación
    if (isLoggedIn && !dbSaveSuccess) {
      alert("Configuración guardada localmente, pero hubo un error al guardar en la base de datos.");
    } else {
      alert("Configuración guardada correctamente");
    }
  };

  // Restablecer configuración predeterminada
  const resetToDefault = async () => {
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
    saveToLocalStorage(defaultTheme, defaultHeaderFooterColor, defaultFontSize, defaultFontFamily, "", defaultHighContrast, []);

    // Si está logueado, actualizar también en la base de datos
    if (isLoggedIn) {
      const resetConfig = {
        usuarioId: userId,
        tema: 2, // dark
        fondo: "fondo1.jpg",
        colorhf: "#1a1a1a",
        tamFuente: 18, // mediano
        fuente: 1, // Roboto
        altoContraste: false,
        recomendacion: []
      };

      try {
        await axios.post('/api/config/save', resetConfig);
      } catch (error) {
        console.error("Error al restablecer configuración en la base de datos:", error);
        alert("Configuración restablecida localmente, pero hubo un error al actualizar la base de datos.");
        return;
      }
    }

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

  // Vista previa del tema actual (para mostrar al usuario)
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
      // Código comentado en el original
    }
  };
  
  // Precargar las imágenes de fondo
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

  // Mostrar cargando mientras verifica estado de inicio de sesión
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t("config.loading")}</p>
      </div>
    );
  }

  return (
    <div className="config-container">
      <h1 className="config-title">{t("config.title")}</h1>
      
      {/* {isLoggedIn ? (
        <div className="login-status">
          <span className="logged-in-badge">✓ {t("config.savedInAccount")}</span>
        </div>
      ) : (
        <div className="login-status">
          <span className="logged-out-badge">ⓘ {t("config.savedInLocal")}</span>
        </div>
      )} */}
      
      <div className="config-section">
        <button className="reset-button" onClick={resetToDefault}>
          {t("config.resetDefaults")}
        </button>
      </div>

      <div className="config-section">
        <h2>{t("config.aesthetics")}</h2>
        
        <div className="config-option">
          <label>{t("config.theme")}</label>
          <div className="theme-options">
            <button 
              className={`theme-button ${theme === "light" ? "active" : ""}`}
              onClick={() => {
                setTheme("light");
                applyStyles("light", headerFooterColor, fontSize, fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              {t("config.themeLight")}
            </button>
            <button 
              className={`theme-button ${theme === "dark" ? "active" : ""}`}
              onClick={() => {
                setTheme("dark");
                applyStyles("dark", headerFooterColor, fontSize, fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              {t("config.themeDark")}
            </button>
            <button 
              className={`theme-button ${theme === "superDark" ? "active" : ""}`}
              onClick={() => {
                setTheme("superDark");
                applyStyles("superDark", headerFooterColor, fontSize, fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              {t("config.themeSuperDark")}
            </button>
          </div>
          {!highContrast && getThemePreview()}
        </div>
        
        <div className="config-option">
          <label>{t("config.customBackground")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
            className="file-input"
            disabled={highContrast}
          />
          {customBackground && !highContrast && (
            <div className="background-preview">
              <img src={customBackground} alt={t("config.customBackground")} />
              <button onClick={clearCustomBackground}>{t("config.remove")}</button>
            </div>
          )}
        </div>
        
        <div className="config-option">
          <label>{t("config.headerFooterColor")}</label>
          <input
            type="color"
            value={headerFooterColor}
            onChange={(e) => {
              setHeaderFooterColor(e.target.value);
              applyStyles(theme, e.target.value, fontSize, fontFamily, customBackground, highContrast);
            }}
            className="color-picker"
            disabled={highContrast}
          />
          <div className="color-preview" style={{ backgroundColor: highContrast ? "#000000" : headerFooterColor }}>
            <span style={{ color: highContrast ? "#ffffff" : (getLuminance(headerFooterColor) < 0.5 ? "#fff" : "#000") }}>
              {t("config.preview")}
            </span>
          </div>
        </div>
        
        <div className="config-option">
          <label>{t("config.fontSize")}: {getFontSizeLabel(highContrast ? "mediano" : fontSize, t)}</label>
          <div className="font-size-options">
            <button 
              className={`font-size-button ${fontSize === "pequeño" && !highContrast ? "active" : ""}`}
              onClick={() => {
                setFontSize("pequeño");
                applyStyles(theme, headerFooterColor, "pequeño", fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              {t("config.fontSizeSmall")}
            </button>
            <button 
              className={`font-size-button ${(fontSize === "mediano" || highContrast) ? "active" : ""}`}
              onClick={() => {
                setFontSize("mediano");
                applyStyles(theme, headerFooterColor, "mediano", fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              {t("config.fontSizeMedium")}
            </button>
            <button 
              className={`font-size-button ${fontSize === "grande" && !highContrast ? "active" : ""}`}
              onClick={() => {
                setFontSize("grande");
                applyStyles(theme, headerFooterColor, "grande", fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              {t("config.fontSizeLarge")}
            </button>
            <button 
              className={`font-size-button ${fontSize === "muy-grande" && !highContrast ? "active" : ""}`}
              onClick={() => {
                setFontSize("muy-grande");
                applyStyles(theme, headerFooterColor, "muy-grande", fontFamily, customBackground, highContrast);
              }}
              disabled={highContrast}
            >
              {t("config.fontSizeXLarge")}
            </button>
          </div>
        </div>
        
        <div className="config-option">
          <label>{t("config.font")}</label>
          <select 
            value={highContrast ? "'Roboto', sans-serif" : fontFamily}
            onChange={(e) => {
              setFontFamily(e.target.value);
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

      {/* <div className="config-section">
        <h2>{t("config.recommendation")}</h2>
        <div className="config-option">
          <label>{t("config.tags")}</label>
          <div className="tag-input-container">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder={t("config.addTag")}
              className="tag-input"
            />
            <button onClick={addTag} className="tag-button">{t("config.add")}</button>
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
      </div> */}

      <div className="config-section">
        <h2>{t("config.accessibility")}</h2>
        <div className="config-option">
          <label>{t("config.highContrastNote")}</label>
          <div className="toggle-switch">
            <input 
              type="checkbox" 
              id="contrast-toggle" 
              className="toggle-input" 
              checked={highContrast}
              onChange={(e) => {
                setHighContrast(e.target.checked);
                applyStyles(theme, headerFooterColor, fontSize, fontFamily, customBackground, e.target.checked);
              }}
            />
            <label htmlFor="contrast-toggle" className="toggle-label"></label>
          </div>
        </div>
      </div>

      <button className="save-button" onClick={saveChanges}>
        {t("config.saveChanges")}
      </button>
    </div>
  );

};

export default Config;