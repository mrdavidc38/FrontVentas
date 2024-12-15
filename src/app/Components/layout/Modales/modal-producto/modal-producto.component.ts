import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/Interfaces/categoria';
import { Producto } from 'src/app/Interfaces/producto';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { CategoriaService } from 'src/app/Services/categoria.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { RolService } from 'src/app/Services/rol.service';
import { UsuarioService } from 'src/app/Services/usuario.service';


@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.css']
})
export class ModalProductoComponent implements
OnInit {
  formularioProducto! : FormGroup;
  tituliAction : string = "Agregar";
  botonAction : string ="Guardar";
  listaCategorias : Categoria[] = [];
  constructor(private fb : FormBuilder
    , private modalActual :MatDialogRef<ModalProductoComponent>
    ,@Inject(MAT_DIALOG_DATA) public datosProducto : Producto
    // , private _rolServicio : RolService
    // ,private _usuarioServicio: UsuarioService
    ,private _utilidadService: UtilidadService
    ,private _categoriaService: CategoriaService,
    private _productoService : ProductoService
  )
    {
      this.formularioProducto = this.fb.group({
        nombre : ["", Validators.required],
        idCategoria : ["", Validators.required],
        stock : ["", Validators.required],
        precio : ["", Validators.required],
        esActivo : ["1", Validators.required],

      })

      if (this.datosProducto != null) {
        this.tituliAction = "Editar";
        this.botonAction = "Guardar";
      }

      this._productoService.lista().subscribe({
        next : (data) =>{
          if(data.status)
          {
          
              this.listaCategorias = data.value;
          }
        },
        error: (e)=>{

        }
      })
    }
  ngOnInit(): void {
    if(this.datosProducto)
      {
          this.formularioProducto.patchValue({
            nombre :this.datosProducto.nombre,
            idCategoria :this.datosProducto.idCategoria,
            stock :this.datosProducto.stock,
            precio :this.datosProducto.precio,
            esActivo :this.datosProducto.esActivo
          })
      }
  }

  guardarEditar()
  {

    const _producto : Producto = {
      idProducto: this.formularioProducto == null || undefined ?0 : 1,
      nombre: this.formularioProducto.value.nombreCompleto,
      idCategoria: this.formularioProducto.value.idCategoria,
      descriptionCategoria: "",
      precio: this.formularioProducto.value.precio,
      stock: this.formularioProducto.value.stock,
      esActivo: parseInt(this.formularioProducto.value.idRol) ,
    }

    if(this.datosProducto == null)
    {
       this._productoService.guardar(_producto).subscribe({
          next : (data) => {
              if(data.status)
              {
                this._utilidadService.mostrarAlerta("el producto fue registrasdo", "Exito");
                this.modalActual.close("true");
              }
              else{
                this._utilidadService.mostrarAlerta("no se pudo registrar el producto", "Error"); 
                  }
          },
          error: (e)=>{}
      
       });
    }
    else{
      this._productoService.editar(_producto).subscribe({
        next : (data) => {
            if(data.status)
            {
              this._utilidadService.mostrarAlerta("el prodcuto fue registrasdo", "Exito");
              this.modalActual.close("true");
            }
            else{
              this._utilidadService.mostrarAlerta("no se pudo registrar el prodcuto", "Error"); 
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
