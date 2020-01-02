<template>
  <div class="customShapeContainer">
    <div class="graphContainer" ref="container"></div>
  </div>
</template>

<script>
import {
  mxGraph as MxGraph,
  mxPoint as MxPoint,
  mxImage as MxImage,
  mxEllipse as MxEllipse,
  mxRubberband as MxRubberBand,
  mxConnectionConstraint as MxConnectionConstraint
} from 'mxgraph/javascript/mxClient'

export default {
  name: 'customShape',
  data() {
    return {
      graph: null,
      rubberBand: null
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
      this.graph.setConnectable(true)
      this.rubberBand = new MxRubberBand(this.graph)
      const pointImg = require('@/assets/point.gif')

      this.graph.connectionHandler.constraintHandler.pointImage = new MxImage(pointImg, 10, 10)
      this.graph.connectionHandler.constraintHandler.createHighlightShape = function () {
        return new MxEllipse(null, this.highlightColor, this.highlightColor, 2)
      }
      this.graph.getAllConnectionConstraints = function (terminal) {
        if (terminal !== null && terminal.shape !== null) {
          const cell = terminal['cell']
          const constraints = cell['constraints']

          if (constraints instanceof Array && constraints.length > 0) {

            return constraints.map((constraint) => {
              return new MxConnectionConstraint(new MxPoint(constraint['x'], constraint['y']), constraint['perimeter'])
            })
          } else {
            if (terminal.shape.stencil) {
              return terminal.shape.stencil.constraints
            } else if (terminal.shape.constraints) {
              return terminal.shape.constraints
            }
          }
        }
        return null
      }
      this.graph.connectionHandler.isConnectableCell = function () {
        return false
      }
    },
    addCell() {
      const parent = this.graph.getDefaultParent()

      this.graph.getModel().beginUpdate()
      try {
        const cell = this.graph.insertVertex(parent, null, null, 500, 10, 200, 200, 'shape=rect')

        cell['constraints'] = [
          {x: -0.5, y: 0.25, perimeter: true},
          {x: -0.5, y: 0.25, perimeter: false},
          {x: -0.5, y: 0.75, perimeter: true},
          {x: -0.5, y: 0.75, perimeter: false},
          {x: 1, y: 0.25, perimeter: false},
          {x: 1, y: 0.75, perimeter: false}
        ]
      } finally {
        this.graph.getModel().endUpdate()
      }
    }
  },
  mounted() {
    this.createGraph()
    this.initGraph()
    this.addCell()
  }
}
</script>

<style lang="scss">
.customShapeContainer {
  width: 100%;
  height: 100%;
  position: relative;

  .graphContainer {
    width: 100%;
    height: 100%;
  }
}
</style>
