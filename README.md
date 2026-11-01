# Gym Control Pro — Progress Club

Sistema de gestión para el gimnasio Progress Club (Rosario).
Proyecto Final — Práctica Profesionalizante II (Técnico Superior en Desarrollo de Software).

## Convenciones de desarrollo
- **Estructura:** Monorepo con `/frontend` y `/backend`.
- **Nomenclatura Backend:** `<modulo>.controller.js`, `<modulo>.service.js`, `<modulo>.validation.js`.
- **Estrategia Git:**
  - `main`: rama protegida de producción.
  - `develop`: rama base de integración.
  - Ramas de tarea: `feature/<id-ticket>-<descripcion>` saliendo siempre de `develop`.

## Puesta en marcha local
1. Entrar a backend: `cd backend`
2. Instalar dependencias: `npm install`
3. Crear `.env` con las variables correspondientes.
4. Levantar servidor: `npm run dev`
