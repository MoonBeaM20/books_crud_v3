import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { faBookMedical, faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { map, startWith, switchMap } from 'rxjs';
import { Book } from '../model/book';
import { BooksFrontendService } from '../service/frontend/books-frontend.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {

  faTrashCan = faTrashCan;
  faEdit = faEdit;
  faBookMedical = faBookMedical;
  tableColumns = ['id', 'isbn', 'title', 'authors', 'genres', 'actions'];

  resultsLength = 0;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  data : Book[] = [];

  constructor(private service : BooksFrontendService) { }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(
      startWith({}),
      switchMap(() => this.service.getBooksPaginated(this.paginator.pageIndex + 1, this.paginator.pageSize)),
      map(data => {
        let totalCount = data.headers.get("X-Total-Count");
        this.resultsLength = totalCount ? +totalCount : 0;
        return data.body ? data.body : [];
      })
    ).subscribe({
      next: data => this.data = data
    });
  }
}
