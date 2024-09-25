import express from 'express';
import cors from 'cors';
import db from './src/config/db';
import usersRoutes from './src/routes/userRoutes';
import carsRoutes from './src/routes/carRoutes';
import auctionsRoutes from './src/routes/auctionRoutes';
import dotenv from 'dotenv';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

// Usar las rutas
app.use('/users', usersRoutes);
app.use('/cars', carsRoutes);
app.use('/auctions', auctionsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejar el cierre del servidor y cerrar la conexión a la base de datos
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error('Error al cerrar la conexión a la base de datos:', err.stack);
    } else {
      console.log('Conexión a la base de datos cerrada.');
    }
    process.exit(0);
  });
});
