import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const camps = await prisma.camp.findMany({
      include: { instructor: true, _count: { select: { enrollments: true } } },
      orderBy: { startDate: 'asc' },
      take: 100,
    });
    return NextResponse.json(camps);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch camps' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const camp = await prisma.camp.create({ data });
    return NextResponse.json(camp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create camp' }, { status: 400 });
  }
}