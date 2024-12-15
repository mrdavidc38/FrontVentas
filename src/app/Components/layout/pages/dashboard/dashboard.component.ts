import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from 'src/app/Services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit{
  totalIngresos = "0";
  totalVentas = "0";
  totalProductos = "0";


  ngOnInit(): void {
    this._dashboard.Resumen().subscribe({
      next: (data) =>{
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos;
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;

          const arrayChart: any[] = data.value.ventasUltimaSemana;
          
          
           const labelGrafico = arrayChart.map(labe => labe.fecha);
           const dataTem = arrayChart.map(data =>data.total)
           console.log(labelGrafico,dataTem);
         this.mostrarGraficos(labelGrafico,dataTem)
        }
      }
    })
  }

constructor(private _dashboard : DashboardService) {


}

mostrarGraficos(labelGraficos :any[], dataGraficos:any[])
{
  const chartBarras = new Chart('chartBarras',{
    type: 'bar',
    data:{
      labels:labelGraficos ,
      datasets:[{
        label:"# de ventas",
        data: dataGraficos,
        backgroundColor:[
          'rgba(54,162,235,0.2 )'
        ],
        borderColor:[
           'rgba(54,162,235,1 )'
        ]
        
      }]
    },
    options:{
      maintainAspectRatio:false,
      responsive: true,
      scales:{
        y:{
          beginAtZero: true
        }
      }
    }
  })
}
}
