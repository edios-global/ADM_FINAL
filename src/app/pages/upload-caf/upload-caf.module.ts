import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadCafePageRoutingModule } from './upload-caf-routing.module';

import { UploadCafPage } from './upload-caf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadCafePageRoutingModule
  ],
  declarations: [UploadCafPage]
})
export class UploadCafePageModule {}
