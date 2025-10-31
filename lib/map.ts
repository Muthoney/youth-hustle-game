import Platform, { PlatformType } from "./platform"

export default class GameMap {
  platforms: Platform[] = []

  constructor(private canvasWidth: number, private canvasHeight: number) {
    this.createInitialPlatforms()
  }

  // 🪜 Create a logical upward journey
  createInitialPlatforms() {
    const baseY = this.canvasHeight - 60 // bottom starting level
    const spacingY = 100 // vertical gap between platforms

    const journey: PlatformType[] = [
      "school",
      "training",
      "jobCenter",
      "ngo",
      "community",
      "market",
      "boda",
      "startup",
      "farm",
      "sideHustle",
      "business",    // 👈 new
      "mentor",      // 👈 new
      "success"      // 👈 final symbolic stage
    ]

    // Zig-zag pattern to make jumping more fun
    this.platforms = journey.map((type, i) => {
      const x = (i % 2 === 0)
        ? this.canvasWidth / 3
        : (this.canvasWidth * 2) / 3
      const y = baseY - i * spacingY
      return new Platform(x, y, 100, 20, type as PlatformType)
    })
  }

  render(ctx: CanvasRenderingContext2D, cameraY: number) {
    for (const platform of this.platforms) {
      platform.render(ctx, cameraY)
    }
  }

  // ✨ Future upgrade: generate next sets dynamically
  generateNextPlatformSet(currentType
