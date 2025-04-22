require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const usuarioRoutes = require('./routes/usuarioRoutes'); // Importar las rutas
const assetsRoutes = require('./routes/assetsRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB conectado"))
.catch(err => console.error(err));


// Usar las rutas de usuario
app.use('/api/usuarios', usuarioRoutes);

// Rutas de los assets
app.use('/api/assets', assetsRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
