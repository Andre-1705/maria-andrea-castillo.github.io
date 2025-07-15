# Notas Técnicas del Proyecto

## Herramientas instaladas y versiones recomendadas

### Node.js
- Versión recomendada: 22.x (actual: v22)
- Descargar/actualizar: https://nodejs.org/
- Comprobar versión:
  ```bash
  node -v
  ```

### npm
- Comando para actualizar:
  ```bash
  npm install -g npm@latest
  ```
- Comprobar versión:
  ```bash
  npm -v
  ```

### ts-node
- Usar siempre la versión local con:
  ```bash
  npx ts-node ...
  ```
- Para actualizar la versión local:
  ```bash
  npm install ts-node@latest
  ```
- Para desinstalar la versión global (evitar conflictos):
  ```bash
  npm uninstall -g ts-node
  ```

---

## Configuración de variables de entorno

### (Comentado) Supabase
```env
# NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### PostgreSQL (recomendado)
```env
DATABASE_TYPE=postgresql
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=portfolio
POSTGRES_USERNAME=tu_usuario
POSTGRES_PASSWORD=tu_contraseña
POSTGRES_SSL=false
```
> También puedes usar un connection string:
> `POSTGRES_CONNECTION_STRING=postgresql://usuario:contraseña@host:puerto/base_de_datos`

---

## Arquitectura de Base de Datos (Multi-DB)

El proyecto ahora soporta varias bases de datos, siendo **PostgreSQL puro** la opción recomendada y por defecto.  
Puedes cambiar de base de datos solo modificando la variable `DATABASE_TYPE` en tu `.env.local`.

### Opciones soportadas:
- **PostgreSQL** (recomendado)
- Supabase (PostgreSQL + servicios extra)
- MongoDB (NoSQL)
- MySQL (preparado)
- SQLite (preparado)

### Esquema de base de datos
El archivo `lib/database/schema.sql` contiene el SQL para crear las tablas y triggers necesarios en PostgreSQL.

### Cambiar de base de datos
Solo cambia la variable `DATABASE_TYPE` y ajusta las variables de entorno correspondientes.  
El código de la app no necesita cambios.

---

## Comandos útiles del proyecto

- Iniciar el servidor de desarrollo:
  ```bash
  npm run dev
  ```
- Ejecutar scripts TypeScript modernos:
  ```bash
  npx ts-node --esm archivo.ts
  ```
- Migrar datos de ejemplo:
  ```bash
  npx ts-node --esm scripts/migrate-jobs.mts
  ```

---

## Servicios y Componentes

### Servicios
- **`JobsService`** y **`ClientsService`**:  
  Acceso unificado a la base de datos, independiente del motor elegido.
- Implementaciones específicas en `lib/database/` para cada motor.

### Componentes Nuevos
- **`ClientsAdminPanel`** (`components/clients-admin-panel.tsx`):  
  Panel de administración de clientes, filtros, estadísticas y gestión de estados.
- **`JobAdminPanel`** (`components/job-admin-panel.tsx`):  
  Panel de administración de trabajos.

### Páginas Actualizadas
- **`/contact`**: Guarda datos en la base seleccionada.
- **`/admin/dashboard`**: Gestión de clientes y trabajos.

---

## Estructura de la Base de Datos (PostgreSQL)

### Tabla `jobs`
```sql
CREATE TABLE jobs (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  video VARCHAR(500),
  link VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `contact_submissions`
```sql
CREATE TABLE contact_submissions (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'rejected', 'unread')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## Flujo de Trabajo con Clientes

1. **Cliente envía mensaje** desde `/contact`
2. **Datos se guardan** en la tabla `contact_submissions` con estado `pending`
3. **Admin ve mensajes** en `/admin/dashboard`
4. **Admin gestiona estados**:
   - `pending` → `contacted` (cuando responde)
   - `contacted` → `completed` (cuando finaliza)
   - `pending` → `rejected` (si no interesa)

---

## Buenas prácticas
- Usar siempre `npx` para ejecutar herramientas instaladas localmente.
- Mantener Node.js y npm actualizados.
- Verificar que las variables de entorno estén configuradas antes de ejecutar.
- Los datos de clientes se guardan automáticamente al enviar el formulario de contacto.
- El panel de administración muestra estadísticas en tiempo real.
- Actualiza este archivo cada vez que instales o uses una herramienta nueva, o si tienes dudas sobre cómo actualizar algo, ¡pregúntame!

---

¿Quieres que agregue alguna sección específica o detalle técnico adicional? 

## 15/07/2025 - Solución definitiva error 'fs' y separación cliente/servidor

- Se eliminaron todos los imports de servicios de base de datos (`JobsService`, `ClientsService`, etc.) en componentes cliente (`dashboard-client.tsx`, `clients-admin-panel.tsx`).
- Ahora, los componentes cliente solo usan `fetch` para interactuar con la API (endpoints en `/api/jobs` y `/api/clients`).
- Todo el acceso a la base de datos ocurre exclusivamente en Server Components o en endpoints API.
- Esto soluciona definitivamente el error `Module not found: Can't resolve 'fs'` y asegura compatibilidad total con Next.js.
- El dashboard y el panel de clientes funcionan correctamente y son seguros para el entorno de producción. 