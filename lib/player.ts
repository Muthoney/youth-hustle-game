import Platform from "./platform"

export default class Player {
  x: number
  y: number
  width = 30
  height = 40
  velocityY = 0
  isJumping = false
  score = 0
  popupText: string | null = null
  popupTimer = 0

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update(platforms: Platform[], gravity: number, onMilestone: (msg: string) => void) {
    this.velocityY += gravity
    this.y += this.velocityY

    for (const p of platforms) {
      if (
        this.y + this.height >= p.y &&
        this.y + this.height <= p.y + 10 &&
        this.x + this.width > p.x &&
        this.x < p.x + p.width &&
        this.velocityY > 0
      ) {
        this.isJumping = false
        this.velocityY = -12 // jump again automatically
        this.score++
        const message = this.getMilestoneMessage(p.type)
        if (message) {
          this.popupText = message
          this.popupTimer = 60 // 1 second (60 FPS)
          onMilestone(message)
        }
        break
      }
    }

    if (this.popupTimer > 0) this.popupTimer--
    if (this.popupTimer === 0) this.popupText = null
  }

  getMilestoneMessage(type: string): string | null {
    const messages: Record<string, string> = {
      school: "🎓 SCHOOL COMPLETED!",
      training: "🧠 SKILLS UPGRADED!",
      jobCenter: "💼 GOT AN INTERVIEW!",
      ngo: "🤝 VOLUNTEERED!",
      community: "🏘️ HELPED THE COMMUNITY!",
      market: "🛍️ STARTED A SMALL BUSINESS!",
      boda: "🚲 HUSTLING HARD!",
      startup: "🚀 LAUNCHED A STARTUP!",
      farm: "🌾 LEARNED FARMING!",
      sideHustle: "💰 BUILT A SIDE INCOME!",
      business: "🏦 BUSINESS GROWING!",
      mentor: "🎯 GOT A MENTOR!",
      success: "🏆 SUCCESS ACHIEVED!"
    }
    return messages[type] || null
  }

  render(ctx: CanvasRenderingContext2D, cameraY: number) {
    ctx.fillStyle = "orange"
    ctx.fillRect(this.x, this.y - cameraY, this.width, this.height)

    if (this.popupText) {
      ctx.font = "bold 20px Arial"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText(this.popupText, this.x + this.width / 2, this.y - cameraY - 20)
    }
  }
}
