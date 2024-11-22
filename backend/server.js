// /server/index.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar multer para subir archivos
const upload = multer({ dest: 'imagenes/' });

// Middleware para servir la carpeta pública
app.use(express.static('public'));
app.use(express.json());

// Endpoint para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    const metadataFile = path.join(__dirname, 'imagenes', 'metadata.json');

    if (!file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const newImagePath = path.join('imagenes', file.originalname);

    // Renombrar el archivo con su nombre original
    fs.renameSync(file.path, newImagePath);

    // Actualizar metadatos
    const metadata = fs.existsSync(metadataFile)
        ? JSON.parse(fs.readFileSync(metadataFile))
        : { images: [] };

    metadata.images.push(file.originalname);
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    res.json({ message: 'Imagen subida correctamente', file: file.originalname });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
