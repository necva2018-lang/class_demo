import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = (await req.json()) as { ids?: string[] };
  const ids = body.ids ?? [];
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids is required" }, { status: 400 });
  }

  await prisma.$transaction(
    ids.map((id, idx) =>
      prisma.banner.update({
        where: { id },
        data: { order: idx },
      })
    )
  );

  return NextResponse.json({ ok: true });
}

