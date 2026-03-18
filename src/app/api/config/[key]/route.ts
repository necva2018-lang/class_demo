import { NextResponse } from "next/server";
import { getAppConfig, resetAppConfig, setAppConfig } from "@/lib/config-store";

type Params = { params: { key: string } };

export async function GET(_: Request, { params }: Params) {
  const key = params.key;
  // Return null when missing; callers may fallback client-side.
  const row = await getAppConfig<any | null>(key, null);
  return NextResponse.json({ key, value: row });
}

export async function PUT(req: Request, { params }: Params) {
  const key = params.key;
  const body = (await req.json()) as { value?: unknown };
  if (!("value" in body)) {
    return NextResponse.json({ error: "value is required" }, { status: 400 });
  }
  await setAppConfig(key, body.value);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: Params) {
  await resetAppConfig(params.key);
  return NextResponse.json({ ok: true });
}

