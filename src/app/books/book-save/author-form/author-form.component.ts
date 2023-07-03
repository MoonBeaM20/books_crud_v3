import { Component, Input, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AuthorsFrontendService } from 'src/app/authors/service/frontend/authors-frontend.service';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { AuthorValidatorService } from 'src/app/authors/service/validator/author-validator.service';
import { ChipItem } from '../book-save-shell/book-save-shell.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject, concatMap, startWith } from 'rxjs';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Book } from '../../model/book';

@Component({
  selector: 'app-author-form',
  templateUrl: './author-form.component.html',
  styleUrls: ['./author-form.component.css']
})
export class AuthorFormComponent implements OnInit, OnChanges {

  faTrashCan = faTrashCan;

  @Input() parentForm !: FormGroup;
  @Input() book !: Book;
  
  @ViewChild("authorSearchInput") authorSearchInput !: ElementRef<HTMLInputElement>;
  separatorKeysCodes = [ENTER, COMMA];

  authorForm = this.fb.group({
    authorsSearch: [''],
    authorsSelect: [[] as number[], [Validators.required]],
    newAuthors: this.fb.array([])
  });

  filteredAuthors$ = this.getControl("authorsSearch").valueChanges.pipe(
    startWith<string>(""),
    concatMap(value => this.service.getAuthorsByNameLike(value || ""))
  );

  authorChips : ChipItem[] = [];

  constructor(private service : AuthorsFrontendService, private fb : FormBuilder, 
    private validator : AuthorValidatorService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    let book : Book = changes["book"].currentValue;
    
    this.authorForm.patchValue({
      authorsSelect: book.authors.map((a) => a.id)
    });

    this.authorChips = book.authors.map(a => ({value: a.id, viewValue: a.authorName} as ChipItem))

    this.parentForm.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.parentForm.addControl("authors", this.authorForm);
    this.authorForm.setParent(this.parentForm);
  }

  getControl(controlName : string) : FormControl {
    return this.authorForm.get(controlName) as FormControl;
  }

  get authorsFormArray() {
    return this.authorForm.get("newAuthors") as FormArray;
  }

  getFormArrayControl(group : string, control : string) : FormControl {
    return this.authorsFormArray.get(group)?.get(control) as FormControl;
  }

  removeAuthorChip(index : number) {
    this.authorChips.splice(index, 1);
  }

  handleAuthorOptionSelectedEvent(event : MatAutocompleteSelectedEvent) {
    if(!this.authorChips.find(c => c.value === event.option.value)) {
      this.authorChips.push({value: event.option.value, viewValue: event.option.viewValue});
      this.getControl("authorsSelect").setValue([...this.getControl("authorsSelect").value, event.option.value]);
    }
    this.authorSearchInput.nativeElement.value = "";
    this.getControl("authorsSearch").setValue(null);
  }

  addNewAuthorGroup() {
    this.authorsFormArray.push(this.newAuthorFormGroup());
  }

  removeAuthorGroup(index : number) {
    this.authorsFormArray.removeAt(index);
  }

  newAuthorFormGroup() {
    return this.fb.group({
      authorName: ['', [Validators.required, RxwebValidators.unique()], [this.validator.authorNameExists()]]
    });
  }

}
