import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Producto {
  codigo: string;
  nombre: string;
  cantidad: number;
  [key: string]: string | number;
}

@Component({
  selector: 'app-tabla-interactiva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-interactiva.component.html',
  styleUrls: ['./tabla-interactiva.component.css']
})
export class TablaInteractivaComponent implements OnInit {

  // 🔥 Columnas reales (respeta el orden del objeto)
  columnas: string[] = [];

  // 🔥 TITULOS que ponés vos (lo que quieras)
  columnas_titulos: string[] = ['Código', 'Nombre', 'Precio Unitario',"Cantidad","Borrar"];

  datos: Producto[] = [
    { codigo: 'P001', nombre: 'Camiseta', cantidad: 0 },
    { codigo: 'P002', nombre: 'Pantalón', cantidad: 0 },
    { codigo: 'P003', nombre: 'Zapatillas', cantidad: 0 },
    { codigo: 'P001', nombre: 'Camiseta', cantidad: 0 },
    { codigo: 'P002', nombre: 'Pantalón', cantidad: 0 },
    { codigo: 'P003', nombre: 'Zapatillas', cantidad: 0 },
    { codigo: 'P001', nombre: 'Camiseta', cantidad: 0 },
    { codigo: 'P002', nombre: 'Pantalón', cantidad: 0 },
    { codigo: 'P003', nombre: 'Zapatillas', cantidad: 0 }
  ];

  ngOnInit() {

    // 🔥 Esta línea hace que columnas siga el orden REAL del objeto
    this.columnas = Object.keys(this.datos[0]);

    // Inicializar si viniera undefined
    this.datos.forEach(fila => {
      if (fila.cantidad === undefined) fila.cantidad = 0;
    });
  }

  increment(fila: Producto) {
    fila.cantidad += 1;
  }

  decrement(fila: Producto) {
    if (fila.cantidad > 0) fila.cantidad -= 1;
  }

  accion(fila: Producto) {
    console.log('Botón presionado en:', fila);
  }
}
