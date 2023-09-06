import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AgenteService {

  private url = 'http://localhost:8084/api/v1/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'text/xml' })
  };

  constructor(private http: HttpClient) { }

  importAgente(file: any): Observable<HttpEvent<any>>  {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(this.url+'agente', new Blob([file]), this.httpOptions)
    .pipe(
      tap((importAgent: any) => console.log(`importAgente w/ `)),
      catchError(this.handleError<any>())
    );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {            
      console.log(`falhou: ${error.message}`);
      return of(result as T);
    };
  }
}
