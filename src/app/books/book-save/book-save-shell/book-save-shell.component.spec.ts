import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSaveShellComponent } from './book-save-shell.component';

describe('BookSaveShellComponent', () => {
  let component: BookSaveShellComponent;
  let fixture: ComponentFixture<BookSaveShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookSaveShellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookSaveShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
