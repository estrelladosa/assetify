import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Asset.css";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { FaUserPlus, FaCheck, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Importamos useTranslation
import {API_URL} from "../services/api"; 

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
  const navigate = useNavigate();
  const { currentUser, loading, refetchUser } = useCurrentUser();
  const { t } = useTranslation(); // Hook para traducción
  
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
    e.preventDefault(); // Esto debe ir siempre primero

    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    if (!newComment.trim()) return;

    await publicarComentario({ usuario: currentUser._id, asset, comentario: newComment });
    const commentsData = await obtenerComentariosPorAsset(assetId);
    setComments(commentsData);
    setNewComment("");
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

  const formatearFecha = (fechaMongo) => {
    const fecha = new Date(fechaMongo);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };


  const getDownloadLink = (url) => {
    if (!url) return "#";

    if (url.includes("uc?id=")) {
      return `${url}&export=download`;
    }

    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?id=${match[1]}&export=download`;
    }

    return url;
  };

  const handleDownload = () => {
    if (!asset.archivos || asset.archivos.length === 0) return;
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    const url = getDownloadLink(asset.archivos[0]); // Puedes cambiar el índice si lo deseas

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "");
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  
  
  if (!asset || !usuario) return <div>{t('asset.loading')}</div>;

  return (
    <div className="asset-container">
       <button className="close-button" onClick={() => navigate(-1)}>
        <FaTimes />
      </button>
      {/* Carrusel */}
      <div className="asset-carousel-section">
        <div className="asset-carousel">
          {<img src={getProperImageUrl(asset.imagenes[currentImgIndex])} alt={t('asset.nombre')} />}
        </div>
        <div className="asset-thumbnails">
          <button onClick={() => handleImageChange(-1)}>◀</button>
          {asset.imagenes.map((img, index) => (
            <img
              key={index}
              src={getProperImageUrl(img)}
              onClick={() => setCurrentImgIndex(index)}
              className={`asset-thumbnail ${currentImgIndex === index ? "selected" : ""}`}
              alt={`${t('asset.thumbnail')}-${index}`}
            />          
          ))}
          <button onClick={() => handleImageChange(1)}>▶</button>
        </div>
      </div>

      {/* Información del asset */}
      <div className="asset-info">
        <div className="asset-user">
          <img src={usuario.foto || "./assets/no-profile.png"} alt={t('asset.userProfileAlt')} className="asset-user-avatar" />
          <div className="asset-user-info">
            <p className="asset-username">{usuario.nombre_usuario}</p>
            <label>
              <input type="checkbox" checked={following} onChange={handleToggleFollow} className="follow NoCheckBox" />
              <span className="asset-button asset-follow">
                {following ? <><FaCheck /> {t('asset.following')}</> : <><FaUserPlus /> {t('asset.follow')}</>}
              </span>
            </label>
          </div>
        </div>

        <div className="asset-actions">
          <label>
            <input type="checkbox" checked={liked} onChange={handleToggleLike} className="like NoCheckBox" />
            <span 
              className="asset-button asset-like"
              role="button"
              aria-pressed={liked}
              aria-label={liked ? `Eliminar me gusta (${asset.likes?.length || 0} me gusta)` : `Me gusta (${asset.likes?.length || 0} me gusta)`}
            >
              {liked ? <><FaHeart /> {asset.likes?.length || 0}</> : <><FaRegHeart /> {asset.likes?.length || 0}</>}
              <span className="sr-only">
                {liked ? "Quitar me gusta" : "Me gusta"}
              </span>
            </span>
          </label>
          <label>
            <input type="checkbox" checked={saved} onChange={handleToggleSave} className="save NoCheckBox" />
            <span className="asset-button asset-save">
              {saved ? <><FaBookmark /> {t('asset.saved')}</> : <><FaRegBookmark /> {t('asset.save')}</>}
            </span>
          </label>
        </div>

        <h2>{asset.nombre}</h2>
        <p className="desc">{asset.descripcion}</p>
        <p className="texto"><strong>{t('asset.creationDate')}:</strong> {formatearFecha(asset.fecha)}</p>
        <p className="texto"><strong>{t('asset.formats')}:</strong> {asset.formato.split('|').join(', ')}</p>
        <p className="eti">{t('asset.tags')}:</p>
        {/* Mostrar las etiquetas */}
        <div className="asset-tags">
          {etiquetas.map((etiqueta, i) => (
            <span key={i} className="asset-tag">#{etiqueta}</span>
          ))}
        </div>

        <button className="asset-download" onClick={handleDownload}>{t('asset.download')}</button>

        {/* Comentarios */}
        <div className="asset-comments">
          <h3>{t('asset.comments')}</h3>
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
              placeholder={t('asset.writeComment')}
            />
            <button type="submit"><FaPaperPlane /></button>
          </form>
        </div>
      </div>
      {showLoginPrompt && (
        <div className="login-prompt-modal">
          <div className="login-prompt-content">
            <p>{t('asset.loginRequired')}</p>
            <a href="/login">{t('asset.goToLogin')}</a>
            <button onClick={() => setShowLoginPrompt(false)}>{t('asset.close')}</button>
          </div>
        </div>
      )}
    </div>
  );
}