import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

// Lee ambos CSVs de Google Contacts y los combina
const googleCsvPaths = [
  path.resolve('C:\\Users\\maria\\OneDrive\\Escritorio\\contacts.csv'),
  path.resolve('C:\\Users\\maria\\OneDrive\\Escritorio\\contacts1.csv')
]
const outputPath = path.resolve(process.cwd(), 'scripts', 'recipients.csv')

interface GoogleContact {
  'First Name'?: string
  'Middle Name'?: string
  'Last Name'?: string
  'Organization Name'?: string
  'E-mail 1 - Value'?: string
  'Phone 1 - Value'?: string
}

interface Recipient {
  email: string
  name: string
  company: string
  phone: string
}

const recipients: Recipient[] = []

// Procesa todos los archivos CSV de Google
for (const csvPath of googleCsvPaths) {
  if (!fs.existsSync(csvPath)) {
    console.warn(`⚠️  Archivo no encontrado: ${csvPath}`)
    continue
  }
  
  const googleCsv = fs.readFileSync(csvPath, 'utf-8')
  const records = parse(googleCsv, { columns: true, skip_empty_lines: true })
  
  for (const rec of records as GoogleContact[]) {
    const email = (rec['E-mail 1 - Value'] || '').trim()
    if (!email || email.includes('@discordapp.com') || email.includes('example.com')) {
      continue // Omite contactos sin email o emails de servicio
    }

    const firstName = (rec['First Name'] || '').trim()
    const middleName = (rec['Middle Name'] || '').trim()
    const lastName = (rec['Last Name'] || '').trim()
    const name = [firstName, middleName, lastName].filter(Boolean).join(' ') || 'Amigo/a'

    const company = (rec['Organization Name'] || '').trim()
    const phone = (rec['Phone 1 - Value'] || '').trim()

    recipients.push({ email, name, company, phone })
  }
}

const outputCsv = stringify(recipients, { header: true, columns: ['email', 'name', 'company', 'phone'] })
fs.writeFileSync(outputPath, outputCsv, 'utf-8')

console.log(`✅ Convertidos ${recipients.length} contactos con email válido a ${outputPath}`)
console.log('Primeros 5 contactos:')
recipients.slice(0, 5).forEach(r => console.log(`  - ${r.name} <${r.email}>`))
