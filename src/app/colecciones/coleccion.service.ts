import { Injectable } from '@angular/core';
import { COLECCION } from './colecciones.json';
import { Coleccion } from './coleccion';
import { Observable , of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {

  constructor() { }

  getColecciones() : Observable<Coleccion[]>{
    return of(COLECCION);
  }
}
