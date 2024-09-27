import { Request, Response } from 'express';
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';

export const updateCar = (req: Request, res: Response): void => {
    const { id } = req.params;
    const { marca, modelo, year, estado_actual, kilometraje, notas, placa, color } = req.body;

    const fotos: string[] = req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/cars/${file.filename}`) : [];

    const checkPlateQuery = 'SELECT COUNT(*) AS count FROM autos WHERE placa = ? AND id != ?';
    db.query(checkPlateQuery, [placa, id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const count = (results as any)[0].count;
        if (count > 0) {
            return res.status(400).json({ error: 'La placa ya está en uso por otro vehículo.' });
        }

        // consulta para actualizar el auto
        let sql = `
            UPDATE autos 
            SET marca = ?, modelo = ?, year = ?, estado_actual = ?, kilometraje = ?, notas = ?, placa = ?, color = ?
            WHERE id = ?
        `;
        const params = [marca, modelo, year, estado_actual, kilometraje, notas, placa, color, id];

        db.query(sql, params, (err, results: ResultSetHeader) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Vehículo no encontrado' });
                return;
            }

            // actualizar las fotos en la bd
            if (fotos.length > 0) {
                // eliminar las fotos existentes
                const sqlDeleteFotos = `DELETE FROM fotos_autos WHERE auto_id = ?`;
                db.query(sqlDeleteFotos, [id], (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }

                    // insertar las nuevas fotos
                    const sqlInsertFotos = `INSERT INTO fotos_autos (auto_id, foto) VALUES ?`;
                    const fotoParams = fotos.map(foto => [id, foto]); 
                    
                    db.query(sqlInsertFotos, [fotoParams], (err) => {
                        if (err) {
                            res.status(500).json({ error: err.message });
                            return;
                        }

                        res.json({ message: 'Vehículo y fotos actualizados' });
                    });
                });
            } else {
                res.json({ message: 'Vehículo actualizado sin nuevas fotos' });
            }
        });
    });
};
