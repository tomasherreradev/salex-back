import { Router } from 'express';

import { getAllAuctions } from '../controllers/auctionControllers/getAllAuctions';
import { createAuction } from '../controllers/auctionControllers/createAuction';
import { isAdmin } from '../middlewares/IsAdminMiddleware';

const router = Router();

// Obtener todas las subastas
router.get('/get-all', getAllAuctions);

// Crear una nueva subasta
router.post('/create-new', isAdmin, createAuction);

export default router;
