import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { concatMap, startWith } from 'rxjs';
import { GenresFrontendService } from 'src/app/genres/service/frontend/genres-frontend.service';
import { GenreValidatorService } from 'src/app/genres/service/validator/genre-validator.service';
import { ChipItem } from '../book-save-shell/book-save-shell.component';
import { Book } from '../../model/book';

@Component({
  selector: 'app-genre-form',
  templateUrl: './genre-form.component.html',
  styleUrls: ['./genre-form.component.css']
})
export class GenreFormComponent implements OnInit, OnChanges {

  faTrashCan = faTrashCan;

  @Input() parentForm !: FormGroup;
  @Input() book !: Book;

  @ViewChild("genreSearchInput") genreSearchInput !: ElementRef<HTMLInputElement>;
  separatorKeysCodes = [ENTER, COMMA];

  genreForm = this.fb.group({
    genresSearch: [''],
    genresSelect: [[] as number[], [Validators.required]],
    newGenres: this.fb.array([])
  });

  filteredGenres$ = this.getControl("genresSearch").valueChanges.pipe(
    startWith<string>(""),
    concatMap(value => this.service.getGenresByNameLike(value || ""))
  );

  genreChips : ChipItem[] = [];

  constructor(private service : GenresFrontendService, private fb : FormBuilder, 
    private validator : GenreValidatorService) { }

  ngOnChanges(changes: SimpleChanges): void {
    let book : Book = changes["book"].currentValue;
    
    this.genreForm.patchValue({
      genresSelect: book.genres.map((g) => g.id)
    });

    this.genreChips = book.genres.map(g => ({value: g.id, viewValue: g.genreName} as ChipItem))

    this.parentForm.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.parentForm.addControl("genres", this.genreForm);
    this.genreForm.setParent(this.parentForm);
  }

  getControl(controlName : string) : FormControl {
    return this.genreForm.get(controlName) as FormControl;
  }

  get genresFormArray() {
    return this.genreForm.get("newGenres") as FormArray;
  }

  getFormArrayControl(group : string, control : string) : FormControl {
    return this.genresFormArray.get(group)?.get(control) as FormControl;
  }

  removeGenreChip(index : number) {
    this.genreChips.splice(index, 1);
  }

  handleGenreOptionSelectedEvent(event : MatAutocompleteSelectedEvent) {
    if(!this.genreChips.find(c => c.value === event.option.value)) {
      this.genreChips.push({value: event.option.value, viewValue: event.option.viewValue});
      this.getControl("genresSelect").setValue([...this.getControl("genresSelect").value, event.option.value]);
    }
    this.genreSearchInput.nativeElement.value = "";
    this.getControl("genresSearch").setValue(null);
  }

  addNewGenreGroup() {
    this.genresFormArray.push(this.newGenreFormGroup());
  }

  removeGenreGroup(index : number) {
    this.genresFormArray.removeAt(index);
  }

  newGenreFormGroup() {
    return this.fb.group({
      genreName: ['', [Validators.required, RxwebValidators.unique()], [this.validator.genreNameExists()]]
    });
  }

}
