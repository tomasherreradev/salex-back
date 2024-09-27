import { Request, Response } from 'express';
import db from '../../config/db';
import { RowDataPacket } from 'mysql2';

// userController.js
export const getUserByEmail = async (req: Request, res: Response) => {

    const { parameter } = req.body;

    const sql = `SELECT * FROM users WHERE email = ?`;

    try {
        db.query<RowDataPacket[]>(sql, [parameter], (err, result) => {
            if(err) {
                res.status(500).json({message: 'Error al obtener el usuario'});
                return;
            }

            if(result.length === 0) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }

            res.json(result[0]);
        })
    } catch (error) {
        res.status(500).json({message: 'Ocurrió un error'})
    }

  };
  

  