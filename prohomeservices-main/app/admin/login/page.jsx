"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f8f4ee", fontFamily: "'Jost', sans-serif", padding: "20px",
    }}>
      <form onSubmit={handleSubmit} style={{
        width: "100%", maxWidth: "380px", background: "#fffdf9",
        border: "1px solid rgba(160,120,64,.18)", padding: "40px 36px",
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 500,
          color: "#1c0f06", marginBottom: "6px",
        }}>Panel de Administración</h1>
        <p style={{ fontSize: "13px", color: "#8c7460", marginBottom: "28px" }}>
          Pro Home Services & Construction Management
        </p>

        <label style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#8c7460", display: "block", marginBottom: "8px" }}>
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%", padding: "12px 0", marginBottom: "20px", border: "none",
            borderBottom: "1.5px solid rgba(160,120,64,.28)", background: "transparent",
            fontSize: "14px", outline: "none",
          }}
        />

        <label style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#8c7460", display: "block", marginBottom: "8px" }}>
          Contraseña
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%", padding: "12px 0", marginBottom: "24px", border: "none",
            borderBottom: "1.5px solid rgba(160,120,64,.28)", background: "transparent",
            fontSize: "14px", outline: "none",
          }}
        />

        {error && (
          <p style={{ color: "#b23b3b", fontSize: "13px", marginBottom: "18px" }}>{error}</p>
        )}

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "14px", background: "#c9a96e", color: "#fff",
          border: "none", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase",
          cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
