import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const id = params.id;
  const body = (await req.json()) as Partial<{
    title: string;
    subtitle: string;
    backgroundImage: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    order: number;
    active: boolean;
    isDefault: boolean;
  }>;

  if (body.title !== undefined && !body.title.trim()) {
    return NextResponse.json({ error: "title cannot be empty" }, { status: 400 });
  }

  const updated = await prisma.banner.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title.trim() } : {}),
      ...(body.subtitle !== undefined ? { subtitle: body.subtitle } : {}),
      ...(body.backgroundImage !== undefined ? { backgroundImage: body.backgroundImage } : {}),
      ...(body.primaryCtaLabel !== undefined ? { primaryCtaLabel: body.primaryCtaLabel } : {}),
      ...(body.primaryCtaHref !== undefined ? { primaryCtaHref: body.primaryCtaHref } : {}),
      ...(body.secondaryCtaLabel !== undefined ? { secondaryCtaLabel: body.secondaryCtaLabel } : {}),
      ...(body.secondaryCtaHref !== undefined ? { secondaryCtaHref: body.secondaryCtaHref } : {}),
      ...(body.order !== undefined ? { order: body.order } : {}),
      ...(body.active !== undefined ? { active: body.active } : {}),
      ...(body.isDefault !== undefined ? { isDefault: body.isDefault } : {}),
    },
  });

  if (updated.isDefault) {
    await prisma.banner.updateMany({
      where: { NOT: { id: updated.id } },
      data: { isDefault: false },
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const id = params.id;
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

