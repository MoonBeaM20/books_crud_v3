import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookSaveShellComponent } from './book-save/book-save-shell/book-save-shell.component';

const routes: Routes = [
  {path: "books", component: BookListComponent},
  {path: "books", children: [
    {path: "add", component: BookSaveShellComponent},
    {path: "edit/:id", component: BookSaveShellComponent},
    {path: ":id", component: BookSaveShellComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }