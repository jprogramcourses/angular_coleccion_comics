import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal:boolean = false;

  // Para notificar y actualizar la vista automáticamente cuando se realiza una subida de imagen
  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  get notificarUpload(): EventEmitter<any>{
    return this._notificarUpload;
  }

  abrirModal(){
    this.modal = true;
    console.log("Modal service open " + this.modal);
  }

  cerrarModal(){
    this.modal = false;
    console.log("Modal service close " + this.modal);
  }
}
