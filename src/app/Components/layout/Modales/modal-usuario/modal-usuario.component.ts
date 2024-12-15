import { Component , Inject, OnInit, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.css']
})
export class ModalUsuarioComponent implements OnInit {
  
  formularioUsuario! : FormGroup;
  ocultarPassword : boolean = true;
  tituliAction : string = "Agregar";
  botonAction : string ="Guardar";
  listaRoles : Rol[] = [];

  constructor(private fb : FormBuilder, private modalActual :MatDialogRef<ModalUsuarioComponent>
    ,@Inject(MAT_DIALOG_DATA) public datosUsuario : Usuario
    , private _rolServicio : RolService
    ,private _usuarioServicio: UsuarioService
    ,private _utilidadService: UtilidadService)
  {
    this.formularioUsuario = fb.group({
      nombreCompleto :[,Validators.required],
      correo :[,Validators.required],
      idrol :[,Validators.required],
      clave :[,Validators.required],
      esActivo :["1",Validators.required],
    });

    if (this.datosUsuario != null) {
      this.tituliAction = "Editar";
      this.botonAction = "Guardar";

      this._rolServicio.lista().subscribe({
        next : (data) =>{
          if(data.status)
          {
              this.listaRoles = data.value;
          }
        },
        error: (e)=>{

        }
      })
    }else{
      this._rolServicio.lista().subscribe({
        next : (data) =>{
          if(data.status)
          {
              this.listaRoles = data.value;
          }
        },
        error: (e)=>{

        }
      })
    }
  }
  ngOnInit(): void {
    if(this.datosUsuario)
    {
        this.formularioUsuario.patchValue({
          nombreCompleto :this.datosUsuario.nombreCompleto,
          correo :this.datosUsuario.correo,
          idrol :this.datosUsuario.idRol,
          clave :this.datosUsuario.clave,
          esActivo :this.datosUsuario.esActivo.toString(),
        })
    }
  }

  guardarEditar_Usuario()
  {
    const usuario : Usuario = {
      idUsuario: this.datosUsuario == null || undefined ?0 : 1,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.get('idrol')?.value,
      rolDescription: this.formularioUsuario.value.rolDescription,
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.idRol) ,
    }

    if(this.datosUsuario == null)
    {
       this._usuarioServicio.guardar(usuario).subscribe({
          next : (data) => {
              if(data.status)
              {
                this._utilidadService.mostrarAlerta("el usuario fue registrasdo", "Exito");
                this.modalActual.close("true");
              }
              else{
                this._utilidadService.mostrarAlerta("no se pudo registrar el usuario", "Error"); 
                  }
          },
          error: (e)=>{}
      
       });
    }
    else{
      this._usuarioServicio.editar(usuario).subscribe({
        next : (data) => {
            if(data.status)
            {
              this._utilidadService.mostrarAlerta("el usuario fue registrasdo", "Exito");
              this.modalActual.close("true");
            }
            else{
              this._utilidadService.mostrarAlerta("no se pudo registrar el usuario", "Error"); 
                }
        },
        error: (e)=>{}
    
     });
    }
  }

  modalCLose()
  {
    this.modalActual.close();
  }

}
