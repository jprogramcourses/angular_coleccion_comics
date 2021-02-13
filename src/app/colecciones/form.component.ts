import { Component, OnInit } from '@angular/core';
import { Coleccion } from './coleccion';
import { ColeccionService } from './coleccion.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Creador } from './creador';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  coleccion: Coleccion = new Coleccion();
  creadores: Creador[];
  titulo: string = 'Nueva Colección';

  errores: string[];

  constructor(private coleccionService: ColeccionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarColeccion();

    this.coleccionService.getCreadores().subscribe(creadores => {
      this.creadores = creadores;
    });
  }

  cargarColeccion(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.coleccionService.getColeccion(id).subscribe((coleccion) => this.coleccion = coleccion);
      }
    })
  }

  public create(): void {
    console.log(this.coleccion);
    this.coleccionService.create(this.coleccion).subscribe(
      coleccion => {
        this.router.navigate(['/colecciones']);
        swal.fire('Nueva colección', `La colección ${coleccion.nombre} ha sido creada correctamente`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  update(): void {
    console.log(this.coleccion);
    this.coleccionService.update(this.coleccion).subscribe(
      json => {
        this.router.navigate(['/colecciones']);
        swal.fire('Colección actualizada', `La colección ${json.coleccion.nombre} se ha actualizado`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  compararCreador(o1: Creador, o2: Creador): boolean {
    if(o1 === undefined && o2 === undefined){
      return true;
    }

    // return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
    return o1 == null || o2 == null ? false : o1.id === o2.id;
  }

}
