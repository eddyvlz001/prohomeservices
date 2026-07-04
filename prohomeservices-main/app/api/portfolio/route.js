import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPortfolio, createPortfolioItem } from "@/lib/db";

export async function GET() {
  const portfolio = await getPortfolio();
  return NextResponse.json(portfolio);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { title, loc, img, thumb, wide } = body;

  if (!title || !loc || !img) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const item = await createPortfolioItem({
    title,
    loc,
    img,
    thumb: thumb || img,
    wide: !!wide,
  });

  return NextResponse.json(item, { status: 201 });
}
