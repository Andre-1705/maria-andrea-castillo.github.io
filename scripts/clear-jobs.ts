import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function clearJobsTable() {
  try {
    console.log('🗑️  Borrando todos los registros de la tabla Trabajos...')
    
    const { error } = await supabase
      .from('Trabajos')
      .delete()
      .neq('id', 0) // Esto borra todos los registros
    
    if (error) {
      console.error('❌ Error al borrar registros:', error)
      return
    }
    
    console.log('✅ Todos los registros han sido borrados exitosamente')
    console.log('📝 Ahora puedes importar el nuevo CSV con los datos correctos')
    
  } catch (error) {
    console.error('❌ Error inesperado:', error)
  }
}

clearJobsTable() 