import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const banners = await prisma.banner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(banners);
}

export async function POST(req: Request) {
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

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const created = await prisma.banner.create({
    data: {
      title: body.title.trim(),
      subtitle: body.subtitle ?? "",
      backgroundImage: body.backgroundImage ?? "",
      primaryCtaLabel: body.primaryCtaLabel ?? "立即找課程",
      primaryCtaHref: body.primaryCtaHref ?? "/courses",
      secondaryCtaLabel: body.secondaryCtaLabel ?? "",
      secondaryCtaHref: body.secondaryCtaHref ?? "",
      order: body.order ?? 0,
      active: body.active ?? true,
      isDefault: body.isDefault ?? false,
    },
  });

  if (created.isDefault) {
    await prisma.banner.updateMany({
      where: { NOT: { id: created.id } },
      data: { isDefault: false },
    });
  }

  return NextResponse.json(created, { status: 201 });
}

