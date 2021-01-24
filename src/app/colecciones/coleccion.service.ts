import { Injectable } from '@angular/core';
import { COLECCION } from './colecciones.json';
import { Coleccion } from './coleccion';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {

  private urlEndPoint: string = 'http://localhost:8080/apicolec/colecciones';

  constructor(private http: HttpClient) { }

  getColecciones(): Observable<Coleccion[]> {
    // return of(COLECCION);
    // Primera forma para castear los resultados recibidos del servicio rest.
    // El resultado recibido se castea con get<Coleccion[]>:
    // return this.http.get<Coleccion[]>(this.urlEndPoint);
    // Segunda forma de castear los resultados, a través de un map
    // y una función lambda:
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Coleccion[])
    );
  }
}
