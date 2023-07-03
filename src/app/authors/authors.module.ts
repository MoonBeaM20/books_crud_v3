import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthorsRoutingModule } from './authors-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthorsRoutingModule,
    SharedModule
  ],
  exports: [
    AuthorsRoutingModule
  ]
})
export class AuthorsModule { }
