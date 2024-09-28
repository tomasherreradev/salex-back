import { Request, Response } from 'express';
import db from '../../config/db'
import { Auction } from '../../models/auctionModel';
import { ResultSetHeader } from 'mysql2';


// Crear una nueva subasta
export const createAuction = (req: Request, res: Response): void => {
  const { auto_id, precio_inicial, puja_minima, fecha_inicio, fecha_fin, activo } = req.body;
  console.log(req.body)
  const sql = `INSERT INTO subastas (auto_id, precio_inicial, puja_minima, fecha_inicio, fecha_fin, activo)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [auto_id, precio_inicial, puja_minima, fecha_inicio, fecha_fin, activo], (err, result: ResultSetHeader) => {
    if (err) {
      res.status(500).json({ error: err.message });
      console.log(err.message)
      return;
    }
    res.json({ message: 'Subasta creada', auctionId: result.insertId });
  });
};
