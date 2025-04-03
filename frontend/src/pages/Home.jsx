import React from "react";
import AssetCard from "../components/AssetCard";

const Home = () => {
  const assets = [
    {
      id: 1,
      title: "P90 machinegun",
      author: "David Gonzalez Moreno",
      imageURL: "data:image/webp;base64,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",
    },
    {
      id: 2,
      title: "Asset 2",
      author: "Autor 2",
      imageURL: "./assets/background-dark.png",
    },
  ];

  return (
    <div className="home">
      <h1>Assets Disponibles</h1>
      <div className="asset-grid">
        {assets.map((asset) => (
          <AssetCard
            key={asset.id}
            title={asset.title}
            author={asset.author}
            imageURL={asset.imageURL}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;