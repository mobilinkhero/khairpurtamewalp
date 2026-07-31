import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/utils'
import { getUserFromRequest } from '@/lib/auth'

const DEFAULT_SETTINGS = [
  { key: 'hero_image_url',   label: 'Home Hero Image URL',    type: 'image',   group: 'appearance', value: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200' },
  { key: 'app_name',         label: 'App Name',                type: 'text',    group: 'general',    value: 'Khairpur Tamewali' },
  { key: 'app_tagline',      label: 'App Tagline',             type: 'text',    group: 'general',    value: 'Your City · Your Community' },
  { key: 'city_name',        label: 'City Name',               type: 'text',    group: 'general',    value: 'Khairpur Tamewali' },
  { key: 'city_district',    label: 'City District',           type: 'text',    group: 'general',    value: 'Bahawalpur' },
  { key: 'city_province',    label: 'Province',                type: 'text',    group: 'general',    value: 'Punjab' },
  { key: 'city_population',  label: 'Population',              type: 'text',    group: 'city_stats', value: '~290K' },
  { key: 'city_councils',    label: 'Union Councils',          type: 'text',    group: 'city_stats', value: '8' },
  { key: 'play_store_url',   label: 'Play Store URL',          type: 'text',    group: 'links',      value: 'https://play.google.com' },
  { key: 'contact_email',    label: 'Contact Email',           type: 'text',    group: 'links',      value: 'info@khairpurtamewali.com' },
  { key: 'about_text',       label: 'About / History Text',    type: 'textarea',group: 'about',      value: 'Khairpur Tamewali is a city in Bahawalpur District, Punjab, Pakistan.' },
  { key: 'disclaimer_text',  label: 'Disclaimer Text',         type: 'textarea',group: 'about',      value: 'This is an independent community platform, not affiliated with any government entity.' },
  { key: 'maintenance_mode', label: 'Maintenance Mode',        type: 'boolean', group: 'system',     value: 'false' },
  { key: 'show_weather',     label: 'Show Weather Widget',     type: 'boolean', group: 'system',     value: 'true' },
  { key: 'show_prayer',      label: 'Show Prayer Times Widget',type: 'boolean', group: 'system',     value: 'true' },
]

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    // Seed defaults if empty
    const count = await prisma.appSetting.count()
    if (count === 0) {
      await prisma.appSetting.createMany({ data: DEFAULT_SETTINGS })
    }

    const settings = await prisma.appSetting.findMany({ orderBy: [{ group: 'asc' }, { key: 'asc' }] })
    return apiSuccess(settings)
  } catch (e) {
    console.error(e)
    return apiError('Internal server error', 500)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) return apiError('Unauthorized', 401)

    const body = await req.json() as Record<string, string>
    const updates = await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.appSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value, label: key, type: 'text', group: 'general' },
        })
      )
    )
    return apiSuccess(updates, 'Settings saved')
  } catch (e) {
    console.error(e)
    return apiError('Internal server error', 500)
  }
}
