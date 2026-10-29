import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablaComponent } from "../tabla/tabla.component";
import { Categoria } from '../../interface/categoria';
import { Producto } from '../../interface/producto';
import { CategoriaService } from '../../service/categoria.service';
import { ProductoService } from '../../service/producto.service';

@Component({
  selector: 'app-buscar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, TablaComponent],
  templateUrl: './buscar-producto.component.html',
  styleUrls: ['./buscar-producto.component.css']
})
export class BuscarProductoComponent {

  @Output() cerrarBuscar = new EventEmitter<boolean>();

  columnas: string[] = ['codigo','nombre','marca','precio_actual','stock'];

  datos: Producto[] = [];
  categorias: Categoria[] = [];

  // Filtros
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
    this.cerrarBuscar.emit(false); 
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
