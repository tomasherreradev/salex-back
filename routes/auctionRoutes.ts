import { Router } from 'express';
import { getAllAuctions, createAuction } from '../controllers/auctionsController';

const router = Router();

// Obtener todas las subastas
router.get('/get-all', getAllAuctions);

// Crear una nueva subasta
router.post('/create-new', createAuction);

export default router;
