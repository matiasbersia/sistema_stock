
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../service/producto.service';
import { HistorialMovimientoService } from '../../../service/historial-movimientos.service';
import { EntradaProductoService } from '../../../service/entrada-producto.service';
import { VentaService } from '../../../service/venta.service';

interface Tarjeta {
  texto: string;
  valor: number;
  visualizar: boolean;
}

@Component({
  selector: 'app-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {

  estado_menu: boolean = false;

  info_tarjeta: Tarjeta[] = [
    { texto: "movimientos historial mes", valor: 0, visualizar: true },
    { texto: "total productos", valor: 0, visualizar: true },
    { texto: "sin stock", valor: 0, visualizar: true },
    { texto: "valor total stock", valor: 0, visualizar: true },
    { texto: "ingreso mes", valor: 0, visualizar: true },
    { texto: "ingreso mes valor", valor: 0, visualizar: true },
    { texto: "ventas mes", valor: 0, visualizar: true },
    { texto: "ventas mes valor", valor: 0, visualizar: true }
  ];

  fila: Tarjeta[] = this.info_tarjeta;

  constructor(
    private productoService: ProductoService,
    private historialService: HistorialMovimientoService,
    private entradaService: EntradaProductoService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {

    // Recuperar estados guardados
    const datos = localStorage.getItem('visualizar_tarjetas');

    if (datos) {
      const estados: Record<string, boolean> = JSON.parse(datos);

      this.info_tarjeta.forEach(t => {
        if (estados[t.texto] !== undefined) {
          t.visualizar = estados[t.texto];
        }
      });
    }

    // Productos sin stock
    this.productoService.getProductosSinStock().subscribe({
      next: (productos) => {
        const tarjeta = this.info_tarjeta.find(
          t => t.texto === "sin stock"
        );

        if (tarjeta) tarjeta.valor = productos.length;
      },
      error: (err) => console.error("Error trayendo productos sin stock", err)
    });

    // Cantidad de movimientos del mes
    this.historialService.verCantidadMes().subscribe({
      next: (res: { cantidad: number }) => {
        const tarjeta = this.info_tarjeta.find(
          t => t.texto === "movimientos historial mes"
        );

        if (tarjeta) tarjeta.valor = res.cantidad;
      },
      error: (err) => console.error("Error trayendo movimientos del mes", err)
    });

    // Cantidad de productos activos
    this.productoService.getCantidadProductosActivos().subscribe({
      next: (res: { cantidad: number }) => {
        const tarjeta = this.info_tarjeta.find(
          t => t.texto === "total productos"
        );

        if (tarjeta) tarjeta.valor = res.cantidad;
      },
      error: (err) => console.error("Error trayendo productos activos", err)
    });

    // Valor total del stock
    this.productoService.getValorTotalStock().subscribe({
      next: (res) => {
        const tarjeta = this.info_tarjeta.find(
          t => t.texto === "valor total stock"
        );

        if (tarjeta) tarjeta.valor = res.total;
      },
      error: (err) => console.error("Error trayendo valor total del stock", err)
    });

    // Cantidad de unidades ingresadas durante el mes
    this.entradaService.verIngresosMes().subscribe({
      next: (res) => {
        const tarjeta = this.info_tarjeta.find(
          t => t.texto === "ingreso mes"
        );

        if (tarjeta) tarjeta.valor = Number(res.total);
      },
      error: (err) => console.error("Error trayendo ingresos del mes", err)
    });

    // Valor monetario de los ingresos del mes
    this.entradaService.verValorIngresosMes().subscribe({
      next: (res) => {
        const tarjeta = this.info_tarjeta.find(
          t => t.texto === "ingreso mes valor"
        );

        if (tarjeta) tarjeta.valor = Number(res.total);
      },
      error: (err) => console.error("Error trayendo valor de ingresos", err)
    });

    // Cantidad de ventas del mes
    this.ventaService.verCantidadVentasMes().subscribe({
      next: (res) => {
        const tarjeta = this.info_tarjeta.find(
          t => t.texto === "ventas mes"
        );

        if (tarjeta) tarjeta.valor = Number(res.total);
      },
      error: (err) => console.error("Error trayendo ventas del mes", err)
    });

    // Valor total de las ventas del mes
    this.ventaService.verTotalVentasMes().subscribe({
      next: (res) => {
        const tarjeta = this.info_tarjeta.find(
          t => t.texto === "ventas mes valor"
        );

        if (tarjeta) tarjeta.valor = Number(res.total);
      },
      error: (err) => console.error("Error trayendo valor de ventas", err)
    });

  }

  menu() {
    this.estado_menu = !this.estado_menu;
  }

  visualizar(tarjeta: Tarjeta) {
    tarjeta.visualizar = !tarjeta.visualizar;

    const estados: Record<string, boolean> = {};

    this.info_tarjeta.forEach(t => {
      estados[t.texto] = t.visualizar;
    });

    localStorage.setItem('visualizar_tarjetas', JSON.stringify(estados));
  }
}
