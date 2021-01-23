import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Aplicación de comics';

  marvel: string = 'Comics Marvel';
  autor: string = 'Juan Díaz Sanjurjo';
}
