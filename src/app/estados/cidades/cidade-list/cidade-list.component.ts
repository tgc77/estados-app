import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Cidade } from '../cidade.model';
import { CidadesService } from '../cidades.service';

@Component({
  selector: 'app-cidade-list',
  templateUrl: './cidade-list.component.html',
  styleUrls: ['./cidade-list.component.css'],
})
export class CidadeListComponent implements OnInit, OnDestroy {
  @Input() estadoId: string;
  cidades: Cidade[] = [];
  cidadeSelected: Cidade;
  isLoading = false;
  private cidadesSub: Subscription;
  displayedColumns: string[] = ['nome', 'action'];
  dataSource: MatTableDataSource<Cidade>;
  isHidden = true;
  editMode = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private cidadesService: CidadesService) {}

  ngOnInit() {
    this.isLoading = true;
    this.cidadesSub = this.cidadesService.getCidadeUpdateListener().subscribe(
      (cidades: Cidade[]) => {
        this.cidades = cidades;
        this.dataSource = new MatTableDataSource(this.cidades);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
        this.isHidden = true;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEditarCidade(cidadeId: string) {
    this.isHidden = false;
    this.editMode = true;
    this.cidadesService.getCidade(this.estadoId, cidadeId).subscribe(
      (cidade) => {
        this.cidadeSelected = {
          id: cidade._id,
          nome: cidade.nome,
          estadoId: this.estadoId,
        };
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  onAddCidade() {
    this.isHidden = !this.isHidden;
    this.editMode = false;
  }

  onDelete(cidadeId: string) {
    this.cidadesService.deleteCidade(cidadeId);
  }

  ngOnDestroy() {
    this.cidadesSub.unsubscribe();
  }
}
