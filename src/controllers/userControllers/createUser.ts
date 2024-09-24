import { Request, Response } from 'express';
import { User } from '../../models/userModel'; 
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { nombre, email, password, telefono, documento, categoria, suscripcion_activa = false, confirmada = false } = req.body;
    const profileImage = req.file ? `/uploads/users/${req.file.filename}` : null; // Obtén el path de la imagen


    if (!nombre || !email || !password || !documento || !categoria) {
        res.status(400).json({ error: 'Todos los campos obligatorios deben rellenarse' });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const activeSubscription = suscripcion_activa === 'true' ? 1 : 0;
    const cuentaConfirmada = confirmada === 'true' ? 1 : 0;

    // Crear una consulta dinámica que incluya o no el campo de imagen
    let sql = `INSERT INTO users (nombre, email, password, telefono, documento, categoria, suscripcion_activa, confirmada`;
    const values = [nombre, email, hashedPassword, telefono, documento, categoria, activeSubscription, cuentaConfirmada];

    // Si hay una imagen, agrega el campo y su valor
    if (profileImage) {
        sql += `, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        values.push(profileImage);
    } else {
        sql += `) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    }

    // Ejecutar la consulta
    db.query(sql, values, (err, result: ResultSetHeader) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Si el usuario es admin, no es necesario enviar el correo de confirmación
        if (req.body.admin) {
            res.json({ message: 'Usuario creado exitosamente, no se requiere confirmación.' });
            return;
        }

        // Crear el token JWT para la confirmación de cuenta
        const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

        // Configuración del correo de confirmación
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirma tu cuenta',
            text: `Haz clic en el siguiente enlace para confirmar tu cuenta: http://localhost:5173/confirm-account?token=${token}`,
            html: `<p>Gracias por registrarte. Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
                   <a href="http://localhost:5173/confirm-account?token=${token}">Confirmar cuenta</a>`,
        };

        // Enviar el correo
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
