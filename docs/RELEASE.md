# Proceso de Release y Versionado

## Versionado semantico (SemVer)

Este proyecto sigue [Semantic Versioning 2.0.0](https://semver.org/):

```
MAJOR.MINOR.PATCH
  │      │     └── fix: correcciones de bugs
  │      └──────── feat: nuevas funcionalidades
  └─────────────── BREAKING CHANGE: cambios incompatibles
```

El versionado se gestiona automaticamente con [`commit-and-tag-version`](https://github.com/absolute-version/commit-and-tag-version), que analiza los commits convencionales para determinar el tipo de incremento.

## Como hacer un release

### 1. Asegurate de estar en `dev` con todo limpio

```bash
git checkout dev
git pull origin dev
git status  # debe estar limpio
```

### 2. Ejecuta el release

```bash
# Release normal (incrementa segun los commits)
npm run release

# Primera vez (si la version es 0.0.0)
npm run release:first

# Release con version especifica
npx commit-and-tag-version --release-as 1.0.0

# Pre-release
npx commit-and-tag-version --prerelease alpha
# Ejemplo: 1.0.0 → 1.0.1-alpha.0

# Solo patch, minor o major
npx commit-and-tag-version --release-as patch
npx commit-and-tag-version --release-as minor
npx commit-and-tag-version --release-as major
```

### 3. Lo que hace `npm run release`

Automaticamente:

1. Analiza los commits desde el ultimo tag
2. Determina el tipo de incremento:
   - `fix` → patch (0.0.X)
   - `feat` → minor (0.X.0)
   - `BREAKING CHANGE` → major (X.0.0)
3. Actualiza la version en `package.json`
4. Genera/actualiza `CHANGELOG.md`
5. Crea un commit: `chore(release): X.Y.Z`
6. Crea un tag de Git: `vX.Y.Z`

### 4. Sube los cambios y el tag

```bash
git push origin dev --follow-tags
```

### 5. Merge a main (deploy a produccion)

Crea un PR de `dev` → `main` en GitHub. Una vez aprobado y mergeado, el deploy a produccion se ejecuta automaticamente.

## CHANGELOG

El archivo `CHANGELOG.md` se genera automaticamente a partir de los commits convencionales. Solo los siguientes tipos aparecen en el changelog:

| Tipo       | Seccion en CHANGELOG |
| ---------- | -------------------- |
| `feat`     | Features             |
| `fix`      | Bug Fixes            |
| `perf`     | Performance          |
| `refactor` | Refactoring          |
| `docs`     | Documentation        |

Los tipos `chore`, `style`, `test`, `build` y `ci` se omiten del changelog.

> **No edites `CHANGELOG.md` manualmente.** Se sobreescribe en cada release.

## Flujo completo de un release

```
                          ┌──────────────────┐
                          │  Desarrollo en   │
                          │  feat/* branches  │
                          └────────┬─────────┘
                                   │ PR → dev
                                   ▼
                          ┌──────────────────┐
                          │    Branch dev     │
                          │  (staging auto)  │
                          └────────┬─────────┘
                                   │ npm run release
                                   │ git push --follow-tags
                                   ▼
                          ┌──────────────────┐
                          │  Tag vX.Y.Z +    │
                          │  CHANGELOG.md    │
                          └────────┬─────────┘
                                   │ PR → main
                                   ▼
                          ┌──────────────────┐
                          │   Branch main    │
                          │  (prod auto)     │
                          └──────────────────┘
```

## CI/CD y Deploys

### Deploys automaticos

| Evento | Rama   | Entorno    | Build config                 |
| ------ | ------ | ---------- | ---------------------------- |
| Push   | `dev`  | Staging    | `--configuration=staging`    |
| Push   | `main` | Produccion | `--configuration=production` |

El deploy se ejecuta via GitHub Actions (`.github/workflows/deploy.yml`):

- Build de Angular
- Rsync via SSH al servidor correspondiente

### CI en Pull Requests

Cada PR a `main` o `dev` ejecuta (`.github/workflows/ci.yml`):

1. `npm run format:check` — formato
2. `npm run lint` — linting
3. `npm run build` — compilacion
4. `npm run test:ci` — tests unitarios

Ademas, `commitlint.yml` valida que los commits sigan el formato convencional.

## Entornos

| Entorno     | API URL                           | Archivo                  |
| ----------- | --------------------------------- | ------------------------ |
| Development | `/api` (proxy local)              | `environment.ts`         |
| Staging     | `https://api.semanticaapi.com.co` | `environment.staging.ts` |
| Production  | `https://api.semanticaapi.com.co` | `environment.prod.ts`    |

## Secretos de GitHub necesarios

Para que el deploy funcione, estos secretos deben estar configurados en el repositorio:

### Staging (dev)

- `DEV_SSH_KEY` — clave privada SSH
- `DEV_HOST` — hostname del servidor
- `DEV_SSH_USER` — usuario SSH
- `DEV_DEPLOY_PATH` — ruta de destino (ej: `/var/www/html/portal-staging`)

### Produccion (main)

- `PROD_SSH_KEY` — clave privada SSH
- `PROD_HOST` — hostname del servidor
- `PROD_SSH_USER` — usuario SSH
- `PROD_DEPLOY_PATH` — ruta de destino (ej: `/var/www/html/portal`)

> El deploy valida que `DEPLOY_PATH` no sea `/var/www` ni `/var/www/html` para evitar sobreescrituras accidentales.

## Ejemplo completo

```bash
# 1. Terminas tu feature
git checkout dev
git pull origin dev
git merge feat/mi-feature

# 2. Verificas que todo esta bien
npm run test:ci
npm run lint
npm run build

# 3. Haces el release
npm run release
# Output: bumping version in package.json from 0.1.0 to 0.2.0
# Output: outputting changes to CHANGELOG.md
# Output: committing package.json and CHANGELOG.md
# Output: tagging release v0.2.0

# 4. Subes a staging
git push origin dev --follow-tags

# 5. Verificas en staging que todo funciona

# 6. Creas PR de dev → main para produccion
gh pr create --base main --title "release: v0.2.0"

# 7. Merge del PR → deploy automatico a produccion
```
