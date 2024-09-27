import { Request, Response } from 'express';
import db from '../../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Crear un nuevo auto y asociar múltiples fotos
export const createCar = (req: Request, res: Response): void => {
  const { marca, modelo, year, estado_actual, kilometraje, notas, placa, color } = req.body;
  console.log(req.body)
  console.log(req.files)

  // Verificar si la placa ya existe
  const checkPlacaSql = `SELECT COUNT(*) as count FROM autos WHERE placa = ?`;

  db.query<RowDataPacket[]>(checkPlacaSql, [placa], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const count = results[0]?.count;

    if (count > 0) {
      return res.status(400).json({ error: 'La placa ya existe' });
    }

    // Si la placa no existe, proceder a insertar el nuevo auto
    const sql = `INSERT INTO autos (marca, modelo, year, estado_actual, kilometraje, notas, placa, color)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [marca, modelo, year, estado_actual, kilometraje, notas, placa, color], (err, result: ResultSetHeader) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const autoId = result.insertId;

      // Insertar las fotos si hay archivos en la request
      if (req.files) {
        const fotos = (req.files as Express.Multer.File[]).map(file => [`/uploads/cars/${file.filename}`, autoId]);

        const insertFotosSql = `INSERT INTO fotos_autos (foto, auto_id) VALUES ?`;
        db.query(insertFotosSql, [fotos], (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Auto y fotos creados', carId: autoId });
        });
      } else {
        res.json({ message: 'Auto creado sin fotos', carId: autoId });
      }
    });
  });
};
