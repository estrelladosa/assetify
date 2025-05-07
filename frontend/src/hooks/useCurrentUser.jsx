import { useEffect, useState, useCallback } from "react";
import { obtenerUsuarioPorId } from "../services/api";

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      setLoading(true);
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

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { currentUser, loading, refetchUser: fetchUser };
}
