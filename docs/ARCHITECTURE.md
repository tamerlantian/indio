# Arquitectura del Proyecto

## Vision general

Portal de autogestion para empleados de Semantica, construido con Angular 20 y PrimeNG 20.

```
src/app/
├── app.config.ts              # Providers globales
├── app.routes.ts              # Rutas raiz (lazy loading)
├── core/                      # Servicios e interceptores globales
│   └── interceptors/
├── features/                  # Modulos funcionales (lazy-loaded)
│   ├── landing/               # Pagina publica
│   ├── auth/                  # Autenticacion
│   ├── dashboard/             # Dashboard protegido
│   └── seguridad/             # Gestion de seguridad
└── shared/                    # Componentes y utilidades compartidas
```

## Principios clave

### Standalone Components

No hay `NgModule` en ningun lugar. Todos los componentes usan `standalone: true`:

```typescript
@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `...`,
  styles: `...`,
})
export class MiComponente {}
```

### Signals para estado

Usa `signal()` y `computed()` en lugar de `BehaviorSubject`:

```typescript
export class MiServicio {
  private _datos = signal<Dato[]>([]);

  readonly datos = this._datos.asReadonly();
  readonly total = computed(() => this._datos().length);
}
```

### Inyeccion con `inject()`

Siempre usa la funcion `inject()`, no constructor injection:

```typescript
export class MiComponente {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
}
```

### Lazy loading por feature

Cada feature tiene su propio archivo de rutas y se carga lazy desde `app.routes.ts`:

```typescript
// app.routes.ts
{
  path: 'dashboard',
  loadChildren: () => import('./features/dashboard/dashboard.routes')
    .then(m => m.DASHBOARD_ROUTES),
  canActivate: [authGuard],
}
```

## Autenticacion

### Flujo

1. **Login**: `POST /auth/seguridad/login` con credenciales → el backend setea HTTP-only cookie
2. **Rehydrate**: al iniciar la app, `POST /auth/seguridad/refresh` rehidrata la sesion
3. **Logout**: `POST /auth/seguridad/logout` limpia la cookie

### Interceptor

`auth.interceptor.ts` agrega `withCredentials: true` a todas las peticiones HTTP para enviar cookies automaticamente.

### Guards

| Guard         | Ubicacion               | Proposito                                                                         |
| ------------- | ----------------------- | --------------------------------------------------------------------------------- |
| `authGuard`   | `features/auth/guards/` | Protege rutas que requieren autenticacion. Redirige a `/auth/login?returnUrl=...` |
| `publicGuard` | `features/auth/guards/` | Bloquea rutas publicas para usuarios autenticados. Redirige a `/dashboard`        |

### AuthService

- `currentUser`: signal con el usuario actual (o `null`)
- `isAuthenticated`: computed signal derivado de `currentUser`
- No usa `localStorage` ni `sessionStorage`

## UI y Estilos

### PrimeNG + Aura

Se usa PrimeNG 20 con el tema Aura y un preset personalizado (`SemanticaPreset`):

- Primario: `navy` (#143049)
- Dark mode: `sky` (#77aad7)

### Design tokens

Usa variables CSS de PrimeNG en lugar de colores hardcodeados:

```scss
// Bien
color: var(--p-primary-color);
background: var(--p-surface-0);

// Mal
color: #143049;
background: white;
```

### Dark mode

Se activa con la clase `.dark-mode` en el elemento raiz. Los design tokens de PrimeNG se adaptan automaticamente.

### Fuente

Geist (sans-serif), cargada desde `node_modules/geist/dist/fonts/`.

## Entornos

| Entorno     | `apiUrl`                                           | Archivo                  |
| ----------- | -------------------------------------------------- | ------------------------ |
| Development | `/api` (proxy a `https://api.semanticaapi.com.co`) | `environment.ts`         |
| Staging     | `https://api.semanticaapi.com.co`                  | `environment.staging.ts` |
| Production  | `https://api.semanticaapi.com.co`                  | `environment.prod.ts`    |

## Testing

- **Framework**: Karma + Jasmine
- **CI**: ChromeHeadless (`npm run test:ci`)
- **Cobertura**: generada con `karma-coverage`
- Cada componente y servicio debe tener un `.spec.ts`

## Rutas del dashboard (planificadas)

Las siguientes rutas estan planificadas pero aun no implementadas:

```
/dashboard/pagos
/dashboard/reclamos
/dashboard/solicitudes
/dashboard/capacitaciones
/dashboard/certificado-laboral
/dashboard/certificado-laboral-historico
/dashboard/autorizacion-arma
/dashboard/seguridad-social
/dashboard/turnos
```
