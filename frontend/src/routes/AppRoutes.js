// src/routes/AppRoutes.js
import { Routes, Route } from "react-router-dom"; // NO uses BrowserRouter aquí
import Registro from "../pages/Registro";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
