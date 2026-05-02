# Financiamiento TDI (Vite + React + TS)

Acá están las instrucciones para correrlo
Cualquier duda sobre la app preguntarme: miretamales@uc.cl o al wsp +56930547385


App para monitorear y alcanzar la meta de dinero en TDI, con categorías e ítems visibles/ocultos, gráficos y persistencia local.



Para correr el código debes clonar el github, luego abrir Visual Studio Code y abrir la terminal, donde colocas:

## Correr
```bash
npm i
npm run dev
```

## Produccion local
```bash
npm run build
$env:ACCESS_KEY="tu-clave"
npm start
```

En desarrollo (`npm run dev`) la app sigue usando `localStorage`. En produccion (`npm start`) el servidor expone `/api/state`, pide clave de acceso y guarda el estado en `data/tdi-financiamiento-state.json`.

## Deploy en Render
1. Crear una **PostgreSQL Database** Free en Render.
2. Copiar el **Internal Database URL** de la base.
3. Crear un **Web Service** desde el repositorio.
4. Build command: `npm ci --include=dev && npm run build`
5. Start command: `npm start`
6. Environment variables del Web Service:
   - `NODE_ENV=production`
   - `ACCESS_KEY=la-clave-privada`
   - `SESSION_SECRET=un-texto-largo-random`
   - `DATABASE_URL=internal-database-url-de-render`

Render Postgres Free tiene 1 GB y expira 30 dias despues de crearse. Para produccion estable conviene subir la base a plan pago o usar otro proveedor gratuito sin expiracion.

## Stack
- React + Vite + TypeScript
- **Zustand** (estado global)
- **Recharts** (gráficos torta/barras)
- **TailwindCSS** (UI)


> Elegimos **Zustand** por su simplicidad y bajo boilerplate para un MVP; y **Recharts** por su enfoque declarativo y responsivo.


Creado por Matías Retamales (miretamales@uc.cl)
