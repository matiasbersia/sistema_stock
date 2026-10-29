import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../../interface/categoria';
import { CategoriaService } from '../../../service/categoria.service';
import { Producto } from '../../../interface/producto';
import { ProductoService } from '../../../service/producto.service';
import { Router } from '@angular/router';
import { CategoriaComponent } from "../../../components/categoria/categoria.component";
import { BuscarProductoComponent } from "../../../components/buscar-producto/buscar-producto.component";
import { ModificarPrecioComponent } from "../../../components/modificar-precio/modificar-precio.component";

@Component({
  selector: 'app-cargar-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoriaComponent, BuscarProductoComponent, ModificarPrecioComponent],
  templateUrl: './cargar-stock.component.html',
  styleUrls: ['./cargar-stock.component.css']
})
export class CargarStockComponent {

  @ViewChild('codigoInput') codigoInput!: ElementRef<HTMLInputElement>;
  botonSeleccionado: string = 'cargar';
  codigo: string = '';
  nombre: string = '';
  marca: string = '';
  precio_actual?: number;
  stock?: number;
  stock_cargar?:number;
  vencimiento: Date | null = null;
  vencimientoInput: string = '';
  
  // Array para las categorías disponibles
  categoriasDisponibles: Categoria[] = [];
  
  // Array para las categorías seleccionadas
  categoriasSeleccionadas: number[] = [];

  // Producto cargado
  producto?: Producto;

  infoTexto: string = '';
  estado_categoria: boolean = false;
  estado_buscar: boolean = false;
  estado: string = 'cargar';

  estado_modificar: boolean = false;


  // Lista que muestra las categorías seleccionadas
  categorias_lista: { id: number, nombre: string }[] = [];

  // Categoría seleccionada en el select
  categoriaSeleccionada: number | null = null;

