<template>
  <div class="manualDrawingContainer">
    <div class="graphContainer" ref="container"></div>
  </div>
</template>

<script>
import {fromEvent} from 'rxjs'
import {takeUntil, map, concatAll} from 'rxjs/operators'
import {
  mxGraph as MxGraph
} from 'mxgraph/javascript/mxClient'

export default {
  name: 'manualDrawing',
  data() {
    return {
      graph: null
    }
  },
  methods: {
    createGraph() {
      this.graph = new MxGraph(this.$refs.container)
      this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")'
    },
    initGraph() {
      if (this.R.isNil(this.graph)) {
        return
      }
      this.graph.setConnectable(false)
    },
    initRubberBand() {
      const container = this.$refs['container']

      if (this.R.isNil(container)) {
        return
      }
      const mouseDown$ = fromEvent(container, 'mousedown')
      const mouseMove$ = fromEvent(container, 'mousemove')
      const mouseUp$ = fromEvent(container, 'mouseup')

      let dom = null
      let geometry = {}

      mouseDown$
        .pipe(
          map(e => {
            dom = document.createElement('div')
            dom.className = 'rubberBandDiv'
            container.appendChild(dom)

            return {startX: e.clientX, startY: e.clientY}
          }),
          map(({startX, startY}) => {
            return mouseMove$
              .pipe(
                map(e => {
                  return {startX, startY, endX: e.clientX, endY: e.clientY}
                })
              )
          }),
          concatAll(),
          takeUntil(mouseUp$)
        )
        .subscribe({
          next: ({startX, startY, endX, endY}) => {
            const containerDiv = this.$refs.container
            const containerRect = containerDiv.getBoundingClientRect()
            const x = Math.min(startX, endX) - containerRect.x + containerDiv.scrollLeft
            const y = Math.min(startY, endY) - containerRect.y + containerDiv.scrollTop
            const width = Math.abs(startX - endX)
            const height = Math.abs(startY - endY)

            geometry = {x, y, width, height}

            dom.style.top = `${y}px`
            dom.style.left = `${x}px`
            dom.style.width = `${width}px`
            dom.style.height = `${height}px`
          },
          complete: () => {
            this.initRubberBand()
            this.addCell(geometry)
            container.removeChild(dom)
            dom = null
          }
        })
    },
    addCell(geometry) {
      const {x, y, width, height} = geometry
      const parent = this.graph.getDefaultParent()

      this.graph.getModel().beginUpdate()
      try {
        this.graph.insertVertex(parent, null, null, x, y, width, height, 'shape=rect')
      } finally {
        this.graph.getModel().endUpdate()
      }
    }
  },
  mounted() {
    this.createGraph()
    this.initGraph()
    this.initRubberBand()
  }
}
</script>

<style lang="scss">
.manualDrawingContainer {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: crosshair;

  .graphContainer {
    width: 100%;
    height: 100%;

    .rubberBandDiv {
      position: absolute;
      opacity: 0.5;
      background-color: #B4E1FF;
      z-index: 2;
    }
  }
}
</style>
