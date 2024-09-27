
import {Router} from 'express';
import { updateUserByAdmin } from '../controllers/adminControllers/updateUserByAdmin';


import { isAdmin } from '../config/middlewares/IsAdminMiddleware';
import upload from '../config/middlewares/MulterConfig';
import { getUserByEmail } from '../controllers/adminControllers/getUserByEmail';
import { getCarByTuition } from '../controllers/adminControllers/getCarByTuition';

const router = Router();


router.post('/get-by-email', getUserByEmail);
router.post('/get-by-tuition', getCarByTuition);
router.put('/update-user/:id', isAdmin, upload.single('profileImage'), updateUserByAdmin);


export default router;
