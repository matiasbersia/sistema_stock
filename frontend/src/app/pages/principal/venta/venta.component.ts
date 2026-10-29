import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../service/producto.service';
import { Producto } from '../../../interface/producto';
import { OtroProductoService } from '../../../service/otro-producto.service';
import { OtroProducto } from '../../../interface/otro_producto';
import { VentaService } from '../../../service/venta.service';

interface ProductoVenta {
  id?: number; // ⚡ id de la BDD
  codigo: string;
  nombre: string;
  marca?: string;
  caracteristica?: string;
  descripcion?: string;  // ⚡ agregamos la descripción
  precio: number;
  cantidad: number;
  tabla?: 'producto' | 'otro_producto';
}

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements AfterViewInit {

  @ViewChild('codigo') input!: ElementRef<HTMLInputElement>;

  datos: ProductoVenta[] = [];
  columnas_titulos: string[] = ['Código', 'Nombre', 'Marca', 'Característica', 'Precio Unitario', 'Cantidad', 'Borrar'];

  codigoBuscar: string = '';
  cantidad: number = 1;
  estado_otro_p: boolean = false;

  nuevoProducto = {
    nombre: '',
    caracteristica: '',
    descripcion: '',
    precio: 0,
    cantidad: 1
  };

  constructor(
    private productoService: ProductoService,
    private otroProductoService: OtroProductoService,
    private ventaService: VentaService
  ) {}

  ngAfterViewInit() {
    this.focusInput();
  }

  focusInput() {
    setTimeout(() => this.input.nativeElement.focus());
  }

  cargarProductoPorCodigo() {
    if (!this.codigoBuscar.trim()) return;

    this.productoService.getProductoPorCodigo(this.codigoBuscar).subscribe({
      next: (prod: Producto) => {
        this.agregarProducto(prod, this.cantidad);
        this.codigoBuscar = '';
        this.cantidad = 1;
        this.focusInput();
      },
      error: () => {
        console.error('Producto no encontrado');
        this.codigoBuscar = '';
        this.focusInput();
      }
    });
  }

  agregarProducto(producto: Producto, cantidad: number) {
    const existente = this.datos.find(p => p.codigo === producto.codigo);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      this.datos.push({
        id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre ?? '',
        marca: producto.marca ?? '',
        caracteristica: '------',
        precio: producto.precio_actual ?? 0,
        cantidad
      });
    }
  }

  aceptarNuevoProducto() {
    if (!this.nuevoProducto.nombre.trim()) return;

    this.datos.push({
      id: undefined,
      codigo: 'OTRO',
      nombre: this.nuevoProducto.nombre,
      marca: '',
      caracteristica: this.nuevoProducto.caracteristica,
      descripcion: this.nuevoProducto.descripcion, // ⚡ guardamos descripción
      precio: this.nuevoProducto.precio,
      cantidad: this.nuevoProducto.cantidad
    });

    this.cancelarNuevoProducto();
  }

  cancelarNuevoProducto() {
    this.estado_otro_p = false;
    this.nuevoProducto = { nombre: '', caracteristica: '', descripcion: '', precio: 0, cantidad: 1 };
  }

  menu_otro_producto() {
    this.estado_otro_p = !this.estado_otro_p;
  }

  borrar(fila: ProductoVenta) {
    const index = this.datos.indexOf(fila);
    if (index !== -1) this.datos.splice(index, 1);
  }

  increment(fila: ProductoVenta) { fila.cantidad += 1; }
  decrement(fila: ProductoVenta) { if (fila.cantidad > 1) fila.cantidad -= 1; }

  totalPrecio(): number {
    return this.datos.reduce((sum, p) => sum + (p.cantidad * p.precio), 0);
  }

  cancelarVenta() {
    this.datos = [];
    this.codigoBuscar = '';
    this.cantidad = 1;
    this.estado_otro_p = false;
    this.nuevoProducto = { nombre: '', caracteristica: '', descripcion: '', precio: 0, cantidad: 1 };
    this.focusInput();
  }

  finalizarVenta() {
    console.log("🧾 FINALIZANDO VENTA…");

    const productosNormales = this.datos.filter(p => p.codigo !== 'OTRO');
    const otros = this.datos.filter(p => p.codigo === 'OTRO');

    console.log("[INFO] Productos a procesar:", { productos: productosNormales, otros_productos: otros });

    const productosParaVenta = productosNormales.map(p => ({
      id: p.id,
      codigo: p.codigo,
      cantidad: p.cantidad,
      precio_unitario: p.precio
    }));

    const otrosParaVenta = otros.map(p => ({
      nombre: p.nombre,
      caracteristica: p.caracteristica ?? '',
      descripcion: p.descripcion ?? '',  // ⚡ usamos la descripción
      precio: p.precio,
      cantidad: p.cantidad
    }));

    const venta = {
      total: this.totalPrecio(),
      productos: productosParaVenta,
      otros_productos: otrosParaVenta
    } as any;

    console.log("[INFO] Objeto final que se enviará al backend:", venta);

    this.ventaService.crearVenta(venta).subscribe({
      next: (res) => {
        console.log("🏁 Venta registrada correctamente:", res);
        this.cancelarVenta();
      },
      error: (err) => console.error("❌ Error al registrar la venta:", err)
    });
  }

}
