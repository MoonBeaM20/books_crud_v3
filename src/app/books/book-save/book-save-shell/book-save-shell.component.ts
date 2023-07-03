import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, Subject, Subscription, concatMap, of } from 'rxjs';
import { Author } from 'src/app/authors/model/author';
import { AuthorsFrontendService } from 'src/app/authors/service/frontend/authors-frontend.service';
import { Genre } from 'src/app/genres/model/genre';
import { GenresFrontendService } from 'src/app/genres/service/frontend/genres-frontend.service';
import { Publisher } from 'src/app/publishers/model/publisher';
import { PublishersFrontendService } from 'src/app/publishers/service/frontend/publishers-frontend.service';
import { Book } from '../../model/book';
import { BooksFrontendService } from '../../service/frontend/books-frontend.service';

@Component({
  selector: 'app-book-save-shell',
  templateUrl: './book-save-shell.component.html',
  styleUrls: ['./book-save-shell.component.css']
})
export class BookSaveShellComponent implements OnInit {

  cardTitle = "Add new book";

  bookForm = this.fb.group({
    isbn: ['', [Validators.required]],
    title: ['', [Validators.required]],
    pages: [0, [Validators.required]],
    description: ['', [Validators.required]],
  });

  book : Book = this.service.defaultBook();
  bookSubscription !: Subscription;
  // publisherDetailsSubscription !: Subscription;
  // authorDetailsSubscription !: Subscription;
  // genreDetailsSubscription !: Subscription;
  
  formSubmitSubject : Subject<Boolean> = new Subject();

  constructor(private service : BooksFrontendService, private fb : FormBuilder, private route : ActivatedRoute,
    private publisherService : PublishersFrontendService, private authorsService : AuthorsFrontendService,
    private genresService : GenresFrontendService) { }

  ngOnInit(): void {
    this.bookSubscription = this.route.params.pipe(
      concatMap(params => params["id"] ? this.service.getBookById(params["id"]) : EMPTY)
    ).subscribe({
      next: data => {
        if(data) this.populateBookForm(data);
      }
    });
  }

  getControl(controlName : string) : FormControl{
    return this.bookForm.get(controlName) as FormControl;
  }

  populateBookForm(book : Book) {
    this.book = book;

    this.bookForm.patchValue({
      isbn: book.isbn13,
      title: book.title,
      pages: book.numPages,
      description: book.description,
    });

    this.bookForm.updateValueAndValidity();
  }

  submitForm() {
    let publisherType = this.getControl("publisher").get("publisherType")?.value;

    let selectedPublisher : number = this.getControl("publisher").get("publisherSelect")?.value;
    let publisher$ : Observable<Publisher> = this.publisherService.getPublisherById(selectedPublisher);

    let newPublisher : Publisher = this.publisherService.defaultPublisher();
    if(this.getControl("publisher").get("newPublisher")?.value) {
      newPublisher.publisherName = this.getControl("publisher").get("newPublisher")?.value;
      publisher$ = of(newPublisher);
    }

    let newAuthors : Author[] = this.getControl("authors").get("newAuthors")?.value.map((a : any) => {
      let author = this.authorsService.defaultAuthor();
      author.authorName = a.authorName;
      return author;
    });
    let selectedAuthors : number[] = this.getControl("authors").get("authorsSelect")?.value;
    let selectedAuthors$ : Observable<Author[]> = selectedAuthors.length ? this.authorsService.getAuthorsByIdLike(selectedAuthors) : of([]);
    let newAuthors$ : Observable<Author[]> = newAuthors.length ? this.authorsService.saveAuthors(newAuthors) : of([]);

    let newGenres : Genre[] = this.getControl("genres").get("newGenres")?.value.map((g : any) => {
      let genre = this.genresService.defaultGenre();
      genre.genreName = g.genreName;
      return genre;
    });
    let selectedGenres : number[] = this.getControl("genres").get("genresSelect")?.value;
    let selectedGenres$ : Observable<Genre[]> = selectedGenres.length ? this.genresService.getGenresByIdLike(selectedGenres) : of([]);
    let newGenres$ : Observable<Genre[]> = newGenres.length ? this.genresService.saveGenres(newGenres) : of([]);

    publisher$.pipe(
      concatMap(publisher => {
        this.book.publisher = publisher;
        return selectedAuthors$;
      }),
      concatMap((authors ?: Author[]) => {
        this.book.authors = authors?.length ? authors : [];
        return newAuthors$;
      }),
      concatMap((authors ?: Author[]) => {
        this.book.authors = authors?.length ? this.book.authors.concat(authors) : this.book.authors;
        return selectedGenres$;
      }),
      concatMap((genres ?: Genre[]) => {
        this.book.genres = genres?.length ? genres : [];
        return newGenres$;
      }),
      concatMap((genres ?: Genre[]) => {
        this.book.genres = genres?.length ? this.book.genres.concat(genres) : this.book.genres;
        return of(this.book);
      })
    ).subscribe({
      next: data => console.log(data)
    });
    
  }

}

export interface ChipItem {
  value: number;
  viewValue: string;
}
