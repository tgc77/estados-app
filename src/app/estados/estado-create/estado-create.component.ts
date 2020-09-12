import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { EstadosService } from '../estados.service';
import { Estado } from '../estado.model';

@Component({
  selector: 'app-estado-create',
  templateUrl: './estado-create.component.html',
  styleUrls: ['./estado-create.component.css'],
})
export class EstadoCreateComponent implements OnInit {
  estado: Estado;
  isLoading = false;
  private mode = 'create';
  private estadoId: string;

  constructor(
    public estadosService: EstadosService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('estadoId')) {
          this.mode = 'edit';
          this.estadoId = paramMap.get('estadoId');
          this.isLoading = true;
          this.estadosService.getEstado(this.estadoId).subscribe(
            (estadoData) => {
              this.isLoading = false;
              this.estado = {
                id: estadoData._id,
                nome: estadoData.nome,
                abreviacao: estadoData.abreviacao,
              };
            },
            (error) => {
              console.error(error);
              this.isLoading = false;
            }
          );
        } else {
          this.mode = 'create';
          this.estadoId = null;
        }
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  onSaveEstado(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.estadosService.addEstado(form.value.nome, form.value.abreviacao);
    } else {
      this.estadosService.updateEstado(
        this.estadoId,
        form.value.nome,
        form.value.abreviacao
      );
    }
    form.resetForm();
    this.isLoading = false;
  }
}
