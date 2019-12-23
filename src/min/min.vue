<template>
  <div class="container">
    <div class="graphContainer" ref="container"></div>
  </div>
</template>

<script>
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
    }
  },
  mounted() {
    this.createGraph()
    this.initGraph()
  }
}
</script>

<style lang="scss">
.container {
  width: 100%;
  height: 100%;
  position: relative;

  .graphContainer {
    width: 100%;
    height: 100%;
  }
}
</style>
