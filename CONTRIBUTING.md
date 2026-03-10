# Guia de Contribucion

## Requisitos previos

- Node.js 22+
- Angular CLI 20
- Git configurado con SSH para `github.com`

```bash
git clone git@github.com:tamerlantian/indio.git
cd indio
npm ci
```

> `npm ci` instala las dependencias exactas del `package-lock.json` y configura Husky automaticamente via el script `prepare`.

## Flujo de trabajo (Git Flow simplificado)

```
main ← merges desde dev (produccion)
 └── dev ← merges desde feature branches (staging)
      └── feat/mi-feature ← tu trabajo diario
```

### Ramas

| Rama                                  | Proposito             | Desplegada en          |
| ------------------------------------- | --------------------- | ---------------------- |
| `main`                                | Produccion estable    | Servidor de produccion |
| `dev`                                 | Integracion y staging | Servidor de staging    |
| `feat/*`, `fix/*`, `refactor/*`, etc. | Trabajo individual    | No se despliega        |

### Crear una rama

Siempre parte desde `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/nombre-descriptivo
```

Usa el prefijo que corresponda al tipo de cambio:

```
feat/     → Nueva funcionalidad
fix/      → Correccion de bug
refactor/ → Refactorizacion sin cambio funcional
docs/     → Solo documentacion
chore/    → Tareas de mantenimiento
```

## Commits convencionales

Este proyecto usa [Conventional Commits](https://www.conventionalcommits.org/). Husky valida cada mensaje de commit automaticamente con `commitlint`.

### Formato

```
<tipo>(scope opcional): descripcion en minusculas

Cuerpo opcional con mas contexto.

BREAKING CHANGE: descripcion del cambio destructivo (si aplica)
```

### Tipos permitidos

| Tipo       | Uso                                  | Aparece en CHANGELOG |
| ---------- | ------------------------------------ | -------------------- |
| `feat`     | Nueva funcionalidad                  | Si (Features)        |
| `fix`      | Correccion de bug                    | Si (Bug Fixes)       |
| `perf`     | Mejora de rendimiento                | Si (Performance)     |
| `refactor` | Refactorizacion sin cambio funcional | Si (Refactoring)     |
| `docs`     | Solo documentacion                   | Si (Documentation)   |
| `style`    | Formato, espacios, punto y coma      | No                   |
| `test`     | Agregar o corregir tests             | No                   |
| `build`    | Cambios en build o dependencias      | No                   |
| `ci`       | Cambios en CI/CD                     | No                   |
| `chore`    | Tareas de mantenimiento              | No                   |
| `revert`   | Revertir un commit previo            | Depende              |

### Reglas

- El `subject` debe estar en minusculas (no PascalCase ni UPPER_CASE)
- El header no debe exceder 100 caracteres
- Usa el scope para dar contexto: `feat(auth): add password recovery`

### Ejemplos

```bash
# Bien
git commit -m "feat(dashboard): add pagos module"
git commit -m "fix(auth): handle expired session redirect"
git commit -m "refactor(api-keys): simplify service injection"

# Mal
git commit -m "Updated stuff"          # sin tipo
git commit -m "feat: Add Login Page"   # mayusculas en subject
git commit -m "fix: a]"               # sin descripcion clara
```

## Hooks de Git (Husky)

Al hacer commit, se ejecutan automaticamente:

1. **pre-commit** → `lint-staged`
   - Archivos `.ts` y `.html` → `eslint --fix`
   - Archivos `.ts`, `.html`, `.scss`, `.json`, `.md` → `prettier --write`
2. **commit-msg** → `commitlint`
   - Valida el formato del mensaje de commit

Si un hook falla, el commit se rechaza. Corrige el problema y vuelve a intentar.

> **No** uses `--no-verify` para saltarte los hooks. Si algo falla, arreglalo.

## Pull Requests

### Proceso

1. Sube tu rama al remoto:

   ```bash
   git push -u origin feat/nombre-descriptivo
   ```

2. Crea un PR en GitHub apuntando a `dev` (no a `main`).

3. El CI ejecuta automaticamente:
   - Validacion de formato (`prettier --check`)
   - Linting (`eslint`)
   - Build de produccion
   - Tests unitarios (ChromeHeadless)
   - Validacion de commits convencionales

4. Todos los checks deben pasar antes de hacer merge.

5. Usa **Squash and merge** o **Merge commit** segun la complejidad:
   - Squash: para features pequenas (1-3 commits)
   - Merge commit: para features grandes donde el historial importa

### Checklist antes de crear el PR

- [ ] Los tests pasan localmente: `npm run test:ci`
- [ ] El linting pasa: `npm run lint`
- [ ] El formato esta correcto: `npm run format:check`
- [ ] El build compila: `npm run build`
- [ ] La rama esta actualizada con `dev`

## Desarrollo local

### Comandos principales

```bash
npm start                              # Dev server → http://localhost:4200
npm run build                          # Build produccion
npm test                               # Tests en modo watch
npm run test:ci                        # Tests una sola vez (CI)
npm run lint                           # Verificar linting
npm run lint:fix                       # Corregir linting automaticamente
npm run format                         # Formatear codigo
npm run format:check                   # Verificar formato sin modificar
```

### Proxy de desarrollo

En modo desarrollo, las peticiones a `/api` se redirigen automaticamente a `https://semanticaapi.com.co` mediante el proxy configurado en `proxy.conf.json`. No necesitas levantar el backend localmente.

## Estructura de archivos para nuevos features

Al crear un nuevo feature, sigue esta estructura:

```
src/app/features/<nombre>/
├── <nombre>.routes.ts           # Rutas del feature
├── components/                  # Componentes del feature
│   └── mi-componente/
│       ├── mi-componente.ts
│       ├── mi-componente.spec.ts
│       └── mi-componente.html   # (solo si no usas template inline)
├── services/                    # Servicios del feature
│   └── mi-servicio.ts
└── models/                      # Interfaces y tipos
    └── mi-modelo.ts
```

### Checklist para nuevos componentes

- Siempre `standalone: true`
- Usa `inject()` para dependencias, no constructor injection
- Usa `signal()` y `computed()` para estado, no `BehaviorSubject`
- Selector con prefijo `app-` en kebab-case
- Estilos inline en SCSS usando design tokens de PrimeNG
- Crea un archivo `.spec.ts` con al menos un test basico
