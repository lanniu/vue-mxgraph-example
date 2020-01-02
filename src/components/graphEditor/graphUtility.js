import * as R from 'ramda'
import base64Coder from 'Base64'
import {
  mxConstants as MxConstants,
  mxEvent as MxEvent,
  mxGraph as MxGraph,
  mxGraphView as MxGraphView,
  mxMouseEvent as MxMouseEvent,
  mxRectangle as MxRectangle,
  mxUtils as MxUtils,
  mxPoint as MxPoint
} from 'mxgraph/javascript/mxClient'

export function resetScrollbars(vueItem) {
  let pad = getPagePadding(vueItem)
  let bounds = vueItem.graph.getGraphBounds()

  vueItem.graph.container.scrollTop = Math.floor(pad.y) - 1
  vueItem.graph.container.scrollLeft = Math.floor(Math.min(pad.x, (vueItem.graph.container.scrollWidth - vueItem.graph.container.clientWidth) / 2)) - 1

  if (bounds.width > 0 && bounds.height > 0) {
    if (bounds.x > vueItem.graph.container.scrollLeft + vueItem.graph.container.clientWidth * 0.9) {
      vueItem.graph.container.scrollLeft = Math.min(bounds.x + bounds.width - vueItem.graph.container.clientWidth, bounds.x - 10)
    }
    if (bounds.y > vueItem.graph.container.scrollTop + vueItem.graph.container.clientHeight * 0.9) {
      vueItem.graph.container.scrollTop = Math.min(bounds.y + bounds.height - vueItem.graph.container.clientHeight, bounds.y - 10)
    }
  }
}

export function getPageSize(vueItem) {
  return new MxRectangle(0, 0, vueItem.graph.pageFormat.width * vueItem.graph.view.scale, vueItem.graph.pageFormat.height * vueItem.graph.view.scale)
}

export function getPagePadding(vueItem) {
  return new MxPoint(Math.max(0, Math.round((vueItem.graph.container.offsetWidth - 34) / vueItem.graph.view.scale)),
    Math.max(0, Math.round((vueItem.graph.container.offsetHeight - 34) / vueItem.graph.view.scale)))
}

export function getPageLayout(vueItem) {
  let size = getPageSize(vueItem)
  let bounds = vueItem.graph.getGraphBounds()

  if (R.equals(bounds.width, 0) || R.equals(bounds.height, 0)) {
    return new MxRectangle(0, 0, 1, 1)
  }
  let x = Math.ceil(bounds.x / vueItem.graph.view.scale - vueItem.graph.view.translate.x)
  let y = Math.ceil(bounds.y / vueItem.graph.view.scale - vueItem.graph.view.translate.y)
  let w = Math.floor(bounds.width / vueItem.graph.view.scale)
  let h = Math.floor(bounds.height / vueItem.graph.view.scale)
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
  const zoomFactor = vueItem.graph.zoomFactor
  const scale = vueItem.graph.view.scale

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
    const offset = MxUtils.getOffset(vueItem.graph.container)
    let dx = 0
    let dy = 0

    if (vueItem.cursorPosition !== null) {
      dx = vueItem.graph.container.offsetWidth / 2 - vueItem.cursorPosition.x + offset.x
      dy = vueItem.graph.container.offsetHeight / 2 - vueItem.cursorPosition.y + offset.y
    }
    const prev = vueItem.graph.view.scale

    vueItem.graph.zoom(cumulativeZoomFactor)
    const s = vueItem.graph.view.scale
    if (s !== prev) {
      if (MxUtils.hasScrollbars(vueItem.graph.container) && (dx !== 0 || dy !== 0)) {
        vueItem.graph.container.scrollLeft -= dx * (cumulativeZoomFactor - 1)
        vueItem.graph.container.scrollTop -= dy * (cumulativeZoomFactor - 1)
      }
    }
    vueItem.updateZoomTimeout = null
  }, 10)
}

function createSvgGrid(vue, graphConfig) {
  vue.graph.view.createSvgGrid = function (color) {
    let tmpGridSize = this.graph.gridSize * this.scale

    while (tmpGridSize < graphConfig.minGridSize) {
      tmpGridSize *= 2
    }
    const tmpGridStep = graphConfig.gridSteps * tmpGridSize
    const size = tmpGridStep
    const d = R.map((index) => {
      const size = index * tmpGridSize

      return `M 0 ${size} L ${tmpGridStep} ${size} M ${size} 0 L ${size} ${tmpGridStep}`
    }, R.range(1, graphConfig.gridSteps))

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
}


function validateBackgroundStyles(vueItem, graphConfig) {
  vueItem.graph.view.validateBackgroundStyles = function () {
    let image = 'none'
    let position = ''
    if (this.graph.isGridEnabled()) {
      image = unescape(encodeURIComponent(this.createSvgGrid(graphConfig.gridColor)))
      image = base64Coder.btoa(image, true)
      image = `url(data:image/svg+xml;base64,${image})`
      let phase = this.graph.gridSize * this.scale * graphConfig.gridSteps
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
    let tmpGridBackgroundColor = graphConfig.gridBackgroundEnabled ? graphConfig.gridBackgroundColor : '#FFF'

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
}

function validateBackgroundPage(vueItem) {
  vueItem.graph.view.validateBackgroundPage = function () {
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
}

function getBackgroundPageBounds(vueItem) {
  vueItem.graph.view.getBackgroundPageBounds = function () {
    let layout = getPageLayout(vueItem)
    let page = getPageSize(vueItem)
    let scale = this.scale
    let translate = this.translate

    return new MxRectangle(scale * (translate.x + layout.x * page.width),
      scale * (translate.y + layout.y * page.height),
      scale * layout.width * page.width,
      scale * layout.height * page.height)
  }
}

function sizeDidChange(vueItem) {
  vueItem.graph.sizeDidChange = function () {
    if (this.container && MxUtils.hasScrollbars(this.container)) {
      let pages = getPageLayout(vueItem)
      let pad = getPagePadding(vueItem)
      let size = getPageSize(vueItem)
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
}

function validate(vueItem) {
  vueItem.graph.view.validate = function () {
    if (this.graph.container && MxUtils.hasScrollbars(this.graph.container)) {
      const pad = getPagePadding(vueItem)
      const size = getPageSize(vueItem)

      this.translate.x = pad.x - (this.x0 || 0) * size.width
      this.translate.y = pad.y - (this.y0 || 0) * size.height
    }
    MxGraphView.prototype.validate.apply(this, arguments)
  }
}

const graphUtility = (vueItem) => {
  createSvgGrid(vueItem, vueItem.graphConfig)
  validateBackgroundStyles(vueItem, vueItem.graphConfig)
  validateBackgroundPage(vueItem)
  getBackgroundPageBounds(vueItem)
  sizeDidChange(vueItem)
  validate(vueItem)
}

export {graphUtility}
