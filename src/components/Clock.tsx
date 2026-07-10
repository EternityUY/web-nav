import { useClock } from '../hooks/useClock'

export default function Clock() {
  const { hours, minutes, dateStr, dayStr } = useClock()

  return (
    <div className="text-center select-none">
      <div className="text-6xl font-medium dark:text-white/90 text-gray-800 tracking-wider">
        {hours}:{minutes}
      </div>
      <div className="text-lg dark:text-white/60 text-gray-500 mt-2 font-light">
        {dateStr} {dayStr}
      </div>
    </div>
  )
}