  constructor(
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  // Método para cargar categorías desde el backend
  cargarCategorias() {
    this.categoriaService.verCategoria().subscribe({
      next: (data: Categoria[]) => {
        this.categoriasDisponibles = data;
        console.log('Categorías cargadas:', this.categoriasDisponibles);
        this.categoriasSeleccionadas = [];
      },
      error: (err) => console.error(err)
    });
  }

  // Método para cargar un producto por código
  cargar_un_producto() {
    if (!this.codigo) return;

    this.productoService.getProductoPorCodigo(this.codigo).subscribe({
      next: (prod) => {
        // Cargar los datos del producto
        this.producto = prod;
        this.vencimientoInput = prod.vencimiento
          ? new Date(prod.vencimiento).toISOString().split('T')[0]
          : '';
        this.nombre = prod.nombre || '';
        this.marca = prod.marca || '';
        this.precio_actual = prod.precio_actual ?? undefined;
        this.stock = prod.stock ?? undefined;
        this.vencimiento = prod.vencimiento ? new Date(prod.vencimiento) : null;

        // Asignar categorías seleccionadas
        this.categoriasSeleccionadas = prod.categorias?.map(c => c.id) ?? [];

        // Mapear las categorías asociadas al producto
        this.categorias_lista = prod.categorias?.map(c => ({ id: c.id, nombre: c.nombre })) ?? [];

        console.log('Producto cargado:', prod);
        console.log('Categorías asociadas al producto:', this.categorias_lista);
      },
      error: () => this.limpiarFormulario()
    });
  }

  // Método para crear un producto
crear_producto() {
  const vencimientoFormateado = this.vencimiento
    ? new Date(this.vencimiento).toISOString().split('T')[0]
    : undefined;

  const producto: Partial<Producto> = {
    codigo: this.codigo,
    nombre: this.nombre || undefined,
    marca: this.marca || undefined,
    precio_actual: this.precio_actual ?? undefined,
    stock: this.stock_cargar ?? undefined, // <-- solo se manda stock_cargar
    categorias: this.mapCategoriasSeleccionadas(),
    vencimiento: vencimientoFormateado
  };

  console.log('Producto que se envía al backend:', producto);

  this.productoService.crearProducto(producto).subscribe({
    next: (resp) => console.log('Respuesta backend:', resp),
    error: (err) => console.error('Error backend:', err)
  });

  this.limpiarFormulario();
}



  // Método para mapear las categorías seleccionadas
  private mapCategoriasSeleccionadas(): { id: number, nombre: string }[] {
    return this.categoriasSeleccionadas.map(id => {
      const cat = this.categoriasDisponibles.find(c => c.id === id);
      return { id: cat!.id, nombre: cat!.nombre };
    });
  }

  // Método para borrar un producto
  borrar_producto() {
    if (!this.codigo) {
      this.infoTexto = 'No hay producto seleccionado para borrar';
      return;
    }

    this.productoService.borrarProducto(this.codigo).subscribe({
      next: (resp) => {
        console.log('Producto borrado:', resp);
        this.infoTexto = 'Producto borrado correctamente';
        this.limpiarFormulario();
        this.ponerFocusCodigo();
      },
      error: (err) => {
        console.error(err);
        this.infoTexto = 'Error al borrar producto';
      }
    });
  }

  // Método para limpiar el formulario
  limpiarFormulario() {
    this.codigo = '';
    this.nombre = '';
    this.marca = '';
    this.precio_actual = undefined;
    this.stock = undefined;
    this.stock_cargar=undefined;
    this.vencimiento = null;
    this.vencimientoInput = '';
    this.categoriasSeleccionadas = [];  // Limpiar categorías seleccionadas
    this.categorias_lista = [];         // Limpiar la tabla de categorías
    this.producto = undefined;
  }

  // Método para cambiar el estado de los botones
  cambiar_estado(estado: string) {
    this.botonSeleccionado = estado;
    this.estado = estado;
    this.limpiarFormulario();
  }

  // Método para actualizar la fecha de vencimiento
  actualizarVencimiento(fecha: string) {
    this.vencimiento = fecha ? new Date(fecha) : null;
  }

  // Método para manejar el estado de la categoría
  boton_categoria() {
    this.botonSeleccionado = 'categoria';
    this.estado_categoria = true;
  }

  // Método para manejar el estado de búsqueda
  boton_buscar() {
    this.botonSeleccionado = 'buscar';
    this.estado_buscar = true;
  }

  // Método para cerrar el modal de búsqueda
  cerrar_buscar() {
    this.estado_buscar = false;
  }

  // Método para poner el foco en el campo de código
  ponerFocusCodigo() {
    this.codigoInput.nativeElement.focus();
  }

  // Método para agregar una categoría seleccionada
  agregarCategoria() {
    if (this.categoriaSeleccionada == null) {
      console.log("Por favor, selecciona una categoría");
      return;
    }

    const categoriaSeleccionadaId = +this.categoriaSeleccionada;  // Convertir a número

    const categoria = this.categoriasDisponibles.find(c => c.id === categoriaSeleccionadaId);

    if (!categoria) {
      console.log("Categoría no encontrada.");
      return;
    }

    this.categorias_lista.push({ id: categoria.id, nombre: categoria.nombre });
    this.categoriasSeleccionadas.push(categoria.id);
    this.categoriaSeleccionada = null;  // Limpiar selección
  }

  // Método para eliminar una categoría
  eliminarCategoria(index: number) {
    const categoria = this.categorias_lista[index];
    
    if (categoria) {
      const idx = this.categoriasSeleccionadas.indexOf(categoria.id);
      if (idx !== -1) {
        this.categoriasSeleccionadas.splice(idx, 1);
      }

      this.categorias_lista.splice(index, 1);
    }
  }

  cerrar_categoria(valor: boolean) {
this.estado_buscar = false;
    this.cargarCategorias();
  }


  boton_modificar() {
  this.botonSeleccionado = 'modificar';
  this.estado_modificar = true;
}
cerrar_modificar(valor: boolean) {
  this.estado_modificar = valor;
}

}
