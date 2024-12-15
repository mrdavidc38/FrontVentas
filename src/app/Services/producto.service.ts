import { Injectable } from '@angular/core';
import { ResponseApi } from '../Interfaces/response-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../Interfaces/login';
import { Usuario } from '../Interfaces/usuario';
import { Producto } from '../Interfaces/producto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlApi = environment.endopoint + "Producto/"
  constructor(private http : HttpClient)
   { 

   }
   lista():Observable<ResponseApi>
   {
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
   }

   guardar(request : Producto): Observable<ResponseApi>
   {
     return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
   }

   editar(request : Producto): Observable<ResponseApi>
   {
     return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
   }

   eliminar(id : number): Observable<ResponseApi>
   {
     return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
   }
}
