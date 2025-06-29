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

## Configuración de Supabase

### 1. Variables de Entorno
Crear archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 2. Crear Tablas en Supabase
Ejecutar el SQL del archivo `SUPABASE_SETUP.md` en el editor SQL de Supabase.

### 3. Migrar Datos de Ejemplo
```bash
npx ts-node --esm scripts/migrate-jobs.mts
```

## Comandos útiles del proyecto

- Iniciar el servidor de desarrollo:
  ```bash
  npm run dev
  ```
- Ejecutar scripts TypeScript modernos:
  ```bash
  npx ts-node --esm archivo.ts
  ```
- Migrar datos de ejemplo a Supabase:
  ```bash
  npx ts-node --esm scripts/migrate-jobs.mts
  ```

## Nuevas Funcionalidades Implementadas

### Gestión de Clientes
- **Tabla `clients`** en Supabase con campos:
  - `id` (UUID, auto-generado)
  - `name` (texto, obligatorio)
  - `email` (texto, único, obligatorio)
  - `phone` (texto, opcional)
  - `company` (texto, opcional)
  - `message` (texto, obligatorio)
  - `status` (enum: pending, contacted, completed, rejected)
  - `created_at` y `updated_at` (timestamps)

### Servicios Creados
- **`ClientsService`** (`lib/clients-service.ts`):
  - CRUD completo para clientes
  - Filtrado por estado
  - Estadísticas de clientes
  - Gestión de estados

### Componentes Nuevos
- **`ClientsAdminPanel`** (`components/clients-admin-panel.tsx`):
  - Panel de administración de clientes
  - Filtros por estado
  - Estadísticas en tiempo real
  - Gestión de estados de clientes

### Páginas Actualizadas
- **`/contact`**: Ahora guarda datos en Supabase
- **`/admin/dashboard`**: Incluye gestión de clientes
- **Formulario de contacto**: Campo de empresa agregado

## Estructura de la Base de Datos

### Tabla `jobs` (existente)
```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  video TEXT,
  link TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla `clients` (nueva)
```sql
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Flujo de Trabajo con Clientes

1. **Cliente envía mensaje** desde `/contact`
2. **Datos se guardan** en tabla `clients` con estado `pending`
3. **Admin ve mensajes** en `/admin/dashboard` → pestaña "Gestión de Clientes"
4. **Admin gestiona estados**:
   - `pending` → `contacted` (cuando responde)
   - `contacted` → `completed` (cuando finaliza)
   - `pending` → `rejected` (si no interesa)

## Buenas prácticas
- Usar siempre `npx` para ejecutar herramientas instaladas localmente.
- Mantener Node.js y npm actualizados.
- Verificar que las variables de entorno estén configuradas antes de ejecutar.
- Los datos de clientes se guardan automáticamente al enviar el formulario de contacto.
- El panel de administración muestra estadísticas en tiempo real.

---

*Actualiza este archivo cada vez que instales o uses una herramienta nueva, o si tienes dudas sobre cómo actualizar algo, ¡pregúntame!* 