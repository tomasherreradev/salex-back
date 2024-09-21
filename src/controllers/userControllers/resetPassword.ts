import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../../config/db';

// Controlador para cambiar la contraseña
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
  
    if (!token || !newPassword) {
      res.status(400).json({ error: 'Faltan datos necesarios' });
      return;
    }
  
    // Verificar el token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
  
      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Actualizar la contraseña en la base de datos
      const sql = 'UPDATE users SET password = ? WHERE id = ?';
      db.query(sql, [hashedPassword, decoded.userId], (err: any) => {
        if (err) {
          res.status(500).json({ error: 'Error al actualizar la contraseña' });
          return;
        }
  
        res.json({ message: 'Contraseña actualizada correctamente' });
      });
    } catch (error) {
      res.status(400).json({ error: 'Token inválido o expirado' });
    }
  };
  