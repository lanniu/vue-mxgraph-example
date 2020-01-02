<template>
  <div class="htmlLabelContainer">
    <div class="graphContainer" ref="container"></div>
  </div>
</template>

<script>
import {
  mxGraph as MxGraph
} from 'mxgraph/javascript/mxClient'

export default {
  name: 'htmlLabel',
  data() {
    return {
      graph: null,
      icon: {
        cat: require('./icon/cat.png'),
        dog: require('./icon/dog.png'),
        right: require('./icon/right.png'),
        error: require('./icon/error.png'),
      }
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
      this.graph.setCellsEditable(false)
      this.graph.setHtmlLabels(true)
    },
    addCell() {
      const parent = this.graph.getDefaultParent()
      const getMyTemplate = (animal, state) => {
        let myAnimal = this.icon.dog
        let myLabel = 'PUPPY'
        let myRight = true
        let myState = this.icon.right

        if (this.R.equals('cat', animal)) {
          myAnimal = this.icon.cat
          myLabel = 'KITTY'
        }
        if (this.R.equals('error', state)) {
          myState = this.icon.error
          myRight = false
        }
        return `<div class="cellLabelContainer">
                  <div class="cellIcon"><img alt="icon" src='${myAnimal}'/></div>
                  <div class="cellLabel"><span>${myLabel}</span></div>
                  <div class="cellState ${myRight ? 'right' : 'error'}" onclick="${this.clickFunc(animal, state)}"><img alt="icon" src='${myState}'/></div>
                </div>`.replace(/[\r\n]/g, '')
      }
      const style = 'text;strokeColor=none;fillColor=none;resizable=0;'

      const htmlStr = `<p style="margin: 4px 0 0 0;text-align: center">
                           <i>&lt;&lt;Interface&gt;&gt;</i>
                           <br/>
                           <b>Interface</b>
                       </p>
                       <hr/>
                       <p style="margin: 0; margin-left: 4px">
                           + field1: Type
                           <br/>
                           + field2: Type
                       </p>
                       <hr/>
                       <p style="margin: 0; margin-left: 4px">
                           + method1(Type): Type
                           <br/>
                           + method2(Type, Type): Type
                       </p>`.replace(/[\r\n]/g, '')

      this.graph.insertVertex(parent, null, getMyTemplate('dog', 'right'), 10, 10, 210, 60, style)
      this.graph.insertVertex(parent, null, getMyTemplate('cat', 'error'), 10, 200, 210, 60, style)
      this.graph.insertVertex(parent, null, getMyTemplate('dog', 'error'), 10, 100, 210, 60, style)
      this.graph.insertVertex(parent, null, getMyTemplate('cat', 'right'), 10, 300, 210, 60, style)
      this.graph.insertVertex(parent, null, htmlStr, 10, 400, 210, 120, 'align=center;verticalAlign=top;align=left;overflow=fill;fontSize=12;')
    },
    clickFunc(animal, state) {
      return `alert('点击的动物为：${animal}，状态为：${state}。')`
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
.htmlLabelContainer {
  width: 100%;
  height: 100%;

  .graphContainer {
    width: 100%;
    height: 100%;

    .cellLabelContainer {
      height: 55px;
      width: 205px;
      display: flex;
      padding-left: 2px;
      justify-content: space-between;
      /*align-content: center;*/

      .cellIcon {
        img {
          height: 50px;
          width: 50px;
          position: relative;
          top: 50%;
          transform: translate(0, -50%);
        }
      }

      .cellLabel {
        font-size: 25px;
        line-height: 2em;
      }

      .cellState {
        padding: 2px;
        cursor: pointer;

        &.right {
          background: #B4E1FF;
        }

        &.error {
          background: #FEC3A6;
        }

        img {
          height: 30px;
          width: 30px;
          position: relative;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
    }
  }
}
</style>
