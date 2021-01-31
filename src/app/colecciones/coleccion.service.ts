import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { COLECCION } from './colecciones.json';
import { Coleccion } from './coleccion';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {

  private urlEndPoint: string = 'http://localhost:8080/apicolec/colecciones';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  getColecciones(): Observable<Coleccion[]> {
    // return of(COLECCION);
    // Primera forma para castear los resultados recibidos del servicio rest.
    // El resultado recibido se castea con get<Coleccion[]>:
    // return this.http.get<Coleccion[]>(this.urlEndPoint);
    // Segunda forma de castear los resultados, a través de un map
    // y una función lambda:
    return this.http.get(this.urlEndPoint).pipe(
      tap(response => {
        let colecciones = response as Coleccion[];
        console.log('ColeccionService: tap1');
        colecciones.forEach(coleccion => {
          console.log(coleccion.nombre);
        })
      }),
      map(response => {
        let colecciones = response as Coleccion[];

        return colecciones.map(coleccion => {
          coleccion.nombre = coleccion.nombre.toUpperCase();
          let datePipe = new DatePipe('es');
          // Opciones para formatear la fecha desde el componente. Alternativa es hacerlo en la vista
          // coleccion.createAt = formatDate(coleccion.createAt, 'dd-MM-yyyy',"en-US");
          // coleccion.createAt = datePipe.transform(coleccion.createAt, 'EEEE, dd-MM-yyyy');
          return coleccion;
        });
      }),
      tap(response => {
        console.log('ColeccionService: tap2');
        response.forEach(coleccion => {
          console.log(coleccion.nombre);
        })
      })
    );
  }

  create(coleccion: Coleccion): Observable<Coleccion> {
    return this.http.post(this.urlEndPoint, coleccion, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.coleccion as Coleccion),
      catchError(e => {

        // Se envían los errores al componente, para que los gestione
        if (e.status == 400) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getColeccion(id): Observable<Coleccion> {
    return this.http.get<Coleccion>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/colecciones']);
        console.error(e);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  update(coleccion: Coleccion): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${coleccion.idColeccion}`,
      coleccion,
      { headers: this.httpHeaders }).pipe(
        catchError(e => {

          // Se envían los errores al componente, para que los gestione
          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Coleccion> {
    return this.http.delete<Coleccion>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
