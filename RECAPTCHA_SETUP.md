# 🔐 Configuración de reCAPTCHA v3

Este proyecto ahora incluye **reCAPTCHA v3** para proteger el formulario de contacto contra spam y bots.

## ¿Qué es reCAPTCHA v3?

- ✅ **Invisible**: El usuario no ve ningún CAPTCHA
- ✅ **Sin interacción**: No require que el usuario haga clic
- ✅ **Protección automática**: Analiza el comportamiento del usuario
- ✅ **Score-based**: Devuelve un score (0.0-1.0) indicando qué tan probable es que sea un bot

## Pasos para configurar

### 1. Crear claves de reCAPTCHA

1. Ve a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Haz clic en "+" (crear nuevo sitio)
3. Nombre: `Maria Andrea Castillo Portfolio`
4. Tipo: **reCAPTCHA v3**
5. Dominios: 
   - `localhost` (desarrollo)
   - `maria-andrea-castillo.github.io` (producción)
   - Tu dominio de Vercel (si lo tienes)
6. Acepta los términos y haz clic en **Crear**
7. Copia las dos claves:
   - **Site Key** → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - **Secret Key** → `RECAPTCHA_SECRET_KEY`

### 2. Agregar claves a `.env.local`

```bash
# .env.local
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
RECAPTCHA_SECRET_KEY="6Lcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 3. Agregar claves a Vercel

En tu proyecto de Vercel:

1. Ve a **Settings** → **Environment Variables**
2. Agrega:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = tu site key
   - `RECAPTCHA_SECRET_KEY` = tu secret key
3. Haz clic en **Save**

### 4. Redeploy

En Vercel, haz clic en **Redeploy** para que cargue las nuevas variables.

## Cómo funciona

1. Usuario completa el formulario de contacto
2. Al hacer clic en "Enviar", reCAPTCHA v3 genera un **token**
3. El formulario se envía con el token al servidor
4. El servidor verifica el token con Google
5. Google retorna un **score** (0.0-1.0):
   - **0.9-1.0**: Definitivamente humano
   - **0.5-0.9**: Probablemente humano
   - **0.0-0.5**: Probablemente bot (se rechaza)

## Sin configurar reCAPTCHA

Si no configuras las claves, el formulario igual funcionará, pero **sin protección contra bots**.

## Verificar que está funcionando

Abre la consola del navegador (F12) al enviar un formulario y busca mensajes como:
- ✅ `reCAPTCHA token obtenido`
- ✅ `🔐 reCAPTCHA response: { success: true, score: 0.95, action: 'contact_form' }`

## Detalles técnicos

- **Librería**: `react-google-recaptcha-v3`
- **Endpoint**: `/api/recaptcha` (verificación del lado del servidor)
- **Score mínimo**: 0.5 (configurable en `app/api/recaptcha/route.ts`)
- **Action**: `contact_form` (para tener diferentes scores por acción)

## Recursos útiles

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/v3)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [react-google-recaptcha-v3 GitHub](https://github.com/ernestospeakert/react-google-recaptcha-v3)
