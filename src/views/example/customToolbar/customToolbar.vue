<template>
  <div class="customToolbarContainer">
    <div class="toolbarContainer">
      <ul>
        <li v-for="item in toolbarItems" :key="item['title']" ref="dragItem">
          <img :src="item['icon']" :alt="item['title']">
          <span>{{item['title']}}</span>
        </li>
      </ul>
    </div>
    <el-button type="success" @click="showCellsValue" class="showInfoButton">
      显示CELLS值
    </el-button>
    <div class="graphContainer" ref="container"></div>
  </div>
</template>

<script>
class FOO {
  constructor() {
    this.tmpAttr = Math.random()
  }
}

import {
  mxGraph as MxGraph,
  mxUtils as MxUtils,
  mxEvent as MxEvent,
  mxCodec as MxCodec,
  mxConstants as MxConstants,
  mxRubberband as MxRubberBand,
  mxObjectCodec as MxObjectCodec
} from 'mxgraph/javascript/mxClient'

export default {
  name: 'customToolbar',
  data() {
    return {
      graph: null,
      rubberBand: null,
      toolbarItems: [ // 可以把数据放在这
        {
          icon: require('./icon/input.png'),
          title: '输入',
          style: {
            width: 50,
            height: 50,
            shape: 'input'
          }
        },
        {
          icon: require('./icon/output.png'),
          title: '输出',
          style: {
            width: 50,
            height: 50,
            shape: 'output'
          }
        }
      ]
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
      this.graph.setConnectable(true) // 允许连线
      this.graph.setCellsEditable(false) // 不可修改
      this.graph.convertValueToString = (cell) => { // 从value中获取显示的内容
        return this.R.prop('title', cell)
      }
      this.graph.addListener(MxEvent.DOUBLE_CLICK, (graph, evt) => { // 监听双击事件
        let cell = this.R.pathOr([], ['properties', 'cell'], evt)
        let obj = cell['value']

        if (this.R.isNil(obj)) {
          return
        }
        this.$prompt('修改值', `双击了 ${cell['title']}`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({value}) => {
          obj['tmpAttr'] = value
        })
      })
      // 以下是为了特殊的需求
      MxObjectCodec.prototype.encode = function (enc, obj) {
        let node = enc.document.createElement(this.getName())

        obj = this.beforeEncode(enc, obj, node)
        const tmpNode = this.encodeObject(enc, obj, node)

        if (tmpNode !== undefined && tmpNode !== null) {
          return tmpNode
        }
        return this.afterEncode(enc, obj, node)
      }
      MxObjectCodec.prototype.encodeObject = function (enc, obj, node) {
        enc.setAttribute(node, 'id', enc.getId(obj))

        const names = Object.keys(obj)
        const valueIndex = names.indexOf('value')
        let needConvert = obj['customer'] && valueIndex !== -1

        if (needConvert) {
          names.splice(valueIndex, 1)
        }
        names.forEach((name) => {
          let value = obj[name]

          if (value != null && !this.isExcluded(obj, name, value, true)) {
            if (MxUtils.isInteger(name)) {
              name = null
            }
            this.encodeValue(enc, obj, name, value, node)
          }
        })
        if (needConvert) {
          const valueNode = enc.encode(obj['value'])
          const tmpNode = node

          node = valueNode
          node.appendChild(tmpNode)
          return node
        }
      }
    },
    makeItemDraggable() {
      this.$nextTick(() => {
        const domArray = this.$refs.dragItem

        if (!(domArray instanceof Array) || domArray.length <= 0 || this.R.isNil(this.graph)) {
          return
        }
        domArray.forEach((dom, domIndex) => {
          const toolItem = this.toolbarItems[domIndex]
          const w = this.R.path(['style', 'width'], toolItem)
          const h = this.R.path(['style', 'height'], toolItem)

          const dragHandler = (graph, evt, cell, x, y) => {
            this.instanceGraph(toolItem, x, y)
          }
          const createDragPreview = () => {
            const elt = document.createElement('div')

            elt.style.border = '2px dotted black'
            elt.style.width = `${w}px`
            elt.style.height = `${h}px`
            return elt
          }

          MxUtils.makeDraggable(dom, this.graph, dragHandler, createDragPreview(), 0, 0, false, true)
        })
      })
    },
    instanceGraph(toolItem, x, y) {
      const w = this.R.path(['style', 'width'], toolItem)
      const h = this.R.path(['style', 'height'], toolItem)
      const shape = this.R.path(['style', 'shape'], toolItem)
      const parent = this.graph.getDefaultParent()

      this.graph.getModel().beginUpdate()
      try {
        let vertex = this.graph.insertVertex(parent, null, null, x, y, w, h, shape)

        vertex.title = toolItem['title']
        vertex.customer = true
        vertex.setValue(new FOO()) // 重点，设置value
      } finally {
        this.graph.getModel().endUpdate()
      }
    },
    registerCustomShape() {
      if (this.R.isNil(this.graph)) {
        return
      }
      const outputStyle = {}

      outputStyle[MxConstants.STYLE_FILLCOLOR] = 'transparent'
      outputStyle[MxConstants.STYLE_STROKECOLOR] = '#000000'
      outputStyle[MxConstants.STYLE_STROKEWIDTH] = '1'
      outputStyle[MxConstants.STYLE_SHAPE] = MxConstants.SHAPE_LABEL
      outputStyle[MxConstants.STYLE_ALIGN] = MxConstants.ALIGN_CENTER
      outputStyle[MxConstants.STYLE_VERTICAL_ALIGN] = MxConstants.ALIGN_BOTTOM
      outputStyle[MxConstants.STYLE_IMAGE_ALIGN] = MxConstants.ALIGN_CENTER
      outputStyle[MxConstants.STYLE_IMAGE_VERTICAL_ALIGN] = MxConstants.ALIGN_TOP
      outputStyle[MxConstants.STYLE_IMAGE] = require('./icon/output.png')
      this.graph.getStylesheet().putCellStyle('output', outputStyle)
      const inputStyle = Object.assign({}, outputStyle)

      inputStyle[MxConstants.STYLE_IMAGE] = require('./icon/input.png')
      this.graph.getStylesheet().putCellStyle('input', inputStyle)
    },
    showCellsValue() {
      if (this.R.isNil(this.graph)) {
        return
      }
      const encoder = new MxCodec()
      const node = encoder.encode(this.graph.model)
      const xml = MxUtils.getPrettyXml(node)

      console.info(xml)

      this.$alert(xml)
    }
  },
  mounted() {
    this.createGraph() // 创建graph
    this.initGraph() // 初始化graph
    this.registerCustomShape() // 注册自定义图形
    this.makeItemDraggable() // 使得可以拖拽
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

  .showInfoButton {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 2;
  }

  .graphContainer {
    position: relative;
    flex: 7;
  }
}
</style>
