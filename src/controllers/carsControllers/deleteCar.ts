import { Request, Response } from 'express';
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';


export const deleteCar = (req: Request, res: Response): void => {
  const { id } = req.params;

  const sql = `DELETE FROM autos WHERE id = ?`;

  db.query(sql, [id], (err, result: ResultSetHeader) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Auto no encontrado' });
      return;
    }
    res.json({ message: 'Auto eliminado' });
  });
};
