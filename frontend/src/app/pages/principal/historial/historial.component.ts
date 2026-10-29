import { Component, OnInit } from '@angular/core';
import { TablaComponent } from "../../../components/tabla/tabla.component";
import { HistorialMovimiento, HistorialPrecio, HistorialSistema } from '../../../interface/historiales';
import { HistorialSistemaService } from '../../../service/historial-sistema.service';
import { HistorialPrecioService } from '../../../service/historial-precio.service';
import { HistorialMovimientoService } from '../../../service/historial-movimientos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [TablaComponent,CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  columnas: string[] = [];
  datos: (HistorialMovimiento | HistorialPrecio | HistorialSistema)[] = [];

  botonSeleccionado: string = 'hm';

  constructor(
    private historialService: HistorialSistemaService,
    private hpService: HistorialPrecioService,
    private hmService: HistorialMovimientoService
  ) {}

  ngOnInit() {
    this.cambiar_estado('hm');
  }

  cambiar_estado(estado: string): void {
    this.botonSeleccionado = estado;
    this.limpiarTabla();

    switch (estado) {
      case 'hm':
        this.cargar_hm();
        break;
      case 'hp':
        this.cargar_hp();
        break;
      case 'hs':
        this.cargar_hs();
        break;
    }
  }

cargar_hm(): void {
  this.columnas = ['estado', 'producto', 'detalles', 'fecha'];

  this.hmService.verHistorial().subscribe({
    next: (data: HistorialMovimiento[]) => {
      this.datos = data
        .map(item => {

          // 🔵 Tipo de movimiento (entrada o salida)
          const tipo = item.estado; // ya viene así desde el backend

          // 🔵 Producto:
          // Entrada  → nombre
          // Salida   → si tiene pedido → "Pedido #id", sino → nombre
          const producto = tipo === 'entrada'
            ? (item.nombre || '-')
            : item.id_pedido
                ? `Pedido #${item.id_pedido}`
                : (item.nombre || '-');

          // 🔵 Detalles:
          // Entrada → id_entrada_producto
          // Salida  → id_pedido
          const detalles = tipo === 'entrada'
            ? item.id_entrada_producto
            : item.id_pedido;

          return {
            ...item,
            producto,
            detalles,
            tipo_movimiento: tipo
          };

        })
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    },

    error: (err) => console.error('Error al cargar historial de movimientos', err)
  });
}





  cargar_hp(): void {
    this.columnas = ['codigo', 'nombre', 'precio_anterior', 'precio_nuevo', 'fecha'];
    this.hpService.verHistorial().subscribe({
      next: (data: HistorialPrecio[]) => {
        this.datos = data.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
      },
      error: (err) => console.error('Error al cargar historial de precios', err)
    });
  }

  cargar_hs(): void {
    this.columnas = ['accion', 'descripcion', 'fecha'];
    this.historialService.verHistorial().subscribe({
      next: (data: HistorialSistema[]) => {
        this.datos = data;
      },
      error: (err) => console.error('Error al cargar historial del sistema', err)
    });
  }

  limpiarTabla(): void {
    this.columnas = [];
    this.datos = [];
  }
}
