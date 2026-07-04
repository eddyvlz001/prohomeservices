# Cómo activar el envío de emails del formulario de contacto

El formulario ahora manda el mensaje de verdad a tu Gmail usando un servicio
gratuito llamado Web3Forms. Son 2 minutos:

## 1. Conseguí tu clave gratis

1. Entrá a **https://web3forms.com**
2. Poné el email donde querés recibir los mensajes: `prohomeservices81@gmail.com`
3. Te va a llegar un email con tu **Access Key** (una clave larga tipo `a1b2c3d4-...`)

No hace falta crear cuenta ni contraseña — solo confirmás tu email.

## 2. Agregá la clave en Vercel

1. Andá a tu proyecto en Vercel → **Settings → Environment Variables**
2. Agregá una nueva variable:
   - Nombre: `WEB3FORMS_ACCESS_KEY`
   - Valor: la clave que te llegó por email
   - Marcala para **Production**
3. Guardá.

## 3. Volvé a desplegar

Como agregaste una variable nueva, hace falta un redeploy para que tome efecto:
- En Vercel → pestaña **Deployments** → en el último deploy, los 3 puntitos (`...`) → **Redeploy**

## 4. Probá el formulario

Entrá a tu sitio, llená el formulario de contacto y enviá un mensaje de prueba.
Debería llegarte a tu Gmail en menos de un minuto.

## Si no llega

- Revisá la carpeta de Spam la primera vez (Web3Forms es nuevo para tu cuenta)
- Confirmá que copiaste la clave completa, sin espacios, en Vercel
- Si el sitio te muestra un mensaje de error al enviar, mandame captura y lo revisamos
