import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchCafPageRoutingModule } from './search-caf-routing.module';

import { SearchCafPage } from './search-caf.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchCafPageRoutingModule
  ],
  declarations: [SearchCafPage]
})
export class SearchCafePageModule {}
