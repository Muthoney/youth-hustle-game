export type PlatformType =
  | "ngo"
  | "jobCenter"
  | "training"
  | "cafe"
  | "market"
  | "boda"
  | "community"
  | "startup"
  | "farm"
  | "sideHustle" // new side hustle spots

const platformColors: Record<
  PlatformType,
  { primary: string; secondary: string; accent: string; label: string }
> = {
  ngo: { primary: "#10b981", secondary: "#059669", accent: "#d1fae5", label: "NGO" },
  jobCenter: { primary: "#3b82f6", secondary: "#1e40af", accent: "#dbeafe", label: "Jobs" },
  training: { primary: "#8b5cf6", secondary: "#6d28d9", accent: "#ede9fe", label: "Train" },
  cafe: { primary: "#6366f1", secondary: "#4f46e5", accent: "#e0e7ff", label: "Café" },
  market: { primary: "#f59e0b", secondary: "#d97706", accent: "#fef3c7", label: "Market" },
  boda: { primary: "#ec4899", secondary: "#be185d", accent: "#fce7f3", label: "Boda" },
  community: { primary: "#14b8a6", secondary: "#0d9488", accent: "#ccfbf1", label: "Comm." },
  startup: { primary: "#ef4444", secondary: "#dc2626", accent: "#fee2e2", label: "Start" },
  farm: { primary: "#65a30d", secondary: "#4b5320", accent: "#f2fcf0", label: "Farm" },
  sideHustle: { primary: "#f97316", secondary: "#c2410c", accent: "#ffedd5", label: "Side" },
}

class Platform {
  x: number
  y: number
  width: number
  height: number
  type: PlatformType

  constructor(x: number, y: number, width: number, height: number, type: PlatformType) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.type = type
  }

  render(ctx: CanvasRenderingContext2D, cameraY: number) {
    const colors = platformColors[this.type]
    const screenY = this.y - cameraY

    // Platform base
    const gradient = ctx.createLinearGradient(this.x, screenY, this.x, screenY + this.height)
    gradient.addColorStop(0, colors.primary)
    gradient.addColorStop(1, colors.secondary)
    ctx.fillStyle = gradient
    ctx.fillRect(this.x, screenY, this.width, this.height)

    // Accent line
    ctx.fillStyle = colors.accent
    ctx.fillRect(this.x, screenY + this.height - 3, this.width, 3)

    // Label
    ctx.fillStyle = "white"
    ctx.font = "bold 12px Arial"
    ctx.textAlign = "center"
    ctx.fillText(colors.label, this.x + this.width / 2, screenY - 5)
  }
}

export default Platform
