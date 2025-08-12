import { prisma } from '@/lib/prisma';
import { CampCard } from '@/components/CampCard';

async function getCampsSafe() {
  try {
    const camps = await prisma.camp.findMany({
      include: { instructor: true, _count: { select: { enrollments: true } } },
      orderBy: { startDate: 'asc' },
      take: 50,
    });
    return camps.map((c) => ({
      id: c.id,
      title: c.title,
      location: c.location,
      startDate: c.startDate,
      endDate: c.endDate,
      instructorName: c.instructor?.name ?? null,
      enrolledCount: c._count.enrollments,
    }));
  } catch (err) {
    return [] as any[];
  }
}

export default async function CampsPage() {
  const camps = await getCampsSafe();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Camps</h1>
        <p className="text-gray-600">Discover upcoming camps across the globe.</p>
      </div>
      {camps.length === 0 ? (
        <p className="text-gray-600">No camps yet. Once the database is seeded, they will appear here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {camps.map((camp) => (
            <CampCard key={camp.id} {...camp} />
          ))}
        </div>
      )}
    </div>
  );
}