import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/classes/producto/producto';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  url: string = 'https://spf-backend.rj.r.appspot.com/api/';

  // Headers
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Para solicitar la autorización de acceso a un recurso del backend mediante token
  private addAuthorization() {
    let token = this.authService.token;

    if (token != null && token != '') {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.httpHeaders;
  }

  // Obtener listado de productos a partir de una categoria paginados
  getProductsFromCategory(category: string, page: number): Observable<any> {
    return this.http.get<any>(`${this.url}productos/get/${category}/${page}`, {
      headers: this.addAuthorization(),
    });
  }

  // Obtener todos los productos activos, paginados
  getPagedProducts(page: number): Observable<any> {
    return this.http.get<any>(`${this.url}productos/get/page/${page}`, {
      headers: this.addAuthorization(),
    });
  }

  // Obtener todos los productos inactivos, paginados
  getInactiveProducts(): Observable<any> {
    return this.http.get<any>(`${this.url}productos/get/inactivo`, {
      headers: this.addAuthorization(),
    });
  }

  // Obtener un producto específico por su código
  getProductByCode(productCode: number) {
    return this.http.get<any>(`${this.url}productos/${productCode}`, {
      headers: this.addAuthorization(),
    });
  }

  // Crear un producto
  saveProduct(product: Producto): Observable<any> {
    return this.http.post<any>(`${this.url}productos`, product, {
      headers: this.addAuthorization(),
    });
  }

  // Agregar la imagen de un producto
  addProductImg(imageFile: File, productCode: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', imageFile);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if (token != null && token != '') {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }

    return this.http.post<any>(
      `${this.url}productos/imagen/${productCode}`,
      formData,
      {
        headers: httpHeaders,
      }
    );
  }

  // Modificar un producto
  updateProduct(product: Producto, code: number): Observable<any> {
    return this.http.put<any>(`${this.url}productos/update/${code}`, product, {
      headers: this.addAuthorization(),
    });
  }

  // Eliminar un producto (lógica)
  deleteProduct(producto: Producto): Observable<any> {
    return this.http.put(
      `${this.url}productos/delete/${producto.codigo}`,
      producto,
      {
        headers: this.addAuthorization(),
      }
    );
  
  }
  // Reintegrar un producto al sistema
  reintegrarProducto(producto: Producto): Observable<any> {
    return this.http.put(
      `${this.url}productos/integrate/${producto.codigo}`,
      producto,
      {
        headers: this.addAuthorization(),
      }
    );
  }

  getProductsFromCategoryList(category: string): Observable<any> {
    return this.http.get<any>(`${this.url}productos/get/${category}`, {
      headers: this.addAuthorization(),
    });
  }

  searchProducts(name: string): Observable<Producto[]> {
    let params = new HttpParams().set('nombre', name);
    return this.http.get<Producto[]>(`${this.url}productos/get/by-name`, {
      params,
      headers: this.addAuthorization(),
    });
  }

  searchInactiveProducts(name: string): Observable<Producto[]> {
    let params = new HttpParams().set('nombre', name);
    return this.http.get<Producto[]>(`${this.url}productos/get/inactive/by-name`, {
      params,
      headers: this.addAuthorization(),
    });
  }
}
