const closeIcon = require('@/assets/icon/delete.png')

export const toolItems = [
  {
    title: '子元素', // 显示名称
    width: 130, // 默认宽度
    height: 50, // 默认高度
    dropAble: false, // 是否可以作为drop的对象
    constraints: [ // 连接点
      {x: 0, y: 0.5},
      {x: 1, y: 0.5},
      {x: 0.5, y: 0},
      {x: 0.5, y: 1}
    ],
    style: { // 样式
      html: '1',
      fillColor: '#3c6379',
      strokeColor: '#53859F',
      fontColor: '#000000',
      resizable: '0',
      overflow: 'fill'
    },
    created(graph, cell, index) {
      const deleteIconDom = document.querySelector(`.deleteIcon_${index}`)

      if (deleteIconDom) {
        deleteIconDom.addEventListener('click', () => {
          graph.removeCells([cell])
        })
      }
    },
    html: (index) => `
                 <div style="margin: 0; padding: 0 5px; height: 100%; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 1.2rem; color: cornsilk; font-weight: 600;">子元素</span>
                  <img style="height: 20px; width: 20px; cursor: pointer;" class="deleteIcon_${index}" src="${closeIcon}" alt=""/>
                 </div>
                `.replace(/[\r\n]/g, '')
  }, {
    title: '容器',
    width: 200,
    height: 200,
    dropAble: true,
    style: {
      overflow: 'fill',
      shape: 'swimlane',
      html: '1',
      swimlaneFillColor: '#B1EEEE',
      fillColor: '#3c6379',
      strokeColor: '#629EA0',
      fontColor: '#000000'
    },
    created(graph, cell, index) {
      const deleteIconDom = document.querySelector(`.deleteIcon_${index}`)

      if (deleteIconDom) {
        deleteIconDom.addEventListener('click', () => {
          graph.removeCells([cell])
        })
      }
    },
    html: (index) => `
            <div style="margin: 0; padding: 0 5px; height: 100%; width: 100%; display: flex; justify-content: space-between; align-items: center; position: relative;">
              <span style="color: cornsilk; font-size: 20px; font-weight: 600; display: inline-block">容器</span>
              <img style="height: 20px; width: 20px; cursor: pointer;" class="deleteIcon_${index}" src="${closeIcon}" alt=""/>
            </div>
          `.replace(/[\r\n]/g, '')
  }
]
