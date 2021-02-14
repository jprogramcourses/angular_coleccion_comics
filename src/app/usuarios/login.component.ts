import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: String = "Inicie sesión";
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire('Login', `Hola ${this.authService.usuario.username}, ya estás autenticado`, 'info');
      this.router.navigate(['/colecciones']);
    }
  }

  login(){
    console.log(this.usuario);
    if(this.usuario.username == null){
      Swal.fire('Error login', 'Username o password vacías', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['/colecciones']);
      Swal.fire('Login', `Hola ${usuario.username}, has inicialo la sesión`, 'success');
    }, err => {
      if(err.status == 400){
        Swal.fire('Error login', `Usuario o clave incorrecto`, 'error');
      }
    });
  }

}
