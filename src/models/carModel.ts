export interface Car {
    id: number;
    marca: string;
    modelo: string;
    año: number;
    estado_actual: 'nuevo' | 'usado';
    kilometraje: number;
    foto?: string;
    notas?: string;
  }
  