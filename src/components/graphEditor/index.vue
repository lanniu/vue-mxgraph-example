<template>
  <div class="graphContainer" tabindex="1" ref="container"/>
</template>

<script>
import {MxEvent, MxGraph, MxKeyHandler, MxPoint, MxRubberBand} from '@/mxgraph'
import {
  createSvgGrid,
  getBackgroundPageBounds,
  lazyZoom,
  resetScrollbars,
  sizeDidChange,
  validate,
  validateBackgroundPage,
  validateBackgroundStyles
} from '@/components/graphEditor/graphUtility'
import {PAGE_FORMATS} from '@/components/graphEditor/pageFormat'
import {GRAPH_CONFIG} from '@/components/graphEditor/graphConfig'


export default {
  name: 'graphEditor',
  data() {
    return {
      container: null,
      keyHandler: null,
      graph: null,
      rubberBand: null,
      cursorPosition: null,
      updateZoomTimeout: null,
      cumulativeZoomFactor: 1,
      oldScrollTop: 0,
      oldScrollLeft: 0
    }
  },
  methods: {
    getPageFormat() {
      let format = this.R.prop('format', PAGE_FORMATS[GRAPH_CONFIG.pageInfo.toLowerCase()])

      if (this.R.isNil(format)) {
        format = PAGE_FORMATS.a4.format
      }
      return format
    },
    initGraph() {
      // 当拖动时鼠标靠近容器边缘时，图形是否应该自动滚动。
      this.graph.autoScroll = false
      // 指定是否应在多个页面之间绘制虚线。
      this.graph.pageBreaksVisible = true
      // 指定分页符的颜色。
      this.graph.pageBreakColor = 'none'
      // 指定背景页的页面格式。
      this.graph.pageFormat = this.getPageFormat()
      // 指定背景页的比例。
      this.graph.pageScale = GRAPH_CONFIG.scale
      // move操作处理为single click的容差
      this.graph.setTolerance(12)
      // 是否应该启用网格。
      this.graph.setGridEnabled(GRAPH_CONFIG.gridEnabled)
      // 设置网格尺寸
      this.graph.setGridSize(GRAPH_CONFIG.gridSize)
      this.graph.setPanning(true)
      // 当图的大小发生变化时调用。
      this.graph.sizeDidChange = sizeDidChange
      // 重置滚动条
      resetScrollbars(this.graph)

    },
    initGraphView() {
      this.graph.view.getBackgroundPageBounds = getBackgroundPageBounds
      this.graph.view.validateBackgroundPage = validateBackgroundPage
      this.graph.view.validateBackgroundStyles = validateBackgroundStyles
      this.graph.view.createSvgGrid = createSvgGrid
      this.graph.view.validate = validate
    },
    initGraphListener() {
      this.graph.container.addEventListener('scroll', () => {
        this.oldScrollTop = this.graph.container.scrollTop
        this.oldScrollLeft = this.graph.container.scrollLeft
      }, true)
      this.graph.container.addEventListener('wheel', (evt) => {
        if (evt.ctrlKey) {
          evt.preventDefault()
        }
      })

      MxEvent.addMouseWheelListener((evt, up) => {
        if (evt.ctrlKey) {
          let source = MxEvent.getSource(evt)

          while (!this.R.isNil(source)) {
            if (this.R.equals(source, this.graph.container)) {
              this.cursorPosition = new MxPoint(MxEvent.getClientX(evt), MxEvent.getClientY(evt))
              lazyZoom(this, up)
              return
            }
            source = source.parentNode
          }
        }
      })
    },
    initGraphHandler() {
      this.keyHandler.bindKey(46, () => {
        const cells = this.graph.getSelectionCells() || []
        this.graph.removeCells(cells, true)
      })
    },
    init() {
      this.container = this.$refs.container
      this.graph = new MxGraph(this.container)
      this.rubberBand = new MxRubberBand(this.graph)
      this.keyHandler = new MxKeyHandler(this.graph)

      this.initGraph()
      this.initGraphView()
      this.initGraphListener()
      this.initGraphHandler()

      MxEvent.disableContextMenu(this.container)
      // 调用validateCell和validateCellState并使用getBoundingBox更新graphBounds。
      this.graph.view.validate()
      this.graph.sizeDidChange()
      return this.graph
    }
  },
  activated() {
    if (this.R.isNil(this.graph)) {
      return
    }
    if (Object.is(0, this.oldScrollLeft) && Object.is(0, this.oldScrollTop)) {
      this.graph.center()
      return
    }
    this.graph.panGraph(-this.oldScrollLeft, -this.oldScrollTop)
  }
}
</script>

<style lang="scss">
.graphEditorContainer {
  width: 100%;
  height: 100%;

  .graphContainer {
    background: #efefef;
  }
}
</style>
