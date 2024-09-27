import { Request, Response } from 'express';
import db from '../../config/db';
import { RowDataPacket } from 'mysql2';


export const getCarByTuition = async (req: Request, res: Response) => {
    const {parameter} = req.body;
    const sql = `SELECT * FROM autos WHERE placa = ?`;

    try {
        db.query<RowDataPacket[]>(sql, [parameter], (err, result) => {
            if(err) {
                res.status(500).json({message: 'Error al obtener el vehiculo'});
                return;
            }

            if(result.length === 0) {
                res.status(404).json({ message: 'Vehiculo no encontrado' });
                return;
            }

            res.json(result[0]);
        })
    } catch (error) {
        res.status(500).json({message: 'Ocurrió un error'})
    }
} 