import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function POST() {
  await prisma.registration.deleteMany();
  await prisma.session.deleteMany();
  await prisma.camp.deleteMany();
  await prisma.instructor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();

  const prof = await prisma.user.create({
    data: { email: "prof@example.com", name: "Prof. Ada Lovelace", role: "INSTRUCTOR" },
  });
  const instructor = await prisma.instructor.create({ data: { userId: prof.id, title: "Professor", bio: "Computer science pioneer" } });

  const location = await prisma.location.create({
    data: { name: "Oxford Campus", country: "UK", city: "Oxford", address: "High St" },
  });

  const camp = await prisma.camp.create({
    data: {
      title: "Global AI Research Camp",
      slug: "global-ai-research-camp",
      description: "An intensive camp led by top researchers.",
      startDate: new Date(Date.now() + 86400000),
      endDate: new Date(Date.now() + 7 * 86400000),
      capacity: 50,
      priceCents: 120000,
      currency: "USD",
      category: "ACADEMIA",
      locationId: location.id,
      instructorId: instructor.id,
      sessions: {
        create: [
          {
            title: "Opening Keynote",
            description: "Vision of AI",
            startTime: new Date(Date.now() + 2 * 86400000),
            endTime: new Date(Date.now() + 2 * 86400000 + 2 * 3600000),
          },
          {
            title: "Hands-on Workshop",
            description: "Build ML models",
            startTime: new Date(Date.now() + 3 * 86400000),
            endTime: new Date(Date.now() + 3 * 86400000 + 3 * 3600000),
          },
        ],
      },
    },
  });

  const student = await prisma.user.create({ data: { email: "student@example.com", name: "Grace Hopper" } });
  await prisma.registration.create({ data: { campId: camp.id, userId: student.id, status: "CONFIRMED" } });

  return NextResponse.json({ ok: true });
}