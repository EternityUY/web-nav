import { useClock } from '../hooks/useClock'

export default function Clock() {
  const { hours, minutes, dateStr, dayStr } = useClock()

  return (
    <div className="text-center select-none">
      <div className="text-7xl font-thin text-white/90 tracking-wider">
        {hours}:{minutes}
      </div>
      <div className="text-lg text-white/60 mt-2 font-light">
        {dateStr} {dayStr}
      </div>
    </div>
  )
}
