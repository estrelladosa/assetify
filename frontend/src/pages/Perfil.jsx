import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Perfil.css';

const Perfil = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/usuarios/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserName(data.nombre_usuario); 
      } catch (e) {
        setError(e.message);
        console.error("Could not fetch user data: ", e);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="profile-container">
      <h1>Perfil del Usuario</h1>
      {error && <p>Error: {error}</p>}
      <p>ID del usuario: {userId}</p>
      <p>Nombre: {userName}</p>
      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Perfil;