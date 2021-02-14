import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  authService: AuthService;

  constructor(authService: AuthService, private route: Router) {
    this.authService = authService;
   }

  ngOnInit(): void {
  }

  title: string = 'Página de cómics'

  logout(): void{
    this.authService.logout();
    Swal.fire("Logout", 'Ha cerrado la sesión', 'success');
    this.route.navigate(["/login"]);
  }

}
