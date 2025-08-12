const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { name: 'Alice Johnson', email: 'alice@example.com', role: 'INSTRUCTOR' },
  });
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: { name: 'Bob Smith', email: 'bob@example.com', role: 'INSTRUCTOR' },
  });

  const camps = [
    {
      title: 'AI Research Bootcamp',
      description: 'Dive into modern AI with hands-on projects led by professors.',
      location: 'Zurich, Switzerland',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 37),
      capacity: 40,
      price: 1800,
      instructorId: alice.id,
    },
    {
      title: 'Sustainability & Climate Tech Camp',
      description: 'Learn from industry leaders solving climate challenges.',
      location: 'Vancouver, Canada',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 68),
      capacity: 35,
      price: 1600,
      instructorId: bob.id,
    },
    {
      title: 'Immersive English + Startup Strategy',
      description: 'English mastery paired with startup strategies from founders.',
      location: 'Singapore',
      startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 52),
      capacity: 30,
      price: 1500,
      instructorId: alice.id,
    },
  ];

  for (const camp of camps) {
    const existing = await prisma.camp.findFirst({ where: { title: camp.title } });
    if (!existing) {
      await prisma.camp.create({ data: camp });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });