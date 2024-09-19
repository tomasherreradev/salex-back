import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Aquí puedes agregar lógica para verificar tokens de autenticación, roles, etc.
  // Ejemplo de autenticación ficticia:
  const token = req.headers.authorization;
  if (!token || token !== 'some_valid_token') {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  next();
};
