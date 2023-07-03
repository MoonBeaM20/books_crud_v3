import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Author } from '../../model/author';
import { AuthorsBackendService } from '../backend/authors-backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorsFrontendService {

  constructor(private service : AuthorsBackendService) { }

  getAllAuthors() {
    return this.service.getAllAuthors();
  }

  getAuthorById(id : number) {
    return this.service.getAuthorById(id);
  }

  getAuthorsByIdLike(ids : number[]) {
    return combineLatest(ids.map(id =>  this.service.getAuthorById(id)));
  }

  getAuthorsByName(name : string) {
    return this.service.getAuthorsByName(name);
  }

  getAuthorsByNameLike(pattern : string) {
    return this.service.getAuthorsByNameLike(pattern);
  }

  saveAuthor(author : Author) {
    return this.service.saveAuthor(author);
  }

  saveAuthors(authors : Author[]) {
    return combineLatest(authors.map(author => this.saveAuthor(author)));
  }

  defaultAuthor() {
    return {
      id: 0,
      authorName: ''
    } as Author;
  }

}
