// src/routes/AppRoutes.js
import { Routes, Route } from "react-router-dom"; // ❌ NO uses BrowserRouter aquí
import Registro from "../pages/Registro";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/registro" element={<Registro />} />
    </Routes>
  );
};

export default AppRoutes;
