import {Router} from 'express';

import { getAllUsers, createUser } from '../controllers/userController';

const router = Router();

// Obtener todos los usuarios
router.get('/get-all', getAllUsers);

// Crear un nuevo usuario
router.post('/create-new', createUser);

export default router;
