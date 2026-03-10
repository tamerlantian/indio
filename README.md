# Semantica Portal

Portal de autogestión para empleados. Permite consultar y gestionar información laboral: comprobantes de pago, certificaciones, turnos, seguridad social, reclamos y más, desde un único lugar.

## Stack

| Tecnología | Versión |
|---|---|
| Angular | 20 (standalone components, signals) |
| PrimeNG | 20.4.0 (tema Aura con preset personalizado) |
| Fuente | Geist |

## Requisitos

- Node.js 20+
- Angular CLI 20
- Backend en `https://semanticaapi.com.co` (proxied en dev como `/api`)

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
├── app.config.ts            # Providers globales (router, HTTP, PrimeNG, app initializer)
├── app.routes.ts            # Rutas raíz con lazy loading
├── core/
│   └── interceptors/
│       └── auth.interceptor.ts  # Agrega withCredentials a todas las peticiones
└── features/
    ├── landing/             # Página de inicio pública
    ├── auth/
    │   ├── login/           # Formulario de inicio de sesión
    │   ├── guards/          # authGuard y publicGuard
    │   ├── services/        # AuthService (signals, HTTP-only cookies)
    │   └── models/          # LoginRequest, AuthResponse, Usuario
    ├── dashboard/
    │   └── shell/           # Layout: navbar + sidebar + router-outlet
    └── seguridad/
        ├── api-keys/        # Gestión de API Keys
        ├── services/        # ApiKeyService
        └── models/          # ApiKey model
```

## Rutas

```
/                             → Landing (redirige a /dashboard si autenticado)
/auth/login                   → Inicio de sesión
/dashboard                    → Dashboard (requiere autenticación)
/seguridad/api-keys           → Gestión de API Keys (requiere autenticación)
```

Rutas planificadas bajo `/dashboard`: pagos, reclamos, solicitudes, capacitaciones, certificado-laboral, certificado-laboral-historico, autorizacion-arma, seguridad-social, turnos.

Todas las rutas protegidas usan `authGuard`. Las rutas de `/auth` usan `publicGuard`.

## Autenticación

La autenticación se maneja con **HTTP-only cookies** gestionadas por el backend. El `AuthService` mantiene el estado en un signal (`currentUser`) y expone `isAuthenticated` como computed signal. No se almacena ningún token en `localStorage`.

Al arrancar la app, un `provideAppInitializer` llama a `POST /auth/seguridad/refresh` para rehidratar la sesión desde la cookie vigente. Esto evita el flash de redirección a login al recargar la página.

## Convenciones

- Todos los componentes son **standalone** — no hay NgModules
- Estado con **signals** (`signal`, `computed`) — no usar `BehaviorSubject`
- Inyección de dependencias con `inject()` en el cuerpo de la clase
- Nuevas rutas en un archivo `<feature>.routes.ts`, cargadas lazy desde `app.routes.ts`
- SCSS usa design tokens de PrimeNG (`var(--p-surface-0)`, `var(--p-primary-color)`, etc.) — evitar colores hardcodeados
- Tema personalizado `SemanticaPreset`: paleta `navy` (#143049) como primario, `sky` (#77aad7) en dark mode
