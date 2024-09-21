import db from '../../config/db';
import { RowDataPacket } from 'mysql2';

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
  