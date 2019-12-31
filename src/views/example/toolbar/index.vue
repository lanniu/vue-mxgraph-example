<template>
  <div ref="container" class="graphContainer">
  </div>
</template>

<script>
import {
  mxToolbar as MxToolbar,
  mxGraphModel as MxGraphModel,
  mxGraph as MxGraph,
  mxCell as MxCell,
  mxGeometry as MxGeometry,
  mxEvent as MxEvent,
  mxUtils as MxUtils
} from 'mxgraph/javascript/mxClient'

export default {
  name: 'HelloWorld',
  data() {
    return {
      model: null,
      graph: null
    }
  },
  methods: {
    addToolbarItem(graph, toolbar, prototype, image) {
      let funct = function (graph, evt, cell, x, y) {
        graph.stopEditing(false)
        let vertex = graph.getModel().cloneCell(prototype)

        vertex.geometry.x = x
        vertex.geometry.y = y

        graph.addCell(vertex)
        graph.setSelectionCell(vertex)
      }
      let img = toolbar.addMode(null, image, function (evt, cell) {
        let pt = this.graph.getPointForEvent(evt)

        funct(graph, evt, cell, pt.x, pt.y)
      })

      MxEvent.addListener(img, 'mousedown', function (evt) {
        if (img.enabled === false) {
          MxEvent.consume(evt)
        }
      })
      MxUtils.makeDraggable(img, graph, funct)
      return img
    }
  },
  mounted() {
    // 创建一个div作为toolbar的容器
    let tbContainer = document.createElement('div')

    tbContainer.style.position = 'absolute'
    tbContainer.style.overflow = 'hidden'
    tbContainer.style.padding = '2px'
    tbContainer.style.left = '0px'
    tbContainer.style.top = '0px'
    tbContainer.style.width = '24px'
    tbContainer.style.bottom = '0px'
    this.$refs.container.appendChild(tbContainer)
    // 创建一个mxToolbar
    let toolbar = new MxToolbar(tbContainer)

    toolbar.enabled = false
    // 创建一个div作为graph的容器
    let container = document.createElement('div')

    container.style.position = 'absolute'
    container.style.overflow = 'hidden'
    container.style.left = '24px'
    container.style.top = '0px'
    container.style.right = '0px'
    container.style.bottom = '0px'
    container.style.background = 'url("./mxgraph/images/grid.gif")'
    this.$refs.container.appendChild(container)
    this.model = new MxGraphModel()
    this.graph = new MxGraph(container, this.model)
    this.graph.setConnectable(true)
    this.graph.setMultigraph(false)

    let addVertex = (icon, w, h, style) => {
      let vertex = new MxCell(null, new MxGeometry(0, 0, w, h), style)

      vertex.setVertex(true)
      let img = this.addToolbarItem(this.graph, toolbar, vertex, icon)

      img.enabled = true
      this.graph.getSelectionModel().addListener(MxEvent.CHANGE, () => {
        let tmp = this.graph.isSelectionEmpty()

        MxUtils.setOpacity(img, (tmp) ? 100 : 20)
        img.enabled = tmp
      })
    }

    addVertex('./mxgraph/images/rectangle.gif', 100, 40, '')
    addVertex('./mxgraph/images/rounded.gif', 100, 40, 'shape=rounded')
    addVertex('./mxgraph/images/ellipse.gif', 40, 40, 'shape=ellipse')
    addVertex('./mxgraph/images/rhombus.gif', 40, 40, 'shape=rhombus')
    addVertex('./mxgraph/images/triangle.gif', 40, 40, 'shape=triangle')
    addVertex('./mxgraph/images/cylinder.gif', 40, 40, 'shape=cylinder')
    addVertex('./mxgraph/images/actor.gif', 30, 40, 'shape=actor')
  }
}
</script>
