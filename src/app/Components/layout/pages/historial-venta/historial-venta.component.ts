import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Venta } from 'src/app/Interfaces/venta';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { VentaService } from 'src/app/Services/venta.service';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
export const MY_DATA_FORMATS ={
  parse:{
    dateIput:'DD/MM/YYYY'
  },
  display:{
    dateInput : 'DD/MM/YYYY',
    monthYearLabel :'MMMM YYYY'
  }
}
@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class HistorialVentaComponent implements OnInit {

  formularioBusqueda: FormGroup;
  opcionesBusqueda : any[] =[
    {value: "fecha", descripcion :"Por fechas"},
    {value: "numero", descripcion :"Numero Venta"},
  ];
  columnasTabla : string[] = ['fechaRegistro','numeroDocumento','tipoPago','total' ,'accion']
  dataInicio: Venta[] =[];
  datosListaVenta = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

constructor(
  private fb : FormBuilder,
  private dialog : MatDialog,
  private _ventaServicio : VentaService,
  private _utilidadServicio : UtilidadService
) {
this.formularioBusqueda = this.fb.group({
buscarPor:['fecha'],
numero:["0"],
fechaInicio:[''],
fechaFin:['']
})
// Set default dates to today
const today = moment();


this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(value =>{
  if(value == "numero")
  {
    this.formularioBusqueda.patchValue({
      numero:'',
      fechaInicio:'01/01/0000',
  fechaFin:'01/01/0000'
    })
  }
  else{
    this.formularioBusqueda.patchValue({
      numero:'0',
      fechaInicio:'',
  fechaFin:''
    }) 
  }
})
}

ngAfterViewInit(): void {
  this.datosListaVenta.paginator = this.paginacionTabla;
}
aplicarFiltroTabla(event : Event)
{
    const filterValue =(event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLocaleLowerCase();
}

buscarVentas()
{
  let _fechaInicio : string = "";
  let _fechaFin : string = "";

  if(this.formularioBusqueda.value.buscarPor === "fecha")
  {
    _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
    _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');
 

  }
  else
  {
    _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
    _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

  }
  if (_fechaInicio == "invalid date" || _fechaFin == "invalid date") {
    this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Oops!")
    return;
  }

  this._ventaServicio.Historial(
    this.formularioBusqueda.value.buscarPor,
    this.formularioBusqueda.value.numero,
    _fechaInicio,
    _fechaFin
  ).subscribe({
    next :(resp)=> {if(resp.status){
        this.datosListaVenta = resp.value
    }
    else{
      this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!")
    }
  },
  error : err =>{

  }  })
}


verDetalleVenta(_venta : Venta)
{
  this.dialog.open(ModalDetalleVentaComponent, {
    data:_venta,
    disableClose : true,
    width:'700px'

  })
}
}
