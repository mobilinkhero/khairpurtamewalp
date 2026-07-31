'use client'

import { useQuery } from '@tanstack/react-query'

// Khairpur Tamewali coordinates
const LAT = 29.5672
const LNG = 72.2436

interface WeatherData {
  current: {
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
    wind_speed_10m: number
    relative_humidity_2m: number
  }
}

function getCondition(code: number) {
  if (code === 0) return { label: 'Clear Sky', icon: '☀️' }
  if (code <= 2) return { label: 'Partly Cloudy', icon: '⛅' }
  if (code === 3) return { label: 'Overcast', icon: '☁️' }
  if (code <= 49) return { label: 'Foggy', icon: '🌫️' }
  if (code <= 69) return { label: 'Rainy', icon: '🌧️' }
  if (code <= 79) return { label: 'Snowy', icon: '🌨️' }
  if (code <= 82) return { label: 'Showers', icon: '🌦️' }
  if (code <= 99) return { label: 'Thunderstorm', icon: '⛈️' }
  return { label: 'Unknown', icon: '🌡️' }
}

export default function WeatherWidget() {
  const { data, isLoading } = useQuery<WeatherData>({
    queryKey: ['weather'],
    queryFn: async () => {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m`
      )
      return res.json()
    },
    staleTime: 1000 * 60 * 30, // 30 min
  })

  if (isLoading) return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 animate-pulse h-36" />
  )

  if (!data) return null

  const { temperature_2m, weather_code, wind_speed_10m, relative_humidity_2m } = data.current
  const { label, icon } = getCondition(weather_code)

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-900 dark:to-blue-950 rounded-2xl p-5 text-white relative overflow-hidden">
      <div className="absolute -top-4 -right-4 text-8xl opacity-20 select-none">{icon}</div>
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">Weather · KPT</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black">{Math.round(temperature_2m)}°</span>
            <span className="text-xl mb-1">{icon}</span>
          </div>
          <p className="text-sm font-semibold text-blue-100 mt-1">{label}</p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-xs text-blue-200">💨 {Math.round(wind_speed_10m)} km/h</div>
          <div className="text-xs text-blue-200">💧 {relative_humidity_2m}%</div>
        </div>
      </div>
    </div>
  )
}
