import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaComponent } from "../tabla/tabla.component";
import { Categoria } from '../../interface/categoria';
import { Producto } from '../../interface/producto';
import { CategoriaService } from '../../service/categoria.service';
import { ProductoService } from '../../service/producto.service';

@Component({
  selector: 'app-modificar-precio',
  standalone: true,
  imports: [CommonModule, FormsModule, TablaComponent],
  templateUrl: './modificar-precio.component.html',
  styleUrls: ['./modificar-precio.component.css']
})
export class ModificarPrecioComponent {

  @Output() cerrarModificar = new EventEmitter<boolean>();

  columnas: string[] = ['codigo', 'nombre', 'marca', 'precio_actual', 'stock'];

  datos: Producto[] = [];
  categorias: Categoria[] = [];

  nombreFiltro: string = '';
  marcaFiltro: string = '';
  codigoBuscar: string = '';
  idCategoriaSeleccionada: number | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cerrarComponente() {
    this.cerrarModificar.emit(false);
  }

  cargarCategorias() {
    this.categoriaService.verCategoria().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
        this.idCategoriaSeleccionada = null;
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe({
      next: (productos: Producto[]) => this.datos = productos,
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  buscarProductos() {
    if (this.codigoBuscar.trim()) {
      this.productoService.getProductoPorCodigo(this.codigoBuscar.trim()).subscribe({
        next: (producto: Producto) => this.datos = producto ? [producto] : [],
        error: (err) => console.error('Error al buscar producto por código', err)
      });
      return;
    }

    this.productoService.buscarProductos({
      nombre: this.nombreFiltro || undefined,
      marca: this.marcaFiltro || undefined,
      idCategoria: this.idCategoriaSeleccionada || undefined
    }).subscribe({
      next: (productos: Producto[]) => this.datos = productos,
      error: (err) => console.error('Error al buscar productos:', err)
    });
  }
}
