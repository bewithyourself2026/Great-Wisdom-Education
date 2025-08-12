import Link from 'next/link';

export type CampCardProps = {
  id: string;
  title: string;
  location: string;
  startDate: string | Date;
  endDate: string | Date;
  instructorName?: string | null;
  enrolledCount?: number;
};

export function CampCard({ id, title, location, startDate, endDate, instructorName, enrolledCount }: CampCardProps) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateRange = `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;

  return (
    <Link href={`/camps/${id}`} className="block rounded-lg border p-4 hover:shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{location} • {dateRange}</p>
      <div className="mt-2 text-sm text-gray-700">
        {instructorName ? <p>Instructor: {instructorName}</p> : null}
        {typeof enrolledCount === 'number' ? <p>Enrolled: {enrolledCount}</p> : null}
      </div>
    </Link>
  );
}