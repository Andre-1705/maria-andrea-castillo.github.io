# EmailJS Template: Felices Fiestas e Invitación

Crea un template en EmailJS con este contenido y los siguientes parámetros.

## Template ID sugerido
`felices_fiestas_invite`

## Variables usadas
- `to_name` (Nombre del destinatario)
- `from_name` (Tu nombre, tomado del formulario)
- `reply_to` (Email del remitente)
- `phone` (Teléfono del remitente)
- `company` (Empresa del remitente, opcional)
- `message` (Mensaje adicional del remitente)
- `site_url` (URL de tu página)

## Contenido HTML del template

```html
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
            <p>Hola {{to_name}},</p>
            <p>Te deseo unas fiestas llenas de paz, alegría y buenos momentos. Me encantaría invitarte a conocer mis trabajos y a interactuar con mi página. Tu opinión y comentarios son súper valiosos para seguir creciendo.</p>
            <p>
              👉 Visita: <a href="{{site_url}}" style="color:#72efdd;text-decoration:none;">{{site_url}}</a>
            </p>
            <p>Si querés dejarme un mensaje o colaborar, podés responder este correo o usar el formulario de contacto.</p>
            <p style="margin-top:16px;">Detalles del remitente:</p>
            <ul style="padding-left:16px;">
              <li><strong>Nombre:</strong> {{from_name}}</li>
              <li><strong>Email:</strong> {{reply_to}}</li>
              <li><strong>Teléfono:</strong> {{phone}}</li>
              <li><strong>Empresa:</strong> {{company}}</li>
            </ul>
            <p><strong>Mensaje:</strong></p>
            <p style="background:#1a1a1a;padding:12px;border-radius:8px;">{{message}}</p>
            <p>¡Gracias por acompañarme este año!</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:24px;color:#aaaaaa;font-size:13px;">
            © {{year}} Maria Andrea Castillo — <a href="{{site_url}}" style="color:#aaaaaa;">{{site_url}}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

> Nota: añadí un `year` si querés actualizarlo dinámicamente desde tu código.

## Ejemplo de `templateParams`

```ts
const templateParams = {
  to_name: "Amigos y colegas",
  from_name: values.name,
  reply_to: values.email,
  phone: values.phone,
  company: values.company || "",
  message: values.message,
  site_url: "https://maria-andrea-castillo.github.io",
  year: new Date().getFullYear().toString(),
};
```

## Pasos en EmailJS
1. Crear un **Service** (por ejemplo, Gmail o EmailJS SMTP).
2. Crear un **Template** con el HTML anterior y variables.
3. Copiar `SERVICE_ID`, `TEMPLATE_ID` y `PUBLIC_KEY` y pegarlos en `.env.local`.
4. Probar desde el panel de EmailJS que el template renderiza correctamente.

## Envío a múltiples destinatarios
EmailJS no gestiona listas masivas por sí solo. Para una invitación “a todos”, usá:
- Crear la campaña desde tu proveedor (Mailchimp, Brevo) y enlazar EmailJS solo para formularios.
- O bien iterar destinatarios desde un script propio usando tu SMTP (no recomendado desde el cliente). Si querés, puedo armarte un script de envío por lotes.
