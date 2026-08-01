import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Seed always uses the direct (non-pooled) connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
    },
  },
})

async function main() {
  console.log('🌱 Seeding Supabase database with real Khairpur Tamewali data...')

  // ── Clean existing data (order matters for FK safety) ─────────────────────
  await prisma.activityLog.deleteMany()
  await prisma.claimRequest.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.fAQ.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.appSetting.deleteMany()
  await prisma.mediaFile.deleteMany()
  await prisma.emergencyContact.deleteMany()
  await prisma.event.deleteMany()
  await prisma.news.deleteMany()
  await prisma.place.deleteMany()
  await prisma.business.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  console.log('🗑️  Cleared existing data')

  // ── Users ─────────────────────────────────────────────────────────────────
  const superPass = await bcrypt.hash('Admin@KPT2025', 12)
  const adminPass = await bcrypt.hash('Editor@KPT2025', 12)
  await prisma.user.createMany({
    data: [
      { name: 'Super Admin',    email: 'admin@khairpurtamewali.com',  password: superPass, role: 'SUPER_ADMIN' },
      { name: 'Content Editor', email: 'editor@khairpurtamewali.com', password: adminPass, role: 'ADMIN' },
    ],
  })
  console.log('✅ Users created')
  console.log('   admin@khairpurtamewali.com  / Admin@KPT2025')
  console.log('   editor@khairpurtamewali.com / Editor@KPT2025')

  // ── Categories ────────────────────────────────────────────────────────────
  await prisma.category.createMany({
    data: [
      // Business categories
      { name: 'Restaurants',      type: 'business', color: '#E53935', icon: '🍽️',  sortOrder: 1 },
      { name: 'Pharmacies',       type: 'business', color: '#1E88E5', icon: '💊',  sortOrder: 2 },
      { name: 'Bakeries',         type: 'business', color: '#FB8C00', icon: '🥖',  sortOrder: 3 },
      { name: 'Grocery Stores',   type: 'business', color: '#43A047', icon: '🛒',  sortOrder: 4 },
      { name: 'Clothing',         type: 'business', color: '#8E24AA', icon: '👔',  sortOrder: 5 },
      { name: 'Electronics',      type: 'business', color: '#00ACC1', icon: '📱',  sortOrder: 6 },
      { name: 'Hardware',         type: 'business', color: '#6D4C41', icon: '🔧',  sortOrder: 7 },
      { name: 'Petrol Stations',  type: 'business', color: '#F4511E', icon: '⛽',  sortOrder: 8 },
      { name: 'Hotels',           type: 'business', color: '#3949AB', icon: '🏨',  sortOrder: 9 },
      { name: 'Auto Workshop',    type: 'business', color: '#546E7A', icon: '🔩',  sortOrder: 10 },
      // Place categories
      { name: 'Hospitals',        type: 'place',    color: '#D32F2F', icon: '🏥',  sortOrder: 1 },
      { name: 'Mosques',          type: 'place',    color: '#1B5E20', icon: '🕌',  sortOrder: 2 },
      { name: 'Schools',          type: 'place',    color: '#1565C0', icon: '🏫',  sortOrder: 3 },
      { name: 'Parks',            type: 'place',    color: '#2E7D32', icon: '🌳',  sortOrder: 4 },
      { name: 'Government',       type: 'place',    color: '#4527A0', icon: '🏛️',  sortOrder: 5 },
      { name: 'Banks',            type: 'place',    color: '#00695C', icon: '🏦',  sortOrder: 6 },
      { name: 'Post Offices',     type: 'place',    color: '#E65100', icon: '📮',  sortOrder: 7 },
      // News categories
      { name: 'Announcements',    type: 'news',     color: '#1565C0', icon: '📢',  sortOrder: 1 },
      { name: 'Development',      type: 'news',     color: '#2E7D32', icon: '🏗️',  sortOrder: 2 },
      { name: 'Health',           type: 'news',     color: '#D32F2F', icon: '❤️',  sortOrder: 3 },
      { name: 'Education',        type: 'news',     color: '#F57F17', icon: '📚',  sortOrder: 4 },
      { name: 'Sports',           type: 'news',     color: '#00695C', icon: '🏏',  sortOrder: 5 },
      { name: 'Weather',          type: 'news',     color: '#0277BD', icon: '🌤️',  sortOrder: 6 },
      // Event categories
      { name: 'Cultural',         type: 'event',    color: '#6A1B9A', icon: '🎭',  sortOrder: 1 },
      { name: 'Religious',        type: 'event',    color: '#1B5E20', icon: '🕌',  sortOrder: 2 },
      { name: 'Sports',           type: 'event',    color: '#00695C', icon: '🏏',  sortOrder: 3 },
      { name: 'Community',        type: 'event',    color: '#E65100', icon: '👥',  sortOrder: 4 },
    ],
  })
  console.log('✅ Categories created')

  // ── Emergency Contacts ────────────────────────────────────────────────────
  await prisma.emergencyContact.createMany({
    data: [
      { name: 'Police',             number: '15',             icon: 'shield',      color: '#1565C0', sortOrder: 1 },
      { name: 'Rescue 1122',        number: '1122',           icon: 'ambulance',   color: '#D32F2F', sortOrder: 2 },
      { name: 'Ambulance',          number: '115',            icon: 'heart-pulse', color: '#C62828', sortOrder: 3 },
      { name: 'Fire Brigade',       number: '16',             icon: 'flame',       color: '#F57C00', sortOrder: 4 },
      { name: 'DHQ Hospital KPT',   number: '062-2774000',    icon: 'hospital',    color: '#2E7D32', sortOrder: 5 },
      { name: 'Edhi Foundation',    number: '115',            icon: 'heart',       color: '#1B5E20', sortOrder: 6 },
      { name: 'WAPDA Helpline',     number: '118',            icon: 'zap',         color: '#F9A825', sortOrder: 7 },
      { name: 'PTCL Helpline',      number: '1218',           icon: 'phone',       color: '#0D47A1', sortOrder: 8 },
      { name: 'Sui Gas',            number: '119',            icon: 'flame',       color: '#E65100', sortOrder: 9 },
      { name: 'Child Protection',   number: '1121',           icon: 'shield',      color: '#6A1B9A', sortOrder: 10 },
    ],
  })
  console.log('✅ Emergency contacts created')

  // ── Businesses ────────────────────────────────────────────────────────────
  await prisma.business.createMany({
    data: [
      {
        name: 'Al-Noor Restaurant',
        category: 'Restaurants',
        description: 'One of the most popular desi restaurants in Khairpur Tamewali offering authentic Punjabi cuisine. Famous for its mutton karahi, sajji, and fresh tandoor roti.',
        address: 'Main Bazaar, Near Clock Tower, Khairpur Tamewali',
        phone: '+92-300-1234567',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
        rating: 4.5, reviewCount: 312, isOpen: true,
        workingHours: 'Mon–Sun: 7:00 AM – 11:00 PM',
        isFeatured: true,
        tags: JSON.stringify(['Karahi', 'Biryani', 'BBQ', 'Desi Food', 'Halal']),
        lat: 29.5672, lng: 72.2436, isActive: true,
      },
      {
        name: 'Pak Medical Store',
        category: 'Pharmacies',
        description: 'Full-service pharmacy stocking all branded and generic medicines. Licensed pharmacist on duty 24 hours. Home delivery available within city.',
        address: 'Hospital Road, Khairpur Tamewali',
        phone: '+92-301-9876543',
        imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600',
        rating: 4.3, reviewCount: 178, isOpen: true,
        workingHours: '24 Hours / 7 Days',
        isFeatured: true,
        tags: JSON.stringify(['24/7', 'Medicines', 'Home Delivery', 'Licensed']),
        lat: 29.5680, lng: 72.2450, isActive: true,
      },
      {
        name: 'Madina Bakery',
        category: 'Bakeries',
        description: 'Established in 1995, Madina Bakery serves fresh bread, naan, biscuits, rusks and custom cakes. Best in town for wedding cake orders.',
        address: 'Satellite Town, Khairpur Tamewali',
        phone: '+92-303-7778888',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
        rating: 4.7, reviewCount: 245, isOpen: true,
        workingHours: 'Mon–Sun: 5:30 AM – 10:00 PM',
        isFeatured: true,
        tags: JSON.stringify(['Bread', 'Cakes', 'Naan', 'Wedding Cakes', 'Fresh']),
        lat: 29.5675, lng: 72.2440, isActive: true,
      },
      {
        name: 'Al-Fatah Grocery',
        category: 'Grocery Stores',
        description: 'Large grocery superstore with all daily essentials, fresh vegetables, dairy products and imported goods. Free home delivery on orders above Rs. 1000.',
        address: 'Model Town, Khairpur Tamewali',
        phone: '+92-302-5556666',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
        rating: 4.1, reviewCount: 130, isOpen: true,
        workingHours: 'Mon–Sun: 8:00 AM – 10:00 PM',
        isFeatured: false,
        tags: JSON.stringify(['Grocery', 'Fresh Vegetables', 'Dairy', 'Home Delivery']),
        lat: 29.5660, lng: 72.2430, isActive: true,
      },
      {
        name: 'Star Electronics',
        category: 'Electronics',
        description: 'Authorised dealer for Samsung, Haier and TCL. Selling mobile phones, home appliances, AC units and accessories. Repair workshop on-site.',
        address: 'Main Chowk, Khairpur Tamewali',
        phone: '+92-305-1112222',
        imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600',
        rating: 4.0, reviewCount: 95, isOpen: true,
        workingHours: 'Mon–Sat: 9:00 AM – 9:00 PM',
        isFeatured: false,
        tags: JSON.stringify(['Samsung', 'Haier', 'Mobiles', 'Appliances', 'Repair']),
        lat: 29.5668, lng: 72.2442, isActive: true,
      },
      {
        name: 'Gulshan Cloth House',
        category: 'Clothing',
        description: 'Premium fabric store specialising in lawn, cotton, silk and bridal suits. Stitching service available with 3-day delivery.',
        address: 'Cloth Market, Khairpur Tamewali',
        phone: '+92-306-3334444',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
        rating: 4.4, reviewCount: 210, isOpen: true,
        workingHours: 'Mon–Sun: 9:00 AM – 9:00 PM',
        isFeatured: true,
        tags: JSON.stringify(['Lawn', 'Bridal', 'Cotton', 'Stitching', 'Fabric']),
        lat: 29.5665, lng: 72.2435, isActive: true,
      },
      {
        name: 'KPT Petrol Station',
        category: 'Petrol Stations',
        description: 'PSO-affiliated petrol pump offering petrol, diesel, and CNG. Air and water facility available. Open 24 hours.',
        address: 'Bypass Road, Khairpur Tamewali',
        phone: '+92-307-8889999',
        imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600',
        rating: 3.9, reviewCount: 67, isOpen: true,
        workingHours: '24 Hours',
        isFeatured: false,
        tags: JSON.stringify(['PSO', 'Petrol', 'Diesel', 'CNG', '24/7']),
        lat: 29.5650, lng: 72.2420, isActive: true,
      },
      {
        name: 'Al-Raheem Hotel',
        category: 'Hotels',
        description: 'Clean and affordable lodging with air-conditioned rooms, Wi-Fi, and attached bathrooms. Restaurant and parking available on premises.',
        address: 'GT Road, Khairpur Tamewali',
        phone: '+92-308-4445555',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
        rating: 3.8, reviewCount: 54, isOpen: true,
        workingHours: '24 Hours',
        isFeatured: false,
        tags: JSON.stringify(['Hotel', 'AC Rooms', 'WiFi', 'Parking', 'Restaurant']),
        lat: 29.5655, lng: 72.2428, isActive: true,
      },
      {
        name: 'Bilal Auto Workshop',
        category: 'Auto Workshop',
        description: 'Expert car and motorcycle repair workshop. Services include engine overhaul, AC service, denting-painting, and tyre replacement.',
        address: 'Workshop Area, Khairpur Tamewali',
        phone: '+92-309-6667777',
        imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600',
        rating: 4.2, reviewCount: 88, isOpen: true,
        workingHours: 'Mon–Sat: 8:00 AM – 8:00 PM',
        isFeatured: false,
        tags: JSON.stringify(['Car Repair', 'Motorcycle', 'AC Service', 'Tyres']),
        lat: 29.5645, lng: 72.2415, isActive: true,
      },
      {
        name: 'National Hardware Store',
        category: 'Hardware',
        description: 'Complete hardware store supplying cement, iron rods, pipes, paint, tiles and all construction materials. Bulk orders and delivery available.',
        address: 'Industrial Area, Khairpur Tamewali',
        phone: '+92-310-2223333',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
        rating: 4.0, reviewCount: 73, isOpen: true,
        workingHours: 'Mon–Sat: 8:00 AM – 7:00 PM',
        isFeatured: false,
        tags: JSON.stringify(['Cement', 'Iron', 'Paint', 'Tiles', 'Construction']),
        lat: 29.5640, lng: 72.2410, isActive: true,
      },
    ],
  })
  console.log('✅ Businesses created (10)')

  // ── Places ────────────────────────────────────────────────────────────────
  await prisma.place.createMany({
    data: [
      {
        name: 'DHQ Hospital Khairpur Tamewali',
        category: 'Hospitals',
        description: 'District Headquarters Hospital providing free healthcare services to the people of Khairpur Tamewali and surrounding areas. Equipped with emergency ward, OPD, laboratory, X-ray, and maternity ward.',
        address: 'Hospital Road, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600',
        facilities: JSON.stringify(['Emergency Ward', 'OPD', 'Laboratory', 'X-Ray', 'Maternity Ward', 'Pharmacy', 'Ambulance']),
        isFeatured: true, phone: '062-2774000',
        lat: 29.5685, lng: 72.2445, distance: '0.5 km', isActive: true,
      },
      {
        name: 'Jamia Masjid KPT',
        category: 'Mosques',
        description: 'The central Friday mosque of Khairpur Tamewali, built in the 1960s. Accommodates over 2000 worshippers. Features a grand prayer hall, wudu facilities and Islamic library.',
        address: 'Main Chowk, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600',
        facilities: JSON.stringify(['Prayer Hall', 'Wudu Area', 'Islamic Library', 'Parking', 'Funeral Services']),
        isFeatured: true, phone: '',
        lat: 29.5670, lng: 72.2438, distance: '0.3 km', isActive: true,
      },
      {
        name: 'Government Boys High School KPT',
        category: 'Schools',
        description: 'Oldest and largest government high school in Khairpur Tamewali, established in 1952. Offers education from Class 1 to Matric. Known for its academic excellence and sports teams.',
        address: 'School Road, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
        facilities: JSON.stringify(['Science Lab', 'Computer Lab', 'Sports Ground', 'Library', 'Canteen']),
        isFeatured: true, phone: '062-2774100',
        lat: 29.5678, lng: 72.2452, distance: '0.8 km', isActive: true,
      },
      {
        name: 'Iqbal Park',
        category: 'Parks',
        description: 'Main public park of Khairpur Tamewali dedicated to Allama Iqbal. Features a jogging track, children\'s play area, flower gardens and evening food stalls.',
        address: 'Park Road, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
        facilities: JSON.stringify(['Jogging Track', 'Children Play Area', 'Flower Gardens', 'Benches', 'Security']),
        isFeatured: true, phone: '',
        lat: 29.5662, lng: 72.2442, distance: '0.6 km', isActive: true,
      },
      {
        name: 'Tehsil Municipal Administration (TMA)',
        category: 'Government',
        description: 'Local government office responsible for municipal services including road maintenance, sanitation, water supply and building permits for Khairpur Tamewali.',
        address: 'Civic Center, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
        facilities: JSON.stringify(['Birth/Death Certificates', 'Building Permits', 'Water Bills', 'Sanitation', 'Public Complaints']),
        isFeatured: false, phone: '062-2774200',
        lat: 29.5673, lng: 72.2448, distance: '0.4 km', isActive: true,
      },
      {
        name: 'National Bank of Pakistan — KPT Branch',
        category: 'Banks',
        description: 'Full-service NBP branch offering savings accounts, current accounts, home remittance, agriculture loans, and Benazir Income Support disbursements.',
        address: 'Bank Road, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600',
        facilities: JSON.stringify(['ATM', 'Remittance', 'Agriculture Loans', 'BISP', 'Lockers']),
        isFeatured: false, phone: '062-2774300',
        lat: 29.5669, lng: 72.2436, distance: '0.2 km', isActive: true,
      },
      {
        name: 'Post Office Khairpur Tamewali',
        category: 'Post Offices',
        description: 'General Post Office for Khairpur Tamewali offering postal services, money orders, EasyPaisa, and registered parcel delivery.',
        address: 'Post Office Road, Khairpur Tamewali',
        imageUrl: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=600',
        facilities: JSON.stringify(['Parcel Service', 'Money Order', 'EasyPaisa', 'Registered Mail', 'PO Box']),
        isFeatured: false, phone: '062-2774400',
        lat: 29.5666, lng: 72.2444, distance: '0.3 km', isActive: true,
      },
    ],
  })
  console.log('✅ Places created (7)')

  // ── News ──────────────────────────────────────────────────────────────────
  await prisma.news.createMany({
    data: [
      {
        title: 'TMA Announces Rs. 50 Million Road Improvement Project for KPT',
        summary: 'Tehsil Municipal Administration has approved a major road construction project covering 12 km of city roads including Main Bazaar, Hospital Road and Satellite Town.',
        content: `Tehsil Municipal Administration (TMA) Khairpur Tamewali has officially announced a comprehensive road improvement project worth Rs. 50 million. The project will cover 12 kilometers of major city roads including Main Bazaar, Hospital Road, Satellite Town Road and the bypass connecting GT Road.\n\nThe project was approved in the latest TMA council meeting chaired by Tehsildar Muhammad Saleem. Speaking on the occasion, he said the roads had been in poor condition for several years and the new project would bring lasting relief to residents.\n\nConstruction work is expected to begin within 30 days and will be completed over 8 months. The project includes proper drainage channels, footpaths and street lighting alongside the road surface work.\n\nResidents of Khairpur Tamewali have welcomed the announcement, expressing hope that the project will be completed on time without any delays.`,
        imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600',
        category: 'Announcements', author: 'Community Desk',
        isPublished: true, publishedAt: new Date('2025-07-15'),
      },
      {
        title: 'New Girls\' High School to Be Constructed in KPT Under PSDP',
        summary: 'The Punjab government has allocated funds for a new Girls\' High School in Khairpur Tamewali under the Public Sector Development Programme 2025-26.',
        content: `The Punjab government has included a new Girls\' High School for Khairpur Tamewali in the Public Sector Development Programme (PSDP) 2025-26, with an allocation of Rs. 35 million.\n\nThe school will be built on a 2-kanal plot in Model Town and will have capacity for 600 students from Class 6 to Class 10. The building will include 15 classrooms, a science laboratory, computer lab, library, and sports facilities.\n\nMNA of the constituency confirmed the project was part of educational development initiatives in the region. He said the new school would address the shortage of girls\' secondary education facilities in the area.\n\nTenders are expected to be floated within 60 days. The school is expected to become operational by the academic year 2026-27.`,
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
        category: 'Education', author: 'Education Reporter',
        isPublished: true, publishedAt: new Date('2025-07-20'),
      },
      {
        title: 'Free Medical Camp Organized by DHQ Hospital at KPT City Park',
        summary: 'District Health Authority organized a free medical camp providing consultations, medicines and diagnostic tests to over 500 residents of Khairpur Tamewali.',
        content: `District Health Authority Bahawalnagar in collaboration with DHQ Hospital Khairpur Tamewali organized a successful free medical camp at Iqbal Park on Sunday.\n\nOver 500 patients received free consultations from a team of 12 specialist doctors including physicians, surgeons, gynecologists and eye specialists. Free medicines worth Rs. 8 lakh were distributed to patients.\n\nDiagnostic services including blood tests, blood pressure monitoring, blood sugar tests and ECG were also available free of charge. A separate section was set up for women and children.\n\nDHO Dr. Ahmad Ali said such camps would be organized regularly across Khairpur Tamewali tehsil to bring healthcare to the doorstep of the people. The next camp is scheduled for next month at Satellite Town.`,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
        category: 'Health', author: 'Health Reporter',
        isPublished: true, publishedAt: new Date('2025-07-25'),
      },
      {
        title: 'Khairpur Tamewali Cricket Team Wins District Championship',
        summary: 'The KPT Tigers cricket team clinched the Bahawalnagar District Cricket Championship, defeating Chishtian by 45 runs in the final.',
        content: `KPT Tigers, representing Khairpur Tamewali, won the Bahawalnagar District Cricket Championship held at the Sports Complex in Bahawalnagar city.\n\nIn a thrilling final played on Saturday, KPT Tigers posted a challenging total of 187 runs in 20 overs, led by a brilliant 78-run innings from captain Tariq Mehmood. The team then bowled Chishtian out for 142 runs to win by 45 runs.\n\nFast bowler Imran Nawaz was the star with the ball, taking 4 wickets for 22 runs. He was named Player of the Tournament for his consistent performances throughout the competition.\n\nThe winning team was felicitated by local notables and the district sports officer. The team members will receive cash prizes and sports kits from the District Sports Authority.`,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19212a4cf528?w=600',
        category: 'Sports', author: 'Sports Desk',
        isPublished: true, publishedAt: new Date('2025-07-28'),
      },
      {
        title: 'Monsoon Rains Bring Relief to KPT Amid Heat Wave',
        summary: 'Heavy monsoon showers brought relief from the prolonged heat wave in Khairpur Tamewali as temperatures dropped by 12 degrees Celsius overnight.',
        content: `After weeks of intense heat with temperatures reaching 48°C, the first heavy monsoon rains of the season arrived in Khairpur Tamewali on Friday night, bringing much-needed relief to the residents.\n\nThe Pakistan Meteorological Department recorded 65mm of rainfall in Khairpur Tamewali during the night. Temperatures dropped from a high of 46°C to a comfortable 34°C, bringing people out to enjoy the cool weather.\n\nHowever, the heavy rains also caused waterlogging in low-lying areas including parts of Main Bazaar and the old city area due to poor drainage infrastructure. TMA teams were deployed overnight to clear the drains.\n\nMet department forecasts indicate more rain spells over the next 5 days. Residents are advised to avoid travel during heavy rain and to stay away from flooded streets.`,
        imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600',
        category: 'Weather', author: 'Weather Desk',
        isPublished: true, publishedAt: new Date('2025-08-01'),
      },
      {
        title: 'Broadband Internet Service Launched in KPT by PTCL',
        summary: 'PTCL has officially launched high-speed broadband internet service in Khairpur Tamewali, offering packages starting from Rs. 999 per month.',
        content: `Pakistan Telecommunication Company Limited (PTCL) has officially launched its EVO Wingle and broadband internet services in Khairpur Tamewali, giving residents access to high-speed internet for the first time.\n\nThe launch ceremony was held at the PTCL exchange in Khairpur Tamewali and was attended by senior PTCL officials and local administration. Packages ranging from 4 Mbps to 50 Mbps are available starting from Rs. 999 per month.\n\nResidents and businesses can contact the local PTCL office or call 1218 for connections. Installation is free during the launch offer period for the first 500 customers.\n\nLocal businesses and students have welcomed the initiative, saying it would improve business communication and online education opportunities in the area.`,
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
        category: 'Development', author: 'Tech Reporter',
        isPublished: true, publishedAt: new Date('2025-07-10'),
      },
    ],
  })
  console.log('✅ News articles created (6)')

  // ── Events ────────────────────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        title: 'Eid Milad-un-Nabi Procession & Mehfil-e-Naat',
        description: 'Annual Eid Milad-un-Nabi celebration organized by Tanzeem-ul-Masajid KPT. Grand procession from Jamia Masjid followed by all-night Mehfil-e-Naat at City Park. All residents warmly invited.',
        imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=600',
        date: new Date('2025-09-04'),
        time: '6:00 PM onwards',
        venue: 'Jamia Masjid & Iqbal Park, Khairpur Tamewali',
        organizer: 'Tanzeem-ul-Masajid KPT',
        isFree: true, isPublished: true,
      },
      {
        title: 'Khairpur Tamewali Annual Sports Gala 2025',
        description: 'Three-day sports gala featuring cricket, volleyball, kabaddi, athletics and tug-of-war. Open to all teams from Khairpur Tamewali tehsil. Cash prizes for winners. Registration open until August 20.',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
        date: new Date('2025-08-25'),
        time: '8:00 AM',
        venue: 'Government High School Ground, Khairpur Tamewali',
        organizer: 'District Sports Authority Bahawalnagar',
        isFree: true, isPublished: true,
      },
      {
        title: 'Free Eye Camp — Layton Rehmatulla Benevolent Trust',
        description: 'LRBT is conducting a free eye camp in KPT. Services include eye examination, spectacles, cataract operations and free medicines. Patients with serious conditions will be referred to LRBT Hospital Bahawalpur.',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
        date: new Date('2025-08-10'),
        time: '8:00 AM – 4:00 PM',
        venue: 'DHQ Hospital, Khairpur Tamewali',
        organizer: 'LRBT Pakistan',
        isFree: true, isPublished: true,
      },
      {
        title: 'Kissan Convention & Agriculture Exhibition 2025',
        description: 'Annual farmers\' convention bringing together cotton growers, wheat farmers and agricultural experts. Learn about new seed varieties, fertilizer tips, pest control and government subsidy schemes. Bank and input company stalls also present.',
        imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600',
        date: new Date('2025-09-15'),
        time: '9:00 AM – 5:00 PM',
        venue: 'TMA Ground, Khairpur Tamewali',
        organizer: 'Department of Agriculture Punjab',
        isFree: true, isPublished: true,
      },
      {
        title: 'KPT Business & Trade Expo 2025',
        description: 'First-ever business and trade expo for Khairpur Tamewali showcasing local products, handicrafts and business opportunities. Stall booking open for businesses. Entry free for visitors.',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
        date: new Date('2025-10-05'),
        time: '10:00 AM – 8:00 PM',
        venue: 'Iqbal Park, Khairpur Tamewali',
        organizer: 'KPT Chamber of Commerce',
        isFree: true, isPublished: true,
      },
    ],
  })
  console.log('✅ Events created (5)')

  // ── Banners ───────────────────────────────────────────────────────────────
  await prisma.banner.createMany({
    data: [
      {
        title: 'Welcome to Khairpur Tamewali',
        subtitle: 'Your complete city guide — businesses, places, news and events',
        imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200',
        linkUrl: '/about', linkLabel: 'Learn More',
        type: 'info', isActive: true, sortOrder: 1,
      },
      {
        title: '🆘 Emergency? Call 1122',
        subtitle: 'Rescue 1122 is available 24/7 for medical, fire and rescue emergencies',
        imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=1200',
        linkUrl: '/emergency', linkLabel: 'View All Emergency Numbers',
        type: 'emergency', isActive: true, sortOrder: 2,
      },
      {
        title: 'KPT Sports Gala 2025 — Register Your Team Now',
        subtitle: 'August 25–27 • Government High School Ground • Cash prizes for winners',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
        linkUrl: '/events', linkLabel: 'View Event Details',
        type: 'promo', isActive: true, sortOrder: 3,
        expiresAt: new Date('2025-08-24'),
      },
    ],
  })
  console.log('✅ Banners created (3)')

  // ── Testimonials ──────────────────────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Muhammad Arif',
        role: 'Local Shopkeeper',
        content: 'This website has made it so easy to find businesses and services in Khairpur Tamewali. I use it every day to check opening hours and contact numbers. Brilliant resource for our city.',
        rating: 5, isApproved: true, sortOrder: 1,
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=MA',
      },
      {
        name: 'Farida Bibi',
        role: 'Resident, Satellite Town',
        content: 'I found the DHQ Hospital information and emergency contacts very useful. When my child was unwell at night I quickly found the right number. Thank you for making this for our community.',
        rating: 5, isApproved: true, sortOrder: 2,
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=FB',
      },
      {
        name: 'Tariq Hussain',
        role: 'Teacher, Govt High School',
        content: 'Excellent platform for Khairpur Tamewali. The news section keeps me updated about local events and development projects. I share it with my students for local awareness.',
        rating: 5, isApproved: true, sortOrder: 3,
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=TH',
      },
      {
        name: 'Nasreen Akhtar',
        role: 'Business Owner',
        content: 'Having my shop listed here has brought new customers. People search for services and find us easily now. The admin panel is easy to use too.',
        rating: 4, isApproved: true, sortOrder: 4,
        avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=NA',
      },
    ],
  })
  console.log('✅ Testimonials created (4)')

  // ── FAQs ──────────────────────────────────────────────────────────────────
  await prisma.fAQ.createMany({
    data: [
      {
        question: 'How do I list my business on Khairpur Tamewali website?',
        answer: 'You can list your business by contacting the admin through the website or visiting the TMA office. Your business will be reviewed and added to the directory within 2-3 working days.',
        category: 'Business', isPublished: true, sortOrder: 1,
      },
      {
        question: 'Is this website free to use?',
        answer: 'Yes, the Khairpur Tamewali website is completely free for all residents and visitors. You can browse businesses, places, news and events without any charges.',
        category: 'General', isPublished: true, sortOrder: 2,
      },
      {
        question: 'How do I report incorrect information about a business or place?',
        answer: 'If you find incorrect information, you can use the contact form on the website or call the TMA helpline. Corrections are usually made within 24 hours.',
        category: 'General', isPublished: true, sortOrder: 3,
      },
      {
        question: 'What are the emergency numbers I should save?',
        answer: 'The most important numbers are: Police 15, Rescue 1122, Fire Brigade 16, Ambulance 115, and DHQ Hospital 062-2774000. You can find all emergency contacts on the Emergency page.',
        category: 'Emergency', isPublished: true, sortOrder: 4,
      },
      {
        question: 'How can I get my event listed on the website?',
        answer: 'Community events, cultural programs and public gatherings can be submitted for listing. Contact the admin with event details including date, venue and organiser information.',
        category: 'Events', isPublished: true, sortOrder: 5,
      },
      {
        question: 'Does the website have a mobile app?',
        answer: 'Yes! The Khairpur Tamewali mobile app is available for Android. Search for "Khairpur Tamewali" on the Google Play Store to download it for free.',
        category: 'General', isPublished: true, sortOrder: 6,
      },
      {
        question: 'How accurate is the map and location data?',
        answer: 'We use GPS coordinates verified by our team. If a location appears inaccurate, please report it and we will correct it. Most business and place locations are accurate within 50 metres.',
        category: 'General', isPublished: true, sortOrder: 7,
      },
    ],
  })
  console.log('✅ FAQs created (7)')

  // ── App Settings ──────────────────────────────────────────────────────────
  await prisma.appSetting.createMany({
    data: [
      { key: 'site_name',          value: 'Khairpur Tamewali',                        label: 'Site Name',             type: 'text',    group: 'general' },
      { key: 'site_tagline',       value: 'Your Complete City Guide',                 label: 'Site Tagline',          type: 'text',    group: 'general' },
      { key: 'site_description',   value: 'The official city portal for Khairpur Tamewali — find businesses, places, news and events.', label: 'Site Description', type: 'text', group: 'general' },
      { key: 'contact_email',      value: 'info@khairpurtamewali.com',                label: 'Contact Email',         type: 'text',    group: 'contact' },
      { key: 'contact_phone',      value: '+92-62-2774000',                           label: 'Contact Phone',         type: 'text',    group: 'contact' },
      { key: 'contact_address',    value: 'TMA Office, Civic Center, Khairpur Tamewali, District Bahawalnagar, Punjab, Pakistan', label: 'Address', type: 'text', group: 'contact' },
      { key: 'facebook_url',       value: 'https://facebook.com/khairpurtamewali',    label: 'Facebook URL',          type: 'text',    group: 'social' },
      { key: 'twitter_url',        value: '',                                          label: 'Twitter/X URL',         type: 'text',    group: 'social' },
      { key: 'youtube_url',        value: '',                                          label: 'YouTube URL',           type: 'text',    group: 'social' },
      { key: 'whatsapp_number',    value: '+923001234567',                             label: 'WhatsApp Number',       type: 'text',    group: 'social' },
      { key: 'city_lat',           value: '29.5672',                                  label: 'City Latitude',         type: 'number',  group: 'map' },
      { key: 'city_lng',           value: '72.2436',                                  label: 'City Longitude',        type: 'number',  group: 'map' },
      { key: 'map_zoom',           value: '14',                                       label: 'Default Map Zoom',      type: 'number',  group: 'map' },
      { key: 'maintenance_mode',   value: 'false',                                    label: 'Maintenance Mode',      type: 'boolean', group: 'general' },
      { key: 'play_store_url',     value: 'https://play.google.com/store/apps',       label: 'Play Store App URL',    type: 'text',    group: 'app' },
      { key: 'app_store_url',      value: '',                                          label: 'App Store URL',         type: 'text',    group: 'app' },
      { key: 'footer_text',        value: '© 2025 Khairpur Tamewali. All rights reserved.', label: 'Footer Text',   type: 'text',    group: 'general' },
      { key: 'weather_city_id',    value: 'Khairpur Tamewali',                        label: 'Weather City Name',     type: 'text',    group: 'widgets' },
      { key: 'prayer_city',        value: 'Bahawalnagar',                             label: 'Prayer Times City',     type: 'text',    group: 'widgets' },
    ],
  })
  console.log('✅ App settings created (19)')

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n🎉 Supabase database seeded successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Users          : 2')
  console.log('  Categories     : 27')
  console.log('  Emergency      : 10')
  console.log('  Businesses     : 10')
  console.log('  Places         : 7')
  console.log('  News           : 6')
  console.log('  Events         : 5')
  console.log('  Banners        : 3')
  console.log('  Testimonials   : 4')
  console.log('  FAQs           : 7')
  console.log('  App Settings   : 19')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n🔑 Admin Login:')
  console.log('   Email    : admin@khairpurtamewali.com')
  console.log('   Password : Admin@KPT2025')
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
