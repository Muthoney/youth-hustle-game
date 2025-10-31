export default class Obstacle {
  x: number
  y: number
  radius = 14
  type: "competition" | "skillgap"
  color: string
  velocityX: number
  velocityY: number
  rotation = 0
  pulseTime = 0

  constructor(x: number, y: number, type: "competition" | "skillgap") {
    this.x = x
    this.y = y
    this.type = type
    this.color = "#EF4444"

    // Random drift
    this.velocityX = (Math.random() - 0.5) * 20
    this.velocityY = (Math.random() - 0.5) * 20
  }

  update(deltaTime: number) {
    // Gentle drift
    this.x += this.velocityX * deltaTime * 0.1
    this.y += this.velocityY * deltaTime * 0.1

    // Rotation
    this.rotation += deltaTime * 3

    // Pulse animation
    this.pulseTime += deltaTime
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)

    // Pulse effect
    const pulse = Math.sin(this.pulseTime * 4) * 0.2 + 0.8
    const pulseRadius = this.radius * pulse

    // Draw warning aura
    ctx.fillStyle = "rgba(239, 68, 68, 0.2)"
    ctx.beginPath()
    ctx.arc(0, 0, pulseRadius + 5, 0, Math.PI * 2)
    ctx.fill()

    // Draw obstacle
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2)
    ctx.fill()

    // Draw outline
    ctx.strokeStyle = "#991B1B"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw warning symbol
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("⚠", 0, 0)

    ctx.restore()
  }
}
