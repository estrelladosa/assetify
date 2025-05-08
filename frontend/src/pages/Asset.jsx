import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Asset.css";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { FaUserPlus, FaCheck, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaPaperPlane } from "react-icons/fa";


import {
  obtenerAssetPorId,
  obtenerUsuarioPorId,
  obtenerComentariosPorAsset,
  obtenerEtiquetasPorAsset, 
  publicarComentario,
  toggleLike,
  toggleSave,
  toggleSeguidor,
  toggleSeguido
} from "../services/api"; // Ajusta la ruta si es necesario

export default function Asset() {
  const { assetId } = useParams();
  const { currentUser, loading, refetchUser } = useCurrentUser();
  const [asset, setAsset] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [etiquetas, setEtiquetas] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const assetData = await obtenerAssetPorId(assetId);
      setAsset(assetData);

      const usuarioData = await obtenerUsuarioPorId(assetData.usuario);
      setUsuario(usuarioData);

      const commentsData = await obtenerComentariosPorAsset(assetId);
      setComments(commentsData);

      const etiquetasData = await obtenerEtiquetasPorAsset(assetId);
      setEtiquetas(etiquetasData);
      
      if (currentUser) {
        setLiked(assetData.likes.includes(currentUser._id));
        setSaved(currentUser.guardados?.includes(assetId));
        setFollowing(currentUser.seguidos?.includes(usuarioData._id));
      }
    }

    if (!loading) {
      fetchData();
    }
  }, [assetId, currentUser, loading]);


  const handleImageChange = (direction) => {
    const total = asset.imagenes.length;
    setCurrentImgIndex((prev) => (prev + direction + total) % total);
  };

  const handleCommentSubmit = async (e) => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    } else {

    e.preventDefault();
    if (!newComment.trim()) return;

    await publicarComentario({ usuario:currentUser._id, asset, comentario: newComment });
    const commentsData = await obtenerComentariosPorAsset(assetId);
    setComments(commentsData);
    setNewComment("");
  }
  };

  const handleToggleLike = async () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    const updatedAsset = await toggleLike(assetId, currentUser._id);
    setAsset(updatedAsset);
    setLiked(updatedAsset.likes.includes(currentUser._id));
  };
  
  const handleToggleSave = async () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const updatedUser = await toggleSave(assetId, currentUser._id);
      setSaved(updatedUser.guardados.includes(assetId));
    } catch (error) {
      console.error("Error al guardar/desguardar el asset:", error);
    }
  };
  
  const handleToggleFollow = async () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const updatedUser = await toggleSeguidor(currentUser._id, usuario._id);
      await toggleSeguido(currentUser._id, usuario._id);
      setUsuario(updatedUser);
      setFollowing(updatedUser.seguidores.includes(currentUser._id));
      await refetchUser(); // <- Esto actualiza currentUser
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error);
    }
  };
  

  const getProperImageUrl = (url) => {
    if (!url) return "./assets/placeholder.png";
  
    if (url.includes('drive.google.com/uc?id=')) {
      return url;
    }
  
    const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?id=${fileIdMatch[1]}`;
    }
  
    return url;
  };
  
  
  if (!asset || !usuario) return <div>Cargando...</div>;

  return (
    <div className="asset-container">
      {/* Carrusel */}
      <div className="asset-carousel-section">
        <div className="asset-carousel">
          {<img src={getProperImageUrl(asset.imagenes[currentImgIndex])} alt="Asset" />}
          {/* Esto hay que revisarlo */}
        </div>
        <div className="asset-thumbnails">
          <button onClick={() => handleImageChange(-1)}>◀</button>
          {asset.imagenes.map((img, index) => (
            <img
            key={index}
            src={getProperImageUrl(img)}
            onClick={() => setCurrentImgIndex(index)}
            className={`asset-thumbnail ${currentImgIndex === index ? "selected" : ""}`}
            alt={`thumbnail-${index}`}
          />          
          ))}
          <button onClick={() => handleImageChange(1)}>▶</button>
        </div>
      </div>

      {/* Información del asset */}
      <div className="asset-info">
      <div className="asset-user">
        <img src={usuario.profileImage || "/imagenes/no-profile.png"}  alt="Usuario" className="asset-user-avatar" />
        <div className="asset-user-info">
          <p className="asset-username">{usuario.nombre_usuario}</p>
          <label>
            <input type="checkbox" checked={following} onChange={handleToggleFollow} className="follow" />
            <span className="asset-button asset-follow">
              {following ?  <><FaCheck /> Siguiendo</> : <><FaUserPlus /> Seguir</>}
            </span>
          </label>
        </div>
      </div>

      <div className="asset-actions">
        <label>
          <input type="checkbox" checked={liked} onChange={handleToggleLike} className="like" />
          <span className="asset-button asset-like">
            {liked ? <><FaHeart /> Liked</> : <><FaRegHeart /> Like</>}
          </span>
        </label>
        <label>
          <input type="checkbox" checked={saved} onChange={handleToggleSave} className="save" />
          <span className="asset-button asset-save">
            {saved ? <><FaBookmark /> Guardado</> : <><FaRegBookmark /> Guardar</>}
          </span>
        </label>
      </div>


        <h2>{asset.nombre}</h2>
        <p className="desc">{asset.descripcion}</p>
        <p className="eti">Etiquetas:</p>
        {/* Mostrar las etiquetas */}
        <div className="asset-tags">
          {etiquetas.map((etiqueta, i) => (
            <span key={i} className="asset-tag">#{etiqueta}</span>
          ))}
        </div>


        <button className="asset-download">Descargar</button>

        {/* Comentarios */}
        <div className="asset-comments">
          <h3>Comentarios</h3>
          <div>
            {comments.map((c, i) => (
              <div key={i} className="comment-box">
                <p className="comment-user">{c.usuario.nombre_usuario}</p>
                <p className="comment-content">{c.comentario}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
            />
            <button type="submit"> <FaPaperPlane /></button>
          </form>
        </div>
      </div>
      {showLoginPrompt && (
  <div className="login-prompt-modal">
    <div className="login-prompt-content">
      <p>Debes iniciar sesión para realizar esta acción.</p>
      <a href="/login">Ir a iniciar sesión</a>
      <button onClick={() => setShowLoginPrompt(false)}>Cerrar</button>
    </div>
  </div>
)}

    </div>
  );
}
