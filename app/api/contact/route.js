import { NextResponse } from "next/server";

// Servicio usado: Web3Forms (gratis, sin necesidad de SMTP propio).
// Necesitás una WEB3FORMS_ACCESS_KEY configurada en Vercel → Environment Variables.
// Instrucciones completas en CONTACT_FORM_SETUP.md
export async function POST(req) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "El formulario todavía no está conectado a un servicio de email. Contactanos por teléfono mientras tanto." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { name, phone, email, service, message } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Nombre y email son requeridos." }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: "Nueva solicitud de presupuesto — Pro Home Services",
        from_name: "Pro Home Services — Formulario Web",
        name,
        email,
        phone: phone || "No proporcionado",
        service: service || "No especificado",
        message: message || "(sin detalles)",
      }),
    });

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json({ error: "El servicio de email rechazó el mensaje. Intentá de nuevo." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Error de conexión al enviar el email." }, { status: 500 });
  }
}
