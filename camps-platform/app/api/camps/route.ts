import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET() {
  const camps = await prisma.camp.findMany({
    include: {
      location: true,
      instructor: { include: { user: true } },
    },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json(camps);
}