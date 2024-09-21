import { Request, Response } from 'express';
import db from '../../config/db';
import jwt from 'jsonwebtoken';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const confirmAccount = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;
  
    if (!token) {
      res.status(400).json({ error: 'Token de confirmación no proporcionado' });
      return;
    }
  
    try {
      // Verificar el token
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as { userId: number };
  
      // Comprobar si la cuenta ya ha sido confirmada
      const checkSql = 'SELECT confirmada FROM users WHERE id = ?';
      db.query(checkSql, [decoded.userId], (err, results: RowDataPacket[]) => {
        if (err) {
          res.status(500).json({ error: 'Error al verificar la cuenta' });
          return;
        }
  
        const user = results[0];
  
        if (user.confirmada === true) {
          res.status(400).json({ error: 'La cuenta ya ha sido confirmada' });
          return;
        }
  
        // Actualizar el campo 'confirmada' a true
        const updateSql = 'UPDATE users SET confirmada = ? WHERE id = ?';
        db.query(updateSql, [true, decoded.userId], (err, result: ResultSetHeader) => {
          if (err) {
            res.status(500).json({ error: 'Error al confirmar la cuenta' });
            return;
          }
  
          if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
          }
  
          res.json({ message: 'Cuenta confirmada exitosamente' });
        });
      });
    } catch (error) {
      res.status(400).json({ error: 'Token inválido o expirado' });
    }
  };
  