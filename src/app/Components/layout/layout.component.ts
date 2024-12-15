import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/Interfaces/menu';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { MenuService } from 'src/app/Services/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  listaMenu : Menu[] = [];
  coreoUsuario:string = '';
  rolUsuario:string = '';
  /**
   *
   */
  constructor(
    private router : Router,
    private _menuServicio : MenuService,
    private _utilidadservice   : UtilidadService
  ) {
   
    
  }
  ngOnInit(): void {
   const usuario = this._utilidadservice.obtenerSesionUsuario();

   if(usuario != null)
   {
     this.coreoUsuario = usuario.correo;
     this.rolUsuario = usuario.rolDescription;

     this._menuServicio.lista(usuario.idUsuario).subscribe({
      next: (data) =>{
        if(data.status)this.listaMenu = data.value;
      },
      error:(e) =>{

      }
     })
   }
  }

  cerrarSesion()
  {
    this._utilidadservice.eliminarSesionUsuario();
    this.router.navigate(['login'])
  }
}
