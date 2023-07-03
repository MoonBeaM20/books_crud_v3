import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PublishersRoutingModule } from './publishers-routing.module';
import { PublisherValidatorComponent } from './service/validator/publisher-validator/publisher-validator.component';



@NgModule({
  declarations: [
    PublisherValidatorComponent
  ],
  imports: [
    CommonModule,
    PublishersRoutingModule,
    SharedModule
  ],
  exports: [
    PublishersRoutingModule
  ]
})
export class PublishersModule { }
