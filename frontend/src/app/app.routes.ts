import { Routes } from '@angular/router';
import { PrincipalComponent } from './pages/principal/principal.component';
import { VentaComponent } from './pages/principal/venta/venta.component';
import { InformacionComponent } from './pages/principal/informacion/informacion.component';
import { HistorialComponent } from './pages/principal/historial/historial.component';
import { CargarStockComponent } from './pages/principal/cargar-stock/cargar-stock.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { VerStockComponent } from './pages/principal/ver-stock/ver-stock.component';



export const routes: Routes = [
  { path: '', redirectTo: 'informacion', pathMatch: 'full' },
  { path: 'venta', component: VentaComponent },
  { path: 'stock', component: VerStockComponent},
  { path: 'cargar-stock', component: CargarStockComponent},
  { path: 'informacion', component: InformacionComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'categoria', component: CategoriaComponent }
  
];

