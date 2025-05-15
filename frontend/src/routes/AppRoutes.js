import { Routes, Route } from "react-router-dom"; // NO uses BrowserRouter aquí
import Registro from "../pages/Registro";
import Login from "../pages/Login";
import Home from "../pages/Home"; // Importamos la página de inicio
import Search from "../pages/Search"; // Importamos la página de búsqueda
import Config from "../pages/Config";
import Publicar from "../pages/Publicar";
import Perfil from "../pages/Perfil";
import Asset from "../pages/Asset"; 


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Ruta para la página de inicio */}
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/buscar" element={<Search />} />
      <Route path="/config" element={<Config />} />
      <Route path="/publicar" element={<Publicar />} />
      <Route path="/perfil/:userId" element={<Perfil />} />
      <Route path="/asset/:assetId" element={<Asset />} /> {/* Ruta para la página del asset */}
    </Routes>
  );
};

export default AppRoutes;