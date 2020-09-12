import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Estado } from '../estado.model';
import { EstadosService } from '../estados.service';
import { CidadesService } from '../cidades/cidades.service';

@Component({
  selector: 'app-estado-list',
  templateUrl: './estado-list.component.html',
  styleUrls: ['./estado-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class EstadoListComponent implements OnInit, OnDestroy {
  estados: Estado[] = [];
  isLoading = false;
  private estadosSub: Subscription;
  displayedColumns: string[] = [
    'nome',
    'abreviacao',
    'data_criacao',
    'data_ultima_alteracao',
    'action',
  ];
  labelColumns: string[] = [
    'nome',
    'abreviacao',
    'data_criacao',
    'data_ultima_alteracao',
  ];
  dataSource: MatTableDataSource<Estado>;
  expandedElement: Estado | null;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private estadosService: EstadosService,
    private cidadesService: CidadesService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.estadosService.getEstados();
    this.estadosSub = this.estadosService
      .getEstadoUpdateListener()
      .subscribe((estados: Estado[]) => {
        this.isLoading = false;
        this.estados = estados;
        this.dataSource = new MatTableDataSource(this.estados);
        this.dataSource.sort = this.sort;
      });
  }

  onEstadoSelected(selectedElement) {
    if (selectedElement) {
      this.cidadesService.getCidades(selectedElement.id);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(estadoId: string) {
    this.estadosService.deleteEstado(estadoId);
  }

  ngOnDestroy() {
    this.estadosSub.unsubscribe();
  }
}
