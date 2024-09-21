import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import db from '../../config/db';



// Obtener todos los usuarios
export const getAllUsers = (req: Request, res: Response): void => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results: User[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};




