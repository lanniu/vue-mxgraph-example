const mx = require('mxgraph')

const mxgraph = mx({
  // 核心中所有图像url的Basepath，不带斜杠。在mxClient.imageBasePath中指定路径.
  mxImageBasePath: 'mxgraph/images',
  // 核心中的所有url的Basepath，不带斜杠。在mxClient.basePath中指定路径。
  // 指向的路径一定要是一个可以通过 url 访问的静态资源目录
  mxBasePath: 'mxgraph',
  // 可选的全局配置变量。切换加载mxGraph和mxEditor中的两个资源文件。
  // 默认值是true。在主线程警告上禁用同步XMLHttpRequest
  mxLoadResources: true
  // 指定是否应加载任何样式表。 默认值是true。
  // mxLoadStylesheets: false,
  // 可选的全局配置变量，在开发模式下强制加载JavaScript文件。
  // mxForceIncludes: true,
  // 可选的全局配置变量来指定资源文件的扩展名。
  // mxResourceExtension: '.txt'
})

// Object.keys(mxgraph).forEach((key) => {
//   window[key] = mxgraph[key];
// });

const MxCell = mxgraph.mxCell
const MxCellState = mxgraph.mxCellState
const MxConnectionConstraint = mxgraph.mxConnectionConstraint
const MxConstants = mxgraph.mxConstants
const MxEllipse = mxgraph.mxEllipse
const MxEvent = mxgraph.mxEvent
const MxGraph = mxgraph.mxGraph
const MxGraphModel = mxgraph.mxGraphModel
const MxGraphView = mxgraph.mxGraphView
const MxImage = mxgraph.mxImage
const MxMouseEvent = mxgraph.mxMouseEvent
const MxPoint = mxgraph.mxPoint
const MxRubberBand = mxgraph.mxRubberband
const MxRectangle = mxgraph.mxRectangle
const MxStencil = mxgraph.mxStencil
const MxStencilRegistry = mxgraph.mxStencilRegistry
const MxToolbar = mxgraph.mxToolbar
const MxUtils = mxgraph.mxUtils
const MxUndoManager = mxgraph.mxUndoManager
const MxKeyHandler = mxgraph.mxKeyHandler
const MxCodec = mxgraph.mxCodec
const MxGeometry = mxgraph.mxGeometry


MxRubberBand.prototype.defaultOpacity = 30

export {
  MxCell,
  MxCellState,
  MxCodec,
  MxConnectionConstraint,
  MxConstants,
  MxEllipse,
  MxEvent,
  MxGeometry,
  MxGraph,
  MxGraphModel,
  MxGraphView,
  MxImage,
  MxMouseEvent,
  MxPoint,
  MxRubberBand,
  MxRectangle,
  MxStencil,
  MxStencilRegistry,
  MxToolbar,
  MxUtils,
  MxUndoManager,
  MxKeyHandler
}
