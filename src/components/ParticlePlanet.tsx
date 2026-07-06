import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ---- Shaders ----

const vertexShader = `
  uniform float uTime;
  uniform float uRadius;

  attribute float aSize;
  attribute vec3 aRandom;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // 粒子在球体表面 + 法线方向呼吸浮动
    float offset = sin(uTime * 0.6 + aRandom.x * 6.28) * 0.3;
    vec3 newPos = position + normalize(position) * offset;

    // 颜色：基于位置 + 时间变化，产生 RGB 流光
    float r = 0.6 + 0.4 * sin(newPos.x * 0.8 + uTime * 0.25);
    float g = 0.5 + 0.5 * sin(newPos.y * 0.8 + uTime * 0.35 + 2.0);
    float b = 0.7 + 0.3 * sin(newPos.z * 0.8 + uTime * 0.45 + 4.0);
    vColor = vec3(r, g, b);

    // 边缘淡出
    float dist = length(newPos);
    vAlpha = smoothstep(uRadius * 1.2, uRadius * 0.3, dist);

    // 标准变换
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    gl_PointSize = aSize * (280.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // 发光圆点：中心亮 → 边缘渐变透明
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - d;
    strength = pow(strength, 1.8);

    if (strength < 0.01) discard;

    gl_FragColor = vec4(vColor, strength * vAlpha);
  }
`

// ---- Helpers ----

function isMobile() {
  return window.innerWidth < 768
}

function getDeviceConfig() {
  const mobile = isMobile()
  return {
    particleCount: mobile ? 12000 : 30000,
    radius: mobile ? 2.2 : 3.0,
    pixelRatio: Math.min(window.devicePixelRatio, mobile ? 1.5 : 2),
    cameraZ: mobile ? 6 : 8,
    rotationSpeed: mobile ? 0.15 : 0.1,
  }
}

// ---- Component ----

export default function ParticlePlanet() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    material: THREE.ShaderMaterial
    geometry: THREE.BufferGeometry
    particles: THREE.Points
    clock: THREE.Clock
    animId: number
    config: ReturnType<typeof getDeviceConfig>
  } | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const config = getDeviceConfig()

    // --- Scene ---
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050510)

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000)
    camera.position.set(0, 1.5, config.cameraZ)
    camera.lookAt(0, 0, 0)

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(config.pixelRatio)
    container.appendChild(renderer.domElement)

    // --- Generate particles ---
    const { particleCount, radius } = config
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const randoms = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // 球体表面均匀分布（球坐标）
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      sizes[i] = 0.15 + Math.random() * 0.7
      randoms[i * 3] = Math.random()
      randoms[i * 3 + 1] = Math.random()
      randoms[i * 3 + 2] = Math.random()
    }

    // --- Geometry ---
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3))

    // --- ShaderMaterial ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: radius },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    // --- Particle system ---
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // --- Background stars ---
    const starCount = config.particleCount > 20000 ? 2000 : 1000
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 400
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.3,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // --- Clock & animation ---
    const clock = new THREE.Clock()

    function animate() {
      const elapsed = clock.getElapsedTime()
      material.uniforms.uTime.value = elapsed

      // 自动旋转
      particles.rotation.y = elapsed * config.rotationSpeed
      stars.rotation.y = elapsed * config.rotationSpeed * 0.1

      renderer.render(scene, camera)
      sceneRef.current!.animId = requestAnimationFrame(animate)
    }

    const animId = requestAnimationFrame(animate)

    // --- Resize handler ---
    function handleResize() {
      const w = container!.clientWidth
      const h = container!.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // --- Orientation change for mobile ---
    function handleOrientation() {
      // Small delay to let layout settle
      setTimeout(handleResize, 300)
    }
    window.addEventListener('orientationchange', handleOrientation)

    // --- Store refs ---
    sceneRef.current = {
      scene, camera, renderer, material, geometry, particles,
      clock, animId, config,
    }

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientation)

      // Dispose Three.js resources
      geometry.dispose()
      material.dispose()
      starGeo.dispose()
      starMat.dispose()
      renderer.dispose()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ width: '100%', height: '100%', overflow: 'hidden' }}
    />
  )
}
