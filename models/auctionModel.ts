import { User } from './userModel';
import { Car } from './carModel';

export interface Auction {
  id: number;
  auto_id: number;
  precio_inicial: number;
  puja_minima: number;
  ganador_id?: number;
  activo: boolean;
  fecha_inicio: Date;
  fecha_fin: Date;
  auto?: Car;
  ganador?: User;
}
