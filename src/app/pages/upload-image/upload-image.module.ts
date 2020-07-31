import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadImagePageRoutingModule } from './upload-image-routing.module';

import { UploadImagePage } from './upload-image.page';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxIonicImageViewerModule,
    UploadImagePageRoutingModule
  ],
  declarations: [UploadImagePage]
})
export class UploadImagePageModule {}
