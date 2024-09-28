import { Request, Response } from 'express';
import db from '../../config/db';
import { Auction } from '../../models/auctionModel';
import { ResultSetHeader } from 'mysql2';

// Editar una subasta existente
export const updateAuction = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { auto_id, precio_inicial, puja_minima, fecha_inicio, fecha_fin, ganador_id, precio_final, activo } = req.body;
  console.log(req.body)

  const sql = `
    UPDATE subastas 
    SET auto_id = ?, precio_inicial = ?, puja_minima = ?, fecha_inicio = ?, fecha_fin = ?, ganador_id = ?, precio_final = ?, activo = ?
    WHERE id = ?
  `;

  db.query(sql, [auto_id, precio_inicial, puja_minima, fecha_inicio, fecha_fin, ganador_id, precio_final, activo, id], (err, result: ResultSetHeader) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Subasta no encontrada' });
      return;
    }
    res.json({ message: 'Subasta actualizada' });
  });
};
