import {Request, Response} from 'express';
import db from '../../config/db';
import { RowDataPacket } from 'mysql2';


export const getCarById = (req: Request, res:Response): void => {
    const {id} = req.params;
    const sql = `SELECT * FROM autos WHERE id = ?`;

    db.query<RowDataPacket[]>(sql, [id], (err, results) => {
        if(err) {
            res.status(500).json({ error: 'Error al obtener el vehiculo' });
            return;
        }

        if(results.length === 0) {
            res.status(404).json({ message: 'Vehiculo no encontrado' });
            return;
        }

        res.json(results[0]);
    });
}