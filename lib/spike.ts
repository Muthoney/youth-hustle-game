export default class Spike {
  x: number
  y: number
  size = 20
  pulse = 0

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update(deltaTime: number) {
    this.pulse += deltaTime * 3
  }

  render(ctx: CanvasRenderingContext2D, cameraY: number) {
    const screenY = this.y - cameraY
    const scale = 1 + Math.sin(this.pulse) * 0.1

    // Draw shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.beginPath()
    ctx.ellipse(this.x, screenY + this.size + 2, this.size * 0.6, 2, 0, 0, Math.PI * 2)
    ctx.fill()

    // Draw spike (triangle)
    ctx.fillStyle = "#FF4444"
    ctx.beginPath()
    ctx.moveTo(this.x, screenY - this.size * scale)
    ctx.lineTo(this.x - this.size * scale, screenY + this.size * scale)
    ctx.lineTo(this.x + this.size * scale, screenY + this.size * scale)
    ctx.closePath()
    ctx.fill()

    // Draw spike outline
    ctx.strokeStyle = "#CC0000"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw warning glow
    ctx.strokeStyle = `rgba(255, 68, 68, ${0.3 + Math.sin(this.pulse) * 0.2})`
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(this.x, screenY - this.size * scale - 5)
    ctx.lineTo(this.x - this.size * scale - 5, screenY + this.size * scale + 5)
    ctx.lineTo(this.x + this.size * scale + 5, screenY + this.size * scale + 5)
    ctx.closePath()
    ctx.stroke()
  }
}
