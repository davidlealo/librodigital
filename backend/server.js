const express = require('express');
const cors = require('cors'); // Importar CORS
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Configuración de multer para subida de archivos
const upload = multer({ dest: 'imagenes/' });

// Middleware para servir la carpeta de imágenes como estática
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

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

    // Leer y actualizar metadata.json
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
