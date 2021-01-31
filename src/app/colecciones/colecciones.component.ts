import { Component, OnInit } from '@angular/core';
import { Coleccion } from './coleccion';
import { ColeccionService } from './coleccion.service';
import Swal from 'sweetalert2';

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
          `success`
        )
      }
    )
  }

}
