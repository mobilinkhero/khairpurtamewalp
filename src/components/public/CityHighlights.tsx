const facts = [
  {
    icon: '🕌',
    title: 'Rich Heritage',
    desc: 'Home to historic mosques, shrines and cultural landmarks that reflect centuries of tradition.',
    color: 'bg-emerald-50 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
  {
    icon: '🌾',
    title: 'Agricultural Hub',
    desc: 'Surrounded by fertile farmlands producing wheat, cotton and sugarcane in the heart of Punjab.',
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
  },
  {
    icon: '🏫',
    title: 'Education Centre',
    desc: 'Multiple schools and colleges serving thousands of students across the region.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '🏥',
    title: 'Healthcare Access',
    desc: 'Government hospitals, clinics and pharmacies providing essential healthcare to residents.',
    color: 'bg-red-50 border-red-100',
    iconBg: 'bg-red-100',
  },
  {
    icon: '🛒',
    title: 'Vibrant Markets',
    desc: 'Bustling bazaars and weekly markets offering fresh produce, goods and local crafts.',
    color: 'bg-purple-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    icon: '🤝',
    title: 'Strong Community',
    desc: 'A close-knit community known for hospitality, cultural events and mutual support.',
    color: 'bg-pink-50 border-pink-100',
    iconBg: 'bg-pink-100',
  },
]

const quickStats = [
  { value: 'Bahawalpur', label: 'District', icon: '📍' },
  { value: 'Punjab', label: 'Province', icon: '🗺️' },
  { value: 'Pakistan', label: 'Country', icon: '🇵🇰' },
  { value: '1122', label: 'Rescue', icon: '🚑' },
]

export default function CityHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-primary font-bold text-xs uppercase tracking-widest mb-3 bg-primary/8 px-4 py-1.5 rounded-full">About Our City</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Why Khairpur Tamewali?</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A thriving city in Bahawalpur District with a rich history, warm people and everything you need.
          </p>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {quickStats.map((s) => (
            <div key={s.label} className="bg-[#0a2e0a] rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-white font-black text-lg">{s.value}</div>
              <div className="text-green-300 text-xs mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Facts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {facts.map((f) => (
            <div key={f.title} className={`${f.color} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}>
              <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
