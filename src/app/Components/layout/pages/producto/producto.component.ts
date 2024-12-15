import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';


import Swal from 'sweetalert2';
import { Producto } from 'src/app/Interfaces/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {

  columnasTabla : string[] = ['nombre','categoria','stock','precio','estado','acciones'];
  dataInicio : Producto[] = [];
  dataListaProductos = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;
   
  constructor(private dialog : MatDialog
    , private _Productoservice : ProductoService
    , private _utilidadService : UtilidadService
)
{

}

obtenerProductos()
{
  this._Productoservice.lista().subscribe({
    next : (data) => {
        if(data.status)
        {
          this.dataListaProductos.data = data.value;
          this._utilidadService.mostrarAlerta("Productos consultados", "Exito");
        
        }
        else{
          this._utilidadService.mostrarAlerta("no se pudo registrar el Productos", "Error"); 
            }
    },
    error: (e)=>{}

 });
}
aplicarFiltroTabla(event : Event)
{
    const filterValue =(event.target as HTMLInputElement).value;
    this.dataListaProductos.filter = filterValue.trim().toLocaleLowerCase();
}
nuevoProductos()
{
  this.dialog.open(ModalProductoComponent, {
    disableClose:true
  }).afterClosed().subscribe(
    data=>{
        if (data == "true") {
          this.obtenerProductos();
        }
    }
  );
}

editarProductos(Productos : Producto)
{
  this.dialog.open(ModalProductoComponent, {
    disableClose:true,
    data : Productos
  }).afterClosed().subscribe(
    data=>{
        if (data == "true") {
          this.obtenerProductos();
        }
    }
  );
}

eliminarProductos(Productos : Producto)
{
Swal.fire({
title : "Deseas eliminar el Productos ?",
text : "Productos.nombre",
icon : "warning",
confirmButtonColor : '#3085d6',
confirmButtonText : "si, eliminar",
showCancelButton:true,
cancelButtonColor : '#d33',
cancelButtonText : "No., volver"
}).then((resultado)=>{
if (resultado.isConfirmed) {
  this._Productoservice.eliminar(Productos.idProducto).subscribe({
    next:(data)=>{
      if (data.status) {
        this._utilidadService.mostrarAlerta("El Productos feu eliminado", "ExExito");
        this.obtenerProductos();
      }
      else{
        this._utilidadService.mostrarAlerta("Mo se pudo eliminas el Productos", "Error")
      }
    },
    error:(e)=>{}
  })
}
})
}

ngAfterViewInit(): void {
  this.dataListaProductos.paginator = this.paginacionTabla;
}
ngOnInit(): void {
  this.obtenerProductos();
}
}
