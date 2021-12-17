export interface RenderArgs {
  timestamp: number
  dt: number
  context: CanvasRenderingContext2D
  width: number
  height: number
}

export interface InitArgs {
  render(args: RenderArgs): void
}

export function init(args: InitArgs) {
  const canvas = document.querySelector('canvas')!
  const context = canvas.getContext('2d')!
  const scale = window.devicePixelRatio ?? 1
  context.scale(scale, scale)
  let rect = canvas.getBoundingClientRect()
  let width = (canvas.width = rect.width * scale)
  let height = (canvas.height = rect.height * scale)

  const ro = new ResizeObserver((entries) => {
    const { contentRect } = entries[0]
    width = canvas.width = contentRect.width * scale
    height = canvas.height = contentRect.height * scale
  })
  ro.observe(canvas)

  let last: number | null = null
  function render(timestamp: number) {
    let dt = 0
    if (last !== null) {
      dt = Math.min(timestamp - last, 30 * 1000) // 30fps cap
    }
    last = timestamp
    args.render({ timestamp, dt, context, width, height })
    window.requestAnimationFrame(render)
  }
  window.requestAnimationFrame(render)
}
