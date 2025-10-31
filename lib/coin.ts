export default class Coin {
  x: number
  y: number
  size = 12
  rotation = 0
  bobOffset = 0

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update(deltaTime: number) {
    this.rotation += deltaTime * 5
    this.bobOffset = Math.sin(this.rotation * 0.05) * 3
  }

  render(ctx: CanvasRenderingContext2D, cameraY: number) {
    const screenY = this.y - cameraY + this.bobOffset

    // Draw shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
    ctx.beginPath()
    ctx.ellipse(this.x, screenY + this.size + 2, this.size * 0.8, 2, 0, 0, Math.PI * 2)
    ctx.fill()

    // Draw coin with gradient
    const gradient = ctx.createRadialGradient(this.x - 3, screenY - 3, 0, this.x, screenY, this.size)
    gradient.addColorStop(0, "#FFED4E")
    gradient.addColorStop(0.5, "#FFD700")
    gradient.addColorStop(1, "#FFA500")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, screenY, this.size, 0, Math.PI * 2)
    ctx.fill()

    // Draw coin outline
    ctx.strokeStyle = "#FF8C00"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Draw shine
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
    ctx.beginPath()
    ctx.arc(this.x - 3, screenY - 3, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}
