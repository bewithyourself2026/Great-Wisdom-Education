import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campId = searchParams.get('campId');

  try {
    if (!campId) {
      const enrollments = await prisma.enrollment.findMany({ include: { user: true, camp: true } });
      return NextResponse.json(enrollments);
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { campId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campId, name, email } = body ?? {};

    if (!campId || !name || !email) {
      return NextResponse.json({ error: 'campId, name, and email are required' }, { status: 400 });
    }

    const camp = await prisma.camp.findUnique({ where: { id: campId } });
    if (!camp) {
      return NextResponse.json({ error: 'Camp not found' }, { status: 404 });
    }

    const totalEnrollments = await prisma.enrollment.count({ where: { campId } });
    if (totalEnrollments >= camp.capacity) {
      return NextResponse.json({ error: 'Camp is full' }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { name, email },
    });

    const existing = await prisma.enrollment.findUnique({
      where: { userId_campId: { userId: user.id, campId } },
    });

    if (existing) {
      return NextResponse.json({ ok: true, message: 'Already applied', enrollmentId: existing.id });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId: user.id, campId, status: 'PENDING' },
    });

    return NextResponse.json({ ok: true, enrollmentId: enrollment.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 400 });
  }
}