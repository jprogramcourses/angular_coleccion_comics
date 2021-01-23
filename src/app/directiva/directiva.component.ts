import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent {

  listaColecciones: string[] = ['Spiderman', 'Los Vengadores', 'Capitán América', 'Daredevil', 'Secret Wars'];

  habilitar: boolean = true;

  constructor() { }

  setHabilitar() : void {
    this.habilitar = (this.habilitar==true) ? false : true;
  }

}
