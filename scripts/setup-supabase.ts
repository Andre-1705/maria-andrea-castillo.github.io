import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupContactTable() {
  console.log('🔍 Verificando tabla contact_submissions...')

  try {
    // 1. Intentar leer la tabla
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('count')
      .limit(1)

    if (!error) {
      console.log('✅ Tabla contact_submissions ya existe')
      return
    }

    if (error.message.includes('relation "contact_submissions" does not exist')) {
      console.log('⚠️  Tabla no existe. Creando...')
      
      // 2. Crear la tabla usando SQL
      const { error: createError } = await supabase.rpc('execute_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.contact_submissions (
            id BIGSERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'rejected')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Crear índices
          CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
          CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
          CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

          -- Habilitar RLS
          ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

          -- Crear políticas de seguridad
          CREATE POLICY "Permite insert sin autenticación" ON public.contact_submissions
            FOR INSERT WITH CHECK (true);

          CREATE POLICY "Permite select solo autenticados" ON public.contact_submissions
            FOR SELECT USING (auth.role() = 'authenticated');

          CREATE POLICY "Permite update solo autenticados" ON public.contact_submissions
            FOR UPDATE USING (auth.role() = 'authenticated');

          CREATE POLICY "Permite delete solo autenticados" ON public.contact_submissions
            FOR DELETE USING (auth.role() = 'authenticated');
        `
      })

      if (createError) {
        console.error('❌ Error al crear tabla:', createError)
        console.log('💡 Intenta crear la tabla manualmente en el SQL Editor de Supabase')
        return
      }

      console.log('✅ Tabla contact_submissions creada exitosamente')
    } else {
      console.error('❌ Error desconocido:', error)
    }
  } catch (error) {
    console.error('💥 Error:', error)
    console.log('\n📝 Crea la tabla manualmente en Supabase con este SQL:\n')
    console.log(`
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Permite insert sin autenticación" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permite select solo autenticados" ON public.contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Permite update solo autenticados" ON public.contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Permite delete solo autenticados" ON public.contact_submissions
  FOR DELETE USING (auth.role() = 'authenticated');
    `)
  }
}

setupContactTable().catch(console.error)
