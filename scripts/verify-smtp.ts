import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'

// Carga primero .env.local; si no existe, intenta .env
const envLocalPath = path.resolve(process.cwd(), '.env.local')
const envPath = path.resolve(process.cwd(), '.env')
try {
  dotenv.config({ path: envLocalPath })
} catch {}
// Si no se cargaron las vars clave, intenta con .env
if (!process.env.EMAIL_SMTP_HOST && !process.env.EMAIL_SMTP_USER && !process.env.EMAIL_SMTP_PASS) {
  dotenv.config({ path: envPath })
}

async function main() {
  const host = process.env.EMAIL_SMTP_HOST
  const port = Number(process.env.EMAIL_SMTP_PORT || '587')
  const secure = port === 465
  const user = process.env.EMAIL_SMTP_USER
  const pass = process.env.EMAIL_SMTP_PASS

  if (!host || !user || !pass) {
    console.error('Faltan variables SMTP: EMAIL_SMTP_HOST/USER/PASS')
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } })

  try {
    await transporter.verify()
    console.log('SMTP OK')
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('SMTP ERROR:', msg)
    process.exit(1)
  }
}

main().catch(err => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error('ERROR general:', msg)
  process.exit(1)
})
