# Cómo activar el panel de administración (/admin)

Tu sitio ahora tiene un dashboard en `/admin` para subir y editar las fotos
de la galería, con login por usuario y contraseña. Sigue estos pasos en orden.

## 1. Instalar las dependencias nuevas

```bash
npm install
```

## 2. Crear el almacenamiento en Vercel

Entra a tu proyecto en vercel.com → pestaña **Storage**:

1. **Create Database → Postgres** (plan gratuito alcanza de sobra). Conéctala a este proyecto.
2. **Create → Blob** (para guardar las fotos que subas). Conéctala también.

Esto agrega automáticamente las variables `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, etc.
a tu proyecto en Vercel — no tenés que copiarlas a mano.

## 3. Agregar las variables de sesión

En Vercel → **Settings → Environment Variables**, agregá:

- `NEXTAUTH_URL` → la URL de tu sitio (ej: `https://prohomeservices.vercel.app`)
- `NEXTAUTH_SECRET` → una clave aleatoria. Generala corriendo en tu terminal:
  ```bash
  openssl rand -base64 32
  ```

## 4. Traer las variables a tu computadora y crear tu usuario admin

```bash
npm i -g vercel        # si no lo tenés instalado
vercel link            # conecta esta carpeta con tu proyecto de Vercel
vercel env pull .env.local
node scripts/init-db.mjs tu@email.com "tu-contraseña-segura" "Tu Nombre"
```

Ese último comando crea las tablas de la base de datos y tu primer usuario.
Podés correrlo de nuevo con otro email para crear más usuarios, o hacerlo
directamente desde el dashboard una vez adentro (sección "Usuarios del panel").

## 5. Desplegar

```bash
git add .
git commit -m "Agregar dashboard de administración"
git push
```

Vercel va a desplegar automáticamente. Una vez arriba, entra a:

```
https://tu-dominio.vercel.app/admin/login
```

e ingresa con el email y contraseña que creaste en el paso 4.

## Qué podés hacer desde el dashboard

- Subir fotos nuevas desde tu computadora (JPG, PNG, WEBP — hasta 8MB)
- Editar el título y la ubicación de cada foto
- Marcar una foto como "tamaño grande" (ocupa 2 columnas en la grilla del sitio)
- Reordenar las fotos con las flechas ↑ ↓
- Borrar fotos
- Agregar más usuarios con su propio email y contraseña

## Notas

- Mientras no completes los pasos 2–4, el sitio sigue funcionando normal
  (usa las fotos originales como respaldo) — no se rompe nada.
- Los cambios que hagas en `/admin` se ven en el sitio público al instante
  (no hace falta re-desplegar).
