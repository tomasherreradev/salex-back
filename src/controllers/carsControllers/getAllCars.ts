import { Request, Response } from 'express';
import db from '../../config/db';
import { Car } from '../../models/carModel';

// Obtener todos los autos
export const getAllCars = (req: Request, res: Response): void => {
  const sql = 'SELECT * FROM autos';
  db.query(sql, (err, results: Car[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};
