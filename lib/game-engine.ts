import Player from "./player-sprite"
import Platform, { type PlatformType } from "./platform"
import ParticleSystem from "./particle-system"

export interface GameStats {
  skills: number
  network: number
  money: number
  energy: number
  motivation: number
}

export default class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  player: Player
  platforms: Platform[] = []
  particles: ParticleSystem
  stats: GameStats = {
    skills: 50,
    network: 50,
    money: 50,
    energy: 100,
    motivation: 100,
  }
  score = 0
  level = 1
  isGameOver = false
  spawnTimer = 0
  cameraY = 0

  platformTypes: PlatformType[] = [
    "ngo",
    "jobCenter",
    "training",
    "cafe",
    "market",
    "boda",
    "community",
    "startup",
    "farm",
    "sideHustle",
  ]

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
    this.particles = new ParticleSystem()
    this.player = new Player(canvas.width / 2, canvas.height - 100)
    this.createInitialPlatforms()
  }

  createInitialPlatforms() {
    this.platforms = [
      new Platform(this.canvas.width / 2, this.canvas.height - 50, 80, 15, "ngo"),
      new Platform(100, this.canvas.height - 150, 80, 15, "jobCenter"),
      new Platform(this.canvas.width - 100, this.canvas.height - 150, 80, 15, "training"),
      new Platform(this.canvas.width / 2, this.canvas.height - 250, 80, 15, "cafe"),
    ]
  }

  spawnPlatform() {
    const x = Math.random() * (this.canvas.width - 80) + 40
    const y = this.cameraY - 50
    const type = this.platformTypes[Math.floor(Math.random() * this.platformTypes.length)]
    this.platforms.push(new Platform(x, y, 80, 15, type))
  }

  applyPlatformEffect(type: PlatformType) {
    const effects: Record<PlatformType, Partial<GameStats>> = {
      ngo: { skills: 5, network: 5 },
      jobCenter: { network: 5, money: 3 },
      training: { skills: 8 },
      cafe: { skills: 4, money: -3 },
      market: { money: 6, energy: -4 },
      boda: { money: 5, motivation: -4 },
      community: { network: 5, motivation: 5 },
      startup: { skills: 6, money: 5 },
      farm: { money: 5, motivation: 6 },
      sideHustle: { money: 7, motivation: Math.random() > 0.7 ? -8 : 0 },
    }

    const effect = effects[type]
    Object.entries(effect).forEach(([key, value]) => {
      const statKey = key as keyof GameStats
      this.stats[statKey] = Math.max(0, Math.min(100, this.stats[statKey] + value))
    })
  }

  update(deltaTime: number) {
    if (this.isGameOver) return

    this.player.update(deltaTime, this.canvas)

    // Camera follows player
    if (this.player.y < this.cameraY + 200) {
      this.cameraY = this.player.y - 200
      this.level = Math.floor(this.cameraY / 500) + 1
    }

    // Energy and motivation drain over time
    this.stats.energy = Math.max(0, this.stats.energy - deltaTime * 2)
    this.stats.motivation = Math.max(0, this.stats.motivation - deltaTime * 1.5)

    // Game over if any critical stat hits 0
    if (this.stats.energy <= 0 || this.stats.motivation <= 0) {
      this.isGameOver = true
      this.particles.emit(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2, 20, "#FF4444")
    }

    // Spawn new platforms
    this.spawnTimer += deltaTime
    if (this.spawnTimer > Math.max(0.6, 1 - this.level * 0.05)) {
      this.spawnPlatform()
      this.spawnTimer = 0
    }

    // Platform collision
    let onPlatform = false
    for (const platform of this.platforms) {
      if (
        this.player.velocityY > 0 &&
        this.player.y + this.player.height >= platform.y &&
        this.player.y + this.player.height <= platform.y + platform.height + 10 &&
        this.player.x + this.player.width > platform.x &&
        this.player.x < platform.x + platform.width
      ) {
        this.player.velocityY = -12
        onPlatform = true
        this.score += 10
        this.applyPlatformEffect(platform.type)
        this.particles.emit(this.player.x + this.player.width / 2, this.player.y + this.player.height, 12, "#4F46E5")
      }
    }

    // Game over if fell too far
    if (this.player.y > this.cameraY + this.canvas.height + 100) {
      this.isGameOver = true
    }

    // Clean up off-screen objects
    this.platforms = this.platforms.filter((p) => p.y < this.cameraY + this.canvas.height + 100)

    this.particles.update(deltaTime)
  }

  render() {
    // Background gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height)
    gradient.addColorStop(0, "#10b981")
    gradient.addColorStop(0.5, "#14b8a6")
    gradient.addColorStop(1, "#3b82f6")
    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw platforms
    for (const platform of this.platforms) {
      platform.render(this.ctx, this.cameraY)
    }

    // Draw particles
    this.particles.render(this.ctx, this.cameraY)

    // Draw player
    this.player.render(this.ctx, this.cameraY)

    // Draw UI
    this.ctx.fillStyle = "white"
    this.ctx.font = "bold 14px Arial"
    this.ctx.fillText(`Level: ${this.level}`, 10, 25)
    this.ctx.fillText(`Score: ${this.score}`, 10, 45)
  }

  reset() {
    this.score = 0
    this.level = 1
    this.isGameOver = false
    this.cameraY = 0
    this.spawnTimer = 0
    this.platforms = []
    this.particles = new ParticleSystem()
    this.player = new Player(this.canvas.width / 2, this.canvas.height - 100)
    this.stats = {
      skills: 50,
      network: 50,
      money: 50,
      energy: 100,
      motivation: 100,
    }
    this.createInitialPlatforms()
  }
}
