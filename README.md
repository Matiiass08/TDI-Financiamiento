# Financiamiento TDI (Vite + React + TS)

Acá están las instrucciones para correrlo
Cualquier duda sobre la app preguntarme: miretamales@uc.cl o al wsp +56930547385


App para monitorear y alcanzar la meta de dinero en TDI, con categorías e ítems visibles/ocultos, gráficos y guardado automático en una base de datos cuando está desplegada.



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

En desarrollo (`npm run dev`) la app sigue usando `localStorage`. En produccion (`npm start`) el servidor expone `/api/state`, pide clave de acceso y guarda el estado en Postgres si existe `DATABASE_URL`. Si no existe `DATABASE_URL`, usa un archivo local solo como fallback de desarrollo.

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

## Que pasa cuando vence Render Postgres Free
La base de datos gratis de Render no es permanente. Render Postgres Free expira 30 dias despues de su creacion. Cuando vence, Render deja la base inaccesible y da un periodo de gracia de 14 dias para subirla a un plan pagado. Si no se hace upgrade durante ese periodo, Render elimina la base y sus datos.

Por eso hay que elegir una de estas rutas:

1. **Mantener Render y pagar Postgres antes del vencimiento**
   - Es la opcion mas simple si la app ya esta funcionando bien.
   - En Render, entrar a la base Postgres y hacer upgrade a un plan pagado antes de los 30 dias o durante los 14 dias de gracia.
   - No hay que cambiar el codigo ni `DATABASE_URL`; la app sigue usando la misma base.

2. **Seguir gratis creando una nueva base en Render**
   - Antes de que venza la base actual, abrir la app y usar **Exportar** para descargar el JSON actualizado.
   - Crear una nueva **PostgreSQL Database Free** en Render.
   - Copiar el nuevo **Internal Database URL**.
   - En el Web Service, reemplazar `DATABASE_URL` por la nueva URL.
   - Redeployar la app.
   - Entrar con la clave y usar **Importar** para subir el JSON exportado.

3. **Migrar a otra base gratis con mayor duracion**
   - Crear una base en otro proveedor, por ejemplo Supabase o Neon.
   - Copiar su connection string compatible con Postgres.
   - Reemplazar `DATABASE_URL` en Render por esa connection string.
   - Si la base exige SSL, agregar `DB_SSL=true` como variable de entorno.
   - Redeployar e importar el JSON si la nueva base esta vacia.

La app guarda todo en una tabla llamada `app_state`, en una sola fila con `id = 'main'`. El contenido principal queda en la columna `data` como JSON.

## Respaldo recomendado
Cada cierto tiempo, especialmente antes de que venza Render Postgres Free, entrar a la app y presionar **Exportar**. Ese archivo JSON es el respaldo manual de emergencia. Si se pierde la base, se puede levantar otra base y luego importar ese JSON para recuperar los datos.

## Stack
- React + Vite + TypeScript
- **Zustand** (estado global)
- **Recharts** (gráficos torta/barras)
- **TailwindCSS** (UI)


> Elegimos **Zustand** por su simplicidad y bajo boilerplate para un MVP; y **Recharts** por su enfoque declarativo y responsivo.


Creado por Matías Retamales (miretamales@uc.cl)
