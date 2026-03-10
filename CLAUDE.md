# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
ng serve          # Dev server at http://localhost:4200
ng build          # Production build to dist/
ng test           # Run tests (Karma + Jasmine, watch mode)
ng test --include="**/foo.spec.ts"  # Run a single test file
```

## Architecture

**Angular 20 standalone components** — no NgModules anywhere. All components use `standalone: true`.

**State management via signals** — use `signal()` and `computed()`, not `BehaviorSubject`. See `AuthService` for the pattern.

**Dependency injection** — always use `inject()` function, not constructor injection.

**Feature-based lazy loading:**
- `/` → `landing` (public, redirects authenticated users to `/dashboard`)
- `/auth` → `features/auth` (public guard blocks authenticated users)
- `/dashboard` → `features/dashboard` (auth guard required)

**Auth flow:** HTTP-only cookies via `withCredentials: true` (set in `core/interceptors/auth.interceptor.ts`). No localStorage. The `AuthService` holds `_currentUser` as a signal. Guards in both `core/guards/` and `features/auth/guards/` — the auth guard redirects to login with `returnUrl` query param.

**Backend:** `https://semanticaapi.com.co` in dev, `/api` in prod (see `src/environments/`).

**UI:** PrimeNG 20 with Aura theme + Geist font. Use PrimeNG components and design tokens in SCSS. Dark mode supported via `.dark-mode` class on the root.

**Planned dashboard routes** (not yet implemented): `/dashboard/pagos`, `/dashboard/reclamos`, `/dashboard/solicitudes`, `/dashboard/capacitaciones`, `/dashboard/certificado-laboral`, `/dashboard/certificado-laboral-historico`, `/dashboard/autorizacion-arma`, `/dashboard/seguridad-social`, `/dashboard/turnos`.

## TypeScript

Strict mode is fully enabled including `strictTemplates`, `strictInjectionParameters`, `noImplicitReturns`, and `noImplicitOverride`. The linter will catch type errors in templates.

## Style

- SCSS inline styles per component
- Prettier: 100 char print width, single quotes
- 2-space indentation (enforced by `.editorconfig`)

## Guidelines
- Siempre usa buenas prácticas de programación
- Escribe código limpio y mantenible
- Documenta el código de forma clara y concisa
- Sigue las convenciones del proyecto para la arquitectura y estructura de archivos
- Usa el mcp de context7 en caso de necesitar entender algunas funcionalidades de la  version de angular
- Usa el mcp de context7 en caso de necesitar entender algunas funcionalidades de la  version de primeng