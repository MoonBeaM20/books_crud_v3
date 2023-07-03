import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Author } from '../../model/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorsBackendService {

  private baseUrl = "http://localhost:3000/authors"

  constructor(private http : HttpClient) { }

  getAllAuthors() {
    return this.http.get<Author[]>(this.baseUrl);
  }

  getAuthorById(id : number) {
    return this.http.get<Author>(`${this.baseUrl}/${id}`);
  }

  getAuthorsByIdLike(ids : number[]) {
    return this.http.get<Author[]>(`${this.baseUrl}?id_like=${ids}`);
  }

  getAuthorsByName(name : string) {
    return this.http.get<Author[]>(`${this.baseUrl}?authorName=${name}`);
  }

  getAuthorsByNameLike(pattern : string) {
    return this.http.get<Author[]>(`${this.baseUrl}?authorName_like=${pattern}`);
  }

  saveAuthor(author : Author) {
    return this.http.post<Author>(this.baseUrl, author);
  }

}
