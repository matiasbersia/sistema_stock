import { Component } from '@angular/core';
import { TablaComponent } from "../../../components/tabla/tabla.component";
import { Producto } from '../../../interface/producto';
import { ProductoService } from '../../../service/producto.service';

@Component({
  selector: 'app-ver-stock',
  standalone: true,
  imports: [TablaComponent],
  templateUrl: './ver-stock.component.html',
  styleUrl: './ver-stock.component.css'
})
export class VerStockComponent {
  productos: Producto[] = [];
  cantidad: number = 0;

  columnasProducto = [
    'Código',
    'Nombre',
    'Marca',
    'Precio',
    'Stock',
    'Vencimiento'
  ];

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.cantidad = data.length;
        console.log(this.productos);
      },
      error: (err) => {
        console.error('Error al cargar productos', err);
      }
    });
  }

  get datosParaTabla() {
    return this.productos.map(prod => ({
      'Código': prod.codigo,
      'Nombre': prod.nombre ?? '—',
      'Marca': prod.marca ?? '—',
      'Precio': prod.precio_actual,
      'Stock': prod.stock,
      'Vencimiento': prod.vencimiento
        ? new Date(prod.vencimiento).toLocaleDateString()
        : '—'
    }));
  }
}
