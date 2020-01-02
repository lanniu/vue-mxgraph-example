<template>
  <div class="groupEditorContainer">
    <div class="toolBarContainer">
      <ul>
        <li v-for="(item, index) in toolItems" :key="index" class="toolItem" ref="toolItem">{{item.title}}</li>
      </ul>
    </div>
    <graph-editor class="graphEditor" ref="graphEditor"/>
  </div>
</template>

<script>
import {
  mxPoint as MxPoint,
  mxUtils as MxUtils,
  mxImage as MxImage,
  mxEllipse as MxEllipse,
  mxCellState as MxCellState,
  mxConnectionConstraint as MxConnectionConstraint
} from 'mxgraph/javascript/mxClient'
import GraphEditor from '@/components/graphEditor'
import {toolItems} from '@/views/example/groupEditor/toolbarItems'


export default {
  name: 'groupEditor',
  components: {GraphEditor},
  computed: {
    toolItems: () => toolItems
  },
  methods: {
    makeToolbarDraggable() {
      const toolItems = this.$refs.toolItem

      if (!(toolItems instanceof Array)) {
        return
      }
      toolItems.forEach((item, index) => {
        const toolItem = this.toolItems[index]
        const {height, width} = toolItem
        // drop的处理函数
        const dropHandler = (graph, evt, cell, x, y) => {
          this.instanceCell(cell, toolItem, x, y)
        }
        // 创建拖拽时的预览图形
        const createDragPreview = () => {
          const elt = document.createElement('div')

          elt.style.border = '2px dotted black'
          elt.style.width = `${width}px`
          elt.style.height = `${height}px`
          return elt
        }
        // 获取拖放的对象
        const getDropTarget = (graph, x, y) => {
          const cell = graph.getCellAt(x, y)

          return this.R.propOr(null, 'dropAble', cell) ? cell : null
        }

        MxUtils.makeDraggable(item, this.graph, dropHandler, createDragPreview(index), 0, 0, false, true, true, getDropTarget)
      })
    },
    instanceCell(dropCell, toolItem, x, y) {
      const drop = !this.R.isNil(dropCell)
      const styleObj = toolItem['style'] || {}
      const style = Object.keys(styleObj).map((key) => `${key}=${styleObj[key]}`).join(';')
      const realX = drop ? x - dropCell.geometry.x : x
      const realY = drop ? y - dropCell.geometry.y : y
      const {height, width} = toolItem
      const parent = drop ? dropCell : this.graph.getDefaultParent()
      const isHtml = Object.is('1', toolItem['style']['html'])
      const tmpIndex = Date.now()
      const value = isHtml ? toolItem['html'](tmpIndex) : null

      this.graph.getModel().beginUpdate()
      try {
        const cell = this.graph.insertVertex(parent, null, value, realX, realY, width, height, style)

        cell['title'] = toolItem['title']
        cell['dropAble'] = toolItem['dropAble']
        cell['constraints'] = toolItem['constraints']
        this.$nextTick(() => {
          const createdCallback = toolItem['created']

          if (createdCallback instanceof Function) {
            createdCallback(this.graph, cell, tmpIndex)
          }
        })
      } finally {
        this.graph.getModel().endUpdate()
      }
    },
    initConnectStyle() {
      this.graph.setConnectable(true)
      this.graph.setAllowDanglingEdges(false)
      this.graph.setConnectableEdges(false)
      this.graph.setDisconnectOnMove(false)
      const style = this.graph.getStylesheet().getDefaultEdgeStyle()

      style['edgeStyle'] = 'orthogonalEdgeStyle'
      style['curved'] = '1'
      this.graph.connectionHandler.createEdgeState = function () {
        const edge = this.graph.createEdge()

        return new MxCellState(this.graph.view, edge, this.graph.getCellStyle(edge))
      }
      const pointImg = require('@/assets/point.gif')

      this.graph.connectionHandler.constraintHandler.pointImage = new MxImage(pointImg, 10, 10)
      this.graph.connectionHandler.isConnectableCell = function () {
        return false
      }
      this.graph.connectionHandler.constraintHandler.createHighlightShape = function () {
        return new MxEllipse(null, this.highlightColor, this.highlightColor, 2)
      }
      this.graph.getAllConnectionConstraints = function (terminal) {
        if (terminal !== null && terminal.shape !== null) {
          const cell = terminal['cell']
          const constraints = cell['constraints']

          if (constraints instanceof Array && constraints.length > 0) {
            return constraints.map((constraint) => new MxConnectionConstraint(new MxPoint(constraint['x'], constraint['y']), constraint['perimeter']))
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
    }
  },
  mounted() {
    this.graph = this.$refs.graphEditor.init()
    if (this.R.isNil(this.graph)) {
      return
    }
    this.graph.setCellsEditable(false)
    this.graph.setDropEnabled(true)
    this.graph.setHtmlLabels(true)
    this.initConnectStyle()
    this.makeToolbarDraggable()
  }
}
</script>

<style lang="scss">
.groupEditorContainer {
  width: 100%;
  height: 100%;
  display: flex;

  .toolBarContainer {
    flex: 1;
    border-right: 1px solid #efefef;

    .toolItem {
      cursor: pointer;

      &:hover {
        background: #B4E1FF;
      }
    }
  }

  .graphEditor {
    flex: 6;
  }
}
</style>
