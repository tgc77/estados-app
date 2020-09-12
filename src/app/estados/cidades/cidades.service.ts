import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Cidade } from './cidade.model';
import { environment } from '../../../environments/environment';

const BACKEND_CIDADES_URL = environment.apiUrl + '/cidades/';

@Injectable({ providedIn: 'root' })
export class CidadesService {
  private cidades: Cidade[] = [];
  private cidadesUpdated = new Subject<Cidade[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getCidades(estadoId: string) {
    this.http
      .get<{ message: string; cidades: any }>(BACKEND_CIDADES_URL + estadoId)
      .pipe(
        map((data) => {
          return data.cidades.map((cidade) => {
            return {
              id: cidade._id,
              nome: cidade.nome,
              data_criacao: new Date(cidade.data_criacao).toLocaleString('pt'),
              data_ultima_alteracao: new Date(
                cidade.data_ultima_alteracao
              ).toLocaleString('pt'),
            };
          });
        })
      )
      .subscribe(
        (transformedCidades) => {
          this.cidades = transformedCidades;
          this.cidadesUpdated.next([...this.cidades]);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getCidadeUpdateListener() {
    return this.cidadesUpdated.asObservable();
  }

  getCidade(estadoId: string, id: string) {
    return this.http.get<{ _id: string; nome: string }>(
      BACKEND_CIDADES_URL + estadoId + '/' + id
    );
  }

  addCidade(nome: string, estadoId: string) {
    const cidade: Cidade = { id: null, nome, estadoId };
    this.http
      .post<{ message: string; cidadeId: string }>(BACKEND_CIDADES_URL, cidade)
      .subscribe(
        (responseData) => {
          const id = responseData.cidadeId;
          cidade.id = id;
          this.cidades.push(cidade);
          this.cidadesUpdated.next([...this.cidades]);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  updateCidade(id: string, nome: string, estadoId: string) {
    const cidade: Cidade = { id, nome, estadoId };
    this.http.put(BACKEND_CIDADES_URL + id, cidade).subscribe(
      (response) => {
        const updatedCidades = [...this.cidades];
        const oldCidadeIndex = updatedCidades.findIndex(
          (p) => p.id === cidade.id
        );
        updatedCidades[oldCidadeIndex] = cidade;
        this.cidades = updatedCidades;
        this.cidadesUpdated.next([...this.cidades]);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteCidade(cidadeId: string) {
    this.http.delete(BACKEND_CIDADES_URL + cidadeId).subscribe(
      () => {
        const updatedCidades = this.cidades.filter(
          (cidade) => cidade.id !== cidadeId
        );
        this.cidades = updatedCidades;
        this.cidadesUpdated.next([...this.cidades]);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
