import { Request, Response } from 'express';
import db from '../../config/db';
import { Auction } from '../../models/auctionModel';

// Obtener todas las subastas con los detalles del auto y una foto
export const getAllAuctions = (req: Request, res: Response): void => {
  const sql = `
    SELECT 
      subastas.id AS id,
      subastas.fecha_inicio,
      subastas.fecha_fin,
      subastas.precio_inicial,
      subastas.puja_minima,
      subastas.ganador_id,
      subastas.activo,
      autos.id AS auto_id,
      autos.marca,
      autos.modelo,
      autos.year,
      autos.foto,
      autos.kilometraje,
      autos.estado_actual,
      (
        SELECT fotos_autos.foto 
        FROM fotos_autos 
        WHERE fotos_autos.auto_id = autos.id 
        LIMIT 1
      ) AS foto_auto
    FROM subastas
    JOIN autos ON subastas.auto_id = autos.id
  `;
  
  db.query(sql, (err: Error, results: Auction[]) => {
    if (err) {
      res.status(500).json({ message: 'Ocurrió un error al obtener los datos' });
      return;
    }
    res.json(results);
  });
};
