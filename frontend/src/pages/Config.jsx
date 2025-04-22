import React, { useState, useEffect } from "react";
import "./Config.css";

const Config = () => {
  // Estados para las diferentes configuraciones
  const [theme, setTheme] = useState("dark"); // dark, light, superDark
  const [headerFooterColor, setHeaderFooterColor] = useState("#1a1a1a");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("'Roboto', sans-serif");
  const [customBackground, setCustomBackground] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  // Cargar configuraciones del localStorage al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedHeaderFooterColor = localStorage.getItem("headerFooterColor");
    const savedFontSize = localStorage.getItem("fontSize");
    const savedFontFamily = localStorage.getItem("fontFamily");
    const savedTags = localStorage.getItem("preferredTags");
    const savedBackground = localStorage.getItem("customBackground");

    if (savedTheme) setTheme(savedTheme);
    if (savedHeaderFooterColor) setHeaderFooterColor(savedHeaderFooterColor);
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedTags) setTags(JSON.parse(savedTags));
    if (savedBackground) setCustomBackground(savedBackground);

    // Aplicar los estilos iniciales
    applyStyles(
      savedTheme || theme,
      savedHeaderFooterColor || headerFooterColor,
      savedFontSize ? parseInt(savedFontSize) : fontSize,
      savedFontFamily || fontFamily,
      savedBackground || customBackground
    );
  }, []);

  // Función para aplicar los estilos globalmente
  const applyStyles = (theme, headerColor, fontSize, fontFamily, bgImage) => {
    const root = document.documentElement;

    // Tema
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

    // Header y Footer color
    root.style.setProperty("--header-footer-color", headerColor);

    // Tamaño de fuente
    root.style.setProperty("--font-size-base", `${fontSize}px`);

    // Familia de fuente
    root.style.setProperty("--font-family", fontFamily);

    // Imagen de fondo
    if (bgImage) {
      document.body.style.backgroundImage = `url(${bgImage})`;
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    } else {
      // Restaurar el fondo predeterminado si no hay imagen
      document.body.style.backgroundImage = "url('assets/background-dark.png')";
      document.body.style.backgroundAttachment = "fixed";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
  };

  // Guardar cambios
  const saveChanges = () => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("headerFooterColor", headerFooterColor);
    localStorage.setItem("fontSize", fontSize.toString());
    localStorage.setItem("fontFamily", fontFamily);
    localStorage.setItem("preferredTags", JSON.stringify(tags));
    localStorage.setItem("customBackground", customBackground);

    // Aplicar los cambios
    applyStyles(theme, headerFooterColor, fontSize, fontFamily, customBackground);

    // Mostrar mensaje de confirmación
    alert("Configuración guardada correctamente");
  };

  // Restablecer configuración predeterminada
  const resetToDefault = () => {
    const defaultTheme = "dark";
    const defaultHeaderFooterColor = "#1a1a1a";
    const defaultFontSize = 16;
    const defaultFontFamily = "'Roboto', sans-serif";

    // Actualizar estados
    setTheme(defaultTheme);
    setHeaderFooterColor(defaultHeaderFooterColor);
    setFontSize(defaultFontSize);
    setFontFamily(defaultFontFamily);
    setCustomBackground("");
    setTags([]);

    // Guardar en localStorage
    localStorage.setItem("theme", defaultTheme);
    localStorage.setItem("headerFooterColor", defaultHeaderFooterColor);
    localStorage.setItem("fontSize", defaultFontSize.toString());
    localStorage.setItem("fontFamily", defaultFontFamily);
    localStorage.setItem("preferredTags", JSON.stringify([]));
    localStorage.removeItem("customBackground");

    // Aplicar los cambios
    applyStyles(defaultTheme, defaultHeaderFooterColor, defaultFontSize, defaultFontFamily, "");

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
              onClick={() => setTheme("light")}
            >
              Claro
            </button>
            <button 
              className={`theme-button ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              Oscuro
            </button>
            <button 
              className={`theme-button ${theme === "superDark" ? "active" : ""}`}
              onClick={() => setTheme("superDark")}
            >
              Super Oscuro
            </button>
          </div>
        </div>
        
        <div className="config-option">
          <label>Fondo personalizado</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
            className="file-input"
          />
          {customBackground && (
            <div className="background-preview">
              <img src={customBackground} alt="Fondo personalizado" />
              <button onClick={() => setCustomBackground("")}>Eliminar</button>
            </div>
          )}
        </div>
        
        <div className="config-option">
          <label>Color de header y footer</label>
          <input
            type="color"
            value={headerFooterColor}
            onChange={(e) => setHeaderFooterColor(e.target.value)}
            className="color-picker"
          />
        </div>
        
        <div className="config-option">
          <label>Tamaño de fuente: {fontSize}px</label>
          <input
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="slider"
          />
        </div>
        
        <div className="config-option">
          <label>Fuente</label>
          <select 
            value={fontFamily} 
            onChange={(e) => setFontFamily(e.target.value)}
            className="select"
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
          <label>Contraste alto</label>
          <div className="toggle-switch">
            <input type="checkbox" id="contrast-toggle" className="toggle-input" />
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