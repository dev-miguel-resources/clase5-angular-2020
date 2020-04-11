import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


//COMPONENTS
import { LayoutAppComponent } from './components/shared/layout-app/layout-app.component';


const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {
    path: '',
    component: LayoutAppComponent,
    children: [
      {path: '', loadChildren: './components/components.module#ComponentsModule'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
