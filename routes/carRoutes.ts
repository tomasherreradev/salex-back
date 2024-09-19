import { Router } from 'express';
import { getAllCars, createCar } from '../controllers/carsController';

const router = Router();

// Obtener todos los autos
router.get('/get-all', getAllCars);

// Crear un nuevo auto
router.post('/create-new', createCar);

export default router;
