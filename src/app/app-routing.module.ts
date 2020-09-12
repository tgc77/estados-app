import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EstadoListComponent } from './estados/estado-list/estado-list.component';
import { EstadoCreateComponent } from './estados/estado-create/estado-create.component';

const routes: Routes = [
  { path: '', component: EstadoListComponent },
  { path: 'create', component: EstadoCreateComponent },
  { path: 'edit/:estadoId', component: EstadoCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
