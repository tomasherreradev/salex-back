import { Request, Response } from 'express';
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';


// Crear un nuevo auto
export const createCar = (req: Request, res: Response): void => {
  const { marca, modelo, año, estado_actual, kilometraje, foto, notas } = req.body;
  const sql = `INSERT INTO autos (marca, modelo, año, estado_actual, kilometraje, foto, notas)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [marca, modelo, año, estado_actual, kilometraje, foto, notas], (err, result: ResultSetHeader) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Auto creado', carId: result.insertId });
  });
};
