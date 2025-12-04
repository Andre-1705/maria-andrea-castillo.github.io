import fs from 'fs'
import path from 'path'
import csvParse from 'csv-parse/sync'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Carga primero .env.local; si no existe, intenta .env
const envLocalPath = path.resolve(process.cwd(), '.env.local')
const envPath = path.resolve(process.cwd(), '.env')
try {
  dotenv.config({ path: envLocalPath })
} catch {}
if (!process.env.EMAIL_SMTP_HOST && !process.env.EMAIL_SMTP_USER && !process.env.EMAIL_SMTP_PASS) {
  dotenv.config({ path: envPath })
}

// Env vars
const SMTP_HOST = process.env.EMAIL_SMTP_HOST || ''
const SMTP_PORT = Number(process.env.EMAIL_SMTP_PORT || '587')
const SMTP_USER = process.env.EMAIL_SMTP_USER || ''
const SMTP_PASS = process.env.EMAIL_SMTP_PASS || ''
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'Maria Andrea Castillo'
const FROM_EMAIL = process.env.EMAIL_FROM_EMAIL || SMTP_USER

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error('Faltan variables SMTP: EMAIL_SMTP_HOST, EMAIL_SMTP_USER, EMAIL_SMTP_PASS')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

const recipientsPath = path.resolve(process.cwd(), 'scripts', 'recipients.csv')
const csvContent = fs.readFileSync(recipientsPath, 'utf-8')
const records = csvParse.parse(csvContent, { columns: true, skip_empty_lines: true }) as Array<{email:string,name?:string,company?:string,phone?:string}>

const siteUrl = 'https://maria-andrea-castillo.github.io'
const year = new Date().getFullYear().toString()

const subject = '¡Felices Fiestas! Te invito a conocer mis trabajos ✨'

// Simple rate limiter
const DELAY_MS = Number(process.env.EMAIL_SEND_DELAY_MS || '3000') // 1 email cada 3s

function templateHtml(toName: string) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0b;color:#ffffff;padding:24px;font-family:Arial, Helvetica, sans-serif;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#121212;border:1px solid #2a2a2a;border-radius:12px;padding:24px;">
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <h1 style="margin:0;font-size:24px;color:#ffd166;">¡Felices Fiestas! ✨</h1>
            </td>
          </tr>
          <tr>
            <td style="font-size:16px;line-height:1.6;color:#eaeaea;">
              <p>Hola ${toName || ''},</p>
              <p>Te deseo unas fiestas llenas de paz, alegría y buenos momentos. Me encantaría invitarte a conocer mis trabajos y a interactuar con mi página. Tu opinión y comentarios son súper valiosos para seguir creciendo.</p>
              <p>
                👉 Visita: <a href="${siteUrl}" style="color:#72efdd;text-decoration:none;">${siteUrl}</a>
              </p>
              <p>Si querés dejarme un mensaje o colaborar, podés responder este correo o usar el formulario de contacto.</p>
              <p>¡Gracias por acompañarme este año!</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:24px;color:#aaaaaa;font-size:13px;">
              © ${year} Maria Andrea Castillo — <a href="${siteUrl}" style="color:#aaaaaa;">${siteUrl}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `
}

async function sendAll() {
  console.log(`Encontrados ${records.length} destinatarios`) 
  let sent = 0
  for (const rec of records) {
    const to = rec.email.trim()
    if (!to) continue

    const html = templateHtml(rec.name || '')
    const mailOptions = {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    }

    try {
      const info = await transporter.sendMail(mailOptions)
      sent++
      console.log(`✅ Enviado a ${to} | MessageID: ${info.messageId}`)
    } catch (err) {
      console.error(`❌ Error enviando a ${to}:`, err instanceof Error ? err.message : String(err))
    }

    await new Promise(res => setTimeout(res, DELAY_MS))
  }
  console.log(`Finalizado. Enviados: ${sent}/${records.length}`)
}

sendAll().catch(err => {
  console.error('Error general:', err)
  process.exit(1)
})
