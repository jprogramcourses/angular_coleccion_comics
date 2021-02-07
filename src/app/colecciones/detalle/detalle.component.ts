import { Component, Input, OnInit } from '@angular/core';
import { Coleccion } from '../coleccion';
import { ColeccionService } from '../coleccion.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-coleccion',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() coleccion: Coleccion;
  titulo: string = "Imagen colección";
  fotoSeleccionada: File;
  modalService: ModalService;
  progreso: number = 0;

  constructor(private coleccionService: ColeccionService,
    modalService: ModalService,
    private activatedRoute: ActivatedRoute) {
      this.modalService = modalService;
  }

  ngOnInit() {
    /* this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if (id) {
        this.coleccionService.getColeccion(id).subscribe(coleccion => {
          this.coleccion = coleccion;
          console.log("onInit: " + coleccion.nombre);
        });
      }
    }); */
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error seleccionar imagen', 'El archivo seleccionado debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal.fire('Error Upload', 'Debe seleccionar una foto', 'error');
    } else {
      this.coleccionService.subirFoto(this.fotoSeleccionada, this.coleccion.idColeccion)
        .subscribe(event => {

          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.coleccion = response.coleccion as Coleccion;
            // this.coleccion = coleccion;

            // Emitir que se ha cambiado la foto
            this.modalService.notificarUpload.emit(this.coleccion);
            
            swal.fire('La foto se ha subido completamente', response.mensaje, 'success');
          }
        });
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    console.log("Cerrar modal en detalle " + this.modalService.modal);
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

}
