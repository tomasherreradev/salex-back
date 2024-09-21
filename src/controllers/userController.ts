import { Request, Response } from 'express';
import { User } from '../models/userModel';
import db from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';


// Obtener todos los usuarios
export const getAllUsers = (req: Request, res: Response): void => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results: User[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
};


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
      }
    });
  });
};


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


// Obtener datos del usuario loggeado
export const getUserData = async (req: any, res: any): Promise<void> => {
  const userId = req.user.userId;

  const sql = 'SELECT * FROM users WHERE id = ?';

  db.query(sql, [userId], (err, results: RowDataPacket[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const user = results[0];
    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      telefono: user.telefono,
      documento: user.documento,
      categoria: user.categoria,
      suscripcion_activa: user.suscripcion_activa,
      confirmada: user.confirmada
    });
  });
};
