<template>
  <div class="m_container">
    <div ref="container" class="graphContainer"></div>
  </div>
</template>

<script>
import {
  mxGraph as MxGraph,
  mxEvent as MxEvent,
  mxUndoManager as MxUndoManager,
  mxKeyHandler as MxKeyHandler
} from 'mxgraph/javascript/mxClient'

const DEFAULT_CELL_X = 0
const DEFAULT_CELL_Y = 0
const DEFAULT_CELL_WIDTH = 40
const DEFAULT_CELL_HEIGHT = 20

export default {
  name: 'test.vue',
  data() {
    return {
      graph: null,
      undoMng: null,
      keyHandler: null
    }
  },
  methods: {
    initGraph() {
      this.graph = new MxGraph(this.$refs.container, this.model)
      MxEvent.disableContextMenu(this.$refs.container)
      this.initContentMenu() // 初始化上下文菜单
      this.initUndoManager() // 初始化undo/redo
      this.initKeyHandler() // 初始化键盘事件
    },
    addCellToContainer({parent = null, id = null, value = '', x = DEFAULT_CELL_X, y = DEFAULT_CELL_Y, width = DEFAULT_CELL_WIDTH, height = DEFAULT_CELL_HEIGHT, style = '', relative = false}) {
      if (!this.graph) {
        throw new Error('graph 没有初始化')
      }
      let tmpCell = null

      this.graph.getModel().beginUpdate()
      try {
        tmpCell = this.graph.insertVertex(parent ? parent : this.graph.getDefaultParent(), id, value, x, y, width, height, style, relative)
      } finally {
        this.graph.getModel().endUpdate()
      }
      return tmpCell
    },
    connectCell({parent = null, id = null, source, target, value = '', style = ''}) {
      if (!source || !target) {
        throw new Error('source 和 target 不得为空')
      }
      return this.graph.insertEdge(parent ? parent : this.graph.getDefaultParent(), id, value, source, target, style)
    },
    deleteCells({cells = [], includeEdges = false, multilevel = true}) {
      if (!cells || !(cells instanceof Array)) {
        throw new Error('cells 必须是一个数组')
      }
      let tmpSet = new Set(cells)

      if (multilevel) {
        cells.forEach((cell) => {
          this.findDeleteCell(cell, tmpSet)
        })
      }
      this.graph.removeCells(Array.from(tmpSet), includeEdges)
    },
    findDeleteCell(cell, deleteSet) {
      deleteSet.add(cell)
      if (cell.edges) {
        cell.edges.forEach((tmpEdge) => {
          if (tmpEdge.target !== cell) {
            deleteSet.add(tmpEdge.target)
            this.findDeleteCell(tmpEdge.target, deleteSet)
          }
        })
      }
    },
    getUndoRedoCell() {
      let cells = []

      if (this.undoMng) {
        let undoIndex = this.undoMng.indexOfNextAdd - 1

        if (this.undoMng.history[undoIndex]) {
          cells = this.undoMng.history[undoIndex].changes.map((change) => {
            if (change.child) {
              return change.child
            } else {
              return change.cell
            }
          })
        }
      }
      return cells
    },
    undo() {
      if (!this.undoMng) {
        throw new Error('mxUndoManager 没有初始化')
      }
      console.info('后退的Cells', this.getUndoRedoCell())
      this.undoMng.undo()
    },
    redo() {
      if (!this.undoMng) {
        throw new Error('mxUndoManager 没有初始化')
      }
      this.undoMng.redo()
      console.info('前进的Cells', this.getUndoRedoCell())
    },
    initContentMenu() {
      this.graph.popupMenuHandler.factoryMethod = (menu/*, cell*/) => {
        menu.addItem('删除', null, () => {
          this.deleteCells({cells: this.graph.getSelectionCells(), includeEdges: true})
        })
        menu.addSeparator()
        menu.addItem('redo', null, () => {
          this.redo()
        })
        menu.addItem('undo', null, () => {
          this.undo()
        })
      }
    },
    initUndoManager() {
      this.undoMng = new MxUndoManager()

      let listen = (sender, evt) => {
        this.undoMng.undoableEditHappened(evt.getProperty('edit'))
      }

      this.graph.getModel().addListener(MxEvent.UNDO, listen)
      this.graph.getView().addListener(MxEvent.UNDO, listen)
    },
    initKeyHandler() {
      if (!this.graph) {
        throw new Error('graph 没有初始化')
      }
      this.keyHandler = new MxKeyHandler(this.graph)

      this.keyHandler.bindControlKey(90, () => {
        this.undo()
      })
      this.keyHandler.bindControlKey(89, () => {
        this.redo()
      })
    }
  },
  mounted() {
    this.initGraph()

    let cell1 = this.addCellToContainer({value: '1', x: 10, y: 10})
    let cell2 = this.addCellToContainer({value: '2', x: 80, y: 10})
    let cell3 = this.addCellToContainer({value: '3', x: 80, y: 80})
    let cell4 = this.addCellToContainer({value: '4', x: 150, y: 10})
    let cell5 = this.addCellToContainer({value: '5', x: 150, y: 80})
    let cell6 = this.addCellToContainer({value: '6', x: 230, y: 10})
    let cell7 = this.addCellToContainer({value: '7', x: 230, y: 80})
    let cell8 = this.addCellToContainer({value: '8', x: 300, y: 10})
    let cell9 = this.addCellToContainer({value: '9', x: 370, y: 10})


    this.connectCell({source: cell1, target: cell2})
    this.connectCell({source: cell1, target: cell3})
    this.connectCell({source: cell2, target: cell4})
    this.connectCell({source: cell2, target: cell5})
    this.connectCell({source: cell4, target: cell6})
    this.connectCell({source: cell5, target: cell7})
    this.connectCell({source: cell6, target: cell8})
    this.connectCell({source: cell8, target: cell9})
    // this.deleteCells({cells: [helloCell], includeEdges: true});
  }
}
</script>

<style lang="scss" scoped>
.m_container {
  width: 100%;
  height: 100%;

  .graphContainer {
    width: 100%;
    height: calc(100% - 30px);
    overflow: auto;
  }
}
</style>
