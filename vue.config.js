module.exports = {
  publicPath: './',
  outputDir: 'dist',
  lintOnSave: true,
  chainWebpack: (config) => {
    config.module
      .rule('')
      .test(/mxClient\.js$/)
      .use('exports-loader')
      .loader('exports-loader?mxClient,mxToolbar,mxWindow,mxGraphModel,mxActor,mxPopupMenu,mxShape,mxEventObject,mxGraph,mxPopupMenuHandler,mxPrintPreview,mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxImage,mxGeometry,mxRubberband,mxKeyHandler,mxDragSource,mxGraphModel,mxEvent,mxUtils,mxEvent,mxCodec,mxCell,mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxEvent,mxUndoManager')
      .end()
  }
}
