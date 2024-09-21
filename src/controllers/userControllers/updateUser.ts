import { Request, Response } from 'express';
import db from '../../config/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

export const updateUser = async (req: any, res: Response): Promise<void> => {
    const { nombre, email, oldPassword, newPassword, repeatPassword, documento } = req.body;
    const userId = req.user.userId;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null; // Obtén el path de la imagen

    // Comprobar que newPassword y repeatPassword sean iguales
    if (newPassword && newPassword !== repeatPassword) {
        res.status(400).json({ error: 'Las contraseñas nuevas no coinciden.' });
    }

    // Verificar la contraseña antigua
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results: RowDataPacket[]) => {
        if (err) return res.status(500).json({ error: 'Error en la consulta.' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado.' });

        const storedPassword = results[0].password;
        const isMatch = bcrypt.compareSync(oldPassword, storedPassword);
        if (!isMatch) {
            return res.status(400).json({ error: 'La contraseña anterior es incorrecta o está vacía' });
        }

        const updateFields = [];
        const values = [];

        if (nombre) {
            updateFields.push('nombre = ?');
            values.push(nombre);
        }
        if (email) {
            updateFields.push('email = ?');
            values.push(email);
        }
        if (documento) {
            updateFields.push('documento = ?');
            values.push(documento);
        }
        if (profileImage) { // Agregar la imagen si existe
            updateFields.push('foto = ?');
            values.push(profileImage);
        }
        if (newPassword) {
            const hashedPassword = bcrypt.hashSync(newPassword, 10);
            updateFields.push('password = ?');
            values.push(hashedPassword);
        }

        values.push(userId);

        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        db.query(query, values, (err) => {
            if (err) return res.status(500).json({ error: 'Error al actualizar los datos.' });
            res.status(200).json({ message: 'Datos actualizados correctamente.', foto: profileImage });
        });
    });
};