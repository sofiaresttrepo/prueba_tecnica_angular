import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { EntidadesService } from '../servicios/entidades.service';
import { Entidad } from '../interfaces/entidad';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-entidades',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService],
})
export default class EntidadesComponent implements OnInit {
closeDialog($event: MouseEvent) {
throw new Error('Method not implemented.');
}
nextPage() {
throw new Error('Method not implemented.');
}
previousPage() {
throw new Error('Method not implemented.');
}
currentPage: any;
pageSize: any;
Math: any;
totalPages: any;
toggleSelect(_t51: any,$event: Event) {
throw new Error('Method not implemented.');
}
isSelected(_t51: any) {
throw new Error('Method not implemented.');
}
filteredEntidades: any;
onSearch(arg0: string) {
throw new Error('Method not implemented.');
}
refreshData() {
throw new Error('Method not implemented.');
}
toggleSelectAll($event: Event) {
throw new Error('Method not implemented.');
}
  public entidadesService = inject(EntidadesService);
  public messageService = inject(MessageService);
  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[] = [];

  entidadForm!: FormGroup;
  submitted = false;
  entidadDialog = false;
  editingEntidad: Entidad | null = null;
allSelected: any;

  constructor(private fb: FormBuilder) {
    this.entidadForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.entidadesService.getAll().subscribe();
    console.log(' Componente Entidades Cargado');
  }

  openNew() {
    this.entidadForm.reset();
    this.entidadDialog = true;
    this.editingEntidad = null;
  }

  edit(entidad: Entidad) {
    this.entidadForm.patchValue(entidad);
    this.entidadDialog = true;
    this.editingEntidad = entidad;
  }

  saveEntidad() {
    this.submitted = true;

    if (this.entidadForm.invalid) return;

    const entidad: Entidad = this.entidadForm.value;
    console.log('Datos enviados:', entidad);
    if (this.editingEntidad) {
      entidad.id = this.editingEntidad.id;
      
      this.entidadesService.update(entidad).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Entidad actualizada',
          });
          this.closeDialogAndRefresh();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la entidad',
          });
        },
      });
    } else {
      const { id, ...entidadSinId } = entidad;
      
      this.entidadesService.create(entidadSinId as Entidad).subscribe({
        next: (nuevaEntidad) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Entidad creada',
          });
          this.closeDialogAndRefresh();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear la entidad',
          });
        },
      });
    }
  }

  deleteEntidad(entidad: Entidad) {
    if (!entidad.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No se puede eliminar una entidad sin ID',
      });
      return;
    }

    this.entidadesService.delete(entidad).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminada',
          detail: `Entidad ${entidad.nombre} eliminada`,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la entidad',
        });
      }
    });
  }

  deleteSelected() {
    if (this.selectedEntidades.length === 0) return;

    const deletePromises = this.selectedEntidades
      .filter(entidad => entidad.id) // Solo entidades con ID
      .map(entidad => this.entidadesService.delete(entidad).toPromise());

    Promise.all(deletePromises).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Eliminadas',
        detail: `${this.selectedEntidades.length} entidades eliminadas`,
      });
      this.selectedEntidades = [];
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar algunas entidades',
      });
    });
  }

  private closeDialogAndRefresh() {
    this.entidadDialog = false;
    this.entidadForm.reset();
    this.editingEntidad = null;
  }
}