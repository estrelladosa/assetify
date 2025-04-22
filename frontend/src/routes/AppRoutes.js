import { Routes, Route } from "react-router-dom"; // NO uses BrowserRouter aquí
import Registro from "../pages/Registro";
import Login from "../pages/Login";
import Home from "../pages/Home"; // Importamos la página de inicio
import Search from "../pages/Search"; // Importamos la página de búsqueda

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* Ruta para la página de inicio */}
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/buscar" element={<Search />} />
    </Routes>
  );
};

export default AppRoutes;