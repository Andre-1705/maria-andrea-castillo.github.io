# Configuración de Base de Datos

Este proyecto está estructurado para soportar múltiples bases de datos. Actualmente soporta:

- **PostgreSQL** - Base de datos SQL recomendada (configuración por defecto)
- **Supabase** - PostgreSQL con servicios adicionales (auth, real-time, etc.)
- **MongoDB** - Base de datos NoSQL
- **MySQL** - Base de datos SQL (preparado para implementar)
- **SQLite** - Base de datos local (preparado para implementar)

## Estructura del Proyecto

```
lib/
├── database/
│   ├── config.ts          # Configuración de base de datos
│   ├── factory.ts         # Factory pattern para crear servicios
│   ├── postgresql.ts      # Implementación para PostgreSQL
│   ├── supabase.ts        # Implementación para Supabase
│   ├── mongodb.ts         # Implementación para MongoDB
│   ├── schema.sql         # Esquema de base de datos PostgreSQL
│   └── README.md          # Esta documentación
├── types/
│   └── database.ts        # Interfaces y tipos comunes
├── jobs-service.ts        # Servicio de trabajos (wrapper)
└── clients-service.ts     # Servicio de clientes (wrapper)
```

## Cómo Cambiar de Base de Datos

### 1. Configurar Variables de Entorno

Crea o modifica tu archivo `.env.local`:

#### Para PostgreSQL (recomendado):
```env
DATABASE_TYPE=postgresql
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=portfolio
POSTGRES_USERNAME=tu_usuario
POSTGRES_PASSWORD=tu_contraseña
POSTGRES_SSL=false
```

#### Para servicios en la nube (Railway, PlanetScale, etc.):
```env
DATABASE_TYPE=postgresql
POSTGRES_CONNECTION_STRING=postgresql://usuario:contraseña@host:puerto/base_de_datos
```

#### Para Supabase:
```env
DATABASE_TYPE=supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

#### Para MongoDB:
```env
DATABASE_TYPE=mongodb
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=portfolio
MONGODB_USERNAME=tu_usuario
MONGODB_PASSWORD=tu_contraseña
```

### 2. Configurar la Base de Datos PostgreSQL

#### Opción A: Base de datos local
1. Instala PostgreSQL en tu máquina
2. Crea una base de datos llamada `portfolio`
3. Ejecuta el script `lib/database/schema.sql` en tu base de datos

#### Opción B: Servicios en la nube
- **Railway**: Crea un proyecto y conecta tu base de datos PostgreSQL
- **PlanetScale**: Usa su base de datos PostgreSQL
- **AWS RDS**: Configura una instancia PostgreSQL
- **Heroku**: Usa su add-on de PostgreSQL

### 3. Instalar Dependencias

```bash
# PostgreSQL (ya incluido)
npm install pg

# MongoDB (opcional)
npm install mongodb

# MySQL (opcional)
npm install mysql2

# SQLite (opcional)
npm install sqlite3
```

### 4. Usar los Servicios

Los servicios se usan exactamente igual, sin importar la base de datos:

```typescript
import { JobsService } from '@/lib/jobs-service'
import { ClientsService } from '@/lib/clients-service'

// Obtener todos los trabajos
const jobs = await JobsService.getAllJobs()

// Crear un nuevo contacto
const contact = await ClientsService.createClient({
  name: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  message: 'Hola, me interesa tu trabajo'
})
```

## Ventajas de PostgreSQL

1. **🔄 ACID Compliance**: Transacciones completas y consistentes
2. **📊 SQL Completo**: Soporte completo para SQL estándar
3. **🔍 Búsquedas Avanzadas**: Full-text search y consultas complejas
4. **📈 Escalabilidad**: Maneja grandes volúmenes de datos
5. **🛡️ Seguridad**: Autenticación y autorización robustas
6. **🔧 Flexibilidad**: JSON, arrays, y tipos de datos avanzados

## Migración desde Supabase

Si quieres migrar desde Supabase a PostgreSQL puro:

1. **Exportar datos de Supabase**:
   ```sql
   -- En Supabase SQL Editor
   SELECT * FROM jobs;
   SELECT * FROM contact_submissions;
   ```

2. **Configurar PostgreSQL**:
   ```env
   DATABASE_TYPE=postgresql
   POSTGRES_HOST=tu_host
   POSTGRES_DATABASE=portfolio
   POSTGRES_USERNAME=tu_usuario
   POSTGRES_PASSWORD=tu_contraseña
   ```

3. **Ejecutar el esquema**:
   ```bash
   psql -h tu_host -U tu_usuario -d portfolio -f lib/database/schema.sql
   ```

4. **Importar los datos** (ajusta según tu estructura)

## Troubleshooting

### Error de conexión PostgreSQL
- Verifica que PostgreSQL esté ejecutándose
- Comprueba las credenciales
- Asegúrate de que el puerto 5432 esté abierto

### Error de SSL
Si usas un servicio en la nube que requiere SSL:
```env
POSTGRES_SSL=true
```

### Error de configuración
Verifica que todas las variables de entorno estén configuradas correctamente según el tipo de base de datos elegido.

## Servicios Recomendados

### Para Desarrollo:
- **PostgreSQL local** - Instalación directa
- **Docker** - `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

### Para Producción:
- **Railway** - Fácil de usar, buen precio
- **PlanetScale** - Escalable, buen rendimiento
- **AWS RDS** - Empresarial, muy confiable
- **Heroku Postgres** - Integración con Heroku 