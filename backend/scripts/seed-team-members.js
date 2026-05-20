const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const teamMembers = [
  {
    fullName: 'Aniket Patil',
    role: 'Founder · Trip planning',
    bio: 'Designs fixed departures and custom routes from Pune — obsessed with honest pricing and small-group pacing.',
    instagramUrl: 'https://instagram.com/',
    linkedinUrl: 'https://linkedin.com/',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    sortOrder: 0,
  },
  {
    fullName: 'Sneha Kelkar',
    role: 'Operations · Stays & transfers',
    bio: 'Coordinates hotels, drivers and on-ground vendors so every batch runs smoothly from pickup to drop-off.',
    instagramUrl: 'https://instagram.com/',
    linkedinUrl: 'https://linkedin.com/',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    sortOrder: 1,
  },
  {
    fullName: 'Vivek Joshi',
    role: 'Trip captain · Northeast & Spiti',
    bio: 'Leads high-altitude batches with a calm, safety-first style — the person you message when plans change on the road.',
    instagramUrl: 'https://instagram.com/',
    linkedinUrl: 'https://linkedin.com/',
    imageUrl:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80',
    sortOrder: 2,
  },
];

async function main() {
  const count = await prisma.teamMember.count();
  if (count > 0) {
    console.log(`Team members already present (${count}). Skipping.`);
    return;
  }
  for (const member of teamMembers) {
    await prisma.teamMember.create({ data: member });
  }
  console.log(`Seeded ${teamMembers.length} team members.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
