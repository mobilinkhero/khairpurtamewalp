import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Super Admin ────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@khairpurtamewali.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@khairpurtamewali.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Admin user created — admin@khairpurtamewali.com / admin123')

  // ── Emergency Contacts ─────────────────────────────────────────────────────
  const contacts = [
    { name: 'Police',          number: '15',             icon: 'shield',    color: '#1565C0', sortOrder: 1 },
    { name: 'Rescue 1122',     number: '1122',           icon: 'ambulance', color: '#D32F2F', sortOrder: 2 },
    { name: 'Ambulance',       number: '1122',           icon: 'heart',     color: '#D32F2F', sortOrder: 3 },
    { name: 'Fire Brigade',    number: '16',             icon: 'flame',     color: '#F57C00', sortOrder: 4 },
    { name: 'DHQ Hospital',    number: '+92-62-2774000', icon: 'hospital',  color: '#2E7D32', sortOrder: 5 },
    { name: 'Edhi Foundation', number: '115',            icon: 'heart',     color: '#1B5E20', sortOrder: 6 },
  ]
  for (const c of contacts) {
    await prisma.emergencyContact.create({ data: c })
  }
  console.log('✅ Emergency contacts seeded')

  // ── Sample Businesses ──────────────────────────────────────────────────────
  await prisma.business.createMany({
    data: [
      {
        name: 'Al-Noor Restaurant',
        category: 'Restaurants',
        description: 'Authentic desi cuisine with traditional flavors.',
        address: 'Main Bazaar, Khairpur Tamewali',
        phone: '+92 300 1234567',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        rating: 4.5, reviewCount: 128, isOpen: true,
        workingHours: 'Mon-Sun: 8:00 AM - 11:00 PM',
        isFeatured: true,
        tags: JSON.stringify(['Biryani', 'Karahi', 'BBQ']),
        lat: 29.5672, lng: 72.2436,
      },
      {
        name: 'City Medical Store',
        category: 'Pharmacies',
        description: 'Complete pharmacy with all medicines available 24/7.',
        address: 'Hospital Road, Khairpur Tamewali',
        phone: '+92 301 9876543',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
        rating: 4.2, reviewCount: 85, isOpen: true,
        workingHours: '24 Hours',
        isFeatured: true,
        tags: JSON.stringify(['Medicine', '24/7']),
        lat: 29.5680, lng: 72.2450,
      },
      {
        name: 'Sunrise Bakery',
        category: 'Bakeries',
        description: 'Fresh bread, cakes, and pastries baked daily.',
        address: 'Clock Tower Chowk, Khairpur Tamewali',
        phone: '+92 303 7778888',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
        rating: 4.7, reviewCount: 200, isOpen: true,
        workingHours: 'Mon-Sun: 6:00 AM - 10:00 PM',
        isFeatured: true,
        tags: JSON.stringify(['Bread', 'Cakes', 'Fresh']),
        lat: 29.5675, lng: 72.2440,
      },
    ],
  })
  console.log('✅ Sample businesses seeded')

  // ── Sample Places ──────────────────────────────────────────────────────────
  await prisma.place.createMany({
    data: [
      {
        name: 'DHQ Hospital',
        category: 'Hospitals',
        description: 'District Headquarters Hospital serving Khairpur Tamewali.',
        address: 'Hospital Road, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
        facilities: JSON.stringify(['Emergency', 'OPD', 'Laboratory', 'X-Ray', 'Pharmacy']),
        isFeatured: true, phone: '+92 300 1111111',
        lat: 29.5685, lng: 72.2445, distance: '0.5 km',
      },
      {
        name: 'Jamia Mosque KPT',
        category: 'Mosques',
        description: 'Historic central mosque of Khairpur Tamewali.',
        address: 'Main Chowk, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400',
        facilities: JSON.stringify(['Prayer Hall', 'Wudu Area', 'Library', 'Parking']),
        isFeatured: true, phone: '',
        lat: 29.5670, lng: 72.2438, distance: '0.3 km',
      },
    ],
  })
  console.log('✅ Sample places seeded')

  // ── Sample News ────────────────────────────────────────────────────────────
  await prisma.news.create({
    data: {
      title: 'New Road Construction Project Announced for KPT',
      summary: 'TMA Khairpur Tamewali has announced a major road improvement project.',
      content: 'Tehsil Municipal Administration has announced a comprehensive road construction project covering major city roads. The project is estimated at Rs. 50 million and will be completed within 8 months.',
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
      category: 'Announcements',
      author: 'Community Desk',
      isPublished: true,
      publishedAt: new Date(),
    },
  })
  console.log('✅ Sample news seeded')

  console.log('\n🎉 Database seeded successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
