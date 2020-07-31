import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'upload-caf',
    loadChildren: () => import('./pages/upload-caf/upload-caf.module').then( m => m.UploadCafePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'upload-image',
    loadChildren: () => import('./pages/upload-image/upload-image.module').then( m => m.UploadImagePageModule)
  },
  {
    path: 'search-caf',
    loadChildren: () => import('./pages/search-caf/search-caf.module').then( m => m.SearchCafePageModule)
  },
  {
    path: 'edit-images',
    loadChildren: () => import('./pages/edit-images/edit-images.module').then( m => m.EditImagesPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then( m => m.ContactPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
