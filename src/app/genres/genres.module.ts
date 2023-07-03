import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GenresRoutingModule } from './genres-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GenresRoutingModule,
    SharedModule
  ],
  exports: [
    GenresRoutingModule
  ]
})
export class GenresModule { }
