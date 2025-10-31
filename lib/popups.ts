export default class PopupManager {
  popups: Popup[] = []

  add(x: number, y: number, text: string, color: string) {
    this.popups.push(new Popup(x, y, text, color))
  }

  update(deltaTime: number) {
    for (let i = this.popups.length - 1; i >= 0; i--) {
      this.popups[i].update(deltaTime)
      if (this.popups[i].life <= 0) {
        this.popups.splice(i, 1)
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (const popup of this.popups) {
      popup.render(ctx)
    }
  }
}

class Popup {
  x: number
  y: number
  text: string
  color: string
  life = 1
  velocityY = -50

  constructor(x: number, y: number, text: string, color: string) {
    this.x = x
    this.y = y
    this.text = text
    this.color = color
  }

  update(deltaTime: number) {
    this.y += this.velocityY * deltaTime
    this.life -= deltaTime * 1.5
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.life)

    // Draw text
    ctx.fillStyle = this.color
    ctx.font = "bold 16px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Add shadow for better visibility
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
    ctx.shadowBlur = 4
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1

    ctx.fillText(this.text, this.x, this.y)

    ctx.restore()
  }
}
