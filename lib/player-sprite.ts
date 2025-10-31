export default class Player {
  x: number
  y: number
  width = 24
  height = 32
  velocityY = 0
  velocityX = 0
  gravity = 0.6
  jumpPower = 12
  isJumping = false
  animationFrame = 0
  moveLeft = false
  moveRight = false

  constructor(x: number, y: number) {
    this.x = x
    this.y = y

    // Touch and keyboard controls
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        this.jump()
      }
      if (e.key === "ArrowLeft" || e.key === "a") this.moveLeft = true
      if (e.key === "ArrowRight" || e.key === "d") this.moveRight = true
    })

    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowLeft" || e.key === "a") this.moveLeft = false
      if (e.key === "ArrowRight" || e.key === "d") this.moveRight = false
    })

    document.addEventListener("click", () => this.jump())
    document.addEventListener("touchstart", () => this.jump())
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = -this.jumpPower
      this.isJumping = true
    }
  }

  update(deltaTime: number, canvas: HTMLCanvasElement) {
    // Horizontal movement
    if (this.moveLeft) this.x -= 5
    if (this.moveRight) this.x += 5

    // Wrap around screen
    if (this.x < 0) this.x = canvas.width
    if (this.x > canvas.width) this.x = 0

    // Gravity
    this.velocityY += this.gravity
    this.y += this.velocityY

    // Animation
    this.animationFrame += deltaTime * 10
    if (this.animationFrame > 4) this.animationFrame = 0
  }

  render(ctx: CanvasRenderingContext2D, cameraY: number) {
    const screenY = this.y - cameraY

    // Draw shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.beginPath()
    ctx.ellipse(this.x + this.width / 2, screenY + this.height + 4, this.width / 2, 3, 0, 0, Math.PI * 2)
    ctx.fill()

    // Draw body (gradient)
    const gradient = ctx.createLinearGradient(this.x, screenY, this.x, screenY + this.height)
    gradient.addColorStop(0, "#FF6B9D")
    gradient.addColorStop(1, "#C44569")
    ctx.fillStyle = gradient
    ctx.fillRect(this.x, screenY, this.width, this.height)

    // Draw head
    ctx.fillStyle = "#FFD700"
    ctx.beginPath()
    ctx.arc(this.x + this.width / 2, screenY + 8, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw eyes with animation
    const eyeOffset = Math.sin(this.animationFrame * 0.5) * 2
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.arc(this.x + this.width / 2 - 4 + eyeOffset, screenY + 6, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(this.x + this.width / 2 + 4 + eyeOffset, screenY + 6, 2, 0, Math.PI * 2)
    ctx.fill()

    // Draw smile
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(this.x + this.width / 2, screenY + 10, 3, 0, Math.PI)
    ctx.stroke()

    // Draw arms
    ctx.strokeStyle = "#FFD700"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(this.x + 2, screenY + 14)
    ctx.lineTo(this.x - 4, screenY + 18)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(this.x + this.width - 2, screenY + 14)
    ctx.lineTo(this.x + this.width + 4, screenY + 18)
    ctx.stroke()
  }
}
