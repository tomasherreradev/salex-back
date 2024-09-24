import {Router} from 'express';

import { getAllUsers } from '../controllers/userControllers/getAllUsers';
import { createUser } from '../controllers/userControllers/createUser';
import { forgotPassword } from '../controllers/userControllers/forgotPassword';
import { confirmAccount } from '../controllers/userControllers/confirmAcount';
import { loginUser } from '../controllers/userControllers/loginUser';
import { getUserData } from '../controllers/userControllers/getUserData';
import { updateUser } from '../controllers/userControllers/updateUser';
import { deleteUser } from '../controllers/userControllers/deleteUser';

import { resetPassword } from '../controllers/userControllers/resetPassword';
import { authMiddleware } from '../config/middlewares/AuthMiddleware';
import { isAdmin } from '../config/middlewares/IsAdminMiddleware';
import upload from '../config/middlewares/MulterConfig';

const router = Router();

// Obtener todos los usuarios
router.get('/get-all', getAllUsers);

// Crear un nuevo usuario
router.post('/create-new', upload.single('profileImage'), createUser);

// Crear un nuevo usuario
router.post('/forgot-password', forgotPassword);

// Confirmar usuario
router.get('/confirm-account', confirmAccount);

//resetear password
router.post('/reset-password', resetPassword);

//iniciar sesion
router.post('/login', loginUser);

// obtener datos del usuario autenticado
// router.get('/me', authMiddleware, getUserData);
router.put('/update-user', authMiddleware, upload.single('profileImage'), updateUser);

// Eliminar usuario
router.delete('/delete/:id', isAdmin, deleteUser);



export default router;
