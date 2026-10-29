import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {

  opcionesMenu = [
    { texto: "Gestor de ventas", url: "/venta" },
    { texto: "Ver stock", url: "/stock" },
    { texto: "Cargar stock", url: "/cargar-stock" },
    { texto: "Informacion", url: "/informacion" },
    { texto: "Historial", url: "/historial" },
    { texto: "Ayuda", url: "" }
  ];

  seleccionado: string = '';

  constructor(private router: Router) {
    // Escuchar cambios de ruta y actualizar el seleccionado
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.seleccionado = event.url; // asigna la URL actual
    });
  }

  ir(url: string) {
    if (url) {
      this.router.navigate([url]);
      // No hace falta actualizar seleccionado aquí, ya lo hace el evento NavigationEnd
    }
  }

}
