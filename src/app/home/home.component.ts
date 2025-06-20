import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextareaModule,
    ToastModule,
    DividerModule,
    TagModule,
    PanelModule
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  entidadesSql = `INSERT INTO entidades (nombre, nit, telefono, direccion) VALUES
('Empresa ABC S.A.S', '900123456-7', '6011234567', 'Calle 123 #45-67, Bogotá'),
('Corporación XYZ Ltda', '800987654-3', '6019876543', 'Carrera 89 #12-34, Medellín'),
('Industrias DEF S.A', '700456789-1', '6015555555', 'Avenida 56 #78-90, Cali'),
('Comercial GHI E.U', '600321654-9', '6017777777', 'Transversal 23 #11-22, Barranquilla'),
('Servicios JKL S.A.S', '500789123-5', '6013333333', 'Diagonal 45 #67-89, Bucaramanga');`;

  contactosSql = `INSERT INTO contactos (nombre, email, telefono, direccion, notas, entidad_id) VALUES
('Juan Pérez', 'juan.perez@empresaabc.com', '3001234567', 'Calle 123 #45-67', 'Gerente General', 1),
('María González', 'maria.gonzalez@corporacionxyz.com', '3009876543', 'Carrera 89 #12-34', 'Directora Comercial', 2),
('Carlos Rodríguez', 'carlos.rodriguez@industriasdef.com', '3005555555', 'Avenida 56 #78-90', 'Jefe de Producción', 3),
('Ana Martínez', 'ana.martinez@comercialghi.com', '3007777777', 'Transversal 23 #11-22', 'Coordinadora de Ventas', 4),
('Luis Hernández', 'luis.hernandez@serviciosjkl.com', '3003333333', 'Diagonal 45 #67-89', 'Supervisor de Servicios', 5),
('Sofia Restrepo', 'sofia.restrepo@empresaabc.com', '3001111111', 'Calle 123 #45-67', 'Desarrolladora Frontend', 1),
('Pedro Jiménez', 'pedro.jimenez@corporacionxyz.com', '3002222222', 'Carrera 89 #12-34', 'Analista de Sistemas', 2);`;

  constructor(private messageService: MessageService) {}

  copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado',
        detail: `Código SQL de ${type} copiado al portapapeles`,
        life: 3000
      });
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo copiar al portapapeles',
        life: 3000
      });
    });
  }
}