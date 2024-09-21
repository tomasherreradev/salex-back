import {Router} from 'express';

import { getAllUsers, createUser, forgotPassword, confirmAccount, loginUser, getUserData } from '../controllers/userController';
import { resetPassword } from '../controllers/resetPassword';
import { authMiddleware } from '../middlewares/AuthMiddleware';

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

//obtener datos del usuario autenticado
router.get('/me', authMiddleware, getUserData)




export default router;
