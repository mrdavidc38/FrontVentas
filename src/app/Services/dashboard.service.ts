import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private urlApi = environment.endopoint + "Dashboard/"
  constructor(private http : HttpClient){}

  Resumen():Observable<ResponseApi>
  {
   return this.http.get<ResponseApi>(`${this.urlApi}Resumen`)
  }
}
