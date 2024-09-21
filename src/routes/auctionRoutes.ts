import { Router } from 'express';

import { getAllAuctions } from '../controllers/auctionControllers/getAllAuctions';
import { createAuction } from '../controllers/auctionControllers/createAuction';

const router = Router();

// Obtener todas las subastas
router.get('/get-all', getAllAuctions);

// Crear una nueva subasta
router.post('/create-new', createAuction);

export default router;
