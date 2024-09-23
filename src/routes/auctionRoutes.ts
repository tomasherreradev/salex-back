import { Router } from 'express';

import { getAllAuctions } from '../controllers/auctionControllers/getAllAuctions';
import { createAuction } from '../controllers/auctionControllers/createAuction';
import { updateAuction } from '../controllers/auctionControllers/updateAuction';
import { deleteAuction } from '../controllers/auctionControllers/deleteAuction';

import { isAdmin } from '../config/middlewares/IsAdminMiddleware';
import { getAuctionById } from '../controllers/auctionControllers/getAuctionById';

const router = Router();

// Obtener todas las subastas
router.get('/get-all', getAllAuctions);

// Obtener por una subasta por id
router.get('/get/:id', getAuctionById)

// Crear una nueva subasta
router.post('/create-new', isAdmin, createAuction);

// Editar una subasta
router.put('/update/:id', isAdmin, updateAuction);

// Eliminar una subasta
router.delete('/delete/:id', isAdmin, deleteAuction);

export default router;
