import {Request, Response} from 'express';
import db from '../../config/db';
import { ResultSetHeader } from 'mysql2';


export const updateCar = (req: Request, res:Response): void => {
    const {id} = req.params;
    const { marca, modelo, year, estado_actual, kilometraje, notas } = req.body;
    const foto = req.file? `/uploads/cars/${req.file.filename}` : null;

    console.log(req.body)
    console.log(req.file)

    const sql = 
    `
    UPDATE autos 
    SET marca = ?, modelo = ?, year = ?, estado_actual = ?, kilometraje = ?, foto = ?, notas = ?
    WHERE id = ?
    `;

    db.query(sql, [marca, modelo, year, estado_actual, kilometraje, foto, notas, id], (err, results: ResultSetHeader) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if(results.affectedRows === 0) {
            res.status(404).json({ message: 'Vehiculo no encontrado' });
            return;
        }


        res.json({message: 'Vehiculo actualizado'})
    })
}