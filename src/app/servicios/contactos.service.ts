import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Contacto } from '../interfaces/contacto';

@Injectable({ providedIn: 'root' })
export class ContactosService {
  private apiUrl = 'http://127.0.0.1:8000/api/contactos';
  
  private _contactos = new BehaviorSubject<Contacto[]>([]);
  public contactos$ = this._contactos.asObservable();
  public contactos = () => this._contactos.value;
  public loading = () => false;

  constructor(private http: HttpClient) {}


  getAll(): Observable<Contacto[]> {
    return this.http.get<Contacto[]>(this.apiUrl).pipe(
      tap((contactos) => this._contactos.next(contactos))
    );
  }

  create(contacto: Contacto): Observable<Contacto> {
    return this.http.post<Contacto>(this.apiUrl, contacto).pipe(
      tap((nuevo) => {
        this._contactos.next([...this._contactos.value, nuevo]);
      })
    );
  }

  update(contacto: Contacto): Observable<Contacto> {
    return this.http.put<Contacto>(`${this.apiUrl}/${contacto.id}`, contacto).pipe(
      tap((contactoActualizado) => {
        const actualizados = this._contactos.value.map(c =>
          c.id === contactoActualizado.id ? contactoActualizado : c
        );
        this._contactos.next(actualizados);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const restantes = this._contactos.value.filter(c => c.id !== id);
        this._contactos.next(restantes);
      })
    );
  }
}