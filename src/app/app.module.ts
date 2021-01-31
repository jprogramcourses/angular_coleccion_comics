import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ColeccionesComponent } from './colecciones/colecciones.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './colecciones/form.component';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// Configuración del locale. Se hace aquí para que quede configurado de manera global
registerLocaleData(localeEs, 'es');

const routes: Routes = [
  { path: '', redirectTo: '/colecciones', pathMatch: 'full' },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'colecciones', component: ColeccionesComponent },
  { path: 'colecciones/form', component: FormComponent },
  { path: 'colecciones/form/:id', component: FormComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ColeccionesComponent,
    FormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
