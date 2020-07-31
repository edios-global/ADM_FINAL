import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadCafPage } from './upload-caf.page';


const routes: Routes = [
  {
    path: '',
    component: UploadCafPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadCafePageRoutingModule {}
