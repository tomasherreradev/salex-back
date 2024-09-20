import {Router} from 'express';

import { getAllUsers, createUser, forgotPassword, confirmAccount, loginUser } from '../controllers/userController';
import { resetPassword } from '../controllers/resetPassword';

const router = Router();

// Obtener todos los usuarios
router.get('/get-all', getAllUsers);

// Crear un nuevo usuario
router.post('/create-new', createUser);

// Crear un nuevo usuario
router.post('/forgot-password', forgotPassword);

// Confirmar usuario
router.get('/confirm-account', confirmAccount);

//resetear password
router.post('/reset-password', resetPassword);

//iniciar sesion
router.post('/login', loginUser);




export default router;
