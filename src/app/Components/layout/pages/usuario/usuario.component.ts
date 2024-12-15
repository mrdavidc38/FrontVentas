import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/Interfaces/usuario';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit{
  columnasTabla : string[] = ['nombreCompleto','correo','rolDescripcion','estado','acciones'];
  dataInicio : Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
   
    constructor(private dialog : MatDialog
              , private _usuarioService : UsuarioService
              , private _utilidadService : UtilidadService
      )
  {

  }

  obtenerUsuarios()
  {
    this._usuarioService.lista().subscribe({
      next : (data) => {
          if(data.status)
          {
            this.dataListaUsuarios.data = data.value;
            this._utilidadService.mostrarAlerta("usuarios consultados", "Exito");
          
          }
          else{
            this._utilidadService.mostrarAlerta("no se pudo registrar el usuario", "Error"); 
              }
      },
      error: (e)=>{}
  
   });
  }
  aplicarFiltroTabla(event : Event)
  {
      const filterValue =(event.target as HTMLInputElement).value;
      this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }
  nuevoUsuario()
  {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose:true
    }).afterClosed().subscribe(
      data=>{
          if (data == "true") {
            this.obtenerUsuarios();
          }
      }
    );
  }

  editarUsuario(usuario : Usuario)
  {
    this.dialog.open(ModalUsuarioComponent, {
      disableClose:true,
      data : usuario
    }).afterClosed().subscribe(
      data=>{
          if (data == "true") {
            this.obtenerUsuarios();
          }
      }
    );
  }

  eliminarUsuario(usuario : Usuario)
  {
Swal.fire({
  title : "Deseas eliminar el usuario ?",
  text : usuario.nombreCompleto,
  icon : "warning",
  confirmButtonColor : '#3085d6',
  confirmButtonText : "si, eliminar",
  showCancelButton:true,
  cancelButtonColor : '#d33',
  cancelButtonText : "No., volver"
}).then((resultado)=>{
  if (resultado.isConfirmed) {
    this._usuarioService.eliminar(usuario.idUsuario).subscribe({
      next:(data)=>{
        if (data.status) {
          this._utilidadService.mostrarAlerta("El usuario feu eliminado", "ExExito");
          this.obtenerUsuarios();
        }
        else{
          this._utilidadService.mostrarAlerta("Mo se pudo eliminas el usuario", "Error")
        }
      },
      error:(e)=>{}
    })
  }
})
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }
  ngOnInit(): void {
    this.obtenerUsuarios();
  }


}
