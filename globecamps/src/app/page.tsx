export default function HomePage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold">Explore Global Learning Camps</h1>
      <p className="text-gray-600 max-w-2xl">
        Join immersive camps around the world led by professors, industry leaders, and expert English teachers.
        Learn, network, and grow in unforgettable locations.
      </p>
      <a
        href="/camps"
        className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
      >
        Browse Camps
      </a>
    </section>
  );
}