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
1. Crear un **Web Service** desde el repositorio.
2. Build command: `npm ci && npm run build`
3. Start command: `npm start`
4. Environment variables:
   - `NODE_ENV=production`
   - `ACCESS_KEY=la-clave-privada`
   - `SESSION_SECRET=un-texto-largo-random`
   - `DATA_DIR=/data`
5. Agregar un **Persistent Disk** montado en `/data`.

Sin disco persistente, Render puede perder el JSON cuando reinicia o redeploya el servicio.

## Stack
- React + Vite + TypeScript
- **Zustand** (estado global)
- **Recharts** (gráficos torta/barras)
- **TailwindCSS** (UI)


> Elegimos **Zustand** por su simplicidad y bajo boilerplate para un MVP; y **Recharts** por su enfoque declarativo y responsivo.


Creado por Matías Retamales (miretamales@uc.cl)
