"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";

const styles = {
  page: { minHeight: "100vh", background: "#f8f4ee", fontFamily: "'Jost', sans-serif", color: "#1c0f06" },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "22px clamp(20px,4vw,60px)", background: "#1c0f06",
  },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "#fff", fontWeight: 500 },
  main: { maxWidth: "1100px", margin: "0 auto", padding: "48px clamp(20px,4vw,60px)" },
  card: { background: "#fffdf9", border: "1px solid rgba(160,120,64,.18)", padding: "28px", marginBottom: "24px" },
  sectionTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", marginBottom: "18px", fontWeight: 500 },
  label: { fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#8c7460", display: "block", marginBottom: "6px" },
  input: {
    width: "100%", padding: "10px 0", marginBottom: "16px", border: "none",
    borderBottom: "1.5px solid rgba(160,120,64,.28)", background: "transparent", fontSize: "14px", outline: "none",
  },
  btn: {
    padding: "12px 26px", background: "#c9a96e", color: "#fff", border: "none",
    fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
  },
  btnGhost: {
    padding: "10px 20px", background: "transparent", color: "#1c0f06", border: "1px solid rgba(160,120,64,.35)",
    fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer",
  },
  btnDanger: {
    padding: "8px 14px", background: "transparent", color: "#b23b3b", border: "1px solid rgba(178,59,59,.4)",
    fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "18px" },
  photoCard: { border: "1px solid rgba(160,120,64,.18)", background: "#fffdf9" },
  thumb: { width: "100%", height: "140px", objectFit: "cover", display: "block" },
  err: { color: "#b23b3b", fontSize: "13px", marginBottom: "14px" },
  ok: { color: "#3b7a3b", fontSize: "13px", marginBottom: "14px" },
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loc, setLoc] = useState("");
  const [wide, setWide] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPass, setNewUserPass] = useState("");
  const [userMsg, setUserMsg] = useState("");

  const loadPortfolio = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/portfolio");
    const data = await res.json();
    setPortfolio(data);
    setLoading(false);
  }, []);

  const loadUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
  }, []);

  useEffect(() => {
    loadPortfolio();
    loadUsers();
  }, [loadPortfolio, loadUsers]);

  async function handleUpload(e) {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Elegí un archivo de imagen primero.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Error al subir la imagen");

      const createRes = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Proyecto sin título",
          loc: loc || "Westchester, NY",
          img: uploadData.url,
          thumb: uploadData.url,
          wide,
        }),
      });
      if (!createRes.ok) throw new Error("Error al guardar el proyecto");

      setFile(null);
      setTitle("");
      setLoc("");
      setWide(false);
      e.target.reset?.();
      await loadPortfolio();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Borrar esta foto de la galería?")) return;
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
    await loadPortfolio();
  }

  async function handleFieldSave(item, field, value) {
    await fetch(`/api/portfolio/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: item.title, loc: item.loc, wide: item.wide, [field]: value }),
    });
  }

  function updateLocal(id, field, value) {
    setPortfolio((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function move(index, direction) {
    const newList = [...portfolio];
    const target = index + direction;
    if (target < 0 || target >= newList.length) return;
    [newList[index], newList[target]] = [newList[target], newList[index]];
    setPortfolio(newList);
    await Promise.all(
      newList.map((item, i) => fetch(`/api/portfolio/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: i }),
      }))
    );
  }

  async function handleAddUser(e) {
    e.preventDefault();
    setUserMsg("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newUserEmail, name: newUserName, password: newUserPass }),
    });
    const data = await res.json();
    if (!res.ok) {
      setUserMsg(data.error || "Error al crear el usuario");
      return;
    }
    setUserMsg(`Usuario ${data.email} creado.`);
    setNewUserEmail("");
    setNewUserName("");
    setNewUserPass("");
    await loadUsers();
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Panel · Galería</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "rgba(255,255,255,.6)", fontSize: "12px" }}>{session?.user?.email}</span>
          <button style={styles.btnGhost} onClick={() => signOut({ callbackUrl: "/admin/login" })}>
            Salir
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Subir nueva foto */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Agregar foto al portafolio</h2>
          {error && <p style={styles.err}>{error}</p>}
          <form onSubmit={handleUpload}>
            <label style={styles.label}>Archivo de imagen (JPG, PNG, WEBP — máx. 8MB)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ marginBottom: "16px", display: "block" }}
            />
            <label style={styles.label}>Título del proyecto</label>
            <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Remodelación de Cocina" />
            <label style={styles.label}>Ubicación</label>
            <input style={styles.input} value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Ej: Ossining, NY" />
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", fontSize: "13px" }}>
              <input type="checkbox" checked={wide} onChange={(e) => setWide(e.target.checked)} />
              Mostrar en tamaño grande (ocupa 2 columnas en la grilla)
            </label>
            <button type="submit" style={styles.btn} disabled={uploading}>
              {uploading ? "Subiendo..." : "Subir foto"}
            </button>
          </form>
        </section>

        {/* Lista de fotos */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Fotos actuales ({portfolio.length})</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div style={styles.grid}>
              {portfolio.map((item, i) => (
                <div key={item.id} style={styles.photoCard}>
                  <img src={item.thumb} alt={item.title} style={styles.thumb} />
                  <div style={{ padding: "14px" }}>
                    <input
                      style={{ ...styles.input, fontSize: "13px", marginBottom: "8px" }}
                      value={item.title}
                      onChange={(e) => updateLocal(item.id, "title", e.target.value)}
                      onBlur={(e) => handleFieldSave(item, "title", e.target.value)}
                    />
                    <input
                      style={{ ...styles.input, fontSize: "12px", marginBottom: "10px" }}
                      value={item.loc}
                      onChange={(e) => updateLocal(item.id, "loc", e.target.value)}
                      onBlur={(e) => handleFieldSave(item, "loc", e.target.value)}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", marginBottom: "12px" }}>
                      <input
                        type="checkbox"
                        checked={!!item.wide}
                        onChange={(e) => {
                          updateLocal(item.id, "wide", e.target.checked);
                          handleFieldSave(item, "wide", e.target.checked);
                        }}
                      />
                      Tamaño grande
                    </label>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button style={styles.btnGhost} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                        <button style={styles.btnGhost} onClick={() => move(i, 1)} disabled={i === portfolio.length - 1}>↓</button>
                      </div>
                      <button style={styles.btnDanger} onClick={() => handleDelete(item.id)}>Borrar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Usuarios */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>Usuarios del panel</h2>
          <ul style={{ marginBottom: "24px", fontSize: "13px", color: "#8c7460", lineHeight: 1.9 }}>
            {users.map((u) => (
              <li key={u.id}>{u.name} — {u.email}</li>
            ))}
          </ul>
          {userMsg && <p style={userMsg.includes("creado") ? styles.ok : styles.err}>{userMsg}</p>}
          <form onSubmit={handleAddUser} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "14px", alignItems: "end" }}>
            <div>
              <label style={styles.label}>Nombre</label>
              <input style={styles.input} value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Email</label>
              <input style={styles.input} type="email" required value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Contraseña</label>
              <input style={styles.input} type="password" required minLength={8} value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} />
            </div>
            <button type="submit" style={{ ...styles.btn, marginBottom: "16px" }}>Agregar</button>
          </form>
        </section>
      </main>
    </div>
  );
}
