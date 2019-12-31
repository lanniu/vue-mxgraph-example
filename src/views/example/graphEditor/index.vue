<template>
  <div class="graphEditorContainer">
    <div class="graphContainer" tabindex="1" ref="container"/>
  </div>
</template>

<script>
import {
  mxGraph as MxGraph,
  mxRubberband as MxRubberBand
} from 'mxgraph/javascript/mxClient'
import {rewriteInterface, resetScrollbars} from '@/views/example/graphEditor/rewriteInterface'
import {GRAPH_CONFIG, PAGE_FORMATS} from '@/views/example/graphEditor/graphConfig'

export default {
  name: 'graphEditor',
  data() {
    return {
      scale: 1,
      cursorPosition: null, // mxGraph 需要的属性
      cumulativeZoomFactor: 1, // mxGraph 需要的属性
      updateZoomTimeout: null,
      graph: null,
      rubberBand: null
    }
  },
  methods: {
    createGraph() {
      this.graph = new MxGraph(this.$refs.container)

      const state = this.graph.view.getState(this.graph.getModel().getRoot())

      console.info(this.graph.view.getBoundingBox(state))
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
    width: 100%;
    height: 100%;
  }
}
</style>
