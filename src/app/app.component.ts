import { Component } from '@angular/core';
import { faDatabase } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bookstore_manager';
  faDatabase = faDatabase;
}
