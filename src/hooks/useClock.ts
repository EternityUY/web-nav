import { useState, useEffect } from 'react'

const DAY_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export function useClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const dateStr = `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日`
  const dayStr = DAY_NAMES[time.getDay()]

  return { hours, minutes, dateStr, dayStr }
}
