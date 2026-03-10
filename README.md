# Semantica Portal

Portal de autogestión para empleados. Permite consultar y gestionar información laboral: comprobantes de pago, certificaciones, turnos, seguridad social, reclamos y más, desde un único lugar.

## Stack

| Tecnología | Versión |
|---|---|
| Angular | 20 (standalone components, signals) |
| PrimeNG | 20.4.0 (tema Aura) |
| Fuente | Geist |

## Requisitos

- Node.js 20+
- Angular CLI 20
- Backend corriendo en `http://localhost:3000/api`

## Comandos

```bash
ng serve                                   # Dev server → http://localhost:4200
ng build                                   # Build de producción → dist/
ng test                                    # Tests unitarios (Karma + Jasmine)
ng test --include="**/foo.spec.ts"         # Ejecutar un test específico
```

## Estructura del proyecto

```
src/app/
├── app.config.ts            # Providers globales (router, HTTP, PrimeNG)
├── app.routes.ts            # Rutas raíz
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts        # Redirige a /auth/login si no autenticado
│   │   └── public.guard.ts      # Redirige a /dashboard si ya autenticado
│   └── interceptors/
│       └── auth.interceptor.ts  # Agrega withCredentials a todas las peticiones
└── features/
    ├── landing/             # Página de inicio pública
    ├── auth/
    │   ├── login/           # Formulario de inicio de sesión
    │   ├── guards/          # Guards de autenticación
    │   ├── services/        # AuthService (signals, HTTP-only cookies)
    │   └── models/          # LoginRequest, AuthResponse, Usuario
    └── dashboard/
        ├── shell/           # Layout: navbar + sidebar + router-outlet
        ├── inicio/          # Página de bienvenida
        ├── pagos/
        ├── reclamos/
        ├── solicitudes/
        ├── capacitaciones/
        ├── certificado-laboral/
        ├── certificado-laboral-historico/
        ├── autorizacion-arma/
        ├── seguridad-social/
        └── turnos/
```

## Rutas

```
/                             → Landing (redirige a /auth/login si no autenticado)
/auth/login                   → Login
/dashboard/inicio             → Inicio  (requiere autenticación)
/dashboard/pagos              → Pagos
/dashboard/reclamos           → Reclamos
/dashboard/solicitudes        → Solicitudes
/dashboard/capacitaciones     → Capacitaciones
/dashboard/certificado-laboral           → Certificado Laboral
/dashboard/certificado-laboral-historico → Cert. Laboral Histórico
/dashboard/autorizacion-arma  → Autorización de Arma
/dashboard/seguridad-social   → Seguridad Social
/dashboard/turnos             → Turnos
```

Todas las rutas bajo `/dashboard` están protegidas por `authGuard`. Todas las rutas de `/auth` están protegidas por `publicGuard`.

## Autenticación

La autenticación se maneja mediante **HTTP-only cookies** gestionadas por el backend. El `AuthService` mantiene el estado del usuario en un signal (`currentUser`) y expone `isAuthenticated` como computed signal. No se almacena ningún token en `localStorage`.

## Convenciones

- Todos los componentes son **standalone** — no hay NgModules
- Estado local con **signals** (`signal`, `computed`) — no usar `BehaviorSubject` para código nuevo
- Inyección de dependencias con `inject()` en el cuerpo de la clase
- Nuevas rutas van en un archivo `<feature>.routes.ts` y se cargan lazy desde `app.routes.ts`
- SCSS usa design tokens de PrimeNG (`var(--p-surface-0)`, `var(--p-primary-color)`, etc.) — evitar colores hardcodeados
