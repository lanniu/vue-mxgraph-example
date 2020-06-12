import * as R from 'ramda'
import base64Coder from 'Base64'
import {MxConstants, MxEvent, MxGraph, MxGraphView, MxMouseEvent, MxPoint, MxRectangle, MxUtils} from '@/mxgraph'
import {GRAPH_CONFIG} from '@/components/graphEditor/graphConfig'

export function resetScrollbars(graph) {
  let pad = getPagePadding(graph)
  let bounds = graph.getGraphBounds()

  graph.container.scrollTop = Math.floor(pad.y) - 1
  graph.container.scrollLeft = Math.floor(Math.min(pad.x, (graph.container.scrollWidth - graph.container.clientWidth) / 2)) - 1

  if (bounds.width > 0 && bounds.height > 0) {
    if (bounds.x > graph.container.scrollLeft + graph.container.clientWidth * 0.9) {
      graph.container.scrollLeft = Math.min(bounds.x + bounds.width - graph.container.clientWidth, bounds.x - 10)
    }
    if (bounds.y > graph.container.scrollTop + graph.container.clientHeight * 0.9) {
      graph.container.scrollTop = Math.min(bounds.y + bounds.height - graph.container.clientHeight, bounds.y - 10)
    }
  }
}

export function getPageSize(graph) {
  return new MxRectangle(0, 0, graph.pageFormat.width * graph.view.scale, graph.pageFormat.height * graph.view.scale)
}

export function getPagePadding(graph) {
  return new MxPoint(Math.max(0, Math.round((graph.container.offsetWidth - 34) / graph.view.scale)),
    Math.max(0, Math.round((graph.container.offsetHeight - 34) / graph.view.scale)))
}

export function getPageLayout(graph) {
  let size = getPageSize(graph)
  let bounds = graph.getGraphBounds()

  if (R.equals(bounds.width, 0) || R.equals(bounds.height, 0)) {
    return new MxRectangle(0, 0, 1, 1)
  }
  let x = Math.ceil(bounds.x / graph.view.scale - graph.view.translate.x)
  let y = Math.ceil(bounds.y / graph.view.scale - graph.view.translate.y)
  let w = Math.floor(bounds.width / graph.view.scale)
  let h = Math.floor(bounds.height / graph.view.scale)
  let x0 = Math.floor(x / size.width)
  let y0 = Math.floor(y / size.height)
  let w0 = Math.ceil((x + w) / size.width) - x0
  let h0 = Math.ceil((y + h) / size.height) - y0

  return new MxRectangle(x0, y0, w0, h0)
}

export function lazyZoom(vueItem, zoomIn) {
  if (vueItem.updateZoomTimeout !== null) {
    window.clearTimeout(vueItem.updateZoomTimeout)
  }
  const graph = vueItem.graph
  const zoomFactor = graph.zoomFactor
  const scale = graph.view.scale

  let cumulativeZoomFactor = 1

  if (zoomIn) {
    if (scale * cumulativeZoomFactor < 0.15) {
      cumulativeZoomFactor = (scale + 0.01) / scale
    } else {
      cumulativeZoomFactor *= zoomFactor
      cumulativeZoomFactor = Math.round(scale * cumulativeZoomFactor * 20) / 20 / scale
    }
  } else {
    if (scale * cumulativeZoomFactor <= 0.15) {
      cumulativeZoomFactor = (scale - 0.01) / scale
    } else {
      cumulativeZoomFactor /= zoomFactor
      cumulativeZoomFactor = Math.round(scale * cumulativeZoomFactor * 20) / 20 / scale
    }
  }
  cumulativeZoomFactor = Math.max(0.01, Math.min(scale * cumulativeZoomFactor, 160) / scale)
  vueItem.updateZoomTimeout = window.setTimeout(() => {
    const graphContainer = graph.container
    const offset = MxUtils.getOffset(graphContainer)
    let dx = 0
    let dy = 0

    if (vueItem.cursorPosition !== null) {
      dx = graphContainer.offsetWidth / 2 - vueItem.cursorPosition.x + offset.x
      dy = graphContainer.offsetHeight / 2 - vueItem.cursorPosition.y + offset.y
    }
    const prev = graph.view.scale

    graph.zoom(cumulativeZoomFactor)
    const s = graph.view.scale
    if (s !== prev) {
      if (MxUtils.hasScrollbars(graphContainer) && (dx !== 0 || dy !== 0)) {
        graphContainer.scrollLeft -= dx * (cumulativeZoomFactor - 1)
        graphContainer.scrollTop -= dy * (cumulativeZoomFactor - 1)
      }
    }
    vueItem.updateZoomTimeout = null
  }, 10)
}

export function createSvgGrid(color) {
  let tmpGridSize = this.graph.gridSize * this.scale

  while (tmpGridSize < GRAPH_CONFIG.minGridSize) {
    tmpGridSize *= 2
  }
  const tmpGridStep = GRAPH_CONFIG.gridSteps * tmpGridSize
  const size = tmpGridStep
  const d = R.map((index) => {
    const size = index * tmpGridSize

    return `M 0 ${size} L ${tmpGridStep} ${size} M ${size} 0 L ${size} ${tmpGridStep}`
  }, R.range(1, GRAPH_CONFIG.gridSteps))

  return `<svg width="${size}" height="${size}" xmlns="${MxConstants.NS_SVG}">
                <defs>
                    <pattern id="grid" width="${tmpGridStep}" height="${tmpGridStep}" patternUnits="userSpaceOnUse">
                        <path d="${d.join(' ')}" fill="none" stroke="${color}" opacity="0.2" stroke-width="1"/>
                        <path d="M ${tmpGridStep} 0 L 0 0 0 ${tmpGridStep}" fill="none" stroke="${color}" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)"/>
            </svg>`
}


