# Envío pequeño de Felicitaciones (Etapa 1)

Este flujo envía el email festivo a una lista pequeña (tus contactos cercanos) desde un script en Node usando SMTP.

## Preparación
1. Completa las variables en `.env.local` (ver `env.example`).
   - `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`
   - `EMAIL_FROM_NAME`, `EMAIL_FROM_EMAIL`
   - `EMAIL_SEND_DELAY_MS` (opcional, por defecto 3000 ms)
2. Edita `scripts/recipients.csv` con tus contactos (cabeceras: `email,name,company,phone`).

## Instalar dependencias
```pwsh
npm install nodemailer csv-parse dotenv ts-node typescript
```

## Ejecutar
```pwsh
npx ts-node scripts/send-festive.ts
```

- Envia 1 email cada `EMAIL_SEND_DELAY_MS` ms para evitar bloqueos.
- Imprime el `MessageID` por destinatario.

## Buenas prácticas
- Usá un SMTP con dominio verificado (Brevo, Mailchimp SMTP, etc.).
- Enviá primero a 3-5 contactos para probar.
- Respetá consentimiento y da opción de responder para baja manual.

## Etapa 2 (Campaña)
Para listas grandes o campañas: usar Mailchimp/Brevo y pegar el HTML de `EMAILJS_TEMPLATE.md`. Manejan bajas, métricas y entregabilidad.
