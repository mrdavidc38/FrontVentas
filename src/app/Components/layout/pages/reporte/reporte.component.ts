import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Reporte } from 'src/app/Interfaces/reporte';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { VentaService } from 'src/app/Services/venta.service';
import * as XLSX from "xlsx"
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  formularioFiltro : FormGroup;
  listaVentasReporte : Reporte[] =[];
  columnasTabla : string[] = ['fechaRegistro', 'numeroVenta', 'tipopago', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla! : MatPaginator;
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private _ventaServicio : VentaService,
    private _utilidadservice : UtilidadService
  ) {
   
    this.formularioFiltro = this.fb.group({
      fechaInicio:['', [Validators.required]],
      fechaFin:['',[Validators.required]]
      })
  }
  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas()
  {
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if (_fechaInicio == "invalid date" || _fechaFin == "invalid date") {
      this._utilidadservice.mostrarAlerta("Debe ingresar ambas fechas", "Oops!")
      return;
    }

    this._ventaServicio.Reporte(
      _fechaInicio,
      _fechaFin
    ).subscribe({
    next:(data) =>{
      if(data.status)
      {
        this.listaVentasReporte = data.value;
        this.dataVentaReporte.data  = data.value;
      }else{
        this.listaVentasReporte = [];
        this.dataVentaReporte.data = [];
        this._utilidadservice.mostrarAlerta("no se enontraron datos", "error")      }
    },
    error:(err) =>{

    }
    })
  }

  exportarExcel(){
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);

    XLSX.utils.book_append_sheet(wb,ws,"Reporte");
    XLSX.writeFile(wb,"Reporte ventas.xlsx");
  
  }
}
