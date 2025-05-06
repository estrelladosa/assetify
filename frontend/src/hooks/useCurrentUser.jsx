import { useEffect, useState } from "react";
import { obtenerUsuarioPorId } from "../services/api";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      obtenerUsuarioPorId(userId)
        .then(setCurrentUser)
        .catch((err) => {
          console.error("Error al obtener usuario:", err);
          setCurrentUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setCurrentUser(null);
      setLoading(false);
    }
  }, []);

  return { currentUser, loading };
}
