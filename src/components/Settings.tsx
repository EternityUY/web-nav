import { useNavStore } from '../stores/useNavStore'
import { Sun, Moon } from 'lucide-react'
import LiquidGlass from '@skyline23/liquid-glass-react'

export default function Settings() {
  const { darkMode, toggleDarkMode } = useNavStore()

  return (
    <div className="flex items-center gap-3">
      {/* Theme toggle — Liquid Glass pilot */}
      <LiquidGlass
        cornerRadius={100}
        displacementScale={60}
        blurAmount={0.08}
        saturation={130}
        aberrationIntensity={2}
        elasticity={0.25}
        padding="9px"
        overLight={!darkMode}
        onClick={toggleDarkMode}
        style={{ display: 'inline-flex', cursor: 'pointer' }}
      >
        <span
          className="flex items-center justify-center"
          title={darkMode ? '切换亮色模式' : '切换暗色模式'}
        >
          {darkMode ? (
            <Sun size={18} color="rgba(255,255,255,0.75)" />
          ) : (
            <Moon size={18} color="rgba(80,80,80,0.8)" />
          )}
        </span>
      </LiquidGlass>
    </div>
  )
}
