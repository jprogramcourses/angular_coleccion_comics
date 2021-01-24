import { Component, OnInit } from '@angular/core';
import { Coleccion } from './coleccion';
import { ColeccionService } from './coleccion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  coleccion: Coleccion = new Coleccion();

  titulo: string = 'Nueva Colección';

  constructor(private coleccionService: ColeccionService,
    private router: Router) { }

  ngOnInit(): void {
  }

  public create(): void {
    this.coleccionService.create(this.coleccion).subscribe(
      response => this.router.navigate(['/colecciones'])
    );
  }

}
