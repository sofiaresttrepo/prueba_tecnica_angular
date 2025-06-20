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
import { InputTextModule } from 'primeng/inputtext';

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
    InputTextModule,
  ],
  templateUrl: './entidades.component.html',
  styleUrl: './entidades.component.css',
  providers: [MessageService],
})
export class EntidadesComponent implements OnInit {
  public entidadesService = inject(EntidadesService);
  public messageService = inject(MessageService);
  total = computed(() => this.entidadesService.entidades().length);
  selectedEntidades: Entidad[] = [];
  filteredEntidades: Entidad[] = [];

  entidadForm!: FormGroup;
  submitted = false;
  entidadDialog = false;
  editingEntidad: Entidad | null = null;

  constructor(private fb: FormBuilder) {
    this.entidadForm = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      direccion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.entidadesService.entidades$.subscribe(entidades => {
      this.filteredEntidades = [...entidades];
    });
    
    this.entidadesService.getAll().subscribe();
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    if (searchTerm) {
      this.filteredEntidades = this.entidadesService.entidades().filter(entidad => {
        return entidad.nombre.toLowerCase().includes(searchTerm) ||
               entidad.nit.toLowerCase().includes(searchTerm) ||
               entidad.direccion.toLowerCase().includes(searchTerm) ||
               entidad.telefono.toLowerCase().includes(searchTerm);
      });
    } else {
      this.filteredEntidades = [...this.entidadesService.entidades()];
    }
  }

  openNew() {
    this.entidadForm.reset();
    this.entidadDialog = true;
    this.editingEntidad = null;
  }

  edit(entidad: Entidad) {
    // Aseguramos que todos los campos, incluido el NIT, sean editables
    this.entidadForm.patchValue({
      id: entidad.id,
      nombre: entidad.nombre,
      nit: entidad.nit,
      telefono: entidad.telefono,
      direccion: entidad.direccion
    });
    this.entidadDialog = true;
    this.editingEntidad = entidad;
  }

  saveEntidad() {
    this.submitted = true;

    if (this.entidadForm.invalid) return;

    const entidad: Entidad = this.entidadForm.value;
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
        error: (error) => {
          let errorMessage = 'No se pudo crear la entidad';
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
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

    let entidadesEliminadas = 0;
    let totalAEliminar = this.selectedEntidades.length;
    
    this.selectedEntidades
      .filter(entidad => entidad.id)
      .forEach(entidad => {
        this.entidadesService.delete(entidad).subscribe({
          next: () => {
            entidadesEliminadas++;
            
            if (entidadesEliminadas === totalAEliminar) {
              this.messageService.add({
                severity: 'success',
                summary: 'Eliminadas',
                detail: `${entidadesEliminadas} entidades eliminadas`,
              });
              this.selectedEntidades = [];
            }
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar algunas entidades',
            });
          }
        });
      });
  }

  private closeDialogAndRefresh() {
    this.entidadDialog = false;
    this.entidadForm.reset();
    this.editingEntidad = null;
  }
}