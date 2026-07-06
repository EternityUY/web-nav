import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  speed: number
  twinkleSpeed: number
  twinklePhase: number
}

interface Nebula {
  x: number
  y: number
  radius: number
  color: string
  speedX: number
  speedY: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  trail: { x: number; y: number }[]
}

export default function NebulaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let w = window.innerWidth
    let h = window.innerHeight

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w
      canvas!.height = h
    }
    resize()
    window.addEventListener('resize', resize)

    // ---- Stars ----
    const starCount = Math.floor((w * h) / 6000)
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 0.3 + Math.random() * 2,
      opacity: 0.3 + Math.random() * 0.7,
      speed: 0.02 + Math.random() * 0.06,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
    }))

    // ---- Nebula clouds ----
    const nebulaColors = [
      'rgba(30, 60, 180, 0.12)',
      'rgba(100, 40, 180, 0.10)',
      'rgba(20, 100, 180, 0.10)',
      'rgba(180, 60, 120, 0.06)',
      'rgba(60, 120, 200, 0.08)',
    ]
    const nebulae: Nebula[] = nebulaColors.map((color) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: 150 + Math.random() * 350,
      color,
      speedX: -0.08 + Math.random() * 0.16,
      speedY: -0.06 + Math.random() * 0.12,
    }))

    // ---- Shooting stars ----
    const shootingStars: ShootingStar[] = []

    let frameCount = 0
    const draw = () => {
      frameCount++
      ctx!.clearRect(0, 0, w, h)

      // 1. Deep space gradient background
      const bgGrad = ctx!.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, Math.max(w, h) * 0.8)
      bgGrad.addColorStop(0, '#0f0f2e')
      bgGrad.addColorStop(0.5, '#0a0a1a')
      bgGrad.addColorStop(1, '#050510')
      ctx!.fillStyle = bgGrad
      ctx!.fillRect(0, 0, w, h)

      // 2. Nebula clouds
      for (const n of nebulae) {
        n.x += n.speedX
        n.y += n.speedY
        // Wrap around edges
        if (n.x < -n.radius) n.x = w + n.radius
        if (n.x > w + n.radius) n.x = -n.radius
        if (n.y < -n.radius) n.y = h + n.radius
        if (n.y > h + n.radius) n.y = -n.radius

        const grad = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius)
        grad.addColorStop(0, n.color)
        grad.addColorStop(0.5, n.color.replace('0.12', '0.06').replace('0.10', '0.05').replace('0.08', '0.04').replace('0.06', '0.03'))
        grad.addColorStop(1, 'transparent')
        ctx!.fillStyle = grad
        ctx!.fillRect(0, 0, w, h)
      }

      // 3. Stars
      for (const star of stars) {
        // Subtle drift
        star.y -= star.speed * 0.1

        // Wrap
        if (star.y < -5) {
          star.y = h + 5
          star.x = Math.random() * w
        }

        // Twinkle
        star.twinklePhase += star.twinkleSpeed
        const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(star.twinklePhase))
        const alpha = star.opacity * twinkle

        ctx!.beginPath()
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()

        // Glow for brighter stars
        if (star.size > 1.5) {
          ctx!.beginPath()
          ctx!.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(180, 200, 255, ${alpha * 0.15})`
          ctx!.fill()
        }
      }

      // 4. Shooting stars (occasional)
      if (frameCount % 180 === 0 && shootingStars.length < 2 && Math.random() < 0.5) {
        const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.3
        const speed = 8 + Math.random() * 6
        shootingStars.push({
          x: Math.random() * w * 0.8 + w * 0.1,
          y: Math.random() * h * 0.3,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 40 + Math.random() * 30,
          trail: [],
        })
      }

      // Update & draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.life++
        s.trail.push({ x: s.x, y: s.y })
        if (s.trail.length > 20) s.trail.shift()
        s.x += s.vx
        s.y += s.vy

        if (s.life > s.maxLife || s.x < -50 || s.x > w + 50 || s.y < -50 || s.y > h + 50) {
          shootingStars.splice(i, 1)
          continue
        }

        const progress = s.life / s.maxLife
        const alpha = 1 - progress

        // Trail
        for (let t = 0; t < s.trail.length - 1; t++) {
          const trailProgress = t / s.trail.length
          ctx!.beginPath()
          ctx!.moveTo(s.trail[t].x, s.trail[t].y)
          ctx!.lineTo(s.trail[t + 1].x, s.trail[t + 1].y)
          ctx!.strokeStyle = `rgba(255, 255, 255, ${alpha * (1 - trailProgress) * 0.6})`
          ctx!.lineWidth = 1.5
          ctx!.stroke()
        }

        // Head
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx!.fill()

        // Glow
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, 6, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(200, 220, 255, ${alpha * 0.2})`
        ctx!.fill()
      }

      // 5. Subtle overlay gradient for depth
      const overlay = ctx!.createLinearGradient(0, 0, 0, h)
      overlay.addColorStop(0, 'rgba(0, 0, 0, 0)')
      overlay.addColorStop(0.7, 'rgba(0, 0, 0, 0)')
      overlay.addColorStop(1, 'rgba(0, 0, 0, 0.3)')
      ctx!.fillStyle = overlay
      ctx!.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
