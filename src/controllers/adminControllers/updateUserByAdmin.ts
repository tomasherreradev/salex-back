import { Request, Response } from 'express';
import db from '../../config/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

export const updateUserByAdmin = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const {
        nombre,
        email,
        password,
        telefono,
        documento,
        categoria,
        suscripcion_activa,
        confirmada,
    } = req.body;
    

    // Verificar si el usuario existe
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results: RowDataPacket[]) => {
        if (err) return res.status(500).json({ error: 'Error en la consulta.' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });

        const updateFields = [];
        const values: any[] = [];

        if (nombre) {
            updateFields.push('nombre = ?');
            values.push(nombre);
        }
        if (email) {
            updateFields.push('email = ?');
            values.push(email);
        }
        if (telefono) {
            updateFields.push('telefono = ?');
            values.push(telefono);
        }
        if (documento) {
            updateFields.push('documento = ?');
            values.push(documento);
        }

        if (req.file) {
            const { filename } = req.file;
            const imagePath = `/uploads/users/${filename}`; // Ruta a almacenar en la base de datos
    
            updateFields.push('foto = ?');
            values.push(imagePath);
        }

        if (categoria) {
            updateFields.push('categoria = ?');
            values.push(categoria);
        }
        if (suscripcion_activa !== undefined) {
            updateFields.push('suscripcion_activa = ?');
            values.push(Number(suscripcion_activa) ? 1 : 0); // Convertir a 1 o 0
        }
        if (confirmada !== undefined) {
            updateFields.push('confirmada = ?');
            values.push(Number(confirmada) ? 1 : 0); // Convertir a 1 o 0
        }
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            updateFields.push('password = ?');
            values.push(hashedPassword);
        }

        // Agregar el ID del usuario al final de los valores
        values.push(userId);

        // Si no hay campos para actualizar
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar.' });
        }

        // Construir y ejecutar la consulta de actualización
        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        db.query(query, values, (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar los datos.' });
            res.status(200).json({ message: 'Usuario actualizado correctamente.' });
        });
    });
};
