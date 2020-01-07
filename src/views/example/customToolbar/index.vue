<template>
  <div class="customToolbarContainer">
    <div class="toolbarContainer">
      <ul>
        <li v-for="item in toolbarItems" :key="item['title']" ref="toolItem">
          <img :src="item['icon']" :alt="item['title']">
          <span>{{item['title']}}</span>
        </li>
      </ul>
    </div>
    <div class="graphContainer" ref="container"></div>
  </div>
</template>

<script>
import {toolbarItems} from './toolbar'
import {
  mxEvent as MxEvent,
  mxGraph as MxGraph, mxUtils as MxUtils
} from 'mxgraph/javascript/mxClient'

export default {
  name: 'index2',
  computed: {
    toolbarItems: () => toolbarItems
  },
  data() {
    return {
      data() {
        return {
          graph: null
        }
      }
    }
  },
  methods: {
    createGraph() {
      this.graph = new MxGraph(this.$refs.container)
    },
    initGraph() {
      if (this.R.isNil(this.graph)) {
        return
      }
      this.graph.setConnectable(true) // 允许连线
      this.graph.setCellsEditable(false) // 不可修改
      this.graph.convertValueToString = (cell) => { // 从value中获取显示的内容
        return this.R.prop('title', cell)
      }
      this.graph.addListener(MxEvent.DOUBLE_CLICK, (graph, evt) => { // 监听双击事件
        const cell = this.R.pathOr([], ['properties', 'cell'], evt)

        console.info(cell) // 在控制台输出双击的cell
      })
    },
    addCell(toolItem, x, y) {
      const {width, height} = toolItem
      const styleObj = toolItem['style']
      const style = Object.keys(styleObj).map((attr) => `${attr}=${styleObj[attr]}`).join(';')
      const parent = this.graph.getDefaultParent()

      this.graph.getModel().beginUpdate()
      try {
        let vertex = this.graph.insertVertex(parent, null, null, x, y, width, height, style)

        vertex.title = toolItem['title']
      } finally {
        this.graph.getModel().endUpdate()
      }
    },
    initToolbar() {
      const domArray = this.$refs.toolItem

      if (!(domArray instanceof Array) || domArray.length <= 0) {
        return
      }
      domArray.forEach((dom, domIndex) => {
        const toolItem = this.toolbarItems[domIndex]
        const {width, height} = toolItem

        const dropHandler = (graph, evt, cell, x, y) => {
          this.addCell(toolItem, x, y)
        }
        const createDragPreview = () => {
          const elt = document.createElement('div')

          elt.style.border = '2px dotted black'
          elt.style.width = `${width}px`
          elt.style.height = `${height}px`
          return elt
        }

        MxUtils.makeDraggable(dom, this.graph, dropHandler, createDragPreview(), 0, 0, false, true)
      })
    }
  },
  mounted() {
    this.createGraph()
    this.initGraph()
    this.initToolbar()
    this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")'
  }
}
</script>

<style lang="scss">
.customToolbarContainer {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  .toolbarContainer {
    flex: 1;
    font-size: 20px;
    background: #efefef;
    text-align: center;
    padding-top: 20px;

    ul {
      padding: 0;
      margin: 0;

      li {
        list-style: none;
        margin-bottom: 10px;
        cursor: pointer;

        img {
          width: 15px;
          height: 15px;
        }

        span {
          margin-left: 15px;
        }
      }
    }
  }

  .graphContainer {
    position: relative;
    flex: 7;
  }
}
</style>
