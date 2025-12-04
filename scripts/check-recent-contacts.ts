import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkRecentContacts() {
  console.log('🔍 Verificando contactos recientes en Supabase...\n')

  try {
    // Obtener todos los contactos ordenados por fecha
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('❌ Error al leer contactos:', error)
      return
    }

    console.log(`✅ Total de contactos encontrados: ${data?.length || 0}\n`)

    if (data && data.length > 0) {
      console.log('📋 Últimos contactos:\n')
      data.forEach((contact, index) => {
        const date = new Date(contact.created_at).toLocaleString('es-AR')
        console.log(`${index + 1}. ${contact.name} (${contact.email})`)
        console.log(`   Teléfono: ${contact.phone}`)
        console.log(`   Empresa: ${contact.company || 'N/A'}`)
        console.log(`   Estado: ${contact.status}`)
        console.log(`   Fecha: ${date}`)
        console.log(`   Mensaje: ${contact.message.substring(0, 50)}...`)
        console.log('')
      })
    } else {
      console.log('⚠️ No hay contactos en la base de datos')
    }

  } catch (error) {
    console.error('💥 Error:', error)
  }
}

checkRecentContacts().catch(console.error)
