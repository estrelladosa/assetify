import React from 'react';
import "./AssetCard.css"; // Importa el archivo CSS para estilos

const AssetCard = ({ title, author, imageURL }) => {
    return (
        <div className="asset-card">
            <img src={imageURL} alt={title} className="asset-card-image" />
            <div className="asset-card-content">
                <h3 className="asset-card-title">{title}</h3>
                <p className="asset-card-author">{author}</p>
            </div>
        </div>
    );
};

export default AssetCard;