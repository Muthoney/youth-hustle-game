export default class ParticleSystem {
  particles: Particle[] = []

  burst(x: number, y: number, color: string, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const velocity = 100 + Math.random() * 100
      this.particles.push(new Particle(x, y, Math.cos(angle) * velocity, Math.sin(angle) * velocity, color))
    }
  }

  update(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(deltaTime)
      if (this.particles[i].life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (const particle of this.particles) {
      particle.render(ctx)
    }
  }
}

class Particle {
  x: number
  y: number
  velocityX: number
  velocityY: number
  life = 1
  color: string
  size = 4

  constructor(x: number, y: number, vx: number, vy: number, color: string) {
    this.x = x
    this.y = y
    this.velocityX = vx
    this.velocityY = vy
    this.color = color
  }

  update(deltaTime: number) {
    this.x += this.velocityX * deltaTime
    this.y += this.velocityY * deltaTime
    this.velocityY += 200 * deltaTime // Gravity
    this.life -= deltaTime * 2
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.globalAlpha = Math.max(0, this.life)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}
