import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updatePortfolioItem, deletePortfolioItem, reorderPortfolioItem } from "@/lib/db";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = Number(params.id);
  const body = await req.json();

  if (typeof body.sortOrder === "number") {
    await reorderPortfolioItem(id, body.sortOrder);
    return NextResponse.json({ ok: true });
  }

  const { title, loc, wide } = body;
  const item = await updatePortfolioItem(id, { title, loc, wide: !!wide });
  return NextResponse.json(item);
}

export async function DELETE(_req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = Number(params.id);
  await deletePortfolioItem(id);
  return NextResponse.json({ ok: true });
}
