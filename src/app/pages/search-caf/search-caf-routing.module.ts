import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchCafPage } from './search-caf.page';


const routes: Routes = [
  {
    path: '',
    component: SearchCafPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchCafPageRoutingModule {}
