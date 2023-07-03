import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Input } from '@angular/core';
import { Subscription, concatMap, startWith } from 'rxjs';
import { PublishersFrontendService } from 'src/app/publishers/service/frontend/publishers-frontend.service';
import { PublisherValidatorService } from 'src/app/publishers/service/validator/publisher-validator.service';
import { Book } from '../../model/book';

@Component({
  selector: 'app-publisher-form',
  templateUrl: './publisher-form.component.html',
  styleUrls: ['./publisher-form.component.css']
})
export class PublisherFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() parentForm !: FormGroup;
  @Input() book !: Book;

  publisherTypeSubscription !: Subscription;
  
  publisherForm = this.fb.group({
    publisherType: ['existing'],
    publisherSelect: [0, [Validators.min(1)]],
    publisherSearch: [''],
    publicationDate: [new Date(), [Validators.required]],
    newPublisher: ['']
  });

  constructor(private service : PublishersFrontendService, private fb : FormBuilder, 
    private validator : PublisherValidatorService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    let book : Book = changes["book"].currentValue;

    this.publisherForm.patchValue({
      publisherSelect: book.publisher.id,
      publicationDate: book.publicationDate
    });

    this.parentForm.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.parentForm.addControl("publisher", this.publisherForm);
    this.publisherForm.setParent(this.parentForm);

    this.publisherTypeSubscription = this.getControl("publisherType").valueChanges.subscribe({
      next: value => {
        if(this.getControl("publisherType").value === "existing") {
          this.getControl("publisherSelect").setValidators(Validators.min(1));
    
          this.getControl("newPublisher").clearValidators();
          this.getControl("newPublisher").clearAsyncValidators();
        }else {
          this.getControl("newPublisher").setValidators(Validators.required);
          this.getControl("newPublisher").setAsyncValidators(this.validator.publisherNameExists());
    
          this.getControl("publisherSelect").clearValidators();
        }
        this.getControl("newPublisher").updateValueAndValidity();
        this.getControl("publisherSelect").updateValueAndValidity();
      }
    });
  }

  filteredPublishers$ = this.getControl("publisherSearch").valueChanges.pipe(
    startWith<string>(''),
    concatMap(value => this.service.getPublishersByNameLike(value || ''))
  );

  getControl(controlName : string) : FormControl {
    return this.publisherForm.get(controlName) as FormControl;
  }

  ngOnDestroy(): void {
    this.publisherTypeSubscription.unsubscribe();
  }

}
