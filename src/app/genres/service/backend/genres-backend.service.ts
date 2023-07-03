import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Genre } from '../../model/genre';

@Injectable({
  providedIn: 'root'
})
export class GenresBackendService {

  private baseUrl = "http://localhost:3000/genres"

  constructor(private http : HttpClient) { }

  getAllGenres() {
    return this.http.get<Genre[]>(this.baseUrl);
  }

  getGenreById(id : number) {
    return this.http.get<Genre>(`${this.baseUrl}/${id}`);
  }

  getGenresByIdLike(ids : number[]) {
    return this.http.get<Genre[]>(`${this.baseUrl}?id_like=${ids}`);
  }

  getGenresByName(name : string) {
    return this.http.get<Genre[]>(`${this.baseUrl}?genreName=${name}`);
  }

  getGenresByNameLike(pattern : string) {
    return this.http.get<Genre[]>(`${this.baseUrl}?genreName_like=${pattern}`);
  }

  saveGenre(genre : Genre) {
    return this.http.post<Genre>(this.baseUrl, genre);
  }

}
