import { Categoria } from "./categoria";

export interface Producto {
  id?:number;
  codigo: string;
  nombre?: string;
  marca?: string;
  precio_actual?: number;
  stock?: number;
  vencimiento?: string;
  categorias?: { id: number; nombre: string }[];
}
