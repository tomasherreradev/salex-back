import { Request, Response } from 'express';
import db from '../../config/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son obligatorios' });
      return;
    }
  
    const sql = 'SELECT * FROM users WHERE email = ?';
  
    db.query(sql, [email], async (err, results: RowDataPacket[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      if (results.length === 0) {
        res.status(401).json({ error: 'Credenciales inválidas, Cuenta inexistente o sin confirmar.' });
        return;
      }
  
      const user = results[0];
  
      if(user.confirmada !== 1) {
        res.status(403).json({ error: 'Cuenta no confirmada, verifica tu email.' });
        return;
      }
  
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Credenciales inválidas' });
        return;
      }
  
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  
      // Enviar el token y los datos relevantes del usuario
      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono,
          documento: user.documento,
          categoria: user.categoria,
          suscripcion_activa: user.suscripcion_activa,
          confirmada: user.confirmada,
          foto: user.foto
        }
      });
    });
  };
  