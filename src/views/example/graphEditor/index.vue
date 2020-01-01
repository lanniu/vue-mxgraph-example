<template>
  <div class="graphEditorContainer">
    <div class="graphContainer" tabindex="1" ref="container"/>
  </div>
</template>

<script>
import {
  mxGraph as MxGraph,
  mxEvent as MxEvent,
  mxRubberband as MxRubberBand
} from 'mxgraph/javascript/mxClient'
import {rewriteInterface, resetScrollbars} from '@/views/example/graphEditor/rewriteInterface'
import {GRAPH_CONFIG, PAGE_FORMATS} from '@/views/example/graphEditor/graphConfig'

export default {
  name: 'graphEditor',
  data() {
    return {
      container: null,
      graph: null,
      rubberBand: null
    }
  },
  methods: {
    createGraph() {
      this.graph = new MxGraph(this.container)
    },
    setPageFormat() {
      let format = this.R.prop('format', PAGE_FORMATS[GRAPH_CONFIG.pageInfo.toLowerCase()])

      if (this.R.isNil(format)) {
        format = PAGE_FORMATS['a4']['format']
      }
      this.graph.pageFormat = format
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

      rewriteInterface(this)

      this.graph.view.validate()
      this.graph.sizeDidChange()

      resetScrollbars(this)
    }
  },
  mounted() {
    this.container = this.$refs.container
    this.createGraph()
    this.initGraph()
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
