import { Component, OnInit } from '@angular/core';
import { Coleccion } from './coleccion';
import { ColeccionService } from './coleccion.service';

@Component({
  selector: 'app-colecciones',
  templateUrl: './colecciones.component.html'
})
export class ColeccionesComponent implements OnInit {

  colecciones: Coleccion[];

  constructor(private coleccionService: ColeccionService) { }

  ngOnInit(): void {
    this.coleccionService.getColecciones().subscribe(
      colecciones => this.colecciones = colecciones
    );
  }

}
