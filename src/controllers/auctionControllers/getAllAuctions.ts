import { Request, Response } from 'express';
import db from '../../config/db'
import { Auction } from '../../models/auctionModel';


// Obtener todas las subastas
export const getAllAuctions = (req: Request, res: Response): void => {
    const sql = `SELECT * FROM subastas`;
    db.query(sql, (err, results: Auction[]) => {
      if (err) {
        res.status(500).json({ message: 'Ocurrió un error al obtener los datos' });
        return;
      }
      res.json(results);
    });
  };
  