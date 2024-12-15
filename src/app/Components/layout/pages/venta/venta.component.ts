import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

listaProducto: Producto[] = [];
listaProductosFiltro : Producto[] = [];

listaProductosParaVenta : DetalleVenta[] = [];
bloquearBotonRegistrar : boolean = false;

productoSeleccionado! : Producto;
tipodePagoPorDefecto : string = "Efectivo";
totalPagar : number = 0;

formularioProductoVenta! : FormGroup;
columnasTabla : string[] = ['producuto', 'cantidad', 'precio', 'total', 'accion'];
datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
 
retornarProductosPorFiltro(busqueda : any): Producto[]
{
const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();

return this.listaProducto.filter(item => item.nombre?.toLocaleLowerCase().includes(valorBuscado));
}
constructor(private dialog : MatDialog
  , private _ventaService : VentaService,
  private _productoService : ProductoService
  ,private _utilidadService : UtilidadService
  ,private _fb : FormBuilder
) {
  
  this.formularioProductoVenta = _fb.group({
    producto : ["", Validators.required],
    cantidad : ["", Validators.required]
})

this._productoService.lista().subscribe({
  next : (data) =>{
    if(data.status)
    {
        const lista = data.value as Producto[];
        this.listaProducto = lista.filter(pro => pro.esActivo == 1 && pro.stock > 0  ) ;
    }
  },
  error: (e)=>{

  }
})

this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
    this.listaProductosFiltro = this.retornarProductosPorFiltro(value)
})
}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  mostrarProducto(producto : Producto): string{
    return producto.nombre
  }
  productoParaVenta(event : any)
  {
    this.productoSeleccionado = event.option.value
  }

  agregarProductoParaVenta()
  {
    const _cantidad = this.formularioProductoVenta.value.cantidad;
    const _precio = parseFloat(this.productoSeleccionado.precio.toString());
    const _total = _cantidad * _precio;
    this.totalPagar = this.totalPagar +_total;

  this.listaProductosParaVenta.push({
  idProducto : this.productoSeleccionado.idProducto,
  descriptionProducto : this.productoSeleccionado.nombre,
  cantidad : _cantidad,
  precioTexto : String(_precio.toFixed(2)),
  totalTexto : String(_total.toFixed(2))

})

this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
this.formularioProductoVenta.patchValue({
  producto : "",
  cantidad: ""
})
  }

   eliminarProducto0(detalle : DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto != detalle.idProducto)
    
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);




  }

  registrarVenta()
  {
    if(this.listaProductosParaVenta.length > 0)
    {
      // this.bloquearBotonRegistrar = true;
      const request : Venta = {
        tipoPago: this.tipodePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosParaVenta,
        idVenta: 0,
        numeroDocumento: null,
        fechaRegistro: null
      }
  
      this._ventaService.registrar(request).subscribe(resp =>{
        if(resp.status)
        {
          this.totalPagar = 0.00;
          this.listaProductosParaVenta = [];
          this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
          Swal.fire({
            icon : 'success',
            title : 'Venta registrada',
            text : `Numero de venta ${resp.value.numeroDocumento}`
          })
  
          this.bloquearBotonRegistrar = false;
        }else{
          this._utilidadService.mostrarAlerta("No se pudo registrar", "No")
        }
  
  
         
      })
    }

  }



}
