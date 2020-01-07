[English](./customToolbar_design_en_us.md) | 简体中文

## 概述
本篇的内容是围绕如何使用 **vue** 和 **mxGraph** 实现一个自定义的工具箱。

主要完成以下功能：
- 自定义工具箱的内容。
- 从工具箱中拖拽一个工具项到绘画区并生成对应的cell。
- 双击生成的cell可以查看cell的数据。

本例可以在 [github](https://github.com/lanniu/vue-mxgraph-example) 上看到源码。

## 基本布局
![image](http://picture.lanniu.top/20200107090258.png)

我们设想的基本布局如上图所示，整个界面分为左右两部分，左侧为工具箱，右侧为我们的绘图区。

由于样式不是我们此次的重点，所以我们将以列表的形式展示工具项，当然你也可以使用一些第三方组件库如 [element-ui](https://element.eleme.cn/)、[ant design vue](https://www.antdv.com/docs/vue)、[vuetify](https://vuetifyjs.com/) 等来实现一些很酷炫的展示效果。

## 定义模型
首先我们需要定义工具箱的数据结构：
```
[
    {
        icon: String || Object, // 工具项图标的路径或对象
        title: String, // 工具项的名称
        width: Number, // 工具项的默认宽度
        height: Number, // 工具项的默认高度
        style: {
            ... // 工具项生成的 cell 样式
        }
    }
]
```

可以看出来工具箱是一个数组，其中存放了多个工具项对象，每个工具项中包含了多个属性。

需要注意的是 **style** 这个属性，这个属性里包含的信息是用于描述此工具项在拖拽后生成的 cell 的样式，取值范围请参考[官方api](https://jgraph.github.io/mxgraph/docs/js-api/files/util/mxConstants-js.html#mxConstants)。

了解了数据结构后，我们开始定义具体的数据：

```
const outputIcon = './icon/output.png'
const inputIcon = './icon/input.png'

export const toolbarItems = [
  {
    icon: outputIcon,
    title: '输出',
    width: 50,
    height: 50,
    style: {
      fillColor: 'transparent',
      strokeColor: '#000000',
      strokeWidth: '1',
      shape: MxConstants.SHAPE_LABEL,
      align: MxConstants.ALIGN_CENTER,
      verticalAlign: MxConstants.ALIGN_BOTTOM,
      imageAlign: MxConstants.ALIGN_CENTER,
      imageVerticalAlign: MxConstants.ALIGN_TOP,
      image: outputIcon
    }
  },
  {
    icon: inputIcon,
    title: '输入',
    width: 50,
    height: 50,
    style: {
      fillColor: 'transparent', // 填充色
      strokeColor: '#000000', // 线条颜色
      strokeWidth: '1', // 线条粗细
      shape: MxConstants.SHAPE_LABEL, // 形状
      align: MxConstants.ALIGN_CENTER, // 水平方向对齐方式
      verticalAlign: MxConstants.ALIGN_BOTTOM, // 垂直方向对齐方式
      imageAlign: MxConstants.ALIGN_CENTER, // 图形水平方向对齐方式
      imageVerticalAlign: MxConstants.ALIGN_TOP, // 图形垂直方向对齐方式
      image: inputIcon // 图形
    }
  }
]
```
(本例中所有的图片都放在 public 目录下)

为了方便维护我们把以上内容放到 toolbar.js 文件中。然后在 vue 组件中导入，并保存为一个名为 toolbarItems 的计算属性。

```
import {toolbarItems} from './customToolbar/toolbar'

export default {
  computed: {
    toolbarItems: () => toolbarItems
  }
}
```

## 编写模板

定义好数据后，我们开始编写模板代码。

首先我们需要一个大的容器，用于存放工具箱和画布。
```
<div class="customToolbarContainer">
</div>
```
接着我们加上工具箱代码：
```
<div class="customToolbarContainer">
    <div class="toolbarContainer">
        <ul>
            <li v-for="item in toolbarItems" :key="item['title']" ref="toolItem">
                <img :src="item['icon']" :alt="item['title']">
                <span>{{item['title']}}</span>
            </li>
        </ul>
    </div>
</div>
```
然后我们加上工具箱的代码：
```
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
```
最后我们还需要一点 css（我使用了scss）：
```
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
```
现在我们开打网页，应该可以看到如下的效果了：
![image](http://picture.lanniu.top/20200107100229.png)

## 编写业务代码
现在万事俱备，我们开始编写具体的代码。

首先我们需要在 vue 的 data 中声明一个 graph 对象，用于保存 mxGraph 实例。
```
data(){
    return {
        graph: null
    }
}
```
首先定义一个 **createGraph** 方法用于生成mxGraph对象：
```
createGraph() {
  this.graph = new MxGraph(this.$refs.container)
}
```
接着我们定义一个 **initGraph** 方法用于初始化一些属性和事件：
```
initGraph() {
  if (this.R.isNil(this.graph)) {
    return
  }
  this.graph.setConnectable(true) // 允许连线
  this.graph.setCellsEditable(false) // 不可修改
  this.graph.convertValueToString = (cell) => { // 根据cell生成显示的标签
    return this.R.prop('title', cell)
  }
  this.graph.addListener(MxEvent.DOUBLE_CLICK, (graph, evt) => { // 监听双击事件
    const cell = this.R.pathOr([], ['properties', 'cell'], evt)

    console.info(cell) // 在控制台输出双击的cell
  })
}
```
上面的代码中，用到了几个 graph 实例的方法，下面一一介绍一下：
- [setConnectable](https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.setConnectable) 设置是否允许新建连线。
- [setCellsEditable](https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.setCellsEditable) 设置是否允许直接双击修改 cell 的标签。
- [convertValueToString](https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.convertValueToString) 这是一个函数，接收一个 cell，并返回该 cell 用于显示的 label，这里是复写了默认的方法。
- [addListener](https://jgraph.github.io/mxgraph/docs/js-api/files/util/mxEvent-js.html#mxEvent.addListener) 为 graph 添加一个双击的监听事件。

然后我们定义一个方法 **addCell** 用于向画布中添加 cell：
```
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
}
```
**addCell** 接收三个参数，分别为：工具项对象，X轴坐标，y轴坐标。

方法中分别执行了如下的步骤：
- 获取了cell默认的宽高信息。
- 把style拼接为“xxx=xxx;xxx=xxx;”的形式。
- 调用 model 的 beginUpdate 方法开始一个事务。
- 调用 [insertVertex](https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraph-js.html#mxGraph.insertVertex) 方法，添加一个 cell。
- 调用 model 的 endUpdate 方法结束一个事务。

接着就是实现工具箱的核心代码，我们新建一个叫 **initToolbar** 的方法：
```
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
```
方法的目的是让工具项可以被拖拽，且在放手时会触发自定义的回调事件。方法中分别执行了如下的步骤：
1. 获取所有的工具项 dom。
2. 遍历所有的 dom。
    1. 获取 dom 对应的工具项对象。
    2. 获取工具项的默认宽高。
    3. 定义 drop 的回调函数，在函数中执行 **addCell** 方法。
    4. 定义生成预览的方法，该方法返回一个 div，作为预览的图形。
    5. 调用[makeDraggable](https://jgraph.github.io/mxgraph/docs/js-api/files/util/mxUtils-js.html#mxUtils.makeDraggable)方法。

需要注意的是 **makeDraggable** 方法，makeDraggable 接收多个参数，我们现在需要在意的是前四个：
1. dom 需要允许被拖拽的 dom 元素。
2. graph 绑定的 graph 对象。
3. dropHandler drop 时的回调函数。
4. preview 拖拽时的预览图形。

最后让我们在 mounted 生命周期函数中添加如下代码：
```
mounted() {
  this.createGraph()
  this.initGraph()
  this.initToolbar()
  this.$refs.container.style.background = 'url("./mxgraph/images/grid.gif")'
}
```

我们打开网页可以看到如下的效果：
![](http://picture.lanniu.top/20200107111924.png)
双击cell时，可以在控制台看到输出的信息：
![](http://picture.lanniu.top/20200107112010.png)

我们在实际的项目中可以对这个 Demo 进行一些扩充，比如在 addCell 时可以针对不同的工具项实例化得到不同的对象，并保存在 cell 的 value 属性中，双击 cell 时可以在弹出的对话框中修改 value 的属性值。

至此。
