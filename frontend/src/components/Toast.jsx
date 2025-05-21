import React from "react";
import "./Toast.css";

const Toast = ({ show, type = "success", message, onClose }) => {
  if (!show) return null;
  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;