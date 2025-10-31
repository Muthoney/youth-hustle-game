import Player from "./player"
import GameMap from "./gameMap"

export default class Game {
  private player: Player
  private map: GameMap
  private gravity = 0.5
  private cameraY = 0

  constructor(private ctx: CanvasRenderingContext2D, private canvas: HTMLCanvasElement) {
    this.map = new GameMap(canvas.width, canvas.height)
    this.player = new Player(canvas.width / 2, canvas.height - 100)
  }

  update() {
    this.player.update(this.map.platforms, this.gravity, (msg) => this.onMilestone(msg))

    // Move camera as player goes up
    if (this.player.y < this.cameraY + 200) {
      this.cameraY -= 2
    }

    // Auto-generate more levels
    const highestPlatform = this.map.platforms[this.map.platforms.length - 1]
    if (this.player.y < highestPlatform.y + 300) {
      this.map.generateNextPlatforms()
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.map.render(this.ctx, this.cameraY)
    this.player.render(this.ctx, this.cameraY)
  }

  onMilestone(msg: string) {
    console.log("Milestone:", msg)
  }
}
