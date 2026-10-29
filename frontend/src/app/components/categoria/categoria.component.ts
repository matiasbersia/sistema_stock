import { Component, EventEmitter, Output } from '@angular/core';
import { TablaComponent } from "../tabla/tabla.component";
import { CommonModule } from '@angular/common';

import { Categoria } from '../../interface/categoria';
import { CategoriaService } from '../../service/categoria.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    TablaComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent {
  cantidad:number =0;
  idCategoriaSeleccionada:number=0;
  estado: string = "crear";
  nombreCategoria:string=""
  columnasCategoria = ["Categoria"];
  categorias: Categoria[] = [];
  infoTexto:string=""
@Output() cerrarCategoria = new EventEmitter<boolean>();
  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.cargarCategorias();
  }

cerrarComponente() {
  this.cerrarCategoria.emit(false); 
}

cargarCategorias() {
  this.categoriaService.verCategoria().subscribe({
    next: (data: Categoria[]) => {
      this.categorias = data;
      this.cantidad = this.categorias.length;
      console.log(this.categorias);

      if (this.categorias.length > 0) {
        this.idCategoriaSeleccionada = this.categorias[0].id;
      }
    },
    error: (err) => {
      console.error('Error al cargar categorías', err);
    }
  });
}

  get datosParaTabla() {
    return this.categorias.map(cat => ({
      Categoria: cat.nombre
    }));
  }
crear_categoria() {
  if (!this.nombreCategoria) return; 
  if(this.categorias.length>=100){
    return
    //aca porner lo de texto info: cantidad maxima
  }
  const nuevaCategoria: Categoria = { nombre: this.nombreCategoria } as Categoria;

  this.categoriaService.crearCategoria(nuevaCategoria).subscribe({
    next: (data: Categoria) => {
      console.log('Categoría creada:', data);
      this.cargarCategorias();

      this.nombreCategoria = '';
    },
    error: (err) => {
      console.error('Error al crear categoría', err);
    }
  });
}

actualizar_categoria() {
  if (!this.nombreCategoria) return;

  const nuevaCategoria: Categoria = { nombre: this.nombreCategoria } as Categoria;

  this.categoriaService.actualizarCategoria(this.idCategoriaSeleccionada, nuevaCategoria).subscribe({
    next: (data: Categoria) => {
      console.log('Categoría actualizada:', data);
      this.cargarCategorias();           
      this.nombreCategoria = '';         
      this.idCategoriaSeleccionada = 0;  
      this.infoTexto = 'Categoría actualizada correctamente'; 
    },
    error: (err) => {
      console.error('Error al actualizar categoría', err);
      this.infoTexto = 'Error al actualizar categoría';
    }
  });
}
borrar_categoria() {
  if (!this.idCategoriaSeleccionada) {
    this.infoTexto = 'No hay categoría seleccionada para borrar';
    return;
  }

  this.categoriaService.borrarCategoria(this.idCategoriaSeleccionada).subscribe({
    next: (res) => {
      console.log('Categoría borrada:', res);
      this.infoTexto = 'Categoría borrada correctamente';
      this.cargarCategorias();          
      this.nombreCategoria = '';         
      this.idCategoriaSeleccionada = this.categorias.length > 0 ? this.categorias[0].id : 0; 
    },
    error: (err) => {
      console.error('Error al borrar categoría', err);
      this.infoTexto = 'Error al borrar categoría';
    }
  });
}




  cargar_estado(estado: string) {
    this.estado = estado;
  }
}
