import { sql } from "@vercel/postgres";

// Se muestra si todavía no corriste el script de setup (scripts/init-db.mjs)
// o si las variables de entorno de Postgres no están configuradas.
// Así el sitio nunca se cae mientras conectas la base de datos.
const FALLBACK_PORTFOLIO = [
  { id: 1, title: "Modern Kitchen Renovation",    loc: "Ossining, NY",      img: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1400&q=90&auto=format&fit=crop",  thumb: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=700&q=80&auto=format&fit=crop",  wide: true,  sort_order: 0 },
  { id: 2, title: "Master Bathroom Overhaul",     loc: "White Plains, NY",  img: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=90&auto=format&fit=crop",  thumb: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=700&q=80&auto=format&fit=crop",  wide: false, sort_order: 1 },
  { id: 3, title: "Open-Plan Living & Flooring",  loc: "Tarrytown, NY",     img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=90&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&q=80&auto=format&fit=crop", wide: false, sort_order: 2 },
  { id: 4, title: "Custom Cabinetry Suite",       loc: "Yonkers, NY",       img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1400&q=90&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700&q=80&auto=format&fit=crop", wide: false, sort_order: 3 },
  { id: 5, title: "Commercial Office Renovation", loc: "Commercial Project",img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&q=90&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=700&q=80&auto=format&fit=crop", wide: false, sort_order: 4 },
  { id: 6, title: "Crown Molding & Trim Package", loc: "Sleepy Hollow, NY", img: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1400&q=90&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=700&q=80&auto=format&fit=crop", wide: true,  sort_order: 5 },
  { id: 7, title: "Exterior Remodeling",          loc: "Ossining, NY",      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=90&auto=format&fit=crop",  thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80&auto=format&fit=crop",  wide: true,  sort_order: 6 },
  { id: 8, title: "Hardwood Floor Installation",  loc: "Tarrytown, NY",     img: "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=1400&q=90&auto=format&fit=crop",  thumb: "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=700&q=80&auto=format&fit=crop",  wide: false, sort_order: 7 },
  { id: 9, title: "Full Home Renovation",         loc: "White Plains, NY",  img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&q=90&auto=format&fit=crop", thumb: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=700&q=80&auto=format&fit=crop", wide: false, sort_order: 8 },
];

export async function getPortfolio() {
  try {
    const { rows } = await sql`
      SELECT id, title, loc, img, thumb, wide, sort_order
      FROM portfolio_images
      ORDER BY sort_order ASC, id ASC
    `;
    if (rows.length === 0) return FALLBACK_PORTFOLIO;
    return rows;
  } catch (err) {
    // La tabla todavía no existe o falta configurar Postgres.
    console.error("getPortfolio: usando datos de respaldo —", err.message);
    return FALLBACK_PORTFOLIO;
  }
}

export async function createPortfolioItem({ title, loc, img, thumb, wide }) {
  const { rows } = await sql`
    INSERT INTO portfolio_images (title, loc, img, thumb, wide, sort_order)
    VALUES (
      ${title}, ${loc}, ${img}, ${thumb}, ${wide},
      COALESCE((SELECT MAX(sort_order) + 1 FROM portfolio_images), 0)
    )
    RETURNING id, title, loc, img, thumb, wide, sort_order
  `;
  return rows[0];
}

export async function updatePortfolioItem(id, { title, loc, wide }) {
  const { rows } = await sql`
    UPDATE portfolio_images
    SET title = ${title}, loc = ${loc}, wide = ${wide}
    WHERE id = ${id}
    RETURNING id, title, loc, img, thumb, wide, sort_order
  `;
  return rows[0];
}

export async function reorderPortfolioItem(id, sortOrder) {
  await sql`UPDATE portfolio_images SET sort_order = ${sortOrder} WHERE id = ${id}`;
}

export async function deletePortfolioItem(id) {
  await sql`DELETE FROM portfolio_images WHERE id = ${id}`;
}

export async function getUserByEmail(email) {
  const { rows } = await sql`
    SELECT id, email, name, password_hash FROM admin_users WHERE email = ${email}
  `;
  return rows[0] || null;
}

export async function createUser({ email, name, passwordHash }) {
  const { rows } = await sql`
    INSERT INTO admin_users (email, name, password_hash)
    VALUES (${email}, ${name}, ${passwordHash})
    RETURNING id, email, name
  `;
  return rows[0];
}

export async function listUsers() {
  const { rows } = await sql`SELECT id, email, name, created_at FROM admin_users ORDER BY created_at ASC`;
  return rows;
}
