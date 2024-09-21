import { Request, Response } from 'express';
import db from '../../config/db';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

// Recuperar contraseña
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
  
    // Validar si se envió el email
    if (!email) {
      res.status(400).json({ error: 'Por favor, proporciona un email' });
      return;
    }
  
    // Buscar si el usuario existe en la base de datos
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results: RowDataPacket[]) => {
      if (err) {
        res.status(500).json({ error: 'Error al buscar el usuario' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
  
      const user = results[0];
  
      // Generar un token JWT de recuperación de contraseña que expira en 1 hora
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  
      // Configurar transporte de nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      // Configurar mail
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Haz clic en el siguiente enlace para cambiar tu contraseña: http://localhost:3000/reset-password?token=${token}`,
        html: `<p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para cambiarla:</p>
               <a href="http://localhost:5173/reset-password?token=${token}">Restablecer contraseña</a>`,
      };
  
      // Enviar 
      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' });
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
      }
    });
  };
  