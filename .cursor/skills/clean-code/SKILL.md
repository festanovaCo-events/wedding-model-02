---
name: clean-code
description: >-
  Applies Clean Code guidelines when writing or reviewing code in this wedding
  invitation app (wedding-model-02). Use when implementing features,
  refactoring, fixing bugs, or reviewing changes, and when the user mentions
  clean code, SOLID, DRY, duplicidad, or maintainability. Keeps edits small
  and does not rewrite the architecture unless a real defect requires it.
---

# Clean Code Guidelines

## Constants Over Magic Numbers
- Replace hard-coded values with named constants
- Use descriptive constant names that explain the value's purpose
- Keep constants at the top of the file or in a dedicated constants file

## Meaningful Names
- Variables, functions, and classes should reveal their purpose
- Names should explain why something exists and how it's used
- Avoid abbreviations unless they're universally understood

## Smart Comments
- Don't comment on what the code does - make the code self-documenting
- Use comments to explain why something is done a certain way
- Document APIs, complex algorithms, and non-obvious side effects

## SOLID

### Single Responsibility
- Each function should do exactly one thing
- Functions should be small and focused
- If a function needs a comment to explain what it does, it should be split

### Open/Closed
- Add a new variant, component, or config entry instead of editing a stable module for every case
- Extend behavior without rewriting the callers that already work
- Do not grow a chain of special cases inside a function that used to have one job

### Liskov Substitution
- A variant must honor the contract of the type it replaces
- Callers of a shared component or helper must not need to know which variant they received
- Do not strengthen preconditions or drop results that existing callers rely on

### Interface Segregation
- Depend only on the fields and functions the caller actually uses
- Pass the value a function needs, not the whole object that happens to contain it
- Do not add inputs, constructor params, or context that most consumers ignore

### Dependency Inversion
- High-level code depends on a small interface, not on a concrete provider
- Keep origins, storage keys, and external URLs behind the module that already owns them
- Do not let a page or section talk to a concrete backend when a port already exists

## Duplicidad de código (DRY)

No copies un bloque que ya existe. Si dos pantallas hacen lo mismo y solo cambia el texto, hay una sola pieza y cada pantalla le pasa su copy.

- Extrae la estructura repetida a una función o un componente. El texto, el tono y los enlaces se quedan en quien lo usa.
- Una URL, un teléfono, un id de sección o una ruta viven en un solo módulo. No los rearmes en cada archivo.
- Dos apariciones del mismo panel, del mismo flujo o de la misma marca ya son duplicidad. No esperes a la tercera.
- No es duplicidad el catálogo: cada evento o cada regalo es un dato distinto del mismo tipo. No es duplicidad una sección que solo rellena un componente compartido.
- No unifiques dos bloques solo porque se parecen un poco. Unifícalos cuando un cambio de comportamiento habría que repetirlo a mano.

## Clean Structure
- Keep related code together
- Organize code in a logical hierarchy
- Use consistent file and folder naming conventions

## Encapsulation
- Hide implementation details
- Expose clear interfaces
- Move nested conditionals into well-named functions

## Code Quality Maintenance
- Refactor continuously
- Fix technical debt early
- Leave code cleaner than you found it

## Testing
- Write tests before fixing bugs
- Keep tests readable and maintainable
- Test edge cases and error conditions

## Version Control
- Write clear commit messages (Conventional Commits)
- Make small, focused commits
- Use meaningful branch names

## Aplicación en este proyecto

Estas reglas se aplican así en **wedding-model-02**. El cambio se queda en el defecto; no se reescribe la arquitectura.

### Estructura canónica
- UI del modelo: `src/app/components/` (hero, invitation, events, timeline, passes, gifts, rsvp, adults-only, footer).
- Página: `src/app/pages/model-page/`.
- Shared: `src/app/shared/` (servicios, dominio, temas, layout, confirmaciones).
- Copy y datos del modelo: `src/app/constants/m02-info.ts` + `src/app/shared/constants/wedding-info.ts`.
- Estilos del modelo: `src/styles/model-02.css` con prefijo `m02-*`.
- Assets del modelo: `src/assets/images/model-02/`. Decoración compartida: el resto de `src/assets/images/`.
- La ruta activa usa `pages/` + `shared/` + `components/`. No añadas código nuevo bajo `src/app/features/`.

### Reglas concretas
- Constantes: el tope de cupos sale de `seats_reserved` vía `GuestList`. No uses `7` ni `2` como límite inventado. Textos de UI salen de `MODEL_02_INFO` / `WEDDING_INFO`, no hardcodeados en plantillas.
- DRY: `hasResponded` es el único criterio de invitación ya respondida. `shouldShowExpiredInvitationPage` es la única regla de expiración. La música de fondo pasa por `BackgroundMusicService`; no dupliques lógica de audio en el splash.
- Responsabilidad única: `M02PageComponent` orquesta carga, expiración y modal. Los componentes de sección solo pintan. El dominio (`GuestList`) no lleva copy de interfaz. No partas un componente de menos de unas 30 líneas.
- Límites: el `.component.ts` exporta la clase del componente. Tipos en `shared/interfaces/`, copy en `constants/`, utilidades en `shared/utils/`. Sin `index.ts` de reexportación.
- Encapsulación: el puerto que ya existe es `INVITATION_API` (HTTP/mock vía `RoutedInvitationApi`). El estado vive en `InvitationStateService`. No añadas un token por servicio, NgRx, una máquina de estados del RSVP ni un mapper por campo del API.
- Iconos: UI con `@hugeicons/angular` + `@hugeicons/core-free-icons`. No vuelvas a meter SVG inline para iconos de acciones o secciones. Los SVG de botánica, olas y decoración sí pueden quedarse.
- Temas: cambios de color/assets del sistema de temas en `src/app/shared/themes/` y `ACTIVE_THEME`. El look del modelo 02 (botánica, papel rasgado) vive en `model-02.css` y assets locales.
- Deuda: borra lo que ninguna plantilla monta. No lo abstraigas. `InvitationService` se conserva: todavía no lo usa una pantalla, pero va a usarse.
- Tests: plazo, cupos, redirección, wizard de confirmación, y utilidades de fecha/tema cuando toque. No un spec por cada sección visual.
- En un `switch` sobre uniones o enums, el `default` debe asignar el valor a `never`. Los imports van al inicio del archivo.
- Los commits son pequeños y el mensaje explica el porqué. Solo se crean cuando el usuario lo pide.
