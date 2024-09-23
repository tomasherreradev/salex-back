import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import db from '../config/db';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
    categoria: 'usuario' | 'suscriptor' | 'administrador';
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Token no proporcionado' });
            return;
        }

        const secret = process.env.JWT_SECRET!;
        if (!secret) {
            res.status(500).json({ message: 'Se requiere configuración del secreto del JWT' });
            return;
        }

        const decoded: any = jwt.verify(token, secret);
        const userId = decoded.userId;

        // Consulta a la base de datos para verificar la categoría del usuario
        db.query<User[]>('SELECT categoria FROM users WHERE id = ?', [userId], (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al consultar la base de datos' });
                return;
            }

            if (results.length === 0 || results[0].categoria !== 'administrador') {
                res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
                return;
            }

            // Si el usuario es administrador, continuar con la siguiente función
            next();
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
