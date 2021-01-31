import { Component, OnInit } from '@angular/core';
import { Coleccion } from './coleccion';
import { ColeccionService } from './coleccion.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  coleccion: Coleccion = new Coleccion();
  titulo: string = 'Nueva Colección';

  errores: string[];

  constructor(private coleccionService: ColeccionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarColeccion();
  }

  cargarColeccion() : void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.coleccionService.getColeccion(id).subscribe((coleccion) => this.coleccion = coleccion);
      }
    })
  }

  public create(): void {
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

  update(): void{
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

}
