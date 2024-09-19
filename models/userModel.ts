export interface User {
    id: number;
    nombre: string;
    email: string;
    password: string;
    telefono: string;
    documento: string;
    foto?: string;
    categoria: 'usuario' | 'suscriptor' | 'administrador';
    suscripcion_activa: boolean;
  }
  