import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function enableRLS() {
  console.log('🔐 Habilitando RLS en contact_submissions...')

  try {
    // Usar SQL directo para habilitar RLS
    // Nota: Esto puede requerir acceso con service role key
    
    const sql = `
      -- Habilitar RLS
      ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

      -- Eliminar políticas antiguas si existen
      DROP POLICY IF EXISTS "Permite insert sin autenticación" ON public.contact_submissions;
      DROP POLICY IF EXISTS "Permite select solo autenticados" ON public.contact_submissions;
      DROP POLICY IF EXISTS "Permite update solo autenticados" ON public.contact_submissions;
      DROP POLICY IF EXISTS "Permite delete solo autenticados" ON public.contact_submissions;

      -- Crear política para INSERT sin autenticación (para formulario público)
      CREATE POLICY "allow_insert_anonymous" ON public.contact_submissions
        FOR INSERT 
        WITH CHECK (true);

      -- Crear política para SELECT (solo usuarios autenticados)
      CREATE POLICY "allow_select_authenticated" ON public.contact_submissions
        FOR SELECT 
        USING (auth.role() = 'authenticated');

      -- Crear política para UPDATE (solo usuarios autenticados)
      CREATE POLICY "allow_update_authenticated" ON public.contact_submissions
        FOR UPDATE 
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated');

      -- Crear política para DELETE (solo usuarios autenticados)
      CREATE POLICY "allow_delete_authenticated" ON public.contact_submissions
        FOR DELETE 
        USING (auth.role() = 'authenticated');
    `

    console.log('📝 SQL a ejecutar:')
    console.log(sql)
    console.log('\n⚠️  Debes ejecutar este SQL manualmente en Supabase:')
    console.log('1. Ve a tu proyecto en Supabase')
    console.log('2. Abre la pestaña "SQL Editor"')
    console.log('3. Crea una nueva query')
    console.log('4. Copia y pega el SQL anterior')
    console.log('5. Ejecuta la query\n')

  } catch (error) {
    console.error('Error:', error)
  }
}

enableRLS().catch(console.error)