export function validateBackgroundStyles() {
  let image = 'none'
  let position = ''
  if (this.graph.isGridEnabled()) {
    image = unescape(encodeURIComponent(this.createSvgGrid(GRAPH_CONFIG.gridColor)))
    image = base64Coder.btoa(image, true)
    image = `url(data:image/svg+xml;base64,${image})`
    let phase = this.graph.gridSize * this.scale * GRAPH_CONFIG.gridSteps
    let x0 = 0
    let y0 = 0

    if (!R.isNil(this.backgroundPageShape)) {
      let bds = this.getBackgroundPageBounds()

      x0 = 1 + bds.x
      y0 = 1 + bds.y
    }
    position = -Math.round(phase - MxUtils.mod(this.translate.x * this.scale - x0, phase)) + 'px ' +
      -Math.round(phase - MxUtils.mod(this.translate.y * this.scale - y0, phase)) + 'px'
  }
  let canvas = this.canvas

  if (!R.isNil(canvas.ownerSVGElement)) {
    canvas = canvas.ownerSVGElement
  }
  let tmpGridBackgroundColor = GRAPH_CONFIG.gridBackgroundEnabled
    ? GRAPH_CONFIG.gridBackgroundColor
    : '#FFF'

  if (!R.isNil(this.backgroundPageShape)) {
    this.backgroundPageShape.node.style.backgroundRepeat = 'repeat'
    this.backgroundPageShape.node.style.backgroundPosition = position
    this.backgroundPageShape.node.style.backgroundImage = image
    this.backgroundPageShape.node.style.backgroundColor = tmpGridBackgroundColor
    this.backgroundPageShape.node.style.border = '1px solid white'
    this.backgroundPageShape.node.style.boxShadow = '2px 2px 1px #E6E6E6'
    canvas.style.backgroundImage = 'none'
    canvas.style.backgroundColor = ''
  } else {
    canvas.style.backgroundPosition = position
    canvas.style.backgroundColor = tmpGridBackgroundColor
    canvas.style.backgroundImage = image
  }
}

export function validateBackgroundPage() {
  if (!R.isNil(this.graph.container)) {
    let bounds = this.getBackgroundPageBounds()

    if (R.isNil(this.backgroundPageShape)) {
      let firstChild = this.graph.container.querySelector('svg')

      if (firstChild !== null) {
        this.backgroundPageShape = this.createBackgroundPageShape(bounds)
        this.backgroundPageShape.scale = 1
        this.backgroundPageShape.dialect = MxConstants.DIALECT_STRICTHTML
        this.backgroundPageShape.init(this.graph.container)
        firstChild.style.position = 'absolute'
        this.graph.container.insertBefore(this.backgroundPageShape.node, firstChild)
        this.backgroundPageShape.redraw()
        this.backgroundPageShape.node.className = 'geBackgroundPage'

        MxEvent.addGestureListeners(this.backgroundPageShape.node,
          MxUtils.bind(this, (evt) => {
            this.graph.fireMouseEvent(MxEvent.MOUSE_DOWN, new MxMouseEvent(evt))
          }),
          MxUtils.bind(this, (evt) => {
            this.graph.fireMouseEvent(MxEvent.MOUSE_UP, new MxMouseEvent(evt))
          })
        )
      }
    } else {
      this.backgroundPageShape.scale = 1
      this.backgroundPageShape.bounds = bounds
      this.backgroundPageShape.redraw()
    }
    this.validateBackgroundStyles()
  }
}

export function getBackgroundPageBounds() {

  let layout = getPageLayout(this.graph)
  let page = getPageSize(this.graph)
  let scale = this.scale
  let translate = this.translate

  return new MxRectangle(scale * (translate.x + layout.x * page.width),
    scale * (translate.y + layout.y * page.height),
    scale * layout.width * page.width,
    scale * layout.height * page.height)
}

export function sizeDidChange() {
  if (this.container && MxUtils.hasScrollbars(this.container)) {
    let pages = getPageLayout(this)
    let pad = getPagePadding(this)
    let size = getPageSize(this)
    let minW = Math.ceil(2 * pad.x + pages.width * size.width)
    let minH = Math.ceil(2 * pad.y + pages.height * size.height)
    let min = this.minimumGraphSize

    if (R.isNil(min) || !R.equals(min.width, minW) || !R.equals(min.height, minH)) {
      this.minimumGraphSize = new MxRectangle(0, 0, minW, minH)
    }
    let dx = pad.x - pages.x * size.width
    let dy = pad.y - pages.y * size.height

    if (!R.equals(this.view.translate.x, dx) || !R.equals(this.view.translate.y, dy)) {
      let tx = this.view.translate.x
      let ty = this.view.translate.y

      this.view.x0 = pages.x
      this.view.y0 = pages.y
      this.view.setTranslate(dx, dy)
      this.container.scrollLeft += Math.round((dx - tx) * this.view.scale)
      this.container.scrollTop += Math.round((dy - ty) * this.view.scale)
      return
    }
    MxGraph.prototype.sizeDidChange.apply(this, arguments)
  }
}

export function validate() {
  if (this.graph.container && MxUtils.hasScrollbars(this.graph.container)) {
    const pad = getPagePadding(this.graph)
    const size = getPageSize(this.graph)

    this.translate.x = pad.x - (this.x0 || 0) * size.width
    this.translate.y = pad.y - (this.y0 || 0) * size.height
  }
  MxGraphView.prototype.validate.apply(this, arguments)
}

