import { Creador } from "./creador";

export class Coleccion {

    idColeccion: number;
    nombre: string;
    numerosTotales: number;
    numerosDisponibles: number;
    listadoNumeros: number[];
    createAt: string;
    imagen: string;
    creador: Creador
}
