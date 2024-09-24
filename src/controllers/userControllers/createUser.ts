import { Request, Response } from 'express';
import { User } from '../../models/userModel'; // Importa el modelo de usuario si lo necesitas
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { nombre, email, password, telefono, documento, categoria, suscripcion_activa } = req.body;

    console.log(req.body); // Asegúrate de que los datos se están recibiendo correctamente

    // Validación de campos obligatorios
    if (!nombre || !email || !password || !documento || !categoria) {
        res.status(400).json({ error: 'Todos los campos obligatorios deben rellenarse' });
        return;
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convertir suscripcion_activa a número
    const activeSubscription = suscripcion_activa ? 1 : 0;

    // Crear el usuario con el campo 'confirmada' en false
    const sql = `INSERT INTO users (nombre, email, password, telefono, documento, categoria, suscripcion_activa, confirmada)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombre, email, hashedPassword, telefono, documento, categoria, activeSubscription, false], (err, result: ResultSetHeader) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Si el registro se realiza desde un administrador, no enviar correo de confirmación
        if (req.body.admin) {
            res.json({ message: 'Usuario creado exitosamente, no se requiere confirmación.' });
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
