import { Router } from 'express';

import { getAllCars} from '../controllers/carsControllers/getAllCars';
import { createCar } from '../controllers/carsControllers/createCar';
import { deleteCar } from '../controllers/carsControllers/deleteCar';
import { getCarById } from '../controllers/carsControllers/getCarById';
import { updateCar } from '../controllers/carsControllers/updateCar';

import { isAdmin } from '../config/middlewares/IsAdminMiddleware';
import upload from '../config/middlewares/MulterConfig';


const router = Router();

// Obtener todos los autos
router.get('/get-all', getAllCars);

// Obtener vehiculo por id
router.get('/get/:id', getCarById)

// Crear un nuevo auto
router.post('/create-new', isAdmin, upload.single('foto'), createCar);

// Editar un vehiculo
router.put('/update/:id', isAdmin, upload.single('foto'), updateCar);

// Eliminar auto
router.delete('/delete/:id', isAdmin, deleteCar);

export default router;
