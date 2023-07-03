import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BookListComponent } from './book-list/book-list.component';
import { BooksRoutingModule } from './books-routing.module';
import { BookSaveShellComponent } from './book-save/book-save-shell/book-save-shell.component';
import { AuthorFormComponent } from './book-save/author-form/author-form.component';
import { PublisherFormComponent } from './book-save/publisher-form/publisher-form.component';
import { GenreFormComponent } from './book-save/genre-form/genre-form.component';



@NgModule({
  declarations: [
    BookListComponent,
    BookSaveShellComponent,
    AuthorFormComponent,
    PublisherFormComponent,
    GenreFormComponent
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    SharedModule
  ],
  exports: [
    BookListComponent,
    BooksRoutingModule
  ]
})
export class BooksModule { }
