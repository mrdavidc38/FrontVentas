import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import {HttpClient} from '@angular/common/http';
import { ResponseApi } from '../Interfaces/response-api';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


export class RolService {

  private urlApi = environment.endopoint + "Rol/"
  constructor(private http : HttpClient){}

  lista():Observable<ResponseApi>
  {
   return this.http.get<ResponseApi>(`${this.urlApi}lista`)
  }
}
