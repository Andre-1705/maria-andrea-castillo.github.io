import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Verificando configuración de Supabase...')
console.log('URL:', supabaseUrl ? '✅ Configurada' : '❌ No configurada')
console.log('Anon Key:', supabaseKey ? '✅ Configurada' : '❌ No configurada')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno necesarias')
  console.log('Asegúrate de tener en tu .env.local:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabaseConnection() {
  try {
    console.log('🔗 Probando conexión a Supabase...')
    
    // Probar conexión básica
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Error de conexión:', error.message)
      
      if (error.message.includes('relation "contact_submissions" does not exist')) {
        console.log('💡 La tabla contact_submissions no existe. Necesitas crearla en Supabase.')
        console.log('Ejecuta este SQL en tu dashboard de Supabase:')
        console.log(`
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `)
      }
      
      if (error.message.includes('permission denied')) {
        console.log('💡 Error de permisos. Verifica las políticas RLS en Supabase.')
        console.log('Ejecuta este SQL para permitir inserciones anónimas:')
        console.log(`
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');
        `)
      }
      
      return
    }
    
    console.log('✅ Conexión exitosa a Supabase')
    
    // Probar inserción de datos
    console.log('📝 Probando inserción de datos...')
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      company: 'Test Company',
      message: 'This is a test message'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('contact_submissions')
      .insert(testData)
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Error al insertar datos:', insertError.message)
      return
    }
    
    console.log('✅ Inserción exitosa:', insertData)
    
    // Limpiar datos de prueba
    console.log('🧹 Limpiando datos de prueba...')
    const { error: deleteError } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('email', 'test@example.com')
    
    if (deleteError) {
      console.error('⚠️  Error al limpiar datos de prueba:', deleteError.message)
    } else {
      console.log('✅ Datos de prueba eliminados')
    }
    
    console.log('🎉 Todas las pruebas pasaron exitosamente!')
    
  } catch (error) {
    console.error('💥 Error inesperado:', error)
  }
}

testSupabaseConnection() 