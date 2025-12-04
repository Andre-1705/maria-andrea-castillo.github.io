import 'dotenv/config'
import { ClientsService } from '../lib/clients-service'
import { getDatabaseConfig, validateDatabaseConfig } from '../lib/database/config'

async function testContactSubmission() {
  console.log('🧪 Iniciando prueba de ContactSubmission...')

  // 1. Verificar configuración
  console.log('\n1️⃣ Verificando configuración de BD...')
  const config = getDatabaseConfig()
  console.log(`📋 DATABASE_TYPE: ${config.type}`)
  console.log(`✔️ Configuración validada: ${validateDatabaseConfig(config)}`)
  
  if (config.type === 'supabase') {
    console.log(`🔗 Supabase URL: ${config.connectionString}`)
    console.log(`🔑 Anon Key: ${config.options?.anonKey?.substring(0, 20)}...`)
  }

  // 2. Intentar crear un contacto
  console.log('\n2️⃣ Intentando crear un contacto de prueba...')
  try {
    const testContact = {
      name: 'Test Contact',
      email: 'test@example.com',
      phone: '+54 9 11 1234-5678',
      company: 'Test Company',
      message: 'Este es un mensaje de prueba para verificar que Supabase funciona correctamente.',
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log('📤 Enviando:', JSON.stringify(testContact, null, 2))
    const result = await ClientsService.createClient(testContact)
    console.log('✅ Contacto creado exitosamente:')
    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('❌ Error al crear contacto:', error)
    if (error instanceof Error) {
      console.error('📝 Mensaje:', error.message)
      console.error('🔗 Stack:', error.stack)
    }
  }

  // 3. Listar todos los contactos
  console.log('\n3️⃣ Listando todos los contactos...')
  try {
    const allContacts = await ClientsService.getAllClients()
    console.log(`✅ Total de contactos: ${allContacts.length}`)
    if (allContacts.length > 0) {
      console.log('📋 Últimos 3 contactos:')
      allContacts.slice(0, 3).forEach((c, i) => {
        console.log(`\n  ${i + 1}. ${c.name} (${c.email})`)
        console.log(`     Estado: ${c.status}`)
      })
    }
  } catch (error) {
    console.error('❌ Error al listar contactos:', error)
  }
}

testContactSubmission().catch(console.error)
