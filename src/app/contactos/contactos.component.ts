import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactosService } from '../servicios/contactos.service';
import { Contacto } from '../interfaces/contacto';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { EntidadesService } from '../servicios/entidades.service';
import { Entidad } from '../interfaces/entidad';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-contactos',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ToolbarModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './contactos.component.html'
})
export class ContactosComponent implements OnInit {
  contactos: Contacto[] = [];
  filteredContactos: Contacto[] = [];
  contactoDialog = false;
  editingContacto: Contacto | null = null;
  contactoForm: FormGroup;
  selectedContactos: Contacto[] = [];
  entidades: Entidad[] = [];
  
  getEntidadName(entidadId: number | undefined): string {
    if (entidadId === undefined) return 'No asignada';
    const entidad = this.entidades.find(e => e.id === entidadId);
    return entidad ? entidad.nombre : 'No asignada';
  }
  
  onSearchContacto(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    
    if (!searchTerm) {
      this.filteredContactos = [...this.contactos];
      return;
    }
    
    const term = searchTerm.toLowerCase();
    this.filteredContactos = this.contactos.filter(contacto => 
      contacto.nombre.toLowerCase().includes(term) ||
      (contacto.email && contacto.email.toLowerCase().includes(term)) ||
      (contacto.telefono && contacto.telefono.toLowerCase().includes(term)) ||
      (contacto.direccion && contacto.direccion.toLowerCase().includes(term))
    );
  }
  
  // Método para filtrar contactos por entidad (para uso futuro)
  filterByEntity(entidadId: number) {
    if (!entidadId) {
      this.filteredContactos = [...this.contactos];
      return;
    }
    
    this.filteredContactos = this.contactos.filter(contacto => 
      contacto.entidad_id === entidadId
    );
  }


  constructor(
    public contactosService: ContactosService,
    private entidadesService: EntidadesService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['',[Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]*$')]],
      direccion: [''],
      notas: [''],
      entidad_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.contactosService.contactos$.subscribe(contactos => {
      this.contactos = contactos;
      this.filteredContactos = [...contactos];
    });
    
    this.entidadesService.entidades$.subscribe(data => this.entidades = data);
    
    this.contactosService.getAll().subscribe();
    this.entidadesService.getAll().subscribe();
  }

  loadContactos() {
    this.contactosService.getAll().subscribe();
  }

  openNew() {
    this.contactoForm.reset();
    this.editingContacto = null;
    this.contactoDialog = true;
  }

  editContacto(contacto: Contacto) {
    this.contactoForm.patchValue(contacto);
    this.editingContacto = contacto;
    this.contactoDialog = true;
  }

  saveContacto() {
    if (this.contactoForm.invalid) return;
    const contacto: Contacto = this.contactoForm.value;
    if (this.editingContacto && this.editingContacto.id) {
      contacto.id = this.editingContacto.id;
      this.contactosService.update(contacto).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Contacto actualizado' });
          this.contactoDialog = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el contacto' });
        }
      });
    } else {
      this.contactosService.create(contacto).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Contacto creado' });
          this.contactoDialog = false;
        },
        error: (error) => {
          let errorMessage = 'No se pudo crear el contacto';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400 && error.error?.includes('email')) {
            errorMessage = 'Ya existe un contacto con este email';
          }
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        }
      });
    }
  }

  deleteContacto(contacto: Contacto) {
    if (!contacto.id) return;
    this.contactosService.delete(contacto.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Contacto eliminado' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el contacto' });
      }
    });
  }
  
  deleteSelectedContactos() {
    if (this.selectedContactos.length === 0) return;
    
    const totalAEliminar = this.selectedContactos.length;
    let contactosEliminados = 0;
    let errores = 0;
    
    this.selectedContactos
      .filter(contacto => contacto.id)
      .forEach(contacto => {
        this.contactosService.delete(contacto.id!).subscribe({
          next: () => {
            contactosEliminados++;
            this.checkCompletionStatus(contactosEliminados, errores, totalAEliminar);
          },
          error: () => {
            errores++;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Error al eliminar el contacto ${contacto.nombre}`,
            });
            this.checkCompletionStatus(contactosEliminados, errores, totalAEliminar);
          }
        });
      });
  }
  
  private checkCompletionStatus(completados: number, errores: number, total: number) {
    if (completados + errores === total) {
      if (completados > 0) {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminados',
          detail: `${completados} contactos eliminados`,
        });
      }
      this.selectedContactos = [];
    }
  }
}