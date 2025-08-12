import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { EnrollmentForm } from '@/components/EnrollmentForm';

interface CampPageProps {
  params: { id: string };
}

export default async function CampDetailPage({ params }: CampPageProps) {
  const camp = await prisma.camp.findUnique({
    where: { id: params.id },
    include: { instructor: true, _count: { select: { enrollments: true } } },
  }).catch(() => null);

  if (!camp) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">Camp not found.</p>
        <Link href="/camps" className="text-blue-600 underline">Back to Camps</Link>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{camp.title}</h1>
        <p className="text-gray-700">{camp.description}</p>
        <p className="text-gray-600">Location: {camp.location}</p>
        <p className="text-gray-600">Dates: {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}</p>
        <p className="text-gray-600">Instructor: {camp.instructor?.name ?? 'TBA'}</p>
        <p className="text-gray-600">Enrolled: {camp._count.enrollments} / {camp.capacity}</p>
      </div>
      <EnrollmentForm campId={camp.id} />
    </article>
  );
}