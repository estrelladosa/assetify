const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const driveService = require('../drive');
const upload = multer({ dest: 'uploads/' });

const CARPETA_DRIVE_ID = '14ZsRkjizYgVypUdynFpXf4g2-d_bOJOs'; // ID de carpeta

router.post('/subir', upload.single('archivo'), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [CARPETA_DRIVE_ID],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    // 1. Subir el archivo a Drive
    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('File ID:', response.data.id);

    // 2. CRÍTICO: Hacer el archivo accesible públicamente
    await driveService.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // 3. IMPORTANTE: Establecer configuración de compartición para que sea accesible
    await driveService.files.update({
      fileId: response.data.id,
      requestBody: {
        // Esto hace que el archivo sea accesible con el enlace
        copyRequiresWriterPermission: false,
        writersCanShare: true,
      },
    });

    fs.unlinkSync(req.file.path); // Elimina archivo temporal

    // 4. MEJOR URL: Usar thumbnail para imágenes (mejor para visualización)
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${response.data.id}&sz=w1000`;
    
    // 5. URLs alternativas por si la primera falla
    const directUrl = `https://drive.google.com/uc?id=${response.data.id}`;
    const cdnUrl = `https://lh3.googleusercontent.com/d/${response.data.id}`;

    // Enviar todas las URLs posibles
    res.status(200).json({
      id: response.data.id,
      // URL principal recomendada para imágenes
      link: thumbnailUrl,
      // URLs alternativas
      directLink: directUrl,
      cdnLink: cdnUrl,
      // URL de descarga
      download: `https://drive.google.com/uc?id=${response.data.id}&export=download`,
      nombre: req.file.originalname
    });
  } catch (error) {
    console.error("Error al subir archivo a Drive:", error);
    res.status(500).json({ 
      message: 'Error al subir a Drive', 
      error: error.message, 
      stack: error.stack
    });
  }
});

module.exports = router;