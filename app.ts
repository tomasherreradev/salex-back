import express from 'express';
import db from './config/db';
import usersRoutes from './routes/userRoutes';
import carsRoutes from './routes/carRoutes';
import auctionsRoutes from './routes/auctionRoutes';

const app = express();
app.use(express.json());

// Usar las rutas
app.use('/users', usersRoutes);
app.use('/cars', carsRoutes);
app.use('/auctions', auctionsRoutes);

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
