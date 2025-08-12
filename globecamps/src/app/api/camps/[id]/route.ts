import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Context {
  params: { id: string };
}

export async function GET(_req: Request, ctx: Context) {
  try {
    const camp = await prisma.camp.findUnique({ where: { id: ctx.params.id } });
    if (!camp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(camp);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch camp' }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: Context) {
  try {
    const data = await request.json();
    const camp = await prisma.camp.update({ where: { id: ctx.params.id }, data });
    return NextResponse.json(camp);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update camp' }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Context) {
  try {
    await prisma.camp.delete({ where: { id: ctx.params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete camp' }, { status: 400 });
  }
}