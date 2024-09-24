import { Request, Response } from 'express';
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';

// Actualizar un auto existente
export const updateCar = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { marca, modelo, year, estado_actual, kilometraje, notas, placa, color } = req.body;
  const foto = req.file ? `/uploads/cars/${req.file.filename}` : null;

  // Construir la consulta SQL dinámicamente
  let sql = `
    UPDATE autos 
    SET marca = ?, modelo = ?, year = ?, estado_actual = ?, kilometraje = ?, notas = ?, placa = ?, color = ?
  `;

  const params = [marca, modelo, year, estado_actual, kilometraje, notas, placa, color];

  // Si hay una nueva foto, añadirla a la consulta
  if (foto) {
    sql += `, foto = ?`;
    params.push(foto);
  }

  sql += ` WHERE id = ?`;
  params.push(id);

  db.query(sql, params, (err, results: ResultSetHeader) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Vehículo no encontrado' });
      return;
    }

    res.json({ message: 'Vehículo actualizado' });
  });
};
