# Configuración de Supabase

Este proyecto ahora utiliza Supabase como base de datos. Sigue estos pasos para configurarlo:

## 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Anota la URL del proyecto y la clave anónima

## 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## 3. Crear Tablas en Supabase

### Tabla `jobs` (ya existente)

```sql
-- Crear tabla de trabajos
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

-- Crear índices para mejor rendimiento
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
```

### Tabla `clients` (nueva)

```sql
-- Crear tabla de clientes
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

-- Crear índices para mejor rendimiento
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_created_at ON clients(created_at);
CREATE INDEX idx_clients_email ON clients(email);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. Configurar Políticas de Seguridad (RLS)

```sql
-- Habilitar RLS en las tablas
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Políticas para jobs (lectura pública, escritura solo para autenticados)
CREATE POLICY "Jobs are viewable by everyone" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Jobs can be created by authenticated users" ON jobs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Jobs can be updated by authenticated users" ON jobs
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Jobs can be deleted by authenticated users" ON jobs
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para clients (lectura y escritura solo para autenticados)
CREATE POLICY "Clients are viewable by authenticated users" ON clients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Clients can be created by everyone" ON clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Clients can be updated by authenticated users" ON clients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Clients can be deleted by authenticated users" ON clients
  FOR DELETE USING (auth.role() = 'authenticated');
```

## 5. Migrar Datos de Ejemplo

Después de crear las tablas, ejecuta:

```bash
npx ts-node --esm scripts/migrate-jobs.mts
```

## 6. Verificar Configuración

Para verificar que todo funciona:

1. Ejecuta el servidor de desarrollo: `npm run dev`
2. Ve a `/admin` y inicia sesión
3. Verifica que puedes ver y gestionar los trabajos
4. Ve a `/contact` y envía un mensaje de prueba
5. Verifica en Supabase que el cliente se guardó correctamente

## Estructura de la base de datos

### Tabla: `jobs`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | TEXT | ID único del trabajo |
| `title` | TEXT | Título del trabajo |
| `description` | TEXT | Descripción del trabajo |
| `image` | TEXT | URL de la imagen |
| `video` | TEXT | URL del video (opcional) |
| `link` | TEXT | Enlace al trabajo |
| `category` | TEXT | Categoría del trabajo |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de última actualización |

## Funcionalidades implementadas

- ✅ Carga de trabajos desde Supabase
- ✅ Filtrado por categorías
- ✅ Página de detalle del trabajo
- ✅ Servicio completo para CRUD operations
- ✅ Migración de datos existentes
- ✅ Manejo de errores y estados de carga

## Próximos pasos (opcionales)

1. **Autenticación**: Implementar autenticación de usuarios
2. **Panel de administración**: Crear interfaz para gestionar trabajos
3. **Subida de archivos**: Integrar almacenamiento de Supabase para imágenes/videos
4. **Búsqueda**: Implementar búsqueda en tiempo real
5. **Filtros avanzados**: Añadir más opciones de filtrado

## Solución de problemas

### Error de conexión
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que la URL y clave de Supabase sean correctas

### Error de migración
- Verifica que la tabla `jobs` exista en Supabase
- Revisa que las políticas RLS permitan inserción de datos

### Datos no se cargan
- Revisa la consola del navegador para errores
- Verifica que las políticas RLS permitan lectura pública 