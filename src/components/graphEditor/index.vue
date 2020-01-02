<template>
  <div class="graphContainer" tabindex="1" ref="container"/>
</template>

<script>
import {
  mxGraph as MxGraph,
  mxEvent as MxEvent,
  mxPoint as MxPoint,
  mxRubberband as MxRubberBand,
  mxKeyHandler as MxKeyHandler
} from 'mxgraph/javascript/mxClient'
import {
  graphUtility,
  resetScrollbars,
  lazyZoom
} from '@/components/graphEditor/graphUtility'
import {PAGE_FORMATS} from '@/components/graphEditor/pageFormat'

const GRAPH_CONFIG = {
  pageInfo: 'a4',
  gridSize: 10,
  gridEnabled: true,
  gridSteps: 5,
  minGridSize: 1,
  scale: 1.00,
  gridColor: '#acacac',
  gridBackgroundEnabled: true,
  gridBackgroundColor: '#ffffff'
}

export default {
  name: 'graphEditor',
  data() {
    return {
      graphConfig: {},
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
    setPageFormat() {
      let format = this.R.prop('format', PAGE_FORMATS[GRAPH_CONFIG.pageInfo.toLowerCase()])

      if (this.R.isNil(format)) {
        format = PAGE_FORMATS['a4']['format']
      }
      this.graph.pageFormat = format
    },
    createGraph() {
      this.graph = new MxGraph(this.container)
    },
    initGraph() {
      if (this.R.isNil(this.graph)) {
        return
      }
      this.rubberBand = new MxRubberBand(this.graph)
      this.graph.tolerance = 12
      this.graph.autoScroll = false
      this.graph.pageBreaksVisible = true
      this.graph.pageBreakColor = 'none'
      MxRubberBand.prototype.defaultOpacity = 30
      MxEvent.disableContextMenu(this.container)

      this.graph.setPanning(true)
      this.graph.pageScale = GRAPH_CONFIG['scale']
      this.graph.pageScale = GRAPH_CONFIG['scale']
      this.graph.gridSize = GRAPH_CONFIG['gridSize']
      this.graph.gridEnabled = GRAPH_CONFIG['gridEnabled']
      this.graph.setPanning = true
      this.setPageFormat()

      graphUtility(this)

      this.graph.view.validate()
      this.graph.sizeDidChange()

      resetScrollbars(this)

      this.graph.container.addEventListener('scroll', () => {
        this.oldScrollTop = this.graph.container.scrollTop
        this.oldScrollLeft = this.graph.container.scrollLeft
      }, true)
      this.graph.container.addEventListener('wheel', (evt) => {
        if (evt.ctrlKey) {
          evt.preventDefault()
        }
      })
      this.keyHandler = new MxKeyHandler(this.graph)
      this.keyHandler.bindKey(46, () => {
        const cells = this.graph.getSelectionCells() || []

        this.graph.removeCells(cells, true)
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
    init() {
      this.container = this.$refs.container
      this.graphConfig = Object.assign({}, GRAPH_CONFIG)
      this.createGraph()
      this.initGraph()
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
