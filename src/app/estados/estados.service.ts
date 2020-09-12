import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Estado } from './estado.model';
import { environment } from '../../environments/environment';

const BACKEND_ESTADOS_URL = environment.apiUrl + '/estados/';

@Injectable({ providedIn: 'root' })
export class EstadosService {
  private estados: Estado[] = [];
  private estadosUpdated = new Subject<Estado[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getEstados() {
    this.http
      .get<{ message: string; estados: any }>(BACKEND_ESTADOS_URL)
      .pipe(
        map((data) => {
          return data.estados.map((estado) => {
            return {
              id: estado._id,
              nome: estado.nome,
              abreviacao: estado.abreviacao,
              data_criacao: new Date(estado.data_criacao).toLocaleString('pt'),
              data_ultima_alteracao: new Date(
                estado.data_ultima_alteracao
              ).toLocaleString('pt'),
            };
          });
        })
      )
      .subscribe(
        (transformedEstados) => {
          this.estados = transformedEstados;
          this.estadosUpdated.next([...this.estados]);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getEstadoUpdateListener() {
    return this.estadosUpdated.asObservable();
  }

  getEstado(id: string) {
    return this.http.get<{ _id: string; nome: string; abreviacao: string }>(
      BACKEND_ESTADOS_URL + id
    );
  }

  addEstado(nome: string, abreviacao: string) {
    const estado: Estado = { id: null, nome, abreviacao };
    this.http
      .post<{ message: string; estadoId: string }>(BACKEND_ESTADOS_URL, estado)
      .subscribe(
        (responseData) => {
          const id = responseData.estadoId;
          estado.id = id;
          this.estados.push(estado);
          this.estadosUpdated.next([...this.estados]);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  updateEstado(id: string, nome: string, abreviacao: string) {
    const estado: Estado = { id, nome, abreviacao };
    this.http.put(BACKEND_ESTADOS_URL + id, estado).subscribe(
      (response) => {
        const updatedEstados = [...this.estados];
        const oldEstadoIndex = updatedEstados.findIndex(
          (p) => p.id === estado.id
        );
        updatedEstados[oldEstadoIndex] = estado;
        this.estados = updatedEstados;
        this.estadosUpdated.next([...this.estados]);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteEstado(estadoId: string) {
    this.http.delete(BACKEND_ESTADOS_URL + estadoId).subscribe(
      () => {
        const updatedEstados = this.estados.filter(
          (estado) => estado.id !== estadoId
        );
        this.estados = updatedEstados;
        this.estadosUpdated.next([...this.estados]);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
