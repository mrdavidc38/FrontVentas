import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formularioLogin! : FormGroup;
  ocultarPassword : boolean = true;
  monstrarLoadinfg : boolean = false;

  constructor(private fb : FormBuilder, private router : Router
    ,private _usuarioService : UsuarioService
    ,private _utilidadServicio: UtilidadService )
  {
this.formularioLogin = fb.group({
  email : [, Validators.required],
  password : [, Validators.required]
})
  }
  ngOnInit(): void {

  }


 iniciarSesion()
 {
  this.monstrarLoadinfg = true;
  const reques : Login = {
    Correo : this.formularioLogin.value.email,
    Clave : this.formularioLogin.value.password
  }
 ;
  this._usuarioService.iniciarSesion(reques).subscribe({
    next:(data) => {
      if(data.status)
      {
        this._utilidadServicio.guardarSesionUsuario(data.value);
        this.router.navigate(["pages"])
      }
      else{
        this._utilidadServicio.mostrarAlerta("no se encontró el usuario", "Opps!");
      }
    },
    complete: () =>{
      this.monstrarLoadinfg = false;
        } 
        ,
        error:()=>
        {
          this.monstrarLoadinfg = false;
          this._utilidadServicio.mostrarAlerta("hubo un error", "Opps!")
        }
  });
 }
 
}
