// Corre esto UNA SOLA VEZ para crear las tablas y tu primer usuario admin.
//
// Cómo usarlo:
//   1. npm install
//   2. vercel env pull .env.local       (trae las variables de Postgres/Blob desde Vercel)
//   3. node scripts/init-db.mjs tu@email.com "tu-contraseña" "Tu Nombre"
//
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error('Uso: node scripts/init-db.mjs tu@email.com "tu-contraseña" "Tu Nombre"');
  process.exit(1);
}

async function main() {
  console.log("Creando tablas si no existen...");

  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS portfolio_images (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      loc TEXT NOT NULL,
      img TEXT NOT NULL,
      thumb TEXT NOT NULL,
      wide BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  const passwordHash = await bcrypt.hash(password, 10);

  await sql`
    INSERT INTO admin_users (email, name, password_hash)
    VALUES (${email}, ${name || email}, ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `;

  console.log(`Listo. Usuario admin creado/actualizado: ${email}`);
  console.log("Ya puedes entrar a /admin/login con ese usuario y contraseña.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error inicializando la base de datos:", err);
  process.exit(1);
});