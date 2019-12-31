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

export default {
  name: 'graphEditor',
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
      this.rubberBand = new MxRubberBand(this.graph)
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
  position: relative;

  .graphContainer {
    outline: none;
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
