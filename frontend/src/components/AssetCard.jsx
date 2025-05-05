import React, { useState } from 'react';
import "./AssetCard.css"; // Importa el archivo CSS para estilos

const AssetCard = ({ title, author, imageURL }) => {
    const [imageError, setImageError] = useState(false);
    
    // Función para usar URL alternativa de Google Drive
    const getAlternativeUrl = (url) => {
        if (!url) return "./assets/placeholder.png";
        
        if (url.includes('drive.google.com/uc?id=')) {
            const id = url.split('id=')[1];
            // Usar formato de URL alternativo que suele funcionar mejor
            return `https://lh3.googleusercontent.com/d/${id}`;
        }
        
        return url;
    };
    
    // Manejar error al cargar la imagen
    const handleImageError = () => {
        console.log("Error al cargar la imagen:", imageURL);
        setImageError(true);
    };
    
    return (
        <div className="asset-card">
            {imageError ? (
                <div className="asset-card-image placeholder">
                    <p>Imagen no disponible</p>
                </div>
            ) : (
                <img 
                    src={getAlternativeUrl(imageURL)} 
                    alt={title} 
                    className="asset-card-image" 
                    onError={handleImageError} 
                />
            )}
            <div className="asset-card-content">
                <h3 className="asset-card-title">{title}</h3>
                <p className="asset-card-author">{author}</p>
            </div>
        </div>
    );
};

export default AssetCard;