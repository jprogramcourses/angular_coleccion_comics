import { Component, OnInit } from '@angular/core';
import { Coleccion } from './coleccion';
import { ColeccionService } from './coleccion.service';
import { ModalService } from './detalle/modal.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-colecciones',
  templateUrl: './colecciones.component.html'
})
export class ColeccionesComponent implements OnInit {

  colecciones: Coleccion[];
  paginador: any;
  coleccionSeleccionada: Coleccion;
  authService: AuthService;

  constructor(private coleccionService: ColeccionService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    authService: AuthService) {
      this.authService = authService;
     }

  ngOnInit(): void {

    // el activatedRoute se encarga de suscribir para comprobar cuándo cambia el parámetro
    // page en la ruta, para actualizar los valores
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      // Al comenzar, si page no tiene valor, se asigna automáticamente 0
      if (!page) {
        page = 0;
      }

      this.coleccionService.getColecciones(page)
        .pipe(
          tap(response => {
            console.log('ColeccionComponent: tap3');
            (response.content as Coleccion[]).forEach(coleccion => {
              console.log(coleccion.nombre);
            });
          })
        ).subscribe(
          response => {
            this.colecciones = response.content as Coleccion[];
            this.paginador = response;
          });
    }
    )

    this.modalService.notificarUpload.subscribe(coleccion => {
      this.colecciones = this.colecciones.map(coleccionOriginal => {
        if(coleccion.idColeccion == coleccionOriginal.idColeccion){
          coleccionOriginal.imagen = coleccion.imagen;
        }
        return coleccionOriginal;
      })
    })
  }

  delete(coleccion: Coleccion): void {

    Swal.fire({
      title: 'Are you sure?',
      text: `¿Está seguro de que desea eliminar la coleccion ${coleccion.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })

    this.coleccionService.delete(coleccion.idColeccion).subscribe(
      reponse => {
        this.colecciones = this.colecciones.filter(col => col !== coleccion)
        Swal.fire(
          'Colección eliminada',
          `La colección ${coleccion.nombre} ha sido eliminada`,
          'success'
        )
      }
    )
  }

  abrirModal(coleccion: Coleccion) {
    this.coleccionSeleccionada = coleccion;
    console.log("Abrir modal con " + this.coleccionSeleccionada.nombre);
    this.modalService.abrirModal();
  }

}
