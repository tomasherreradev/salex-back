import { Request, Response } from 'express';
import db from '../../config/db';
import { Car } from '../../models/carModel';

// Obtener todos los autos
export const getAllCars = (req: Request, res: Response): void => {
  const sql = `
    SELECT 
        a.id,
        a.marca,
        a.modelo,
        a.year,
        a.estado_actual,
        a.kilometraje,
        a.notas,
        a.placa,
        a.color,
        MIN(f.foto) AS foto
    FROM 
        autos AS a
    LEFT JOIN 
        fotos_autos AS f ON a.id = f.auto_id
    GROUP BY 
        a.id
  `;
  
  db.query(sql, (err, results: Car[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Procesar los resultados para incluir la foto en la respuesta
    const processedResults = results.map(item => ({
      ...item,
      foto: item.foto ? `${item.foto}` : null // Asegúrate de construir la URL correctamente
    }));

    res.json(processedResults);
  });
};
