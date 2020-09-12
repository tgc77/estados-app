import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CidadesService } from '../cidades.service';
import { Cidade } from '../cidade.model';

@Component({
  selector: 'app-cidade-create',
  templateUrl: './cidade-create.component.html',
  styleUrls: ['./cidade-create.component.css'],
})
export class CidadeCreateComponent implements OnInit {
  @Input() cidade: Cidade;
  @Input() estadoId: string;
  isLoading = false;
  @Input() editMode = false;

  constructor(public cidadesService: CidadesService) {}

  ngOnInit() {}

  onSaveCidade(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    if (!this.editMode) {
      this.cidadesService.addCidade(form.value.nome, this.estadoId);
    } else {
      this.cidadesService.updateCidade(
        this.cidade.id,
        form.value.nome,
        this.cidade.estadoId
      );
    }
    form.resetForm();
    this.isLoading = false;
  }
}
