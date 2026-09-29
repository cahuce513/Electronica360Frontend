import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'https://electronica360api.vercel.app/servicios';

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  guardarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizarProducto(productoId: string, producto: Producto): Observable<Producto> {
    return this.http.patch<Producto>(
      `${this.apiUrl}/${productoId}`,
      producto
    );
  }

  eliminarProducto(productoId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${productoId}`
    );
  }
}