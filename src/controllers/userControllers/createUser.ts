import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { nombre, email, password, telefono, documento, categoria, suscripcion_activa } = req.body;
  
    if (!nombre || !email || !password || !documento) {
      res.status(400).json({ error: 'Todos los campos obligatorios deben rellenarse' });
      return;
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Crear el usuario con el campo 'confirmada' en false
    const sql = `INSERT INTO users (nombre, email, password, telefono, documento, categoria, suscripcion_activa, confirmada)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(sql, [nombre, email, hashedPassword, telefono, documento, categoria, suscripcion_activa, false], (err, result: ResultSetHeader) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      // Generar token JWT de confirmación que expira en 24 horas
      const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
  
      // Configurar transporte de nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      // Configurar el correo de confirmación
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirma tu cuenta',
        text: `Haz clic en el siguiente enlace para confirmar tu cuenta: http://localhost:5173/confirm-account?token=${token}`,
        html: `<p>Gracias por registrarte. Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
               <a href="http://localhost:5173/confirm-account?token=${token}">Confirmar cuenta</a>`,
      };
  
      // Enviar el correo de confirmación
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo de confirmación:', error);
          res.status(500).json({ error: 'Error al enviar el correo de confirmación' });
          return;
        }
        res.json({ message: 'Usuario registrado. Por favor, revisa tu email para confirmar la cuenta.' });
      });
    });
  };