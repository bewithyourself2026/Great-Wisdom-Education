import Link from "next/link";
import { prisma } from "../lib/prisma";

export default async function CampsPage() {
  const camps = await prisma.camp.findMany({
    include: {
      location: true,
      instructor: { include: { user: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Camps</h1>
      {camps.length === 0 ? (
        <p className="text-gray-500">No camps yet.</p>
      ) : (
        <ul className="space-y-4">
          {camps.map((camp) => (
            <li key={camp.id} className="border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{camp.title}</h2>
                  <p className="text-sm text-gray-600">
                    {camp.location.city}, {camp.location.country} • {new Date(camp.startDate).toLocaleDateString()} - {new Date(camp.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Led by {camp.instructor.user.name}</p>
                </div>
                <Link href={`/camps/${camp.slug}`} className="text-blue-600 hover:underline">
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}