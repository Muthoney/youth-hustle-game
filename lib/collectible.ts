export default class Collectible {
  x: number
  y: number
  radius = 12
  type: "job" | "ngo" | "money"
  color: string
  velocityX: number
  velocityY: number
  rotation = 0
  bobOffset = 0
  bobTime = 0

  constructor(x: number, y: number, type: "job" | "ngo" | "money") {
    this.x = x
    this.y = y
    this.type = type

    // Set color and velocity based on type
    switch (type) {
      case "job":
        this.color = "#3B82F6"
        break
      case "ngo":
        this.color = "#A855F7"
        break
      case "money":
        this.color = "#FBBF24"
        break
    }

    // Random drift
    this.velocityX = (Math.random() - 0.5) * 30
    this.velocityY = (Math.random() - 0.5) * 30
  }

  getPoints(): number {
    switch (this.type) {
      case "job":
        return 10
      case "ngo":
        return 15
      case "money":
        return 5
      default:
        return 0
    }
  }

  update(deltaTime: number) {
    // Gentle drift
    this.x += this.velocityX * deltaTime * 0.1
    this.y += this.velocityY * deltaTime * 0.1

    // Bobbing animation
    this.bobTime += deltaTime
    this.bobOffset = Math.sin(this.bobTime * 3) * 3

    // Rotation
    this.rotation += deltaTime * 2
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y + this.bobOffset)
    ctx.rotate(this.rotation)

    // Draw collectible
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
    ctx.fill()

    // Draw outline
    ctx.strokeStyle = "#FFFFFF"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw inner circle
    ctx.fillStyle = "#FFFFFF"
    ctx.beginPath()
    ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2)
    ctx.fill()

    // Draw icon
    ctx.fillStyle = this.color
    ctx.font = "bold 10px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    switch (this.type) {
      case "job":
        ctx.fillText("💼", 0, 0)
        break
      case "ngo":
        ctx.fillText("🏢", 0, 0)
        break
      case "money":
        ctx.fillText("💰", 0, 0)
        break
    }

    ctx.restore()
  }
}
