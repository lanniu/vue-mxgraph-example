import {
  mxConstants as MxConstants
} from 'mxgraph/javascript/mxClient'

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
      align: MxConstants.ALIGN_CENTER, // 水平方向对其方式
      verticalAlign: MxConstants.ALIGN_BOTTOM, // 垂直方向对其方式
      imageAlign: MxConstants.ALIGN_CENTER, // 图形水平方向对其方式
      imageVerticalAlign: MxConstants.ALIGN_TOP, // 图形方向对其方式
      image: inputIcon // 图形
    }
  }
]
