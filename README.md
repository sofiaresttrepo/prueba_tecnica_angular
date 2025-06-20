###📦 Frontend - Angular

##🧾 Descripción General
Este frontend fue desarrollado en Angular utilizando la arquitectura standalone components. Permite gestionar entidades y sus respectivos contactos, consumiendo un API REST desarrollado en Laravel.

---


## 🛠️ Tecnologías y dependencias
Angular 17+

PrimeNG (UI components)

Angular Forms (ReactiveForms)

Angular Router (standalone routing)

HttpClient (para consumir el API)

CSS personalizado

---

## ✅ Funcionalidades
CRUD Entidades:
Listado en tabla

Crear y editar en formulario reactivo

Eliminar individual y múltiple

Validaciones con mensajes

CRUD Contactos:
Asociados a una entidad

Dropdown de entidades en el formulario

Tabla con acciones de editar/eliminar

Validaciones

---

## 🧪 Validaciones
Campos requeridos (nombre, email, entidad_id)

Validación de email

Validación de número (telefono)

Mensajes visibles y claros al usuario

---

## ▶️ Ejecución

cd frontend   # o la carpeta del proyecto Angular
npm install

📁 Configura las variables de entorno
Abre src/environments/environment.ts y asegúrate de que el apiUrl apunte al backend:

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api'
};

▶️ Levantar servidor de desarrollo

ng serve
El frontend estará disponible en http://localhost:4200.

📌 Consideraciones Técnicas
No se usa AppModule, ya que se emplean componentes standalone.

Las rutas están definidas en app.routes.ts.

Navegación entre rutas mediante [routerLink].

Se usa bootstrapApplication() en main.ts.
