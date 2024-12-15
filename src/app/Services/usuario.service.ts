import { Injectable } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { ResponseApi } from '../Interfaces/response-api';
import { Observable } from 'rxjs';
import { Login } from '../Interfaces/login';
import { Usuario } from '../Interfaces/usuario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApi = environment.endopoint + "Usuario/"
  constructor(private http : HttpClient)
   { 

   }

   iniciarSesion(request : Login): Observable<ResponseApi>
   {
     ;
     return this.http.post<ResponseApi>(`${this.urlApi}iniciarSesion`, request)
   }
   lista():Observable<ResponseApi>
   {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
   }

   guardar(request : Usuario): Observable<ResponseApi>
   {
     return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
   }

   editar(request : Usuario): Observable<ResponseApi>
   {
     return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
   }

   eliminar(id : number): Observable<ResponseApi>
   {
     return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
   }
}
