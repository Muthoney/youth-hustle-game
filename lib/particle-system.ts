interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

export default class ParticleSystem {
  particles: Particle[] = []

  emit(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count
      const speed = 3 + Math.random() * 3
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1,
        maxLife: 1,
        color,
        size: 3 + Math.random() * 2,
      })
    }
  }

  update(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life -= deltaTime * 2
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.2 // gravity

      if (p.life <= 0) {
        this.particles.splice(i, 1)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D, cameraY: number) {
    for (const p of this.particles) {
      const screenY = p.y - cameraY
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life
      ctx.beginPath()
      ctx.arc(p.x, screenY, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }
  }
}
