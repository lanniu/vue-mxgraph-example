<template>
  <div class="edgeStyleContainer">
    <div class="legendContainer">
      <ul>
        <li v-for="key in Object.keys(status)" :key="key">
          {{key}}
          <div class="legendColor" :style="{ background: status[key]}"></div>
        </li>
      </ul>
    </div>
    <div class="toolbarContainer">
      <ul>
        <li v-for="item in toolbarItems" :key="item['name']" ref="dragItem">
          {{item['title']}}
        </li>
      </ul>
    </div>
    <div class="graphContainer" ref="container"></div>
    <change-status-dialog ref="dialog"/>
  </div>
</template>

<script>
import {
  mxGraph as MxGraph,
  mxUtils as MxUtils,
  mxEvent as MxEvent,
  mxRubberband as MxRubberBand
} from 'mxgraph/javascript/mxClient'
import ChangeStatusDialog from '@/views/example/edgeStyle/changeStatusDialog'

export default {
  name: 'edgeStyle',
  components: {ChangeStatusDialog},
  data() {
    return {
      rubberBand: null,
      status: {
        success: '#008000',
        waiting: '#808080',
        running: '#0000ff',
        failed: '#ff0000',
        default: '#808080'
      },
      toolbarItems: [
        {name: 'start', title: '开始节点', defaultStatus: 'success'},
        {name: 'end', title: '结束节点', defaultStatus: 'success'},
        {
          name: 'node',
          title: '普通节点',
          defaultStatus: 'success',
          OptionalStatus: ['success', 'waiting', 'running', 'failed']
        },
        {name: 'parallel', title: '并行节点', defaultStatus: 'success'},
        {name: 'branch', title: '分支节点', defaultStatus: 'waiting'},
        {name: 'Aggregation', title: '聚合节点', defaultStatus: 'success'}
      ],
      statusMap: {}
    }
  },
  methods: {
    setEdgeColor(edge, color) {
      const style = this.R.prop('style', this.graph.view.getState(edge, true))

      style['strokeColor'] = color
      let styleStr = ''

      this.R.forEachObjIndexed((value, key) => {
        styleStr += `${key}=${value};`
      }, style)
      edge.setStyle(styleStr)
      this.graph.refresh(edge)
    },
    createGraph() {
      this.graph = new MxGraph(this.$refs.container)
      this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")'
    },
    initGraph() {
      if (this.R.isNil(this.graph)) {
        return
      }
      this.rubberBand = new MxRubberBand(this.graph)

      this.graph.setConnectable(true)
      this.graph.setCellsEditable(false)
      this.graph.setAllowDanglingEdges(false)
      this.graph.setConnectableEdges(false)
      this.graph.convertValueToString = (cell) => {
        return this.R.prop('customerTitle', cell)
      }
      this.graph.addListener(MxEvent.DOUBLE_CLICK, (graph, evt) => { // 监听双击事件
        let cell = this.R.pathOr([], ['properties', 'cell'], evt)

        if (this.R.equals('node', cell['customerName'])) {
          this.$refs.dialog.openDialog(cell)
        }
      })
      this.graph.connectionHandler.validateConnection = (source, target) => {
        const sourceName = source['customerName']
        const targetName = target['customerName']

        if (source === target) {
          return false
        }
        if (this.R.equals('end', sourceName)) {
          return false
        }
        if (this.R.equals('start', targetName)) {
          return false
        }
        if (this.R.equals('parallel', targetName) && ((target['edges'] instanceof Array && target['edges'].length >= 1) || this.R.equals('start', sourceName))) {
          return false
        }
        if (this.R.equals('branch', targetName) && this.R.equals('start', sourceName)) {
          return false
        }
        if (this.R.equals('Aggregation', targetName) && this.R.equals('start', sourceName)) {
          return false
        }
        return null
      }
      this.graph.connectionHandler.addListener(MxEvent.CONNECT, (sender, evt) => {
        const edge = evt.getProperty('cell')
        const source = edge['source']
        const target = edge['target']
        const status = source['customerStatus'] || 'default'
        const sourceName = source['customerName']
        const targetName = target['customerName']

        this.setEdgeColor(edge, this.status[status])

        if (sourceName === 'branch') {
          const targetStatus = ('success' === target['customerStatus'] || 'running' === target['customerStatus']) ? 'success' : 'waiting'

          this.setEdgeColor(edge, this.status[targetStatus])
        }
        if (targetName === 'Aggregation') {
          const edges = this.R.filter(this.R.propEq('target', target), this.R.propOr([], 'edges', target))
          const nodeStatus = this.R.map(this.R.path(['source', 'customerStatus']), edges)

          if (this.R.includes('waiting', nodeStatus) || this.R.includes('failed', nodeStatus)) {
            target['customerStatus'] = 'waiting'
          } else {
            target['customerStatus'] = 'success'
          }
        }
      })
    },
    makeItemDraggable() {
      this.$nextTick(() => {
        const domArray = this.$refs.dragItem

        if (!(domArray instanceof Array) || domArray.length <= 0 || this.R.isNil(this.graph)) {
          return
        }
        domArray.forEach((dom, domIndex) => {
          const toolItem = this.toolbarItems[domIndex]
          const dragHandler = (graph, evt, cell, x, y) => {
            this.instanceGraph(toolItem, x, y)
          }
          const createDragPreview = () => {
            const elt = document.createElement('div')

            elt.style.border = '2px dotted black'
            elt.style.width = '50px'
            elt.style.height = '50px'
            return elt
          }

          MxUtils.makeDraggable(dom, this.graph, dragHandler, createDragPreview(), 0, 0, false, true)
        })
      })
    },
    changeStatusHandler(cell) {
      const status = cell['customerStatus']

      this.R.propOr([], 'edges', cell).forEach((edge) => {
        if (edge['source'] === cell) {
          this.setEdgeColor(edge, this.status[status])

          const nextCell = edge['target']
          const nextCellType = nextCell['customerName']

          // 下一个节点为普通节点
          if (this.R.equals('node', nextCellType)) {
            if ('failed' === status) {
              nextCell['customerStatus'] = 'failed'
            }
            if ('waiting' === status || 'running' === status) {
              nextCell['customerStatus'] = 'waiting'
            }
          }
          // 下一个节点为聚合节点
          if (this.R.equals('Aggregation', nextCellType)) {
            const edges = this.R.filter(this.R.propEq('target', nextCell), this.R.propOr([], 'edges', nextCell))
            const nodeStatus = this.R.map(this.R.path(['source', 'customerStatus']), edges)

            if (this.R.includes('waiting', nodeStatus) || this.R.includes('failed', nodeStatus)) {
              nextCell['customerStatus'] = 'waiting'
            } else {
              nextCell['customerStatus'] = 'success'
            }
          }
          // 下一个节点为并行节点
          if (this.R.equals('parallel', nextCellType)) {
            if ('running' === status) {
              nextCell['customerStatus'] = 'waiting'
            } else {
              nextCell['customerStatus'] = status
            }
          }
        } else {
          const lastCell = edge['source']
          const lastCellType = lastCell['customerName']

          // 上一个节点为分支节点
          if (this.R.equals('branch', lastCellType)) {
            this.setEdgeColor(edge, this.status[('success' === status || 'running' === status) ? 'success' : 'waiting'])
          }
        }
      })
    },
    instanceGraph(toolItem, x, y) {
      const parent = this.graph.getDefaultParent()

      this.graph.getModel().beginUpdate()
      try {
        const statusMap = this.statusMap
        const vertex = this.graph.insertVertex(parent, null, null, x, y, 50, 50, '')
        const changeStatusHandler = this.changeStatusHandler

        vertex.customerOptionalStatus = toolItem['OptionalStatus']
        vertex.customerName = toolItem['name']
        vertex.customerTitle = toolItem['title']
        statusMap[vertex['id']] = toolItem['defaultStatus']
        vertex.customer = true

        Reflect.defineProperty(vertex, 'customerStatus', {
          set(value) {
            statusMap[vertex['id']] = value
            changeStatusHandler(vertex)
          },
          get() {
            return statusMap[vertex['id']]
          }
        })
      } finally {
        this.graph.getModel().endUpdate()
      }
    }
  },
  mounted() {
    this.createGraph()
    this.initGraph()
    this.makeItemDraggable()
  }
}
</script>

<style lang="scss">
.edgeStyleContainer {
  width: 100%;
  height: 100%;
  display: flex;

  .legendContainer {
    position: absolute;
    top: 5%;
    right: 5%;
    z-index: 2;
    background-color: #fff;

    ul {
      padding: 0;
      margin: 0;

      li {
        list-style: none;

        .legendColor{
          display: inline-block;
          width: 10px;
          height: 10px;
        }
      }
    }

  }


  .toolbarContainer {
    flex: 1;
    height: 100%;

    ul {
      padding-left: 0;

      li {
        font-weight: 600;
        list-style: none;
        margin-bottom: 5px;
        cursor: pointer;
        transition: all 0.5s;

        &:hover {
          background-color: #B4E1FF;
        }
      }
    }
  }

  .graphContainer {
    flex: 7;
    height: 100%;
  }
}
</style>

