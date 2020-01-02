import {
  mxConstants as MxConstants,
  mxRectangle as MxRectangle
} from 'mxgraph/javascript/mxClient'
const PAGE_FORMATS = {}

PAGE_FORMATS['a0'] = {name: 'a0', text: 'A0 (841 mm x 1189 mm)', format: new MxRectangle(0, 0, 4681, 3300)}
PAGE_FORMATS['a1'] = {name: 'a1', text: 'A1 (594 mm x 841 mm)', format: new MxRectangle(0, 0, 3300, 2339)}
PAGE_FORMATS['a2'] = {name: 'a2', text: 'A2 (420 mm x 594 mm)', format: new MxRectangle(0, 0, 2336, 1654)}
PAGE_FORMATS['a3'] = {name: 'a3', text: 'A3 (297 mm x 420 mm)', format: new MxRectangle(0, 0, 1682, 1192)}
PAGE_FORMATS['a4'] = {
  name: 'a4',
  text: 'A4 (210 mm x 297 mm)',
  format: new MxRectangle(0, 0, 1189, 841),
  scaleWidth: 1125.737
}

PAGE_FORMATS['a5'] = {name: 'a5', text: 'A5 (148 mm x 210 mm)', format: new MxRectangle(0, 0, 827, 583)}
PAGE_FORMATS['a6'] = {name: 'a6', text: 'A6 (105 mm x 148 mm)', format: new MxRectangle(0, 0, 583, 413)}
PAGE_FORMATS['a7'] = {name: 'a7', text: 'A7 (74 mm x 105 mm)', format: new MxRectangle(0, 0, 413, 291)}
PAGE_FORMATS['letter'] = {
  name: 'letter',
  text: 'US-Letter (8,5" x 11")',
  format: new MxRectangle(0, 0, MxConstants.PAGE_FORMAT_LETTER_PORTRAIT.height, MxConstants.PAGE_FORMAT_LETTER_PORTRAIT.width)
}
PAGE_FORMATS['legal'] = {name: 'legal', text: 'US-Legal (8,5" x 14")', format: new MxRectangle(0, 0, 1400, 850)}
PAGE_FORMATS['tabloid'] = {
  name: 'tabloid',
  text: 'US-Tabloid (279 mm x 432 mm)',
  format: new MxRectangle(0, 0, 1700, 1100)
}

export {PAGE_FORMATS}
