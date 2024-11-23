import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/imagenes': 'http://localhost:3000', // Redirige solicitudes de imágenes al backend
            '/upload': 'http://localhost:3000',   // Redirige el endpoint de subida al backend
            '/metadata.json': 'http://localhost:3000/imagenes/metadata.json' // Redirige metadata.json
        },
    },
});
