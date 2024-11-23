const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

// Leer el puerto desde variables de entorno o usar 3000 como predeterminado
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors());

// Servir archivos estáticos (frontend y carpeta de imágenes)
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Configuración de multer para subir imágenes
const upload = multer({ dest: 'imagenes/' });

// Endpoint para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    const metadataFile = path.join(__dirname, 'imagenes', 'metadata.json');

    if (!file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const newImagePath = path.join('imagenes', file.originalname);
    fs.renameSync(file.path, newImagePath);

    const metadata = fs.existsSync(metadataFile)
        ? JSON.parse(fs.readFileSync(metadataFile))
        : { images: [] };

    metadata.images.push(file.originalname);
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    res.json({ message: 'Imagen subida correctamente', file: file.originalname });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
