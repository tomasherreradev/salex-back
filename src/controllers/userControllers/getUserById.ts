import {Request, Response} from 'express';
import db from '../../config/db';
import { RowDataPacket } from 'mysql2';


export const getUserById = (req: Request, res:Response): void => {
    const {id} = req.params;
    const sql = `SELECT * FROM users WHERE id = ?`;

    db.query<RowDataPacket[]>(sql, [id], (err, results) => {
        if(err) {
            res.status(500).json({ error: 'Error al obtener usuario' });
            return;
        }

        if(results.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        res.json(results[0]);
    });
}