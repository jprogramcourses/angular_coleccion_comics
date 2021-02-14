import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { COLECCION } from './colecciones.json';
import { Coleccion } from './coleccion';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Creador } from './creador';
import { AuthService } from '../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {

  private urlEndPoint: string = 'http://localhost:8080/apicolec/colecciones';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private agregarAutorizationHeader(){
    let token = this.authService.token;
    if(token != null){
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e): boolean {
    if (e.status == 401) {

      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }

      this.router.navigate(['/login']);
      return true;
    }

    if (e.status == 403) {
      swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username}, no tienes permiso`, 'warning');
      this.router.navigate(['/colecciones']);
      return true;
    }

    return false;
  }

  getCreadores(): Observable<Creador[]> {
    return this.http.get<Creador[]>(this.urlEndPoint + '/creadores', {headers: this.agregarAutorizationHeader()})
      .pipe(
        catchError(e => {
          this.isNoAutorizado(e);
          return throwError(e);
        })
      );
  }

  getColecciones(page: number): Observable<any> {
    // return of(COLECCION);
    // Primera forma para castear los resultados recibidos del servicio rest.
    // El resultado recibido se castea con get<Coleccion[]>:
    // return this.http.get<Coleccion[]>(this.urlEndPoint);
    // Segunda forma de castear los resultados, a través de un map
    // y una función lambda:
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ColeccionService: tap1');
        (response.content as Coleccion[]).forEach(coleccion => {
          console.log(coleccion.nombre);
        })
      }),
      map((response: any) => {

        (response.content as Coleccion[]).map(coleccion => {
          coleccion.nombre = coleccion.nombre.toUpperCase();
          // let datePipe = new DatePipe('es');
          // Opciones para formatear la fecha desde el componente. Alternativa es hacerlo en la vista
          // coleccion.createAt = formatDate(coleccion.createAt, 'dd-MM-yyyy',"en-US");
          // coleccion.createAt = datePipe.transform(coleccion.createAt, 'EEEE, dd-MM-yyyy');
          return coleccion;
        });
        return response;
      }),
      tap(response => {
        console.log('ColeccionService: tap2');
        (response.content as Coleccion[]).forEach(coleccion => {
          console.log(coleccion.nombre);
        })
      })
    );
  }

  create(coleccion: Coleccion): Observable<Coleccion> {
    return this.http.post(this.urlEndPoint, coleccion, { headers: this.agregarAutorizationHeader() }).pipe(
      map((response: any) => response.coleccion as Coleccion),
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }

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
    return this.http.get<Coleccion>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAutorizationHeader()}).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }

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
      { headers: this.agregarAutorizationHeader() }).pipe(
        catchError(e => {

          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }

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
    return this.http.delete<Coleccion>(`${this.urlEndPoint}/${id}`, { headers: this.agregarAutorizationHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }

        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, idColeccion): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", idColeccion);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if(token != null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );

  }
}
