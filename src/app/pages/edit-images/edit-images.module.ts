import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditImagesPageRoutingModule } from './edit-images-routing.module';

import { EditImagesPage } from './edit-images.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditImagesPageRoutingModule
  ],
  declarations: [EditImagesPage]
})
export class EditImagesPageModule {}
