import { Request, Response } from 'express';
import db from '../../config/db';
import { RowDataPacket } from 'mysql2';

export const getCarById = (req: Request, res: Response): void => {
    const { id } = req.params;
    const sql = `
        SELECT a.*, f.foto 
        FROM autos a 
        LEFT JOIN fotos_autos f ON a.id = f.auto_id 
        WHERE a.id = ?`;

    db.query<RowDataPacket[]>(sql, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener el vehículo' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ message: 'Vehículo no encontrado' });
            return;
        }

        // Agrupar las fotos y el auto
        const car = results[0];
        const photos = results.map(result => result.foto).filter(foto => foto !== null);

        // Respuesta final
        res.json({
            ...car,
            fotos: photos
        });
    });
}
