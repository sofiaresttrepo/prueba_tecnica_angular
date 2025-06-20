import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contacto } from '../interfaces/contacto';

@Injectable({ providedIn: 'root' })
export class ContactosService {
  private apiUrl = 'http://127.0.0.1:8000/api/contactos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(this.apiUrl);
  }

  create(contacto: Contacto): Observable<Contacto> {
    return this.http.post<Contacto>(this.apiUrl, contacto);
  }

  update(contacto: Contacto): Observable<Contacto> {
    return this.http.put<Contacto>(`${this.apiUrl}/${contacto.id}`, contacto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}