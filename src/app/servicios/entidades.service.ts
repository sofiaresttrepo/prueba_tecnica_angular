import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Entidad } from '../interfaces/entidad';

@Injectable({
  providedIn: 'root'
})
export class EntidadesService {
  private apiUrl = 'http://127.0.0.1:8000/api/entidades';

  private _entidades = new BehaviorSubject<Entidad[]>([]);
  public entidades = () => this._entidades.value;
  public entidades$ = this._entidades.asObservable();
  public loading = () => false;

  constructor(private http: HttpClient) {}


  getAll(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(this.apiUrl).pipe(
      tap((entidades) => this._entidades.next(entidades))
    );
  }

  create(entidad: Entidad): Observable<Entidad> {
    const { id, ...data } = entidad; // Evita enviar un id
    return this.http.post<Entidad>(this.apiUrl, data).pipe(
      tap((nueva) => {
        this._entidades.next([...this._entidades.value, nueva]);
      })
    );
  }

  update(entidad: Entidad): Observable<Entidad> {
    return this.http.put<Entidad>(`${this.apiUrl}/${entidad.id}`, entidad).pipe(
      tap((entidadActualizada) => {
        const actualizadas = this._entidades.value.map(e =>
          e.id === entidadActualizada.id ? entidadActualizada : e
        );
        this._entidades.next(actualizadas);
      })
    );
  }

  delete(entidad: Entidad): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${entidad.id}`).pipe(
      tap(() => {
        const restantes = this._entidades.value.filter(e => e.id !== entidad.id);
        this._entidades.next(restantes);
      })
    );
  }
}