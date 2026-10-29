export interface HistorialMovimiento {
  id: number;
  id_pedido?: number | null;
  id_entrada_producto?: number | null;
  estado: 'entrada' | 'salida';
  fecha: string; 
  nombre?: string; 
}

export interface HistorialPrecio {
  id: number;
  id_producto: number;
  codigo: string;       
  nombre: string;       
  precio_anterior: number;
  precio_nuevo: number;
  fecha: string;
}


export interface HistorialSistema {
  id: number;
  accion: string;
  descripcion: string;
  fecha: string;
}
