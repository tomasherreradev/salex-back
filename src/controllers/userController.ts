import { Request, Response } from 'express';
import db from '../../config/db';
import { User } from '../models/userModel';
import { ResultSetHeader } from 'mysql2';

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
export const createUser = (req: Request, res: Response): void => {
  const { nombre, email, password, telefono, documento, categoria, suscripcion_activa } = req.body;
  const sql = `INSERT INTO users (nombre, email, password, telefono, documento, categoria, suscripcion_activa)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nombre, email, password, telefono, documento, categoria, suscripcion_activa], (err, result: ResultSetHeader) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Usuario registrado', userId: result.insertId });
  });
};
