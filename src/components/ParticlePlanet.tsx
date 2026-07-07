import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ---- Shaders ----

const vertexShader = `
  uniform float uTime;

  attribute float aSize;
  attribute vec4 aShift;   // x: phaseX, y: phaseY, z: speed, w: amplitude

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // 轨道微动 (wobble) — 每个粒子沿随机方向做小幅度周期运动
    float t = uTime;
    float moveT = mod(aShift.x + aShift.z * t, 6.2832);
    float moveS = mod(aShift.y + aShift.z * t, 6.2832);
    vec3 wobble = vec3(
      cos(moveS) * sin(moveT),
      cos(moveT),
      sin(moveS) * sin(moveT)
    ) * aShift.w;

    vec3 newPos = position + wobble;

    // 颜色：根据位置混合 紫色(核心) → 金色(外缘)
    // 不同方向不同缩放，使颜色梯度在盘面方向更明显
    float d = length(abs(newPos) / vec3(12.0, 4.0, 12.0));
    d = clamp(d, 0.0, 1.0);
    // 紫色 (100,50,255) → 金色 (227,155,0)
    vec3 purple = vec3(0.392, 0.196, 1.0);
    vec3 gold   = vec3(0.890, 0.608, 0.0);
    vColor = mix(purple, gold, d);

    // 边缘淡出 — 盘面外缘渐隐
    float dist = length(newPos);
    vAlpha = smoothstep(16.0, 8.0, dist);

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
    // 柔和圆点：中心亮 → 边缘渐变透明
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;

    float strength = smoothstep(0.5, 0.2, d);
    gl_FragColor = vec4(vColor, strength * vAlpha * 0.6 + 0.4);
  }
`

// ---- Helpers ----

function isMobile() {
  return window.innerWidth < 768
}

function getDeviceConfig() {
  const mobile = isMobile()
  return {
    sphereCount: mobile ? 10000 : 25000,
    discCount: mobile ? 20000 : 50000,
    baseRadius: mobile ? 2.2 : 3.0,
    shellThickness: mobile ? 0.2 : 0.3,
    discInnerR: mobile ? 2.4 : 3.2,
    discOuterR: mobile ? 8 : 12,
    discHeight: mobile ? 0.4 : 0.6,
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
    sphereGeo: THREE.BufferGeometry
    discGeo: THREE.BufferGeometry
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
    scene.background = new THREE.Color(0x160016)

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000)
    camera.position.set(0, 1.5, config.cameraZ)
    camera.lookAt(0, 0, 0)

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1.5 : 2))
    container.appendChild(renderer.domElement)

    // ---- 1. 球形壳粒子 ----
    const totalParticles = config.sphereCount + config.discCount
    const positions = new Float32Array(totalParticles * 3)
    const sizes = new Float32Array(totalParticles)
    const shifts = new Float32Array(totalParticles * 4)

    let idx = 0

    // 球形壳：有厚度的球壳，半径在 [baseRadius, baseRadius + thickness] 范围
    for (let i = 0; i < config.sphereCount; i++, idx++) {
      const dir = new THREE.Vector3().randomDirection()
      const r = config.baseRadius + Math.random() * config.shellThickness
      positions[idx * 3] = dir.x * r
      positions[idx * 3 + 1] = dir.y * r
      positions[idx * 3 + 2] = dir.z * r

      sizes[idx] = 0.5 + Math.random() * 1.0

      // shift: phaseX, phaseY, speed, amplitude
      shifts[idx * 4] = Math.random() * Math.PI
      shifts[idx * 4 + 1] = Math.random() * Math.PI * 2
      shifts[idx * 4 + 2] = (Math.random() * 0.9 + 0.1) * Math.PI * 0.1
      shifts[idx * 4 + 3] = Math.random() * 0.15 + 0.05
    }

    // 吸积盘：柱坐标扁平盘面，内缘密度更高 (pow(rand, 1.5))
    for (let i = 0; i < config.discCount; i++, idx++) {
      const rand = Math.pow(Math.random(), 1.5)
      const radius = Math.sqrt(
        config.discOuterR * config.discOuterR * rand +
        (1 - rand) * config.discInnerR * config.discInnerR
      )
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * config.discHeight * 2

      const vec = new THREE.Vector3().setFromCylindricalCoords(radius, angle, height)
      positions[idx * 3] = vec.x
      positions[idx * 3 + 1] = vec.y
      positions[idx * 3 + 2] = vec.z

      sizes[idx] = 0.3 + Math.random() * 0.8

      shifts[idx * 4] = Math.random() * Math.PI
      shifts[idx * 4 + 1] = Math.random() * Math.PI * 2
      shifts[idx * 4 + 2] = (Math.random() * 0.9 + 0.1) * Math.PI * 0.08
      shifts[idx * 4 + 3] = Math.random() * 0.12 + 0.03
    }

    // --- Geometry ---
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('aShift', new THREE.BufferAttribute(shifts, 4))

    // --- ShaderMaterial ---
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    // --- Particle system ---
    const particles = new THREE.Points(geometry, material)
    particles.rotation.order = 'ZYX'
    particles.rotation.z = 0.15
    scene.add(particles)

    // --- Background stars ---
    const starCount = 500
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 400
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))

    const starColors = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const tint = 0.6 + Math.random() * 0.4
      starColors[i * 3] = tint
      starColors[i * 3 + 1] = tint * 0.7
      starColors[i * 3 + 2] = tint
    }
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

    const starMat = new THREE.PointsMaterial({
      size: 0.3,
      transparent: true,
      opacity: 0.35,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // --- Clock & animation ---
    const clock = new THREE.Clock()

    function animate() {
      const elapsed = clock.getElapsedTime()
      // 传弧度值 (actium 方案: t * PI)
      material.uniforms.uTime.value = elapsed * Math.PI

      // 慢速自动旋转
      particles.rotation.y = elapsed * config.rotationSpeed
      stars.rotation.y = elapsed * config.rotationSpeed * 0.05

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
      setTimeout(handleResize, 300)
    }
    window.addEventListener('orientationchange', handleOrientation)

    // --- Store refs ---
    sceneRef.current = {
      scene, camera, renderer, material,
      sphereGeo: geometry,
      discGeo: geometry,
      particles, clock, animId, config,
    }

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientation)

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
