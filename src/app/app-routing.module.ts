import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MappingToolComponent} from './mapping_tool/mapping-tool/mapping-tool.component';

const routes: Routes = [
  {
    path: 'mapping-tool',
    component: MappingToolComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
