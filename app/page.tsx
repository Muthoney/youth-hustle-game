"use client"

import { useEffect, useRef, useState } from "react"
import Game from "@/lib/game-engine"

interface Stats {
  skills: number
  network: number
  money: number
  energy: number
  motivation: number
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<Game | null>(null)
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">("menu")
  const [stats, setStats] = useState<Stats>({
    skills: 50,
    network: 50,
    money: 50,
    energy: 100,
    motivation: 100,
  })
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)

  useEffect(() => {
    const saved = localStorage.getItem("youthHustleHighScore")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    gameRef.current = new Game(canvas, ctx)

    let animationId: number
    let lastTime = Date.now()

    const gameLoop = () => {
      const now = Date.now()
      const deltaTime = (now - lastTime) / 1000
      lastTime = now

      if (gameState === "playing") {
        gameRef.current?.update(deltaTime)
        gameRef.current?.render()

        setStats({
          skills: Math.max(0, Math.min(100, gameRef.current?.stats.skills || 50)),
          network: Math.max(0, Math.min(100, gameRef.current?.stats.network || 50)),
          money: Math.max(0, Math.min(100, gameRef.current?.stats.money || 50)),
          energy: Math.max(0, Math.min(100, gameRef.current?.stats.energy || 100)),
          motivation: Math.max(0, Math.min(100, gameRef.current?.stats.motivation || 100)),
        })
        setLevel(gameRef.current?.level || 1)

        if (gameRef.current?.isGameOver) {
          setGameState("gameOver")
          const finalScore = gameRef.current?.score || 0
          if (finalScore > highScore) {
            setHighScore(finalScore)
            localStorage.setItem("youthHustleHighScore", finalScore.toString())
          }
        }
      } else {
        gameRef.current?.render()
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    animationId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animationId)
  }, [gameState, highScore])

  const startGame = () => {
    gameRef.current?.reset()
    setGameState("playing")
    setStats({
      skills: 50,
      network: 50,
      money: 50,
      energy: 100,
      motivation: 100,
    })
    setLevel(1)
  }

  const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-gray-700">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-200" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  )

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-400 via-teal-400 to-blue-500 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 p-4 text-white text-center">
            <h1 className="text-3xl font-bold">Youth Hustle</h1>
            <p className="text-sm opacity-90">Navigate Kenya's entrepreneurial pathways</p>
          </div>

          {/* Stats Display */}
          {gameState === "playing" && (
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 border-b-2 border-emerald-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <StatBar label="Skills" value={stats.skills} color="#3b82f6" />
                <StatBar label="Network" value={stats.network} color="#8b5cf6" />
                <StatBar label="Money" value={stats.money} color="#fbbf24" />
                <StatBar label="Energy" value={stats.energy} color="#ef4444" />
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Motivation: {stats.motivation}%</span>
                <span>Level {level}</span>
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="bg-black relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={600}
              className="w-full block"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Menu */}
          {gameState === "menu" && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl">
              <div className="bg-white p-8 rounded-xl text-center max-w-sm mx-4">
                <h2 className="text-3xl font-bold text-emerald-600 mb-2">Youth Hustle</h2>
                <p className="text-sm text-gray-600 mb-4">Jump between opportunities to build your career in Kenya</p>
                <div className="space-y-2 mb-6 text-left text-xs bg-gray-50 p-4 rounded-lg">
                  <p>
                    <span className="font-bold text-emerald-600">NGO Office:</span> +Skills, +Network
                  </p>
                  <p>
                    <span className="font-bold text-blue-600">Job Center:</span> +Network, +Money
                  </p>
                  <p>
                    <span className="font-bold text-purple-600">Training Hub:</span> +Skills
                  </p>
                  <p>
                    <span className="font-bold text-indigo-600">Cyber Café:</span> +Skills, -Money
                  </p>
                  <p>
                    <span className="font-bold text-orange-600">Market Hustle:</span> +Money, -Energy
                  </p>
                  <p>
                    <span className="font-bold text-pink-600">Boda Stop:</span> +Money, -Motivation
                  </p>
                  <p>
                    <span className="font-bold text-teal-600">Community:</span> +Network, +Motivation
                  </p>
                  <p>
                    <span className="font-bold text-green-600">Startup:</span> +Skills, +Money
                  </p>
                  <p>
                    <span className="font-bold text-lime-600">Farm:</span> +Money, +Motivation
                  </p>
                  <p>
                    <span className="font-bold text-red-600">Side Hustle:</span> +Money, risk burnout
                  </p>
                </div>
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all active:scale-95"
                >
                  Start Journey
                </button>
              </div>
            </div>
          )}

          {/* Game Over */}
          {gameState === "gameOver" && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl">
              <div className="bg-white p-8 rounded-xl text-center max-w-xs mx-4">
                <h2 className="text-3xl font-bold text-red-600 mb-4">Journey Ended</h2>
                <div className="mb-4 bg-gradient-to-r from-emerald-100 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Final Stats:</p>
                  <p className="text-2xl font-bold text-emerald-600">Level {level}</p>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>
                      Skills: {stats.skills}% | Network: {stats.network}%
                    </p>
                    <p>
                      Money: {stats.money}% | Energy: {stats.energy}%
                    </p>
                  </div>
                </div>
                {level > highScore && <p className="text-lg font-bold text-yellow-500 mb-4">New High Level!</p>}
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all active:scale-95"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-center text-white mt-6 text-sm">
          <p className="font-semibold">Tap/Click to Jump</p>
          <p className="opacity-90">or use SPACE key</p>
        </div>
      </div>
    </main>
  )
}
