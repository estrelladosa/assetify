import React, { useState } from "react";
import AssetCard from "../components/AssetCard";
import "../pages/Home.css"; // Asegúrate de que el archivo existe para los estilos

const Home = () => {
  // Datos simulados
  const allDestacados = [
    { id: 1, title: "P90 Machinegun", author: "David Gonzalez", imageURL: "./assets/p90.png" },
    { id: 2, title: "Medieval Shield", author: "Ana Martínez", imageURL: "./assets/shield.png" },
    { id: 3, title: "Sci-Fi Helmet", author: "Carlos López", imageURL: "./assets/helmet.png" },
    { id: 4, title: "Ancient Sword", author: "Lara Croft", imageURL: "./assets/sword.png" },
    { id: 5, title: "Cyberpunk Drone", author: "John Doe", imageURL: "./assets/drone.png" },
  ];

  // IDs de los destacados que queremos mostrar
  const destacados = allDestacados.filter((asset) => [1, 2, 3].includes(asset.id));

  const recientes = [
    { id: 6, title: "Castle", author: "User2", imageURL: "./assets/castle.png" },
    { id: 7, title: "Potion", author: "User3", imageURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhMWFhUVFxcVGBUVGBcVFhcXFRUXGBYWFxcYHCkgGBolGxcVITEiJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFQ8PFSsdFR0rKy03LSsrKy03Ny0rLTItKzctLS0rLSsrLS0tNy0tKys3NzctNy0rLS03KysrLSstK//AABEIALABHwMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABwEDBAUGAgj/xABOEAABAwICBAcLCAcGBwEAAAABAAIDBBESIQUxUZEGBxMiQVJhFDJTVHGBkqHB0dIVI0Jik6Kx4hczcqPC8PEWJIKys+FDY3N0g9PjNP/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABgRAQEBAQEAAAAAAAAAAAAAAAABEhEC/9oADAMBAAIRAxEAPwCcUREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAXPcJeF0FE9kcmbnguwggENBtex1533Lc19YyGN8rzZrAXE+To8p1KCNIaVfUzSVTtbjkNjfogeayDvRxtUmN4MUwaBdrsNy82zaWjvfLdeWcblJhjJimDnGz24T82M7uvbn9GQ2qLm1T8n3dcnrOsMie9vbUNW1X+Ufjvid3w+kbWNvo4iBrt0oJQ/SvR3kGCazQMBwO+cNsxa3MzyzXn9LNHaP5ua7u/GB3zfq5/mUaw1pdrfY9I5osekWIurvK/X9bfcgkU8bNH8583Nzf1fMd85l5OZnlmn6WKP5u8ctnAmQ4D82cN7aufnlceVR22X/metvuVJpThPOuMJvqy7cgEEiHjXpcMhEUxLSRGMJ+cHQSbczyFVdxr0mJg5KfCQS92A8w2yAbbn3NxfJafgtUaPDH92A48Qw/rDzbfU7b61uXV2g/5FQg2fBHhzFXzSwNjdGWDGzGc5Iw7CXWtzbXZcZ9+F1iiTT/CDRtNJTVNC5pkjl54Dnm8TmOEjbOOs5AbDZSxBM17WvYQWuAc0jUQRcEeZB7REQEREBERAREQEREBERAREQEREBERAREQEREBERBwnGvLI6FlNHi+cJe7CC7msIs1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" },
    { id: 8, title: "Bow", author: "User4", imageURL: "./assets/bow.png" },
    { id: 9, title: "Cyborg Arm", author: "User5", imageURL: "./assets/cyborg_arm.png" },
    { id: 10, title: "Laser Gun", author: "User6", imageURL: "./assets/laser_gun.png" },
    { id: 11, title: "Golden Shield", author: "User7", imageURL: "./assets/golden_shield.png" },
    { id: 12, title: "Knight Helmet", author: "User8", imageURL: "./assets/knight_helmet.png" },
    { id: 13, title: "Space Suit", author: "User9", imageURL: "./assets/space_suit.png" },
    { id: 14, title: "Futuristic Sword", author: "User10", imageURL: "./assets/futuristic_sword.png" },
  ];

  const tendencias = [...recientes].reverse(); // Simulando orden de más likes a menos

  const [visibleRecientes, setVisibleRecientes] = useState(4);
  const [visibleTendencias, setVisibleTendencias] = useState(4);

  const mostrarMas = (setVisible, total) => {
    setVisible((prev) => Math.min(prev + 8, total));
  };

  const mostrarMenos = (setVisible) => {
    setVisible(4);
  };

  return (
    <div className="home">
      <h2>Destacados del día</h2>
      <div className="destacados-box">
        <div className="destacados">
          {destacados.map((asset) => (
            <AssetCard key={asset.id} title={asset.title} author={asset.author} imageURL={asset.imageURL} />
          ))}
        </div>
      </div>

      <h2>Subidos recientemente</h2>
      <div className="recientes">
        {recientes.slice(0, visibleRecientes).map((asset, index) => (
          <AssetCard key={asset.id} title={asset.title} author={asset.author} imageURL={asset.imageURL} className={`asset-${index % 4}`} />
        ))}
      </div>
      <div className="botones">
        <p className="mostrar-mas" onClick={() => mostrarMas(setVisibleRecientes, recientes.length)}>Mostrar más</p>
        {visibleRecientes > 4 && (
          <p className="mostrar-menos" onClick={() => mostrarMenos(setVisibleRecientes)}>Mostrar menos</p>
        )}
      </div>

      <h2>Tendencias</h2>
      <div className="tendencias">
        {tendencias.slice(0, visibleTendencias).map((asset, index) => (
          <AssetCard key={asset.id} title={asset.title} author={asset.author} imageURL={asset.imageURL} className={`asset-${index % 4}`} />
        ))}
      </div>
      <div className="botones">
        <p className="mostrar-mas" onClick={() => mostrarMas(setVisibleTendencias, tendencias.length)}>Mostrar más</p>
        {visibleTendencias > 4 && (
          <p className="mostrar-menos" onClick={() => mostrarMenos(setVisibleTendencias)}>Mostrar menos</p>
        )}
      </div>
    </div>
  );
};

export default Home;
