import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditImagesPage } from './edit-images.page';

const routes: Routes = [
  {
    path: '',
    component: EditImagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditImagesPageRoutingModule {}
