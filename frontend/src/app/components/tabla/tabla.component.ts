import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntradaProductoService } from '../../service/entrada-producto.service';
import { VentaService } from '../../service/venta.service';

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.css'
})
export class TablaComponent<T extends Record<string, any>> implements OnChanges {

  @Input() boton: boolean = true;
  @Input() columnas: string[] = [];
  @Input() datos: T[] = [];

  filas: number = 5;

  constructor(
    private entradaSrv: EntradaProductoService,
    private ventaSrv: VentaService     // <-- agregado
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.boton) {
      this.filas = this.datos.length; 
    } else if (this.filas > this.datos.length) {
      this.filas = 5; 
    }
  }

  mostrar() {
    if (this.filas === this.datos.length) {
      this.filas = 5; 
    } else {
      this.filas = this.datos.length;
    }
  }

  verDetalles(item: any) {

    // ===============================
    // 📥 ENTRADA
    // ===============================
    if (item.tipo_movimiento === 'entrada') {
      console.log("📥 BUSCANDO ENTRADA:", item.id_entrada_producto);

      this.entradaSrv.verEntradaPorId(item.id_entrada_producto).subscribe({
        next: (data) => {
          console.log("📥 DETALLES DE ENTRADA:", data);
        },
        error: (err) => console.error("❌ Error obteniendo entrada:", err)
      });
    }

    // ===============================
    // 📤 SALIDA = PEDIDO / VENTA
    // ===============================
    else if (item.tipo_movimiento === 'salida') {
      console.log("📤 BUSCANDO PEDIDO:", item.id_pedido);

      this.ventaSrv.verPedidoPorId(item.id_pedido).subscribe({
        next: (data) => {
          console.log("📤 DETALLES DE PEDIDO:", data);
        },
        error: (err) => console.error("❌ Error obteniendo pedido:", err)
      });
    }
  }

}
