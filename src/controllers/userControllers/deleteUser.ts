import { Request, Response } from 'express';
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';


export const deleteUser = (req: Request, res: Response): void => {
  const { id } = req.params;

  const sql = `DELETE FROM users WHERE id = ?`;

  db.query(sql, [id], (err, result: ResultSetHeader) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }
    res.json({ message: 'Usuario eliminado' });
  });
};
