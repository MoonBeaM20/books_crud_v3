import { Injectable } from '@angular/core';
import { GenresBackendService } from '../backend/genres-backend.service';
import { Genre } from '../../model/genre';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenresFrontendService {

  constructor(private service: GenresBackendService) {}

  getAllGenres() {
    return this.service.getAllGenres();
  }

  getGenreById(id: number) {
    return this.service.getGenreById(id);
  }

  getGenresByIdLike(ids : number[]) {
    return combineLatest(ids.map(id => this.service.getGenreById(id)))
  }

  getGenresByName(name: string) {
    return this.service.getGenresByName(name);
  }

  getGenresByNameLike(pattern: string) {
    return this.service.getGenresByNameLike(pattern);
  }

  saveGenre(genre : Genre) {
    return this.service.saveGenre(genre);
  }

  saveGenres(genres : Genre[]) {
    return combineLatest(genres.map(genre => this.saveGenre(genre)));
  }

  defaultGenre() {
    return {
      id: 0,
      genreName: ''
    } as Genre;
  }

}
