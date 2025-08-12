import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";

interface CampPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CampDetailPage(props: CampPageProps) {
  const { slug } = await props.params;
  const camp = await prisma.camp.findUnique({
    where: { slug },
    include: {
      location: true,
      instructor: { include: { user: true } },
      sessions: true,
      registrations: true,
    },
  });

  if (!camp) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{camp.title}</h1>
      <p className="text-gray-700">{camp.description}</p>
      <p className="text-sm text-gray-600">
        {camp.location.city}, {camp.location.country}
      </p>
      <p className="text-sm text-gray-600">
        {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">Led by {camp.instructor.user.name}</p>
      <div>
        <h2 className="font-semibold mt-4">Sessions</h2>
        <ul className="list-disc pl-6">
          {camp.sessions.map((s) => (
            <li key={s.id}>
              {s.title} • {new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
      <div className="text-sm text-gray-600">
        {camp.registrations.length} / {camp.capacity} registered
      </div>
    </div>
  );
}