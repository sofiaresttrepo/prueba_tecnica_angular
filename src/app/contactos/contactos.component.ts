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
    DropdownModule
  ],
  providers: [MessageService],
  templateUrl: './contactos.component.html'
})
export class ContactosComponent implements OnInit {
filteredContactos: any;
filterByEntity($event: Event) {
throw new Error('Method not implemented.');
}
exportContacts() {
throw new Error('Method not implemented.');
}
onSearchContacto(arg0: string) {
throw new Error('Method not implemented.');
}
getEntidadName(entidadId: number): string | undefined {
  const entidad = this.entidades.find(e => e.id === entidadId);
  return entidad ? entidad.nombre : undefined;
} 
closeDialog($event: MouseEvent) {
throw new Error('Method not implemented.');
}
  contactos: Contacto[] = [];
  contactoDialog = false;
  editingContacto: Contacto | null = null;
  contactoForm: FormGroup;
  entidades: Entidad[] = [];


  constructor(
    private contactosService: ContactosService,
    private entidadesService: EntidadesService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.contactoForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['',[Validators.email]],
      telefono: [''],
      direccion: [''],
      notas: [''],
      entidad_id: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadContactos();
    this.entidadesService.getAll().subscribe(data => this.entidades = data); // <-- carga entidades
  }

  loadContactos() {
    this.contactosService.getAll().subscribe(data => this.contactos = data);
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
          this.loadContactos();
          this.contactoDialog = false;
        }
      });
    } else {
      this.contactosService.create(contacto).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Contacto creado' });
          this.loadContactos();
          this.contactoDialog = false;
        }
      });
    }
  }

  deleteContacto(contacto: Contacto) {
    if (!contacto.id) return;
    this.contactosService.delete(contacto.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Contacto eliminado' });
        this.loadContactos();
      }
    });
  }
}