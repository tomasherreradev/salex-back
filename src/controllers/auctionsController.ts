import { Request, Response } from 'express';
import db from '../config/db';
import { Auction } from '../models/auctionModel';
import { ResultSetHeader } from 'mysql2';

// Obtener todas las subastas
export const getAllAuctions = (req: Request, res: Response): void => {
  const sql = `SELECT * FROM subastas`;
  db.query(sql, (err, results: Auction[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};

// Crear una nueva subasta
export const createAuction = (req: Request, res: Response): void => {
  const { auto_id, precio_inicial, puja_minima, fecha_inicio, fecha_fin } = req.body;
  const sql = `INSERT INTO subastas (auto_id, precio_inicial, puja_minima, fecha_inicio, fecha_fin)
               VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [auto_id, precio_inicial, puja_minima, fecha_inicio, fecha_fin], (err, result: ResultSetHeader) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Subasta creada', auctionId: result.insertId });
  });
};
