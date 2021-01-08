import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { InitGuard } from './helpers/init/init.guard';
import { LoginComponent } from './main/auth-screen/login/login.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [InitGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./main/main.module').then(m => m.MainModule),
      },
      {
        path: '*',
        redirectTo: '',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
